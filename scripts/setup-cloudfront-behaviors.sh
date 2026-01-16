#!/bin/bash

# CloudFront Behavior 설정 스크립트
# PWA 및 버전별 releases 경로를 위한 Behavior 추가
#
# 필요한 구조:
# - Origin 1 (S3-versioned): Origin Path = /releases/deploy-xxx → Default Behavior
# - Origin 2 (S3-root): Origin Path = 없음 → /releases/*, PWA Behaviors
set -e

if [ $# -eq 0 ]; then
    echo "❌ 사용법: $0 <CLOUDFRONT_DISTRIBUTION_ID>"
    echo ""
    echo "CloudFront 배포 ID를 확인하려면:"
    echo "aws cloudfront list-distributions --query 'DistributionList.Items[?contains(Aliases.Items, \`woo-bottle.com\`)].{Id:Id,DomainName:DomainName}' --output table"
    exit 1
fi

DISTRIBUTION_ID="$1"
BUCKET_DOMAIN="woo-bottle.com.s3.ap-northeast-2.amazonaws.com"
ROOT_ORIGIN_ID="S3-woo-bottle-root"

echo "🔧 CloudFront Behavior 설정 시작..."
echo "배포 ID: $DISTRIBUTION_ID"
echo ""

# 1. 현재 설정 가져오기
echo "📋 현재 CloudFront 설정 확인..."
aws cloudfront get-distribution-config --id "$DISTRIBUTION_ID" > /tmp/cf-config.json

ETAG=$(jq -r '.ETag' /tmp/cf-config.json)
echo "현재 ETag: $ETAG"

# 기존 Origin ID 확인
EXISTING_ORIGIN_ID=$(jq -r '.DistributionConfig.Origins.Items[0].Id' /tmp/cf-config.json)
echo "기존 Origin ID: $EXISTING_ORIGIN_ID"

# 2. S3-root Origin 추가 (Origin Path 없음)
echo "📝 S3-root Origin 추가 중..."

# OAC ID 가져오기 (기존 Origin에서)
OAC_ID=$(jq -r '.DistributionConfig.Origins.Items[0].OriginAccessControlId // empty' /tmp/cf-config.json)

# 새 Origin 정의
if [ -n "$OAC_ID" ]; then
    # OAC 사용하는 경우
    ROOT_ORIGIN=$(cat <<EOF
{
    "Id": "$ROOT_ORIGIN_ID",
    "DomainName": "$BUCKET_DOMAIN",
    "OriginPath": "",
    "S3OriginConfig": {
        "OriginAccessIdentity": ""
    },
    "OriginAccessControlId": "$OAC_ID",
    "CustomHeaders": {
        "Quantity": 0
    },
    "ConnectionAttempts": 3,
    "ConnectionTimeout": 10,
    "OriginShield": {
        "Enabled": false
    }
}
EOF
)
else
    # OAI 또는 퍼블릭 액세스
    OAI=$(jq -r '.DistributionConfig.Origins.Items[0].S3OriginConfig.OriginAccessIdentity // empty' /tmp/cf-config.json)
    ROOT_ORIGIN=$(cat <<EOF
{
    "Id": "$ROOT_ORIGIN_ID",
    "DomainName": "$BUCKET_DOMAIN",
    "OriginPath": "",
    "S3OriginConfig": {
        "OriginAccessIdentity": "$OAI"
    },
    "CustomHeaders": {
        "Quantity": 0
    },
    "ConnectionAttempts": 3,
    "ConnectionTimeout": 10,
    "OriginShield": {
        "Enabled": false
    }
}
EOF
)
fi

# 3. Behavior 템플릿 (Default에서 복사)
echo "📝 Behavior 템플릿 생성..."

# DefaultCacheBehavior를 기반으로 CacheBehavior 생성
DEFAULT_BEHAVIOR=$(jq '.DistributionConfig.DefaultCacheBehavior' /tmp/cf-config.json)

create_behavior() {
    local path_pattern="$1"
    local origin_id="$2"
    echo "$DEFAULT_BEHAVIOR" | jq --arg pattern "$path_pattern" --arg origin "$origin_id" '
        . + {PathPattern: $pattern, TargetOriginId: $origin}
    '
}

# 4. 설정 업데이트
echo "🔄 CloudFront 설정 업데이트 중..."

# Origin 추가 (이미 존재하면 스킵)
# Behavior 추가 (이미 존재하면 교체)
jq --argjson rootOrigin "$ROOT_ORIGIN" \
   --argjson swBehavior "$(create_behavior "/sw.js" "$ROOT_ORIGIN_ID")" \
   --argjson manifestBehavior "$(create_behavior "/manifest.json" "$ROOT_ORIGIN_ID")" \
   --argjson iconsBehavior "$(create_behavior "/icons/*" "$ROOT_ORIGIN_ID")" \
   --argjson releasesBehavior "$(create_behavior "/releases/*" "$ROOT_ORIGIN_ID")" \
   --arg rootOriginId "$ROOT_ORIGIN_ID" '
    # Root Origin 추가 (없으면)
    .DistributionConfig.Origins.Items = (
        [.DistributionConfig.Origins.Items[] | select(.Id != $rootOriginId)] + [$rootOrigin]
    ) |
    .DistributionConfig.Origins.Quantity = (.DistributionConfig.Origins.Items | length) |

    # Behaviors 설정
    .DistributionConfig.CacheBehaviors.Items = (
        [.DistributionConfig.CacheBehaviors.Items // [] | .[] |
         select(.PathPattern | IN("/sw.js", "/manifest.json", "/icons/*", "/releases/*") | not)] +
        [$swBehavior, $manifestBehavior, $iconsBehavior, $releasesBehavior]
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
echo "✅ CloudFront 설정 완료!"
echo ""
echo "📝 구조:"
echo ""
echo "  Origins:"
echo "    - $EXISTING_ORIGIN_ID (Origin Path: /releases/deploy-xxx)"
echo "    - $ROOT_ORIGIN_ID (Origin Path: 없음)"
echo ""
echo "  Behaviors:"
echo "    - /sw.js          → $ROOT_ORIGIN_ID"
echo "    - /manifest.json  → $ROOT_ORIGIN_ID"
echo "    - /icons/*        → $ROOT_ORIGIN_ID"
echo "    - /releases/*     → $ROOT_ORIGIN_ID"
echo "    - Default (*)     → $EXISTING_ORIGIN_ID"
echo ""
echo "⏱️  배포 완료까지 5-15분 소요될 수 있습니다."
