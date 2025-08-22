#!/bin/bash

# WooBottle Labs 롤백 스크립트
# 사용법: ./scripts/rollback.sh [--version v1.0.0] [--staging] [--list] [--interactive]

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
ROLLBACK_VERSION=""
IS_STAGING=false
LIST_VERSIONS=false
INTERACTIVE_MODE=false
STAGING_BUCKET="woo-bottle-staging.com"
PRODUCTION_BUCKET="woo-bottle.com"

# 명령행 인자 파싱
while [[ $# -gt 0 ]]; do
  case $1 in
    --version)
      ROLLBACK_VERSION="$2"
      shift 2
      ;;
    --staging)
      IS_STAGING=true
      shift
      ;;
    --list)
      LIST_VERSIONS=true
      shift
      ;;
    --interactive)
      INTERACTIVE_MODE=true
      shift
      ;;
    --help|-h)
      echo "WooBottle Labs 롤백 스크립트"
      echo
      echo "사용법: $0 [옵션]"
      echo
      echo "옵션:"
      echo "  --version v1.0.0    롤백할 버전 지정"
      echo "  --staging           스테이징 환경에서 롤백"
      echo "  --list              사용 가능한 버전 목록 표시"
      echo "  --interactive       대화형 모드"
      echo "  --help, -h          이 도움말 표시"
      echo
      echo "예시:"
      echo "  $0 --list                       # 사용 가능한 버전 목록"
      echo "  $0 --version v1.0.1             # 특정 버전으로 롤백"
      echo "  $0 --interactive                # 대화형 롤백"
      echo "  $0 --version v1.0.1 --staging   # 스테이징 환경 롤백"
      exit 0
      ;;
    *)
      echo -e "${RED}❌ 알 수 없는 옵션: $1${NC}"
      echo "도움말을 보려면 --help를 사용하세요."
      exit 1
      ;;
  esac
done

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

# AWS 자격증명 설정
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=$AWS_REGION

# 타겟 버킷 결정
if [[ "$IS_STAGING" == true ]]; then
  TARGET_BUCKET="$STAGING_BUCKET"
  ENVIRONMENT="스테이징"
  CURRENT_PATH="staging"
else
  TARGET_BUCKET="$PRODUCTION_BUCKET"
  ENVIRONMENT="프로덕션"
  CURRENT_PATH="current"
fi

echo -e "${BLUE}🔄 WooBottle Labs 롤백 시작...${NC}"
echo -e "${BLUE}🎯 대상 환경: $ENVIRONMENT ($TARGET_BUCKET)${NC}"

# 버전 목록 표시
if [[ "$LIST_VERSIONS" == true ]]; then
  echo -e "${BLUE}📋 $ENVIRONMENT 환경의 사용 가능한 버전:${NC}"
  echo
  
  # 현재 배포된 버전 확인
  CURRENT_VERSION_INFO=$(aws s3 cp "s3://$TARGET_BUCKET/$CURRENT_PATH/deploy-info.json" - 2>/dev/null || echo '{}')
  CURRENT_VERSION=$(echo "$CURRENT_VERSION_INFO" | grep -o '"version":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "unknown")
  
  echo -e "${GREEN}현재 배포된 버전: $CURRENT_VERSION${NC}"
  echo
  
  # S3에서 사용 가능한 버전들
  echo -e "${YELLOW}사용 가능한 버전들:${NC}"
  AVAILABLE_VERSIONS=($(aws s3 ls "s3://$TARGET_BUCKET/versions/" | grep "PRE" | awk '{print $2}' | sed 's/\///g' | sort -V))
  
  if [[ ${#AVAILABLE_VERSIONS[@]} -eq 0 ]]; then
    echo -e "${RED}❌ 사용 가능한 버전이 없습니다!${NC}"
    exit 1
  fi
  
  for version in "${AVAILABLE_VERSIONS[@]}"; do
    if [[ "$version" == "$CURRENT_VERSION" ]]; then
      echo -e "  ${GREEN}● $version (현재)${NC}"
    else
      echo -e "  ○ $version"
    fi
  done
  
  exit 0
fi

# 대화형 모드
if [[ "$INTERACTIVE_MODE" == true ]]; then
  echo -e "${BLUE}🔄 대화형 롤백 모드${NC}"
  echo
  
  # 현재 버전 표시
  CURRENT_VERSION_INFO=$(aws s3 cp "s3://$TARGET_BUCKET/$CURRENT_PATH/deploy-info.json" - 2>/dev/null || echo '{}')
  CURRENT_VERSION=$(echo "$CURRENT_VERSION_INFO" | grep -o '"version":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "unknown")
  
  echo -e "현재 배포된 버전: ${GREEN}$CURRENT_VERSION${NC}"
  echo
  
  # 사용 가능한 버전들
  echo -e "${YELLOW}사용 가능한 버전들:${NC}"
  AVAILABLE_VERSIONS=($(aws s3 ls "s3://$TARGET_BUCKET/versions/" | grep "PRE" | awk '{print $2}' | sed 's/\///g' | sort -V))
  
  if [[ ${#AVAILABLE_VERSIONS[@]} -eq 0 ]]; then
    echo -e "${RED}❌ 롤백할 수 있는 버전이 없습니다!${NC}"
    exit 1
  fi
  
  # 현재 버전을 제외한 버전들만 표시
  OTHER_VERSIONS=()
  for version in "${AVAILABLE_VERSIONS[@]}"; do
    if [[ "$version" != "$CURRENT_VERSION" ]]; then
      OTHER_VERSIONS+=("$version")
    fi
  done
  
  if [[ ${#OTHER_VERSIONS[@]} -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  롤백할 수 있는 다른 버전이 없습니다.${NC}"
    exit 0
  fi
  
  # 버전 선택
  echo "롤백할 버전을 선택하세요:"
  for i in "${!OTHER_VERSIONS[@]}"; do
    echo "  $((i + 1))) ${OTHER_VERSIONS[$i]}"
  done
  echo
  
  read -p "선택하세요 (1-${#OTHER_VERSIONS[@]}): " choice
  
  if [[ "$choice" =~ ^[0-9]+$ ]] && [[ "$choice" -ge 1 ]] && [[ "$choice" -le ${#OTHER_VERSIONS[@]} ]]; then
    ROLLBACK_VERSION="${OTHER_VERSIONS[$((choice - 1))]}"
  else
    echo -e "${RED}❌ 유효하지 않은 선택입니다.${NC}"
    exit 1
  fi
fi

# 롤백 버전 확인
if [[ -z "$ROLLBACK_VERSION" ]]; then
  echo -e "${RED}❌ 롤백할 버전을 지정해야 합니다!${NC}"
  echo "사용법: $0 --version v1.0.0 또는 $0 --interactive"
  exit 1
fi

# 버전 유효성 검사
if ! validate_version "$ROLLBACK_VERSION"; then
  exit 1
fi

echo -e "${BLUE}📋 롤백 버전: $ROLLBACK_VERSION${NC}"

# 롤백할 버전이 S3에 존재하는지 확인
echo -e "${YELLOW}🔍 버전 존재 확인 중...${NC}"
if ! aws s3 ls "s3://$TARGET_BUCKET/versions/$ROLLBACK_VERSION/" &>/dev/null; then
  echo -e "${RED}❌ 버전 $ROLLBACK_VERSION이 S3에 존재하지 않습니다!${NC}"
  echo "사용 가능한 버전을 확인하려면 --list 옵션을 사용하세요."
  exit 1
fi

echo -e "${GREEN}✅ 버전 확인됨${NC}"

# 현재 버전 백업 (안전장치)
echo -e "${YELLOW}💾 현재 버전 백업 중...${NC}"
BACKUP_PATH="backups/rollback-backup-$(date +%Y%m%d-%H%M%S)"
aws s3 sync "s3://$TARGET_BUCKET/$CURRENT_PATH/" "s3://$TARGET_BUCKET/$BACKUP_PATH/" --quiet

# 롤백 확인
echo
echo -e "${YELLOW}⚠️  롤백 확인${NC}"
echo -e "환경: $ENVIRONMENT"
echo -e "롤백 버전: $ROLLBACK_VERSION"
echo -e "백업 경로: s3://$TARGET_BUCKET/$BACKUP_PATH/"
echo

if [[ "$INTERACTIVE_MODE" != true ]]; then
  read -p "계속하시겠습니까? (y/N): " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${YELLOW}❌ 롤백이 취소되었습니다.${NC}"
    exit 0
  fi
fi

# 롤백 실행
echo -e "${YELLOW}🔄 롤백 실행 중...${NC}"

# 지정된 버전을 현재 경로로 복사
aws s3 sync "s3://$TARGET_BUCKET/versions/$ROLLBACK_VERSION/" "s3://$TARGET_BUCKET/$CURRENT_PATH/" \
  --delete \
  --cache-control "max-age=86400"

# 롤백 메타데이터 업데이트
ROLLBACK_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ROLLBACK_METADATA="{
  \"version\": \"$ROLLBACK_VERSION\",
  \"timestamp\": \"$ROLLBACK_TIMESTAMP\",
  \"environment\": \"$ENVIRONMENT\",
  \"bucket\": \"$TARGET_BUCKET\",
  \"rollback\": true,
  \"backup_path\": \"$BACKUP_PATH\",
  \"commit_hash\": \"$(git rev-parse HEAD 2>/dev/null || echo 'unknown')\",
  \"branch\": \"$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')\"
}"

echo "$ROLLBACK_METADATA" | aws s3 cp - "s3://$TARGET_BUCKET/$CURRENT_PATH/deploy-info.json" \
  --content-type "application/json" \
  --cache-control "no-cache"

# CloudFront 캐시 무효화 (프로덕션만)
if [[ "$IS_STAGING" != true && -n "$CLOUDFRONT_DISTRIBUTION_ID" ]]; then
  echo -e "${YELLOW}🌐 CloudFront 캐시 무효화 중...${NC}"
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --output table
fi

echo -e "${GREEN}✅ 롤백이 완료되었습니다!${NC}"
echo
echo -e "${BLUE}📊 롤백 요약:${NC}"
echo -e "   환경: $ENVIRONMENT"
echo -e "   롤백 버전: $ROLLBACK_VERSION"
echo -e "   백업 위치: s3://$TARGET_BUCKET/$BACKUP_PATH/"
echo -e "   롤백 시간: $(date)"

# 배포 URL 표시
if [[ "$IS_STAGING" == true ]]; then
  ROLLBACK_URL="http://$STAGING_BUCKET.s3-website.$AWS_REGION.amazonaws.com"
  echo -e "${GREEN}🔗 스테이징 URL: $ROLLBACK_URL${NC}"
else
  if [[ -n "$DEPLOYMENT_URL" ]]; then
    echo -e "${GREEN}🔗 프로덕션 URL: $DEPLOYMENT_URL${NC}"
  else
    ROLLBACK_URL="http://$PRODUCTION_BUCKET.s3-website.$AWS_REGION.amazonaws.com"
    echo -e "${GREEN}🔗 프로덕션 URL: $ROLLBACK_URL${NC}"
  fi
fi

echo
echo -e "${YELLOW}💡 참고: 문제가 발생하면 백업에서 복원할 수 있습니다:${NC}"
echo "  aws s3 sync s3://$TARGET_BUCKET/$BACKUP_PATH/ s3://$TARGET_BUCKET/$CURRENT_PATH/ --delete"
