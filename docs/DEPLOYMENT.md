# 🚀 WooBottle Labs 배포 가이드

이 가이드는 WooBottle Labs 프로젝트를 AWS S3에 자동 배포하는 방법을 설명합니다.

## 📋 목차

- [배포 방법 개요](#배포-방법-개요)
- [사전 준비](#사전-준비)
- [GitHub Actions 자동 배포](#github-actions-자동-배포)
- [로컬 CLI 배포](#로컬-cli-배포)
- [환경별 배포](#환경별-배포)
- [문제 해결](#문제-해결)

## 🌟 배포 방법 개요

본 프로젝트는 두 가지 배포 방법을 제공합니다:

1. **GitHub Actions** - 코드 푸시 시 자동 배포
2. **로컬 CLI** - 수동 배포 스크립트

## 🔧 사전 준비

### 1. AWS 설정

#### S3 버킷 생성
```bash
# AWS CLI로 버킷 생성
aws s3 mb s3://your-bucket-name --region ap-northeast-2

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document 404.html
```

#### IAM 사용자 생성 및 권한 설정
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2. 환경변수 설정

다음 환경변수들을 설정해야 합니다:

#### 환경변수 설정 (.env.local)
```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=woobottle-labs-prod
CLOUDFRONT_DISTRIBUTION_ID=E1234567890XYZ  # 선택사항
DEPLOYMENT_URL=https://woobottle-labs.com   # 선택사항
```

## 🤖 GitHub Actions 자동 배포

### 설정 방법

1. **GitHub Repository Secrets 설정**

   Repository Settings → Secrets and variables → Actions에서 다음 시크릿들을 추가:

   ```
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=ap-northeast-2 
   S3_BUCKET_NAME=woobottle-labs-prod
   CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC (선택사항)
   ```

2. **수동 배포 실행**

   - Repository → Actions → "Deploy to S3" 워크플로우 선택
   - "Run workflow" 버튼 클릭
   - 테스트 건너뛰기 옵션 선택 (선택사항)
   - "Run workflow" 버튼으로 실행

### 워크플로우 단계

1. ✅ 코드 체크아웃
2. 📦 Node.js 및 pnpm 설치
3. 🔧 의존성 설치
4. 🧪 테스트 실행
5. 🔍 린트 검사
6. 🔨 프로젝트 빌드
7. ☁️ S3에 배포
8. 🌐 CloudFront 캐시 무효화 (옵션)

## 💻 로컬 CLI 배포

### 사전 요구사항

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) 설치
- Node.js 및 패키지 매니저 (pnpm/yarn/npm)
- 환경변수 파일 설정

### 배포 명령어

```bash
# 배포 실행
npm run deploy

# 직접 스크립트 실행
./scripts/deploy.sh
```

### 배포 스크립트 기능

- 🔍 환경변수 검증
- 📦 의존성 자동 설치
- 🧪 테스트 자동 실행
- 🔍 린트 검사
- 🔨 프로젝트 빌드
- ☁️ S3 동기화 (삭제된 파일 처리)
- 🌐 CloudFront 캐시 무효화
- 📊 배포 결과 리포트

## 🌍 배포 환경

### 프로덕션환경
- 버킷: `woobottle-labs-prod`
- 용도: 실제 서비스
- 배포 방식: GitHub Actions 수동 실행 또는 로컬 CLI
- CloudFront CDN 권장

## 🔧 CloudFront 설정 (권장)

### CDN 설정의 장점
- 🚀 전 세계 빠른 콘텐츠 전송
- 💰 S3 데이터 전송 비용 절약
- 🔒 HTTPS 지원
- 🛡️ DDoS 보호

### 설정 방법
```bash
# CloudFront 배포 생성
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json

# 무효화 (배포 후 캐시 갱신)
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

## 🐛 문제 해결

### 자주 발생하는 문제들

#### 1. AWS 권한 오류
```
Error: AccessDenied
```
**해결방법:**
- IAM 사용자 권한 확인
- S3 버킷 정책 확인
- Access Key 유효성 검증

#### 2. 빌드 실패
```
Error: Build failed
```
**해결방법:**
- `npm run test` 로 테스트 확인
- `npm run lint` 로 코드 검사
- 의존성 설치 확인

#### 3. 환경변수 누락
```
Error: Required environment variable not set
```
**해결방법:**
- `.env.*` 파일 존재 확인
- 필수 변수 설정 확인
- 파일 경로 확인

#### 4. CloudFront 캐시 문제
**해결방법:**
```bash
# 강제 캐시 무효화
aws cloudfront create-invalidation \
  --distribution-id YOUR_ID \
  --paths "/*"
```

### 디버깅 팁

#### 로그 확인
```bash
# GitHub Actions 로그
# Repository → Actions 탭에서 확인

# 로컬 배포 로그
# 스크립트 실행 시 콘솔 출력 확인
```

#### AWS CLI 디버깅
```bash
# AWS CLI 설정 확인
aws configure list

# S3 접근 테스트
aws s3 ls s3://your-bucket-name

# CloudFront 배포 목록
aws cloudfront list-distributions
```

## 📚 추가 리소스

### 공식 문서
- [AWS S3 정적 웹사이트 호스팅](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront 가이드](https://docs.aws.amazon.com/cloudfront/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

### 유용한 도구
- [AWS CLI 설치 가이드](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [S3 요금 계산기](https://calculator.aws/)
- [CloudFront 요금 정보](https://aws.amazon.com/cloudfront/pricing/)

## 🔐 보안 고려사항

### 권장사항
- ✅ IAM 사용자별 최소 권한 원칙
- ✅ Access Key 정기 교체
- ✅ S3 버킷 퍼블릭 접근 제한
- ✅ CloudFront를 통한 HTTPS 접근
- ✅ 환경변수 파일 .gitignore 설정

### 주의사항
- ❌ Root 계정 Access Key 사용 금지
- ❌ 환경변수 하드코딩 금지
- ❌ 프로덕션 키를 개발환경에 사용 금지

---

## 🆘 지원

문제가 발생하면 다음을 확인해보세요:

1. 이 가이드의 [문제 해결](#문제-해결) 섹션
2. AWS 콘솔에서 직접 확인
3. GitHub Actions 로그 확인
4. 팀 개발자에게 문의

**Happy Deploying! 🚀**
