#!/bin/bash

# WooBottle Labs AWS 초기 설정 스크립트
# 사용법: ./scripts/setup-aws.sh

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 WooBottle Labs AWS 초기 설정 시작...${NC}"

# 환경 설정 로드
source .env.local 2>/dev/null || {
  echo -e "${RED}❌ .env.local 파일이 없습니다!${NC}"
  echo "먼저 .env.local 파일을 생성하고 AWS 자격증명을 설정해주세요."
  exit 1
}

# 필수 환경변수 확인
if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" || -z "$AWS_REGION" ]]; then
  echo -e "${RED}❌ 필수 AWS 환경변수가 설정되지 않았습니다!${NC}"
  echo "필요한 변수: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION"
  exit 1
fi

# AWS CLI 설치 확인
if ! command -v aws &> /dev/null; then
  echo -e "${RED}❌ AWS CLI가 설치되지 않았습니다!${NC}"
  echo "설치 방법: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
  exit 1
fi

# AWS 자격증명 설정
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=$AWS_REGION

PRODUCTION_BUCKET="woo-bottle.com"

echo -e "${YELLOW}🔍 AWS 연결 테스트 중...${NC}"
if ! aws sts get-caller-identity &>/dev/null; then
  echo -e "${RED}❌ AWS 자격증명이 유효하지 않습니다!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ AWS 연결 확인됨${NC}"

# 1. 프로덕션 S3 버킷 생성
echo -e "${YELLOW}📦 프로덕션 S3 버킷 확인 중: $PRODUCTION_BUCKET${NC}"
if ! aws s3 ls "s3://$PRODUCTION_BUCKET" &>/dev/null; then
  echo -e "${YELLOW}📦 프로덕션 버킷 생성 중...${NC}"
  
  # 버킷 생성
  aws s3 mb "s3://$PRODUCTION_BUCKET" --region "$AWS_REGION"
  
  # 정적 웹사이트 호스팅 설정
  aws s3 website "s3://$PRODUCTION_BUCKET" \
    --index-document index.html \
    --error-document 404.html
  
  # 퍼블릭 읽기 권한 설정
  cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$PRODUCTION_BUCKET/*"
    }
  ]
}
EOF
  
  # 퍼블릭 액세스 차단 해제 (정적 웹사이트 호스팅을 위해)
  aws s3api put-public-access-block \
    --bucket "$PRODUCTION_BUCKET" \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
  
  # 버킷 정책 적용
  aws s3api put-bucket-policy \
    --bucket "$PRODUCTION_BUCKET" \
    --policy file:///tmp/bucket-policy.json
  
  # 임시 파일 정리
  rm -f /tmp/bucket-policy.json
  
  echo -e "${GREEN}✅ 프로덕션 버킷 생성 및 설정 완료${NC}"
else
  echo -e "${GREEN}✅ 프로덕션 버킷이 이미 존재합니다${NC}"
fi



# 3. CloudFront 설정 (선택사항)
if [[ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]]; then
  echo -e "${YELLOW}🌐 CloudFront 설정 확인 중...${NC}"
  if aws cloudfront get-distribution --id "$CLOUDFRONT_DISTRIBUTION_ID" &>/dev/null; then
    echo -e "${GREEN}✅ CloudFront Distribution 확인됨: $CLOUDFRONT_DISTRIBUTION_ID${NC}"
  else
    echo -e "${YELLOW}⚠️  CloudFront Distribution ID가 유효하지 않습니다: $CLOUDFRONT_DISTRIBUTION_ID${NC}"
  fi
else
  echo -e "${YELLOW}ℹ️  CloudFront Distribution ID가 설정되지 않았습니다 (선택사항)${NC}"
fi

echo
echo -e "${GREEN}🎉 AWS 초기 설정이 완료되었습니다!${NC}"
echo
echo -e "${BLUE}📊 설정 요약:${NC}"
echo -e "   프로덕션 버킷: $PRODUCTION_BUCKET"
echo -e "   AWS 리전: $AWS_REGION"

if [[ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]]; then
  echo -e "   CloudFront: $CLOUDFRONT_DISTRIBUTION_ID"
fi

echo
echo -e "${BLUE}🔗 웹사이트 URL:${NC}"
echo -e "   프로덕션: https://$PRODUCTION_BUCKET"

echo
echo -e "${YELLOW}다음 단계:${NC}"
echo -e "1. 첫 번째 Git 태그 생성: ${GREEN}npm run version:create${NC}"
echo -e "2. 프로덕션 배포: ${GREEN}npm run deploy${NC}"

echo
echo -e "${YELLOW}💡 참고:${NC}"
echo "- 도메인을 연결하려면 Route 53에서 CNAME 설정이 필요합니다"
echo "- HTTPS를 사용하려면 CloudFront 설정을 권장합니다"
echo "- 버킷 정책은 퍼블릭 읽기 권한으로 설정되었습니다"
