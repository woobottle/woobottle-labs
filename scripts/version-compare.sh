#!/bin/bash

# 버전 비교 및 분석 스크립트
# 현재 배포된 버전과 사용 가능한 버전들을 비교

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 버전 관리 유틸리티 로드
source "$(dirname "$0")/version-utils.sh" 2>/dev/null || {
  echo -e "${RED}❌ version-utils.sh 파일을 찾을 수 없습니다!${NC}"
  exit 1
}

PRODUCTION_BUCKET="woo-bottle.com"

# 현재 배포된 버전 정보 가져오기
get_deployed_version_info() {
    local bucket_name=$1
    
    echo -e "${YELLOW}🔍 현재 배포된 버전 정보 조회 중...${NC}"
    
    # deploy-info.json에서 배포 정보 가져오기
    local deploy_info=$(aws s3 cp "s3://$bucket_name/current/deploy-info.json" - 2>/dev/null || echo "{}")
    
    if [[ "$deploy_info" == "{}" ]]; then
        echo -e "${YELLOW}⚠️  배포 정보를 찾을 수 없습니다.${NC}"
        return 1
    fi
    
    echo "$deploy_info"
}

# 버전 정보 파싱
parse_deploy_info() {
    local deploy_info=$1
    
    # jq가 있으면 사용, 없으면 간단한 파싱
    if command -v jq &> /dev/null; then
        echo "버전: $(echo "$deploy_info" | jq -r '.version // "unknown"')"
        echo "배포 시간: $(echo "$deploy_info" | jq -r '.timestamp // "unknown"')"
        echo "커밋 해시: $(echo "$deploy_info" | jq -r '.commit_hash // "unknown"')"
        echo "브랜치: $(echo "$deploy_info" | jq -r '.branch // "unknown"')"
        echo "환경: $(echo "$deploy_info" | jq -r '.environment // "unknown"')"
    else
        # 간단한 grep 기반 파싱
        echo "버전: $(echo "$deploy_info" | grep -o '"version"[^,]*' | cut -d'"' -f4 || echo "unknown")"
        echo "배포 시간: $(echo "$deploy_info" | grep -o '"timestamp"[^,]*' | cut -d'"' -f4 || echo "unknown")"
        echo "커밋 해시: $(echo "$deploy_info" | grep -o '"commit_hash"[^,]*' | cut -d'"' -f4 || echo "unknown")"
        echo "브랜치: $(echo "$deploy_info" | grep -o '"branch"[^,]*' | cut -d'"' -f4 || echo "unknown")"
    fi
}

# 사용 가능한 버전들과 비교
compare_versions() {
    local bucket_name=$1
    
    echo -e "${BLUE}📊 버전 비교 분석${NC}"
    echo "=================================="
    
    # 현재 배포된 버전 정보
    local deploy_info=$(get_deployed_version_info "$bucket_name")
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}🚀 현재 배포된 버전:${NC}"
        parse_deploy_info "$deploy_info"
        echo
    fi
    
    # Git 태그 목록
    echo -e "${BLUE}🏷️  사용 가능한 Git 태그:${NC}"
    local git_tags=$(git tag -l "v*" | sort -V | tail -10)
    if [[ -n "$git_tags" ]]; then
        echo "$git_tags"
    else
        echo "태그가 없습니다."
    fi
    echo
    
    # S3 버전 목록
    echo -e "${BLUE}☁️  S3에 저장된 버전:${NC}"
    local s3_versions=$(aws s3 ls "s3://$bucket_name/versions/" | grep "PRE" | awk '{print $2}' | sed 's/\///g' | sort -V)
    if [[ -n "$s3_versions" ]]; then
        echo "$s3_versions"
    else
        echo "S3에 저장된 버전이 없습니다."
    fi
    echo
    
    # 최신 태그와 배포된 버전 비교
    local latest_tag=$(get_latest_version)
    if [[ -n "$deploy_info" ]]; then
        local deployed_version
        if command -v jq &> /dev/null; then
            deployed_version=$(echo "$deploy_info" | jq -r '.version // "unknown"')
        else
            deployed_version=$(echo "$deploy_info" | grep -o '"version"[^,]*' | cut -d'"' -f4 || echo "unknown")
        fi
        
        echo -e "${BLUE}🔍 버전 상태 분석:${NC}"
        if [[ "$latest_tag" == "$deployed_version" ]]; then
            echo -e "${GREEN}✅ 최신 버전이 배포되어 있습니다.${NC}"
        else
            echo -e "${YELLOW}⚠️  배포된 버전($deployed_version)이 최신 태그($latest_tag)와 다릅니다.${NC}"
            echo -e "${BLUE}💡 업데이트 명령어: npm run deploy${NC}"
        fi
    fi
}

# 특정 버전의 상세 정보 조회
get_version_details() {
    local version=$1
    local bucket_name=$2
    
    echo -e "${BLUE}🔍 버전 $version 상세 정보:${NC}"
    echo "=================================="
    
    # S3에서 해당 버전의 deploy-info.json 조회
    local version_info=$(aws s3 cp "s3://$bucket_name/versions/$version/deploy-info.json" - 2>/dev/null || echo "{}")
    
    if [[ "$version_info" != "{}" ]]; then
        parse_deploy_info "$version_info"
        echo
        
        # 파일 목록
        echo -e "${BLUE}📁 포함된 파일:${NC}"
        aws s3 ls "s3://$bucket_name/versions/$version/" --recursive | head -20
        echo
        
        # 크기 정보
        local total_size=$(aws s3 ls "s3://$bucket_name/versions/$version/" --recursive --summarize | grep "Total Size" | awk '{print $3, $4}')
        echo -e "${BLUE}📦 총 크기: $total_size${NC}"
    else
        echo -e "${RED}❌ 버전 정보를 찾을 수 없습니다.${NC}"
    fi
}

# 롤백 시뮬레이션
simulate_rollback() {
    local target_version=$1
    local bucket_name=$2
    
    echo -e "${YELLOW}🎭 롤백 시뮬레이션: $target_version${NC}"
    echo "=================================="
    
    # 대상 버전 존재 확인
    if ! aws s3 ls "s3://$bucket_name/versions/$target_version/" &>/dev/null; then
        echo -e "${RED}❌ 버전 $target_version이 S3에 존재하지 않습니다.${NC}"
        return 1
    fi
    
    # 현재 버전과 대상 버전 비교
    echo -e "${BLUE}📊 변경 사항 분석:${NC}"
    
    # 파일 개수 비교
    local current_files=$(aws s3 ls "s3://$bucket_name/current/" --recursive | wc -l)
    local target_files=$(aws s3 ls "s3://$bucket_name/versions/$target_version/" --recursive | wc -l)
    
    echo "현재 파일 수: $current_files"
    echo "대상 파일 수: $target_files"
    
    if [[ $target_files -gt $current_files ]]; then
        echo -e "${GREEN}📈 파일이 $((target_files - current_files))개 추가됩니다.${NC}"
    elif [[ $target_files -lt $current_files ]]; then
        echo -e "${YELLOW}📉 파일이 $((current_files - target_files))개 제거됩니다.${NC}"
    else
        echo -e "${BLUE}📊 파일 수는 동일합니다.${NC}"
    fi
    
    echo
    echo -e "${BLUE}🔄 롤백 실행 명령어:${NC}"
    echo "  ./scripts/rollback.sh --version $target_version"
    echo
    echo -e "${YELLOW}⚠️  이는 시뮬레이션입니다. 실제 롤백은 수행되지 않았습니다.${NC}"
}

# 사용법 표시
show_help() {
    echo "버전 비교 및 분석 스크립트"
    echo
    echo "사용법:"
    echo "  $0 [명령어] [옵션]"
    echo
    echo "명령어:"
    echo "  compare                     현재 버전과 사용 가능한 버전들 비교"
    echo "  details <version>           특정 버전의 상세 정보 조회"
    echo "  simulate <version>          롤백 시뮬레이션"
    echo "  current                     현재 배포된 버전 정보만 표시"
    echo
    echo "예시:"
    echo "  $0 compare"
    echo "  $0 details v1.0.1"
    echo "  $0 simulate v1.0.0"
    echo "  $0 current"
}

# 메인 로직
main() {
    local command=${1:-compare}
    
    case $command in
        compare)
            compare_versions "$PRODUCTION_BUCKET"
            ;;
        details)
            if [[ -z "$2" ]]; then
                echo -e "${RED}❌ 버전을 지정해주세요.${NC}"
                echo "예시: $0 details v1.0.1"
                exit 1
            fi
            get_version_details "$2" "$PRODUCTION_BUCKET"
            ;;
        simulate)
            if [[ -z "$2" ]]; then
                echo -e "${RED}❌ 롤백할 버전을 지정해주세요.${NC}"
                echo "예시: $0 simulate v1.0.0"
                exit 1
            fi
            simulate_rollback "$2" "$PRODUCTION_BUCKET"
            ;;
        current)
            local deploy_info=$(get_deployed_version_info "$PRODUCTION_BUCKET")
            if [[ $? -eq 0 ]]; then
                echo -e "${GREEN}🚀 현재 배포된 버전 정보:${NC}"
                parse_deploy_info "$deploy_info"
            fi
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}❌ 알 수 없는 명령어: $command${NC}"
            echo
            show_help
            exit 1
            ;;
    esac
}

# 스크립트가 직접 실행될 때만 main 함수 실행
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
