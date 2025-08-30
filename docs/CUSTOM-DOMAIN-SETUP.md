# 🌐 커스텀 도메인 설정 가이드

`woo-bottle.com` 도메인을 사용하여 HTTPS로 접근할 수 있도록 설정하는 방법을 안내합니다.

## 📋 목차

- [개요](#개요)
- [사전 준비](#사전-준비)
- [1단계: SSL 인증서 생성](#1단계-ssl-인증서-생성)
- [2단계: CloudFront 배포 생성](#2단계-cloudfront-배포-생성)
- [3단계: Route 53 DNS 설정](#3단계-route-53-dns-설정)
- [4단계: 배포 스크립트 업데이트](#4단계-배포-스크립트-업데이트)
- [문제 해결](#문제-해결)

## 🎯 개요

현재 상황:
- S3 버킷: `woo-bottle.com`
- 기존 URL: `https://woo-bottle.com`
- 목표 URL: `https://woo-bottle.com`

필요한 AWS 서비스:
- **ACM (Certificate Manager)**: SSL 인증서
- **CloudFront**: CDN 및 HTTPS 제공
- **Route 53**: DNS 관리

## 🔧 사전 준비

### 1. 도메인 소유권 확인
- `woo-bottle.com` 도메인을 소유하고 있어야 합니다
- 도메인 등록업체에서 네임서버를 Route 53으로 변경해야 합니다

### 2. AWS 권한 확인
필요한 AWS 권한:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "acm:*",
                "cloudfront:*",
                "route53:*"
            ],
            "Resource": "*"
        }
    ]
}
```

## 🔒 1단계: SSL 인증서 생성

### AWS 콘솔에서 생성

1. **ACM 콘솔 접속** (⚠️ **반드시 us-east-1 리전**)
   - https://console.aws.amazon.com/acm/home?region=us-east-1

2. **인증서 요청**
   - "인증서 요청" 클릭
   - "퍼블릭 인증서 요청" 선택

3. **도메인 이름 추가**
   ```
   woo-bottle.com
   *.woo-bottle.com  (선택사항: 서브도메인 지원)
   ```

4. **검증 방법 선택**
   - **DNS 검증** 권장 (Route 53 사용 시 자동)
   - 이메일 검증도 가능

5. **검증 완료 대기**
   - Route 53 사용 시: 자동으로 DNS 레코드 생성
   - 다른 DNS 사용 시: 수동으로 CNAME 레코드 추가

### AWS CLI로 생성

```bash
# 인증서 요청
aws acm request-certificate \
    --domain-name woo-bottle.com \
    --subject-alternative-names "*.woo-bottle.com" \
    --validation-method DNS \
    --region us-east-1

# 인증서 ARN 확인
aws acm list-certificates --region us-east-1
```

## ☁️ 2단계: CloudFront 배포 생성

### 자동 설정 스크립트 사용

```bash
# 스크립트 생성
cat > scripts/setup-cloudfront.sh << 'EOF'
#!/bin/bash

# CloudFront 배포 생성 스크립트
set -e

DOMAIN_NAME="woo-bottle.com"
S3_BUCKET="woo-bottle.com"
S3_REGION="us-east-1"
CERTIFICATE_ARN="$1"

if [[ -z "$CERTIFICATE_ARN" ]]; then
    echo "사용법: $0 <certificate-arn>"
    echo "예시: $0 arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
    exit 1
fi

# CloudFront 배포 설정
cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "woo-bottle-$(date +%s)",
    "Comment": "WooBottle Labs - Static Website",
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$S3_BUCKET",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            }
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {"Forward": "none"}
        },
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$S3_BUCKET",
                "DomainName": "$S3_BUCKET.s3-website-$S3_REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "Aliases": {
        "Quantity": 1,
        "Items": ["$DOMAIN_NAME"]
    },
    "DefaultRootObject": "index.html",
    "PriceClass": "PriceClass_100",
    "Enabled": true,
    "ViewerCertificate": {
        "ACMCertificateArn": "$CERTIFICATE_ARN",
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1.2_2021"
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/404.html",
                "ResponseCode": "404",
                "ErrorCachingMinTTL": 300
            }
        ]
    }
}
EOF

# CloudFront 배포 생성
echo "CloudFront 배포 생성 중..."
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file:///tmp/cloudfront-config.json \
    --query 'Distribution.Id' \
    --output text)

echo "✅ CloudFront 배포 생성 완료"
echo "🆔 배포 ID: $DISTRIBUTION_ID"

# 배포 도메인 이름 가져오기
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
    --id "$DISTRIBUTION_ID" \
    --query 'Distribution.DomainName' \
    --output text)

echo "🌐 CloudFront 도메인: $CLOUDFRONT_DOMAIN"

# 임시 파일 정리
rm -f /tmp/cloudfront-config.json

echo ""
echo "다음 단계:"
echo "1. Route 53에서 A 레코드 생성"
echo "2. .env.local에 배포 ID 추가: CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID"

EOF

chmod +x scripts/setup-cloudfront.sh
```

### 스크립트 실행

```bash
# 인증서 ARN을 사용하여 실행
./scripts/setup-cloudfront.sh arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

## 🌐 3단계: Route 53 DNS 설정

### Route 53 호스팅 영역 생성 (필요시)

```bash
# 호스팅 영역 생성
aws route53 create-hosted-zone \
    --name woo-bottle.com \
    --caller-reference "woo-bottle-$(date +%s)"

# 네임서버 확인
aws route53 list-hosted-zones-by-name --dns-name woo-bottle.com
```

### A 레코드 생성

```bash
# 호스팅 영역 ID 가져오기
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
    --dns-name woo-bottle.com \
    --query 'HostedZones[0].Id' \
    --output text | sed 's|/hostedzone/||')

# CloudFront 도메인 가져오기 (위에서 생성한 배포 ID 사용)
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
    --id YOUR_DISTRIBUTION_ID \
    --query 'Distribution.DomainName' \
    --output text)

# A 레코드 생성
cat > /tmp/route53-change.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "woo-bottle.com",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$CLOUDFRONT_DOMAIN",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z2FDTNDATAQYW2"
                }
            }
        }
    ]
}
EOF

# 변경사항 적용
aws route53 change-resource-record-sets \
    --hosted-zone-id "$HOSTED_ZONE_ID" \
    --change-batch file:///tmp/route53-change.json

rm -f /tmp/route53-change.json
```

## 🚀 4단계: 배포 스크립트 업데이트

### .env.local 파일 생성

```bash
# .env.local 파일에 CloudFront 배포 ID 추가
echo "CLOUDFRONT_DISTRIBUTION_ID=YOUR_DISTRIBUTION_ID" >> .env.local
echo "AWS_REGION=us-east-1" >> .env.local
```

### 환경변수 확인

```bash
# deploy.sh에서 자동으로 CloudFront 캐시 무효화가 실행됩니다
npm run deploy
```

## 🔍 확인 및 테스트

### 1. DNS 전파 확인

```bash
# DNS 조회
nslookup woo-bottle.com
dig woo-bottle.com

# 온라인 도구 사용
# https://www.whatsmydns.net/#A/woo-bottle.com
```

### 2. HTTPS 접근 테스트

```bash
# HTTP → HTTPS 리다이렉트 확인
curl -I https://woo-bottle.com

# HTTPS 직접 접근
curl -I https://woo-bottle.com
```

### 3. SSL 인증서 확인

```bash
# SSL 인증서 정보 확인
openssl s_client -connect woo-bottle.com:443 -servername woo-bottle.com
```

## 🛠️ 문제 해결

### 일반적인 문제들

#### 1. "Certificate not found" 오류
- **원인**: 인증서가 us-east-1 리전에 없음
- **해결**: ACM에서 us-east-1 리전에 인증서 생성

#### 2. DNS 전파 지연
- **원인**: DNS 변경사항 전파 시간
- **해결**: 최대 48시간 대기, TTL 확인

#### 3. CloudFront 403 오류
- **원인**: S3 버킷 정책 또는 Origin 설정 문제
- **해결**: S3 버킷 정책 확인, Origin 도메인 확인

#### 4. 무한 리다이렉트
- **원인**: S3 웹사이트 호스팅 리다이렉트 규칙
- **해결**: 이전에 수정한 리다이렉트 설정 확인

### 디버깅 명령어

```bash
# CloudFront 배포 상태 확인
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID

# 캐시 무효화
aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"

# Route 53 레코드 확인
aws route53 list-resource-record-sets \
    --hosted-zone-id YOUR_HOSTED_ZONE_ID
```

## 📊 비용 정보

### 예상 월 비용 (소규모 사이트 기준)

- **Route 53 호스팅 영역**: $0.50/월
- **CloudFront**: $0.085/GB (첫 1TB)
- **ACM 인증서**: 무료
- **Route 53 쿼리**: $0.40/백만 쿼리

**총 예상 비용**: 월 $1-5 (트래픽에 따라)

## 🎉 완료!

설정이 완료되면:
- ✅ `https://woo-bottle.com`으로 접근 가능
- ✅ HTTP → HTTPS 자동 리다이렉트
- ✅ 전 세계 CDN을 통한 빠른 로딩
- ✅ 자동 SSL 인증서 갱신

모든 스크립트와 문서의 URL이 `https://woo-bottle.com`으로 업데이트되었습니다! 🚀