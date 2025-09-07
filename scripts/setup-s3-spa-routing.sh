#!/bin/bash

# S3 SPA 라우팅 설정 자동화 스크립트
set -e

BUCKET_NAME="woo-bottle.com"

echo "🚀 S3 SPA 라우팅 설정 중..."

# 1. S3 웹사이트 호스팅 활성화
echo "📦 S3 웹사이트 호스팅 활성화..."
aws s3 website "s3://$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html

echo "✅ S3 웹사이트 호스팅 설정 완료"

# 2. S3 버킷 정책 설정 (퍼블릭 읽기 권한)
echo "🔐 S3 버킷 정책 설정..."
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file:///tmp/bucket-policy.json

echo "✅ S3 버킷 정책 설정 완료"

# 3. 퍼블릭 액세스 차단 설정 해제 (웹사이트 호스팅을 위해 필요)
echo "🌐 퍼블릭 액세스 설정..."
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

echo "✅ 퍼블릭 액세스 설정 완료"

# 4. CloudFront 배포 ID 확인 및 설정 안내
echo ""
echo "🌍 CloudFront 설정이 필요합니다:"
echo ""
echo "다음 명령어로 CloudFront 배포 목록을 확인하세요:"
echo "aws cloudfront list-distributions --query 'DistributionList.Items[?contains(Aliases.Items, \`$BUCKET_NAME\`)].Id' --output text"
echo ""
echo "CloudFront 배포 ID를 확인한 후, 다음 스크립트를 실행하세요:"
echo "./scripts/setup-cloudfront-spa.sh YOUR_DISTRIBUTION_ID"
echo ""

# S3 웹사이트 엔드포인트 출력
echo "📍 S3 웹사이트 엔드포인트:"
echo "http://$BUCKET_NAME.s3-website.ap-northeast-2.amazonaws.com"
echo ""
echo "✅ S3 SPA 라우팅 설정 완료!"

# 임시 파일 정리
rm -f /tmp/bucket-policy.json
