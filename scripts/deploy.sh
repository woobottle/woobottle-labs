#!/bin/bash

# WooBottle Labs S3 배포 스크립트
# 사용법: ./scripts/deploy.sh

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 WooBottle Labs 배포 시작...${NC}"

# 환경 설정 로드
source .env.local 2>/dev/null || {
  echo -e "${RED}❌ .env.local 파일이 없습니다!${NC}"
  exit 1
}

# 필수 환경변수 확인
if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" || -z "$AWS_REGION" || -z "$S3_BUCKET_NAME" ]]; then
  echo -e "${RED}❌ 필수 AWS 환경변수가 설정되지 않았습니다!${NC}"
  echo "필요한 변수: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET_NAME"
  exit 1
fi

# AWS CLI 설치 확인
if ! command -v aws &> /dev/null; then
  echo -e "${RED}❌ AWS CLI가 설치되지 않았습니다!${NC}"
  echo "설치 방법: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
  exit 1
fi

# 의존성 설치
echo -e "${YELLOW}📦 의존성 설치 중...${NC}"
if command -v pnpm &> /dev/null; then
  pnpm install --frozen-lockfile
elif command -v yarn &> /dev/null; then
  yarn install --frozen-lockfile
else
  npm ci
fi

# 테스트 실행
echo -e "${YELLOW}🧪 테스트 실행 중...${NC}"
if command -v pnpm &> /dev/null; then
  pnpm test
elif command -v yarn &> /dev/null; then
  yarn test
else
  npm test
fi

# Lint 검사
echo -e "${YELLOW}🔍 코드 검사 중...${NC}"
if command -v pnpm &> /dev/null; then
  pnpm lint
elif command -v yarn &> /dev/null; then
  yarn lint
else
  npm run lint
fi

# 빌드
echo -e "${YELLOW}🔨 프로젝트 빌드 중...${NC}"
if command -v pnpm &> /dev/null; then
  pnpm build
elif command -v yarn &> /dev/null; then
  yarn build
else
  npm run build
fi

# AWS 자격증명 설정
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=$AWS_REGION

# S3에 업로드
echo -e "${YELLOW}☁️  S3에 업로드 중...${NC}"
aws s3 sync ./out s3://$S3_BUCKET_NAME --delete --cache-control "max-age=86400"

# CloudFront 무효화 (선택사항)
if [[ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]]; then
  echo -e "${YELLOW}🌐 CloudFront 캐시 무효화 중...${NC}"
  aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*" \
    --output table
fi

echo -e "${GREEN}✅ 배포가 완료되었습니다!${NC}"
echo -e "${GREEN}🌍 버킷: $S3_BUCKET_NAME${NC}"
echo -e "${GREEN}📅 배포 시간: $(date)${NC}"

# 배포 URL 표시 (선택사항)
if [[ -n "$DEPLOYMENT_URL" ]]; then
  echo -e "${GREEN}🔗 배포 URL: $DEPLOYMENT_URL${NC}"
fi
