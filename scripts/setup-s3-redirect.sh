#!/bin/bash

# S3 웹사이트 호스팅 리다이렉트 설정 스크립트
# 루트 경로(/)를 current/ 폴더로 리다이렉트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 기본 설정
PRODUCTION_BUCKET="woo-bottle.com"

# 사용법 표시
show_help() {
    echo "S3 웹사이트 호스팅 리다이렉트 설정 스크립트"
    echo
    echo "사용법:"
    echo "  $0 <bucket-name>"
    echo
    echo "예시:"
    echo "  $0 woo-bottle.com                # 프로덕션 버킷 설정"
}

# S3 웹사이트 호스팅 설정
setup_s3_website_hosting() {
    local bucket_name=$1
    
    echo -e "${BLUE}🌐 S3 웹사이트 호스팅 설정: $bucket_name${NC}"
    
    # 현재 폴더는 항상 current
    CURRENT_FOLDER="current"
    
      # 웹사이트 설정 JSON 생성 (무한 리다이렉트 방지)
  cat > /tmp/website-config.json << EOF
{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "404.html"
    },
    "RoutingRules": [
        {
            "Condition": {
                "KeyPrefixEquals": "",
                "HttpErrorCodeReturnedEquals": "404"
            },
            "Redirect": {
                "ReplaceKeyPrefixWith": "$CURRENT_FOLDER/",
                "HttpRedirectCode": "302"
            }
        }
    ]
}
EOF
    
    # S3 웹사이트 호스팅 설정 적용
    echo -e "${YELLOW}📝 웹사이트 호스팅 설정 적용 중...${NC}"
    aws s3api put-bucket-website \
        --bucket "$bucket_name" \
        --website-configuration file:///tmp/website-config.json
    
    # 임시 파일 정리
    rm -f /tmp/website-config.json
    
    echo -e "${GREEN}✅ 웹사이트 호스팅 설정 완료${NC}"
    echo -e "${BLUE}🔗 웹사이트 URL: http://$bucket_name.s3-website.$AWS_REGION.amazonaws.com${NC}"
}

# 버킷 정책 설정 (공개 읽기 권한)
setup_bucket_policy() {
    local bucket_name=$1
    
    echo -e "${YELLOW}🔒 버킷 정책 설정 중...${NC}"
    
    # 버킷 정책 JSON 생성
    cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucket_name/*"
        }
    ]
}
EOF
    
    # 버킷 정책 적용
    aws s3api put-bucket-policy \
        --bucket "$bucket_name" \
        --policy file:///tmp/bucket-policy.json
    
    # 임시 파일 정리
    rm -f /tmp/bucket-policy.json
    
    echo -e "${GREEN}✅ 버킷 정책 설정 완료${NC}"
}

# 메인 로직
main() {
    local bucket_name=$1
    
    # 인자 확인
    if [[ -z "$bucket_name" ]]; then
        echo -e "${RED}❌ 버킷 이름이 필요합니다!${NC}"
        show_help
        exit 1
    fi
    
    # AWS 환경변수 확인
    if [[ -z "$AWS_REGION" ]]; then
        export AWS_REGION="ap-northeast-2"  # 기본값
        echo -e "${YELLOW}⚠️  AWS_REGION이 설정되지 않아 기본값 사용: $AWS_REGION${NC}"
    fi
    
    echo -e "${BLUE}🚀 S3 웹사이트 호스팅 설정 시작...${NC}"
    echo -e "${BLUE}📦 버킷: $bucket_name${NC}"
    echo -e "${BLUE}🌍 리전: $AWS_REGION${NC}"
    echo -e "${BLUE}🎯 타입: 프로덕션${NC}"
    echo
    
    # 설정 실행
    setup_s3_website_hosting "$bucket_name"
    setup_bucket_policy "$bucket_name"
    
    echo
    echo -e "${GREEN}🎉 설정 완료!${NC}"
    echo -e "${GREEN}🔗 이제 다음 URL로 접근할 수 있습니다:${NC}"
    echo -e "${GREEN}   http://$bucket_name.s3-website.$AWS_REGION.amazonaws.com${NC}"
    echo
    echo -e "${BLUE}💡 참고사항:${NC}"
    echo -e "   - 루트 경로(/) 접근 시 자동으로 current/ 폴더로 리다이렉트됩니다"
    echo -e "   - CloudFront를 사용하는 경우 캐시 무효화가 필요할 수 있습니다"
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
