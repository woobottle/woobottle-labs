#!/bin/bash

# S3 리다이렉트 문제 해결 스크립트
# woo-bottle.com 리다이렉트 루프 문제 해결

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PRODUCTION_BUCKET="woo-bottle.com"

echo -e "${BLUE}🔧 S3 리다이렉트 문제 해결 중...${NC}"
echo -e "${BLUE}📦 버킷: $PRODUCTION_BUCKET${NC}"
echo

# 1. 현재 웹사이트 설정 확인
echo -e "${YELLOW}🔍 현재 웹사이트 설정 확인 중...${NC}"
aws s3api get-bucket-website --bucket "$PRODUCTION_BUCKET" > /tmp/current-config.json 2>/dev/null || echo "웹사이트 설정이 없습니다."

# 2. 리다이렉트 규칙 제거 - 단순한 웹사이트 호스팅 설정
echo -e "${YELLOW}🛠️  리다이렉트 규칙 제거 중...${NC}"
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

# 웹사이트 설정 적용
aws s3api put-bucket-website \
    --bucket "$PRODUCTION_BUCKET" \
    --website-configuration file:///tmp/simple-website-config.json

echo -e "${GREEN}✅ 리다이렉트 규칙 제거 완료${NC}"

# 3. current/ 폴더의 내용을 루트로 복사
echo -e "${YELLOW}📁 current/ 폴더 내용을 루트로 복사 중...${NC}"

# current/ 폴더에서 루트로 동기화
aws s3 sync "s3://$PRODUCTION_BUCKET/current/" "s3://$PRODUCTION_BUCKET/" \
    --exclude "deploy-info.json" \
    --cache-control "max-age=86400" \
    --delete

echo -e "${GREEN}✅ 파일 복사 완료${NC}"

# 4. 배포 정보 복사 (버전 정보 유지)
echo -e "${YELLOW}📄 배포 정보 복사 중...${NC}"
aws s3 cp "s3://$PRODUCTION_BUCKET/current/deploy-info.json" "s3://$PRODUCTION_BUCKET/deploy-info.json" \
    --content-type "application/json" \
    --cache-control "no-cache" 2>/dev/null || echo -e "${YELLOW}⚠️  deploy-info.json 파일이 없습니다${NC}"

# 5. CloudFront 캐시 무효화 (선택사항)
echo -e "${YELLOW}🌐 CloudFront 캐시 무효화 확인 중...${NC}"
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[0]=='$PRODUCTION_BUCKET'].Id" --output text 2>/dev/null || echo "")

if [[ -n "$DISTRIBUTION_ID" && "$DISTRIBUTION_ID" != "None" ]]; then
    echo -e "${YELLOW}🔄 CloudFront 캐시 무효화 중... (Distribution: $DISTRIBUTION_ID)${NC}"
    aws cloudfront create-invalidation \
        --distribution-id "$DISTRIBUTION_ID" \
        --paths "/*" > /dev/null
    echo -e "${GREEN}✅ CloudFront 캐시 무효화 완료${NC}"
else
    echo -e "${YELLOW}⚠️  CloudFront 배포를 찾을 수 없습니다${NC}"
fi

# 임시 파일 정리
rm -f /tmp/simple-website-config.json /tmp/current-config.json

echo
echo -e "${GREEN}🎉 리다이렉트 문제 해결 완료!${NC}"
echo -e "${GREEN}🔗 이제 https://woo-bottle.com 에서 정상 접근 가능합니다${NC}"
echo
echo -e "${BLUE}📋 변경사항:${NC}"
echo "  1. S3 리다이렉트 규칙 제거"
echo "  2. current/ 폴더 내용을 루트(/)로 복사"
echo "  3. 직접 접근 가능하도록 설정"
echo "  4. CloudFront 캐시 무효화 (해당하는 경우)"
echo
echo -e "${YELLOW}💡 참고사항:${NC}"
echo "  - 루트 경로(/)에서 바로 index.html 제공"
echo "  - 리다이렉트 없이 직접 접근"
echo "  - 변경사항이 반영되는데 몇 분 소요될 수 있습니다"
echo
echo -e "${BLUE}🧪 테스트:${NC}"
echo "  curl -I https://woo-bottle.com/"
