#!/bin/bash

# CloudFront 배포 생성 스크립트
# 커스텀 도메인과 HTTPS를 위한 CloudFront 설정

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 설정값
DOMAIN_NAME="woo-bottle.com"
S3_BUCKET="woo-bottle.com"
S3_REGION="us-east-1"

# 사용법 표시
show_help() {
    echo "CloudFront 배포 생성 스크립트"
    echo
    echo "사용법:"
    echo "  $0 <acm-certificate-arn>"
    echo
    echo "매개변수:"
    echo "  acm-certificate-arn    ACM 인증서 ARN (us-east-1 리전)"
    echo
    echo "예시:"
    echo "  $0 arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
}

# CloudFront 배포 설정 JSON 생성
create_cloudfront_config() {
    local certificate_arn=$1
    
    cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "woo-bottle-$(date +%s)",
    "Comment": "WooBottle Labs - Static Website with Custom Domain",
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
            "Cookies": {
                "Forward": "none"
            }
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
        "ACMCertificateArn": "$certificate_arn",
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
}

# CloudFront 배포 생성
create_distribution() {
    local certificate_arn=$1
    
    echo -e "${YELLOW}☁️  CloudFront 배포 생성 중...${NC}"
    
    create_cloudfront_config "$certificate_arn"
    
    local distribution_id=$(aws cloudfront create-distribution \
        --distribution-config file:///tmp/cloudfront-config.json \
        --query 'Distribution.Id' \
        --output text)
    
    if [[ -n "$distribution_id" ]]; then
        echo -e "${GREEN}✅ CloudFront 배포 생성 완료${NC}"
        echo -e "${BLUE}🆔 배포 ID: $distribution_id${NC}"
        
        # 배포 도메인 이름 가져오기
        local domain_name=$(aws cloudfront get-distribution \
            --id "$distribution_id" \
            --query 'Distribution.DomainName' \
            --output text)
        
        echo -e "${BLUE}🌐 CloudFront 도메인: $domain_name${NC}"
        
        # 임시 파일 정리
        rm -f /tmp/cloudfront-config.json
        
        echo "$distribution_id"
        return 0
    else
        echo -e "${RED}❌ CloudFront 배포 생성 실패${NC}"
        rm -f /tmp/cloudfront-config.json
        return 1
    fi
}

# Route 53 레코드 생성
create_route53_record() {
    local distribution_id=$1
    
    echo -e "${YELLOW}🌐 Route 53 A 레코드 생성 중...${NC}"
    
    # 호스팅 영역 ID 가져오기
    local hosted_zone_id=$(aws route53 list-hosted-zones-by-name \
        --dns-name "$DOMAIN_NAME" \
        --query 'HostedZones[0].Id' \
        --output text | sed 's|/hostedzone/||')
    
    if [[ "$hosted_zone_id" == "None" ]]; then
        echo -e "${RED}❌ 호스팅 영역을 찾을 수 없습니다: $DOMAIN_NAME${NC}"
        echo "먼저 Route 53에서 호스팅 영역을 생성해주세요."
        return 1
    fi
    
    # CloudFront 배포 도메인 이름 가져오기
    local cloudfront_domain=$(aws cloudfront get-distribution \
        --id "$distribution_id" \
        --query 'Distribution.DomainName' \
        --output text)
    
    # Route 53 변경 배치 생성
    cat > /tmp/route53-change.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN_NAME",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$cloudfront_domain",
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
        --hosted-zone-id "$hosted_zone_id" \
        --change-batch file:///tmp/route53-change.json
    
    echo -e "${GREEN}✅ Route 53 A 레코드 생성 완료${NC}"
    
    # 임시 파일 정리
    rm -f /tmp/route53-change.json
}

# 메인 로직
main() {
    local certificate_arn=$1
    
    if [[ -z "$certificate_arn" ]]; then
        echo -e "${RED}❌ ACM 인증서 ARN이 필요합니다!${NC}"
        show_help
        exit 1
    fi
    
    echo -e "${BLUE}🚀 CloudFront 배포 설정 시작...${NC}"
    echo -e "${BLUE}🌍 도메인: $DOMAIN_NAME${NC}"
    echo -e "${BLUE}📦 S3 버킷: $S3_BUCKET${NC}"
    echo -e "${BLUE}🔒 인증서: $certificate_arn${NC}"
    echo
    
    # CloudFront 배포 생성
    local distribution_id=$(create_distribution "$certificate_arn")
    
    if [[ -n "$distribution_id" ]]; then
        echo
        echo -e "${YELLOW}⏳ CloudFront 배포 전파 대기 중... (5-10분 소요)${NC}"
        echo "배포가 완료되면 Route 53 레코드를 생성합니다."
        
        # Route 53 레코드 생성
        create_route53_record "$distribution_id"
        
        echo
        echo -e "${GREEN}🎉 설정 완료!${NC}"
        echo -e "${GREEN}🔗 이제 https://$DOMAIN_NAME 에서 접근할 수 있습니다.${NC}"
        echo
        echo -e "${BLUE}📋 생성된 리소스:${NC}"
        echo "   CloudFront 배포 ID: $distribution_id"
        echo "   도메인: https://$DOMAIN_NAME"
        echo "   인증서: $certificate_arn"
        echo
        echo -e "${YELLOW}💡 참고사항:${NC}"
        echo "   - CloudFront 배포 전파까지 5-10분 소요"
        echo "   - DNS 전파까지 최대 48시간 소요 가능"
        echo "   - 배포 완료 후 캐시 무효화: aws cloudfront create-invalidation --distribution-id $distribution_id --paths '/*'"
        
        # deploy.sh에 CloudFront 배포 ID 추가 안내
        echo
        echo -e "${BLUE}🔧 다음 단계:${NC}"
        echo "1. deploy.sh에 CloudFront 배포 ID 추가:"
        echo "   export CLOUDFRONT_DISTRIBUTION_ID=$distribution_id"
        echo "2. 또는 .env.local 파일에 추가:"
        echo "   echo 'CLOUDFRONT_DISTRIBUTION_ID=$distribution_id' >> .env.local"
    else
        exit 1
    fi
}

# 스크립트가 직접 실행될 때만 main 함수 실행
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        help|--help|-h)
            show_help
            ;;
        *)
            main "$@"
            ;;
    esac
fi
