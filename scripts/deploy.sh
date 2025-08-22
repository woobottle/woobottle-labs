#!/bin/bash

# WooBottle Labs S3 배포 스크립트 (버저닝 지원)
# 사용법: ./scripts/deploy.sh [--version v1.0.0] [--staging] [--auto-version patch|minor|major]

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 버전 관리 유틸리티 로드
source "$(dirname "$0")/version-utils.sh" 2>/dev/null || {
  echo -e "${RED}❌ version-utils.sh 파일을 찾을 수 없습니다!${NC}"
  exit 1
}

# 기본 설정
DEPLOY_VERSION=""
IS_STAGING=false
AUTO_VERSION=""
STAGING_BUCKET="woo-bottle-staging.com"
PRODUCTION_BUCKET="woo-bottle.com"

# 명령행 인자 파싱
while [[ $# -gt 0 ]]; do
  case $1 in
    --version)
      DEPLOY_VERSION="$2"
      shift 2
      ;;
    --staging)
      IS_STAGING=true
      shift
      ;;
    --auto-version)
      AUTO_VERSION="$2"
      shift 2
      ;;
    --help|-h)
      echo "WooBottle Labs 배포 스크립트 (버저닝 지원)"
      echo
      echo "사용법: $0 [옵션]"
      echo
      echo "옵션:"
      echo "  --version v1.0.0       특정 버전으로 배포"
      echo "  --staging              스테이징 환경에 배포"
      echo "  --auto-version TYPE    자동 버전 생성 (patch|minor|major)"
      echo "  --help, -h             이 도움말 표시"
      echo
      echo "예시:"
      echo "  $0                                    # 현재 버전으로 프로덕션 배포"
      echo "  $0 --staging                          # 현재 버전으로 스테이징 배포"
      echo "  $0 --version v1.2.0                   # 특정 버전으로 프로덕션 배포"
      echo "  $0 --auto-version patch               # 패치 버전 자동 생성 후 배포"
      echo "  $0 --auto-version minor --staging     # 마이너 버전 생성 후 스테이징 배포"
      exit 0
      ;;
    *)
      echo -e "${RED}❌ 알 수 없는 옵션: $1${NC}"
      echo "도움말을 보려면 --help를 사용하세요."
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🚀 WooBottle Labs 배포 시작...${NC}"

# 자동 버전 생성
if [[ -n "$AUTO_VERSION" ]]; then
  echo -e "${YELLOW}🏷️  자동 버전 생성 중...${NC}"
  DEPLOY_VERSION=$(get_next_version "$AUTO_VERSION")
  create_git_tag "$DEPLOY_VERSION" "Automated $AUTO_VERSION release"
  push_git_tag "$DEPLOY_VERSION"
  echo -e "${GREEN}✅ 새 버전 생성: $DEPLOY_VERSION${NC}"
fi

# 배포 버전 결정
if [[ -z "$DEPLOY_VERSION" ]]; then
  DEPLOY_VERSION=$(get_latest_version)
  echo -e "${BLUE}📋 배포 버전: $DEPLOY_VERSION (최신)${NC}"
else
  # 버전 유효성 검사
  if ! validate_version "$DEPLOY_VERSION"; then
    exit 1
  fi
  echo -e "${BLUE}📋 배포 버전: $DEPLOY_VERSION (지정됨)${NC}"
fi

# 타겟 버킷 결정
if [[ "$IS_STAGING" == true ]]; then
  TARGET_BUCKET="$STAGING_BUCKET"
  DEPLOY_TYPE="스테이징"
else
  TARGET_BUCKET="$PRODUCTION_BUCKET"
  DEPLOY_TYPE="프로덕션"
fi

echo -e "${BLUE}🎯 배포 대상: $DEPLOY_TYPE ($TARGET_BUCKET)${NC}"

# 환경 설정 로드
source .env.local 2>/dev/null || {
  echo -e "${RED}❌ .env.local 파일이 없습니다!${NC}"
  exit 1
}

# 필수 환경변수 확인
if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" || -z "$AWS_REGION" ]]; then
  echo -e "${RED}❌ 필수 AWS 환경변수가 설정되지 않았습니다!${NC}"
  echo "필요한 변수: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION"
  exit 1
fi

# 스테이징 버킷 존재 확인 및 생성
if [[ "$IS_STAGING" == true ]]; then
  echo -e "${YELLOW}🔍 스테이징 버킷 확인 중...${NC}"
  if ! aws s3 ls "s3://$STAGING_BUCKET" &>/dev/null; then
    echo -e "${YELLOW}📦 스테이징 버킷 생성 중: $STAGING_BUCKET${NC}"
    aws s3 mb "s3://$STAGING_BUCKET" --region "$AWS_REGION"
    
    # 정적 웹사이트 호스팅 설정
    aws s3 website "s3://$STAGING_BUCKET" \
      --index-document index.html \
      --error-document 404.html
    
    echo -e "${GREEN}✅ 스테이징 버킷 생성 완료${NC}"
  else
    echo -e "${GREEN}✅ 스테이징 버킷 확인됨${NC}"
  fi
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

# S3에 버전별 업로드
echo -e "${YELLOW}☁️  S3에 버전별 업로드 중...${NC}"

# 1. 버전별 디렉토리에 업로드
VERSION_PATH="versions/$DEPLOY_VERSION"
echo -e "${BLUE}📁 버전 경로: s3://$TARGET_BUCKET/$VERSION_PATH${NC}"
aws s3 sync ./out "s3://$TARGET_BUCKET/$VERSION_PATH/" --cache-control "max-age=31536000"

# 2. 현재 버전으로 설정 (프로덕션의 경우 current/, 스테이징의 경우 staging/)
if [[ "$IS_STAGING" == true ]]; then
  CURRENT_PATH="staging"
else
  CURRENT_PATH="current" 
fi

echo -e "${BLUE}📁 현재 경로: s3://$TARGET_BUCKET/$CURRENT_PATH${NC}"
aws s3 sync ./out "s3://$TARGET_BUCKET/$CURRENT_PATH/" --delete --cache-control "max-age=86400"

# 3. 배포 메타데이터 저장
DEPLOY_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DEPLOY_METADATA="{
  \"version\": \"$DEPLOY_VERSION\",
  \"timestamp\": \"$DEPLOY_TIMESTAMP\",
  \"environment\": \"$DEPLOY_TYPE\",
  \"bucket\": \"$TARGET_BUCKET\",
  \"commit_hash\": \"$(git rev-parse HEAD 2>/dev/null || echo 'unknown')\",
  \"branch\": \"$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')\"
}"

echo "$DEPLOY_METADATA" | aws s3 cp - "s3://$TARGET_BUCKET/$CURRENT_PATH/deploy-info.json" \
  --content-type "application/json" \
  --cache-control "no-cache"

echo -e "${GREEN}✅ S3 업로드 완료${NC}"

# CloudFront 무효화 (선택사항)
if [[ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]]; then
  echo -e "${YELLOW}🌐 CloudFront 캐시 무효화 중...${NC}"
  aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*" \
    --output table
fi

# 오래된 버전 정리 (최신 3개만 유지)
if [[ "$IS_STAGING" != true ]]; then
  echo -e "${YELLOW}🧹 오래된 버전 정리 중...${NC}"
  cleanup_old_versions "$TARGET_BUCKET" 3
fi

echo -e "${GREEN}✅ 배포가 완료되었습니다!${NC}"
echo -e "${GREEN}🎯 환경: $DEPLOY_TYPE${NC}"
echo -e "${GREEN}🌍 버킷: $TARGET_BUCKET${NC}"
echo -e "${GREEN}📦 버전: $DEPLOY_VERSION${NC}"
echo -e "${GREEN}📅 배포 시간: $(date)${NC}"

# 배포 URL 표시
if [[ "$IS_STAGING" == true ]]; then
  DEPLOYMENT_URL="http://$STAGING_BUCKET.s3-website.$AWS_REGION.amazonaws.com"
  echo -e "${GREEN}🔗 스테이징 URL: $DEPLOYMENT_URL${NC}"
else
  if [[ -n "$DEPLOYMENT_URL" ]]; then
    echo -e "${GREEN}🔗 프로덕션 URL: $DEPLOYMENT_URL${NC}"
  else
    DEPLOYMENT_URL="http://$PRODUCTION_BUCKET.s3-website.$AWS_REGION.amazonaws.com"
    echo -e "${GREEN}🔗 프로덕션 URL: $DEPLOYMENT_URL${NC}"
  fi
fi

# 배포 요약
echo
echo -e "${BLUE}📊 배포 요약:${NC}"
echo -e "   버전: $DEPLOY_VERSION"
echo -e "   환경: $DEPLOY_TYPE"
echo -e "   버킷: $TARGET_BUCKET"
echo -e "   경로: /$CURRENT_PATH/"
echo -e "   메타데이터: /$CURRENT_PATH/deploy-info.json"
