#!/bin/bash

# AWS CLI로 수동 실행할 명령어들
# 각 명령어를 하나씩 복사해서 터미널에서 실행하세요

echo "=== S3 무한 리다이렉트 문제 해결 명령어 ==="
echo
echo "1. 리다이렉트 설정 제거:"
echo 'aws s3api put-bucket-website --bucket woo-bottle.com --website-configuration '"'"'{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"404.html"}}'"'"

echo
echo "2. current/ 폴더 내용을 루트로 복사:"
echo "aws s3 sync s3://woo-bottle.com/current/ s3://woo-bottle.com/ --exclude 'deploy-info.json'"

echo
echo "3. 배포 정보 복사:"
echo "aws s3 cp s3://woo-bottle.com/current/deploy-info.json s3://woo-bottle.com/deploy-info.json"

echo
echo "4. 확인:"
echo "curl -I http://woo-bottle.com.s3-website-us-east-1.amazonaws.com/"
