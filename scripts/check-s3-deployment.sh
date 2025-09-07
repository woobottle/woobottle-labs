#!/bin/bash

# S3 배포 상태 확인 스크립트
set -e

BUCKET_NAME="woo-bottle.com"
DOMAIN="https://woo-bottle.com"

echo "🔍 S3 배포 상태 확인 중..."

# S3 버킷 존재 확인
echo "📦 S3 버킷 확인..."
if aws s3 ls "s3://$BUCKET_NAME" > /dev/null 2>&1; then
    echo "✅ S3 버킷 '$BUCKET_NAME' 존재함"
else
    echo "❌ S3 버킷 '$BUCKET_NAME' 접근 불가"
    exit 1
fi

# 주요 파일들 존재 확인
echo ""
echo "📄 주요 파일 존재 확인..."
files_to_check=(
    "index.html"
    "text-counter/index.html"
    "calculator/index.html"
    "icon-generator/index.html"
    "about/index.html"
    "404.html"
)

for file in "${files_to_check[@]}"; do
    if aws s3 ls "s3://$BUCKET_NAME/$file" > /dev/null 2>&1; then
        echo "✅ $file"
    else
        echo "❌ $file (누락)"
    fi
done

# S3 웹사이트 호스팅 설정 확인
echo ""
echo "🌐 S3 웹사이트 호스팅 설정 확인..."
website_config=$(aws s3api get-bucket-website --bucket "$BUCKET_NAME" 2>/dev/null || echo "ERROR")

if [[ "$website_config" == "ERROR" ]]; then
    echo "❌ S3 웹사이트 호스팅이 비활성화됨"
    echo ""
    echo "🔧 웹사이트 호스팅 활성화 명령어:"
    echo "aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html"
else
    echo "✅ S3 웹사이트 호스팅 활성화됨"
    echo "설정: $website_config"
fi

# S3 버킷 정책 확인
echo ""
echo "🔐 S3 버킷 정책 확인..."
bucket_policy=$(aws s3api get-bucket-policy --bucket "$BUCKET_NAME" 2>/dev/null || echo "ERROR")

if [[ "$bucket_policy" == "ERROR" ]]; then
    echo "❌ S3 버킷 정책이 설정되지 않음"
    echo ""
    echo "🔧 퍼블릭 읽기 권한 설정이 필요합니다."
else
    echo "✅ S3 버킷 정책 존재"
fi

# HTTP 응답 테스트
echo ""
echo "🌍 HTTP 응답 테스트..."
test_urls=(
    "$DOMAIN"
    "$DOMAIN/text-counter/"
    "$DOMAIN/calculator/"
    "$DOMAIN/nonexistent-page"
)

for url in "${test_urls[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "ERROR")
    if [[ "$response" == "200" ]]; then
        echo "✅ $url → $response"
    elif [[ "$response" == "404" ]]; then
        echo "❌ $url → $response"
    else
        echo "⚠️  $url → $response"
    fi
done

echo ""
echo "🔍 진단 완료!"
echo ""
echo "💡 문제 해결 방법:"
echo "1. S3 웹사이트 호스팅이 비활성화된 경우:"
echo "   aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html"
echo ""
echo "2. CloudFront 설정이 필요한 경우:"
echo "   - CloudFront 배포에서 커스텀 오류 응답 설정"
echo "   - 404 오류 → /index.html 리다이렉트"
echo ""
echo "3. 캐시 무효화:"
echo "   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths '/*'"
