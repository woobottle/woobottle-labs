#!/bin/bash

# CloudFront Behavior 설정 스크립트
# PWA 및 버전별 releases 경로를 위한 Behavior 추가
set -e

if [ $# -eq 0 ]; then
    echo "❌ 사용법: $0 <CLOUDFRONT_DISTRIBUTION_ID>"
    echo ""
    echo "CloudFront 배포 ID를 확인하려면:"
    echo "aws cloudfront list-distributions --query 'DistributionList.Items[?contains(Aliases.Items, \`woo-bottle.com\`)].{Id:Id,DomainName:DomainName}' --output table"
    exit 1
fi

DISTRIBUTION_ID="$1"

echo "🔧 CloudFront Behavior 설정 시작..."
echo "배포 ID: $DISTRIBUTION_ID"
echo ""

# 1. 현재 설정 가져오기
echo "📋 현재 CloudFront 설정 확인..."
aws cloudfront get-distribution-config --id "$DISTRIBUTION_ID" > /tmp/cf-config.json

ETAG=$(jq -r '.ETag' /tmp/cf-config.json)
echo "현재 ETag: $ETAG"

# Origin ID 추출 (기존 S3 Origin 사용)
ORIGIN_ID=$(jq -r '.DistributionConfig.Origins.Items[0].Id' /tmp/cf-config.json)
echo "Origin ID: $ORIGIN_ID"

# 2. 새 Behavior 정의
# 공통 Behavior 설정 (캐시 정책 등)
DEFAULT_CACHE_BEHAVIOR=$(jq '.DistributionConfig.DefaultCacheBehavior' /tmp/cf-config.json)

# Behavior 템플릿 생성 함수
create_behavior() {
    local path_pattern="$1"
    echo "$DEFAULT_CACHE_BEHAVIOR" | jq --arg pattern "$path_pattern" --arg origin "$ORIGIN_ID" '
        .PathPattern = $pattern |
        .TargetOriginId = $origin
    '
}

# 3. Behavior 목록 생성
echo "📝 새 Behavior 목록 생성..."

BEHAVIORS_JSON=$(cat <<EOF
[
    $(create_behavior "/sw.js"),
    $(create_behavior "/manifest.json"),
    $(create_behavior "/icons/*"),
    $(create_behavior "/releases/*")
]
EOF
)

# 4. 설정 업데이트
echo "🔄 CloudFront 설정 업데이트 중..."

# 기존 Behaviors에 새 Behaviors 추가 (이미 존재하는 것 제외)
jq --argjson newBehaviors "$BEHAVIORS_JSON" '
    .DistributionConfig.CacheBehaviors.Items = (
        [.DistributionConfig.CacheBehaviors.Items // [] | .[] | select(.PathPattern | IN("/sw.js", "/manifest.json", "/icons/*", "/releases/*") | not)] +
        $newBehaviors
    ) |
    .DistributionConfig.CacheBehaviors.Quantity = (.DistributionConfig.CacheBehaviors.Items | length)
' /tmp/cf-config.json | jq '.DistributionConfig' > /tmp/cf-config-updated.json

# 5. CloudFront 업데이트 실행
echo "🚀 CloudFront 배포 업데이트..."
aws cloudfront update-distribution \
    --id "$DISTRIBUTION_ID" \
    --distribution-config file:///tmp/cf-config-updated.json \
    --if-match "$ETAG" > /tmp/cf-update-result.json

NEW_ETAG=$(jq -r '.ETag' /tmp/cf-update-result.json)
echo "새 ETag: $NEW_ETAG"

# 6. 캐시 무효화
echo "🔄 CloudFront 캐시 무효화..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' --output text)

echo "무효화 ID: $INVALIDATION_ID"

# 정리
rm -f /tmp/cf-config.json /tmp/cf-config-updated.json /tmp/cf-update-result.json

echo ""
echo "✅ CloudFront Behavior 설정 완료!"
echo ""
echo "📝 추가된 Behaviors:"
echo "  - /sw.js          → S3 루트 (Origin Path 없음)"
echo "  - /manifest.json  → S3 루트 (Origin Path 없음)"
echo "  - /icons/*        → S3 루트 (Origin Path 없음)"
echo "  - /releases/*     → S3 루트 (Origin Path 없음)"
echo ""
echo "⏱️  배포 완료까지 5-15분 소요될 수 있습니다."
