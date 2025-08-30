#!/bin/bash

# S3 무한 리다이렉트 문제 긴급 해결 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PRODUCTION_BUCKET="woo-bottle.com"

echo -e "${RED}🚨 S3 무한 리다이렉트 문제 해결 중...${NC}"

# 1. 기존 웹사이트 설정 제거
echo -e "${YELLOW}🔧 기존 리다이렉트 설정 제거 중...${NC}"
cat > /tmp/simple-website-config.json << EOF
{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "404.html"
    }
}
EOF

aws s3api put-bucket-website \
    --bucket "$PRODUCTION_BUCKET" \
    --website-configuration file:///tmp/simple-website-config.json

echo -e "${GREEN}✅ 리다이렉트 설정 제거 완료${NC}"

# 2. current/ 폴더의 내용을 루트로 복사
echo -e "${YELLOW}📁 current/ 폴더 내용을 루트로 복사 중...${NC}"

# current/ 폴더에서 루트로 동기화 (리다이렉트 없이 직접 접근 가능하도록)
aws s3 sync "s3://$PRODUCTION_BUCKET/current/" "s3://$PRODUCTION_BUCKET/" \
    --exclude "deploy-info.json" \
    --cache-control "max-age=86400"

echo -e "${GREEN}✅ 루트 파일 복사 완료${NC}"

# 3. 루트에 deploy-info.json도 복사 (버전 정보 유지)
echo -e "${YELLOW}📄 배포 정보 복사 중...${NC}"
aws s3 cp "s3://$PRODUCTION_BUCKET/current/deploy-info.json" "s3://$PRODUCTION_BUCKET/deploy-info.json" \
    --content-type "application/json" \
    --cache-control "no-cache"

# 임시 파일 정리
rm -f /tmp/simple-website-config.json

echo
echo -e "${GREEN}🎉 문제 해결 완료!${NC}"
echo -e "${GREEN}🔗 이제 http://woo-bottle.com.s3-website-us-east-1.amazonaws.com 에서 정상 접근 가능합니다.${NC}"
echo
echo -e "${BLUE}📋 변경사항:${NC}"
echo "  1. 무한 리다이렉트 규칙 제거"
echo "  2. current/ 폴더 내용을 루트(/)로 복사"
echo "  3. 직접 접근 가능하도록 설정"
echo
echo -e "${YELLOW}💡 참고:${NC}"
echo "  - 루트 경로(/)에서 바로 index.html 제공"
echo "  - current/ 경로도 여전히 접근 가능"
echo "  - 버전 정보는 /deploy-info.json에서 확인 가능"
