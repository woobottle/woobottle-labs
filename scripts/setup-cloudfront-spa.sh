#!/bin/bash

# CloudFront SPA 라우팅 설정 자동화 스크립트
set -e

if [ $# -eq 0 ]; then
    echo "❌ 사용법: $0 <CLOUDFRONT_DISTRIBUTION_ID>"
    echo ""
    echo "CloudFront 배포 ID를 확인하려면:"
    echo "aws cloudfront list-distributions --query 'DistributionList.Items[?contains(Aliases.Items, \`woo-bottle.com\`)].{Id:Id,DomainName:DomainName,Aliases:Aliases.Items}' --output table"
    exit 1
fi

DISTRIBUTION_ID="$1"
BUCKET_NAME="woo-bottle.com"

echo "🌍 CloudFront SPA 라우팅 설정 중..."
echo "배포 ID: $DISTRIBUTION_ID"

# 1. 현재 CloudFront 설정 가져오기
echo "📋 현재 CloudFront 설정 확인..."
aws cloudfront get-distribution-config \
    --id "$DISTRIBUTION_ID" \
    --output json > /tmp/cf-config.json

# ETag 추출 (업데이트에 필요)
ETAG=$(jq -r '.ETag' /tmp/cf-config.json)
echo "ETag: $ETAG"

# 2. 커스텀 오류 응답 설정 추가
echo "🔧 커스텀 오류 응답 설정 추가..."

# 기존 설정에 커스텀 오류 응답 추가
jq '.DistributionConfig.CustomErrorResponses.Items = [
    {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
    },
    {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html", 
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
    }
] | .DistributionConfig.CustomErrorResponses.Quantity = 2' /tmp/cf-config.json > /tmp/cf-config-updated.json

# DistributionConfig만 추출
jq '.DistributionConfig' /tmp/cf-config-updated.json > /tmp/cf-distribution-config.json

# 3. CloudFront 배포 업데이트
echo "🚀 CloudFront 배포 업데이트 중..."
aws cloudfront update-distribution \
    --id "$DISTRIBUTION_ID" \
    --distribution-config file:///tmp/cf-distribution-config.json \
    --if-match "$ETAG" \
    --output json > /tmp/cf-update-result.json

echo "✅ CloudFront 설정 업데이트 완료"

# 4. 배포 상태 확인
echo "⏳ 배포 상태 확인..."
NEW_ETAG=$(jq -r '.ETag' /tmp/cf-update-result.json)
STATUS=$(jq -r '.Distribution.Status' /tmp/cf-update-result.json)

echo "새 ETag: $NEW_ETAG"
echo "배포 상태: $STATUS"

# 5. 캐시 무효화
echo "🔄 CloudFront 캐시 무효화..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo "무효화 ID: $INVALIDATION_ID"

echo ""
echo "✅ CloudFront SPA 라우팅 설정 완료!"
echo ""
echo "📝 설정된 내용:"
echo "- 403 오류 → /index.html (200 응답)"
echo "- 404 오류 → /index.html (200 응답)"
echo "- 오류 캐시 TTL: 10초"
echo ""
echo "⏱️  배포 완료까지 5-15분 정도 소요될 수 있습니다."
echo ""
echo "🧪 테스트 URL:"
echo "- https://$BUCKET_NAME/"
echo "- https://$BUCKET_NAME/text-counter/"
echo "- https://$BUCKET_NAME/calculator/"
echo "- https://$BUCKET_NAME/nonexistent-page (404 테스트)"

# 임시 파일 정리
rm -f /tmp/cf-*.json
