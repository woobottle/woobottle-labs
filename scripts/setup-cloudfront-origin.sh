#!/bin/bash

# CloudFront Origin Path 설정 스크립트
# CloudFront에서 S3의 current/ 폴더를 루트로 매핑

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# CloudFront 배포 설정 업데이트
update_cloudfront_origin() {
    local distribution_id=$1
    local bucket_name=$2
    local origin_path=${3:-"/current"}
    
    echo -e "${BLUE}☁️  CloudFront 배포 설정 업데이트: $distribution_id${NC}"
    echo -e "${BLUE}📦 S3 버킷: $bucket_name${NC}"
    echo -e "${BLUE}📁 Origin Path: $origin_path${NC}"
    
    # 현재 배포 설정 가져오기
    echo -e "${YELLOW}📋 현재 배포 설정 조회 중...${NC}"
    aws cloudfront get-distribution-config \
        --id "$distribution_id" \
        --output json > /tmp/distribution-config.json
    
    # ETag 추출 (업데이트에 필요)
    local etag=$(jq -r '.ETag' /tmp/distribution-config.json)
    
    # 배포 설정에서 DistributionConfig만 추출
    jq '.DistributionConfig' /tmp/distribution-config.json > /tmp/distribution-config-only.json
    
    # Origin Path 업데이트
    echo -e "${YELLOW}🔧 Origin Path 업데이트 중...${NC}"
    jq --arg origin_path "$origin_path" \
       '.Origins.Items[0].OriginPath = $origin_path' \
       /tmp/distribution-config-only.json > /tmp/updated-distribution-config.json
    
    # 배포 설정 업데이트
    echo -e "${YELLOW}📤 CloudFront 배포 업데이트 중...${NC}"
    aws cloudfront update-distribution \
        --id "$distribution_id" \
        --distribution-config file:///tmp/updated-distribution-config.json \
        --if-match "$etag" \
        --output table
    
    # 임시 파일 정리
    rm -f /tmp/distribution-config.json
    rm -f /tmp/distribution-config-only.json
    rm -f /tmp/updated-distribution-config.json
    
    echo -e "${GREEN}✅ CloudFront 배포 업데이트 완료${NC}"
    echo -e "${YELLOW}⏳ 배포 전파까지 5-10분 정도 소요될 수 있습니다.${NC}"
}

# 캐시 무효화
invalidate_cloudfront_cache() {
    local distribution_id=$1
    
    echo -e "${YELLOW}🔄 CloudFront 캐시 무효화 중...${NC}"
    
    local invalidation_id=$(aws cloudfront create-invalidation \
        --distribution-id "$distribution_id" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    echo -e "${GREEN}✅ 캐시 무효화 요청 완료${NC}"
    echo -e "${BLUE}🆔 무효화 ID: $invalidation_id${NC}"
    echo -e "${YELLOW}⏳ 캐시 무효화 완료까지 5-15분 정도 소요될 수 있습니다.${NC}"
}

# 사용법 표시
show_help() {
    echo "CloudFront Origin Path 설정 스크립트"
    echo
    echo "사용법:"
    echo "  $0 <distribution-id> <bucket-name> [origin-path]"
    echo
    echo "매개변수:"
    echo "  distribution-id    CloudFront 배포 ID"
    echo "  bucket-name        S3 버킷 이름"
    echo "  origin-path        Origin Path (기본값: /current)"
    echo
    echo "예시:"
    echo "  $0 E1234567890ABC woo-bottle.com"
    echo "  $0 E1234567890ABC woo-bottle.com /current"
}

# 메인 로직
main() {
    local distribution_id=$1
    local bucket_name=$2
    local origin_path=${3:-"/current"}
    
    # 인자 확인
    if [[ -z "$distribution_id" || -z "$bucket_name" ]]; then
        echo -e "${RED}❌ 필수 매개변수가 누락되었습니다!${NC}"
        show_help
        exit 1
    fi
    
    # jq 설치 확인
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ jq가 설치되지 않았습니다!${NC}"
        echo "설치 방법: brew install jq (macOS) 또는 apt-get install jq (Ubuntu)"
        exit 1
    fi
    
    echo -e "${BLUE}🚀 CloudFront Origin Path 설정 시작...${NC}"
    echo
    
    # 설정 실행
    update_cloudfront_origin "$distribution_id" "$bucket_name" "$origin_path"
    
    # 캐시 무효화 여부 확인
    read -p "캐시를 무효화하시겠습니까? (y/N): " invalidate
    if [[ $invalidate == "y" || $invalidate == "Y" ]]; then
        invalidate_cloudfront_cache "$distribution_id"
    fi
    
    echo
    echo -e "${GREEN}🎉 설정 완료!${NC}"
    echo -e "${BLUE}💡 이제 CloudFront URL로 접근하면 S3의 $origin_path 폴더가 루트로 매핑됩니다.${NC}"
}

# 스크립트가 직접 실행될 때만 main 함수 실행
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        help|--help|-h)
            show_help
            ;;
        *)
            main "$@"
            ;;
    esac
fi
