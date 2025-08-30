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

# Git 태그 생성
create_git_tag() {
    local version=$1
    local message=${2:-"Release $version"}
    
    echo -e "${YELLOW}🏷️  Git 태그 생성 중: $version${NC}"
    
    # 현재 상태 확인
    if ! git diff-index --quiet HEAD --; then
        echo -e "${RED}❌ 커밋되지 않은 변경사항이 있습니다!${NC}"
        echo "먼저 모든 변경사항을 커밋해주세요."
        exit 1
    fi
    
    # 태그 생성
    git tag -a "$version" -m "$message"
    
    echo -e "${GREEN}✅ 태그 '$version' 생성 완료${NC}"
}

# 태그를 원격 저장소에 푸시
push_git_tag() {
    local version=$1
    
    echo -e "${YELLOW}📤 태그를 원격 저장소에 푸시 중...${NC}"
    git push origin "$version"
    echo -e "${GREEN}✅ 태그 '$version' 푸시 완료${NC}"
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
