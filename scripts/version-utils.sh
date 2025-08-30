#!/bin/bash

# WooBottle Labs 버전 관리 유틸리티
# Semantic Versioning (v1.0.0) 형식을 사용합니다.

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 최신 태그 가져오기
get_latest_version() {
    local latest_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    if [[ -z "$latest_tag" ]]; then
        echo "v0.0.0"
    else
        echo "$latest_tag"
    fi
}

# 버전 파싱 (v1.2.3 -> 1 2 3)
parse_version() {
    local version=$1
    # v 접두사 제거
    version=${version#v}
    # . 으로 분할
    echo "$version" | tr '.' ' '
}

# 다음 버전 계산
get_next_version() {
    local bump_type=$1  # major, minor, patch
    local current_version=$(get_latest_version)
    
    read -r major minor patch <<< $(parse_version "$current_version")
    
    case $bump_type in
        major)
            ((major++))
            minor=0
            patch=0
            ;;
        minor)
            ((minor++))
            patch=0
            ;;
        patch)
            ((patch++))
            ;;
        *)
            echo -e "${RED}❌ 유효하지 않은 bump 타입: $bump_type${NC}"
            echo "사용 가능한 타입: major, minor, patch"
            exit 1
            ;;
    esac
    
    echo "v${major}.${minor}.${patch}"
}

# CI 환경 감지
is_ci_environment() {
    # GitHub Actions
    [[ -n "$GITHUB_ACTIONS" ]] && return 0
    # GitLab CI
    [[ -n "$GITLAB_CI" ]] && return 0
    # Jenkins
    [[ -n "$JENKINS_URL" ]] && return 0
    # CircleCI
    [[ -n "$CIRCLECI" ]] && return 0
    # Travis CI
    [[ -n "$TRAVIS" ]] && return 0
    # 기타 CI 환경변수
    [[ -n "$CI" ]] && return 0
    
    return 1
}

# Git 설정 확인 및 설정
setup_git_for_ci() {
    if is_ci_environment; then
        echo -e "${YELLOW}🔧 CI 환경에서 Git 설정 중...${NC}"
        
        # Git 사용자 정보가 없으면 설정
        if [[ -z "$(git config user.name)" ]]; then
            git config user.name "GitHub Actions"
        fi
        
        if [[ -z "$(git config user.email)" ]]; then
            git config user.email "actions@github.com"
        fi
        
        # GitHub Actions의 경우 토큰 설정
        if [[ -n "$GITHUB_ACTIONS" && -n "$GITHUB_TOKEN" ]]; then
            git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
        fi
        
        echo -e "${GREEN}✅ CI 환경 Git 설정 완료${NC}"
    fi
}

# Git 태그 생성
create_git_tag() {
    local version=$1
    local message=${2:-"Release $version"}
    
    echo -e "${YELLOW}🏷️  Git 태그 생성 중: $version${NC}"
    
    # CI 환경 설정
    setup_git_for_ci
    
    # CI 환경이 아닌 경우에만 변경사항 확인
    if ! is_ci_environment; then
        # 현재 상태 확인
        if ! git diff-index --quiet HEAD --; then
            echo -e "${RED}❌ 커밋되지 않은 변경사항이 있습니다!${NC}"
            echo "먼저 모든 변경사항을 커밋해주세요."
            exit 1
        fi
    else
        echo -e "${BLUE}ℹ️  CI 환경에서 실행 중 - 변경사항 확인을 건너뜁니다.${NC}"
        
        # CI 환경에서는 빌드 아티팩트 등을 .gitignore에 추가하거나 스테이지에서 제외
        if [[ -f ".gitignore" ]]; then
            # 빌드 결과물들을 임시로 스테이지에서 제거
            git reset HEAD -- out/ 2>/dev/null || true
            git reset HEAD -- .next/ 2>/dev/null || true
            git reset HEAD -- node_modules/ 2>/dev/null || true
        fi
    fi
    
    # 태그가 이미 존재하는지 확인
    if git tag -l | grep -q "^${version}$"; then
        echo -e "${YELLOW}⚠️  태그 '$version'이 이미 존재합니다.${NC}"
        if is_ci_environment; then
            echo -e "${BLUE}ℹ️  CI 환경에서는 기존 태그를 사용합니다.${NC}"
            return 0
        else
            read -p "기존 태그를 덮어쓰시겠습니까? (y/N): " overwrite
            if [[ $overwrite == "y" || $overwrite == "Y" ]]; then
                git tag -d "$version"
                echo -e "${YELLOW}🗑️  기존 태그 삭제됨${NC}"
            else
                echo -e "${YELLOW}❌ 태그 생성이 취소되었습니다.${NC}"
                exit 1
            fi
        fi
    fi
    
    # 태그 생성
    git tag -a "$version" -m "$message"
    
    echo -e "${GREEN}✅ 태그 '$version' 생성 완료${NC}"
}

# 태그를 원격 저장소에 푸시
push_git_tag() {
    local version=$1
    
    echo -e "${YELLOW}📤 태그를 원격 저장소에 푸시 중...${NC}"
    
    # CI 환경에서 푸시 권한 확인
    if is_ci_environment; then
        if [[ -z "$GITHUB_TOKEN" ]]; then
            echo -e "${YELLOW}⚠️  GITHUB_TOKEN이 설정되지 않았습니다. 태그 푸시를 건너뜁니다.${NC}"
            echo -e "${BLUE}ℹ️  태그는 로컬에만 생성되었습니다: $version${NC}"
            return 0
        fi
        
        # GitHub Actions에서 기본 브랜치로 푸시 권한이 제한될 수 있음
        echo -e "${BLUE}ℹ️  CI 환경에서 태그 푸시를 시도합니다...${NC}"
    fi
    
    # 태그 푸시 시도
    if git push origin "$version" 2>/dev/null; then
        echo -e "${GREEN}✅ 태그 '$version' 푸시 완료${NC}"
    else
        echo -e "${YELLOW}⚠️  태그 푸시에 실패했습니다. 권한을 확인해주세요.${NC}"
        if is_ci_environment; then
            echo -e "${BLUE}ℹ️  CI 환경에서는 태그가 로컬에만 생성되었습니다.${NC}"
            echo -e "${BLUE}ℹ️  워크플로우 완료 후 수동으로 태그를 푸시하거나 권한을 확인해주세요.${NC}"
        else
            echo -e "${RED}❌ 태그 푸시 실패${NC}"
            exit 1
        fi
    fi
}

# 사용 가능한 버전 목록 조회
list_versions() {
    echo -e "${BLUE}📋 사용 가능한 버전 목록:${NC}"
    git tag -l "v*" | sort -V | tail -10
}

# S3에서 버전 목록 조회
list_s3_versions() {
    local bucket_name=$1
    
    if [[ -z "$bucket_name" ]]; then
        echo -e "${RED}❌ S3 버킷 이름이 필요합니다!${NC}"
        return 1
    fi
    
    echo -e "${BLUE}☁️  S3 버킷 '$bucket_name'의 버전 목록:${NC}"
    aws s3 ls "s3://$bucket_name/versions/" | grep "PRE" | awk '{print $2}' | sed 's/\///g' | sort -V
}

# 오래된 버전 정리 (최신 3개만 유지)
cleanup_old_versions() {
    local bucket_name=$1
    local keep_count=${2:-3}
    
    if [[ -z "$bucket_name" ]]; then
        echo -e "${RED}❌ S3 버킷 이름이 필요합니다!${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}🧹 오래된 버전 정리 중... (최신 $keep_count개 유지)${NC}"
    
    # S3에서 버전 목록 가져오기
    local versions=($(aws s3 ls "s3://$bucket_name/versions/" | grep "PRE" | awk '{print $2}' | sed 's/\///g' | sort -V))
    local total_versions=${#versions[@]}
    
    if [[ $total_versions -le $keep_count ]]; then
        echo -e "${GREEN}✅ 정리할 오래된 버전이 없습니다.${NC}"
        return 0
    fi
    
    # 삭제할 버전 개수 계산
    local delete_count=$((total_versions - keep_count))
    
    echo -e "${YELLOW}📊 총 $total_versions개 버전 중 $delete_count개 버전을 삭제합니다.${NC}"
    
    # 오래된 버전들 삭제
    for ((i=0; i<delete_count; i++)); do
        local version_to_delete=${versions[$i]}
        echo -e "${YELLOW}🗑️  삭제 중: $version_to_delete${NC}"
        aws s3 rm "s3://$bucket_name/versions/$version_to_delete/" --recursive
        echo -e "${GREEN}✅ $version_to_delete 삭제 완료${NC}"
    done
    
    echo -e "${GREEN}🎉 버전 정리 완료! 현재 ${keep_count}개 버전이 유지됩니다.${NC}"
}

# 버전 유효성 검사
validate_version() {
    local version=$1
    
    # v1.2.3 형식 확인
    if [[ ! $version =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo -e "${RED}❌ 유효하지 않은 버전 형식: $version${NC}"
        echo "올바른 형식: v1.0.0"
        return 1
    fi
    
    return 0
}

# 대화형 버전 생성
interactive_version_bump() {
    echo -e "${BLUE}🔄 새 버전 생성${NC}"
    echo
    
    local current_version=$(get_latest_version)
    echo -e "현재 버전: ${GREEN}$current_version${NC}"
    echo
    
    echo "어떤 유형의 업데이트인가요?"
    echo "1) patch (버그 수정)     - $(get_next_version patch)"
    echo "2) minor (기능 추가)     - $(get_next_version minor)"  
    echo "3) major (중요한 변경)   - $(get_next_version major)"
    echo "4) 사용자 정의"
    echo
    
    read -p "선택하세요 (1-4): " choice
    
    case $choice in
        1)
            local new_version=$(get_next_version patch)
            ;;
        2)
            local new_version=$(get_next_version minor)
            ;;
        3)
            local new_version=$(get_next_version major)
            ;;
        4)
            read -p "버전을 입력하세요 (예: v1.2.3): " new_version
            if ! validate_version "$new_version"; then
                exit 1
            fi
            ;;
        *)
            echo -e "${RED}❌ 유효하지 않은 선택입니다.${NC}"
            exit 1
            ;;
    esac
    
    echo
    echo -e "새 버전: ${GREEN}$new_version${NC}"
    read -p "계속하시겠습니까? (y/N): " confirm
    
    if [[ $confirm == "y" || $confirm == "Y" ]]; then
        create_git_tag "$new_version"
        read -p "원격 저장소에 푸시하시겠습니까? (y/N): " push_confirm
        
        if [[ $push_confirm == "y" || $push_confirm == "Y" ]]; then
            push_git_tag "$new_version"
        fi
        
        echo -e "${GREEN}🎉 버전 $new_version 생성 완료!${NC}"
    else
        echo -e "${YELLOW}❌ 취소되었습니다.${NC}"
    fi
}

# 도움말 표시
show_help() {
    echo "WooBottle Labs 버전 관리 유틸리티"
    echo
    echo "사용법:"
    echo "  $0 <command> [options]"
    echo
    echo "명령어:"
    echo "  current                    현재 최신 버전 표시"
    echo "  next <type>               다음 버전 계산 (patch|minor|major)"
    echo "  create <type> [message]   새 버전 태그 생성"
    echo "  list                      Git 태그 목록 표시"
    echo "  list-s3 <bucket>          S3 버전 목록 표시"
    echo "  cleanup <bucket> [count]  오래된 S3 버전 정리 (기본: 3개 유지)"
    echo "  interactive               대화형 버전 생성"
    echo "  validate <version>        버전 형식 유효성 검사"
    echo
    echo "예시:"
    echo "  $0 current"
    echo "  $0 next patch"
    echo "  $0 create minor 'Add new features'"
    echo "  $0 cleanup woo-bottle.com 3"
    echo "  $0 interactive"
}

# 메인 로직 (스크립트가 직접 실행될 때만)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
case "${1:-}" in
    current)
        get_latest_version
        ;;
    next)
        if [[ -z "$2" ]]; then
            echo -e "${RED}❌ bump 타입이 필요합니다! (patch|minor|major)${NC}"
            exit 1
        fi
        get_next_version "$2"
        ;;
    create)
        if [[ -z "$2" ]]; then
            echo -e "${RED}❌ bump 타입이 필요합니다! (patch|minor|major)${NC}"
            exit 1
        fi
        new_version=$(get_next_version "$2")
        message=${3:-"Release $new_version"}
        create_git_tag "$new_version" "$message"
        push_git_tag "$new_version"
        ;;
    list)
        list_versions
        ;;
    list-s3)
        if [[ -z "$2" ]]; then
            echo -e "${RED}❌ S3 버킷 이름이 필요합니다!${NC}"
            exit 1
        fi
        list_s3_versions "$2"
        ;;
    cleanup)
        if [[ -z "$2" ]]; then
            echo -e "${RED}❌ S3 버킷 이름이 필요합니다!${NC}"
            exit 1
        fi
        cleanup_old_versions "$2" "${3:-3}"
        ;;
    interactive)
        interactive_version_bump
        ;;
    validate)
        if [[ -z "$2" ]]; then
            echo -e "${RED}❌ 버전이 필요합니다!${NC}"
            exit 1
        fi
        validate_version "$2"
        echo -e "${GREEN}✅ 유효한 버전 형식입니다.${NC}"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ 알 수 없는 명령어: ${1:-}${NC}"
        echo
        show_help
        exit 1
        ;;
esac
fi
