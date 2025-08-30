# 🚀 WooBottle Labs 배포 가이드 (버저닝 지원)

이 가이드는 WooBottle Labs 프로젝트를 AWS S3에 버저닝과 함께 자동 배포하는 방법을 설명합니다.

## 📋 목차

- [배포 방법 개요](#배포-방법-개요)
- [버저닝 시스템](#버저닝-시스템)
- [사전 준비](#사전-준비)
- [GitHub Actions 자동 배포](#github-actions-자동-배포)
- [로컬 CLI 배포](#로컬-cli-배포)
- [롤백 시스템](#롤백-시스템)
- [환경별 배포](#환경별-배포)
- [문제 해결](#문제-해결)

## 🌟 배포 방법 개요

본 프로젝트는 **버저닝이 지원되는** 두 가지 배포 방법을 제공합니다:

1. **GitHub Actions** - 웹 UI에서 버전 선택 및 자동 배포
2. **로컬 CLI** - 명령행에서 버전 관리 및 배포

## 🏷️ 버저닝 시스템

### S3 버킷 구조
```
woo-bottle.com (프로덕션)
├── versions/
│   ├── v1.0.0/         # 릴리즈 버전별 보관
│   ├── v1.0.1/
│   └── v1.1.0/
├── current/            # 현재 프로덕션 버전
└── backups/            # 롤백 시 백업

woo-bottle-staging.com (스테이징)
├── versions/
│   ├── v1.0.0/
│   └── v1.1.0/
├── staging/            # 현재 스테이징 버전
└── backups/
```

### 버전 형식
- **Semantic Versioning**: `v1.0.0` (major.minor.patch)
- **자동 태그 생성**: Git 태그로 관리
- **최대 보관**: 최신 3개 버전만 유지

### 주요 기능
- ✅ **자동 버전 생성**: patch/minor/major 버전 자동 증가
- ✅ **롤백 지원**: 이전 버전으로 즉시 복원
- ✅ **스테이징 환경**: 프로덕션 배포 전 테스트
- ✅ **백업 시스템**: 롤백 시 안전장치
- ✅ **메타데이터**: 배포 정보 추적

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
CLOUDFRONT_DISTRIBUTION_ID=E1234567890XYZ  # 선택사항
DEPLOYMENT_URL=https://woo-bottle.com      # 선택사항

# 버킷 이름은 스크립트에서 자동 설정됨
# 프로덕션: woo-bottle.com
# 스테이징: woo-bottle-staging.com (자동 생성)
```

## 🤖 GitHub Actions 자동 배포

### 설정 방법

1. **GitHub Repository Secrets 설정**

   Repository Settings → Secrets and variables → Actions에서 다음 시크릿들을 추가:

   ```
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=ap-northeast-2 
   CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC (선택사항)
   DEPLOYMENT_URL=https://woo-bottle.com (선택사항)
   ```

2. **배포 실행**

   #### 프로덕션 배포
   - Repository → Actions → "Deploy to S3" 워크플로우 선택
   - "Run workflow" 클릭 후 옵션 설정:
     - **배포 타입**: `production`
     - **자동 버전 생성**: 체크 시 버전 자동 증가
     - **버전 타입**: `patch`/`minor`/`major` 선택
     - **사용자 정의 버전**: 수동으로 버전 지정 (예: v1.2.0)

   #### 스테이징 배포
   - **배포 타입**: `staging` 선택
   - 스테이징 버킷이 없으면 자동 생성됨

### 워크플로우 단계

1. ✅ 코드 체크아웃
2. 📦 Node.js 및 pnpm 설치  
3. 🔧 의존성 설치
4. 🧪 테스트 실행 (건너뛰기 가능)
5. 🔍 린트 검사 (건너뛰기 가능)
6. 🔨 프로젝트 빌드
7. 🏷️ 버전 생성/확인
8. ☁️ S3에 버전별 배포
9. 🧹 오래된 버전 정리 (최신 3개 유지)
10. 🌐 CloudFront 캐시 무효화 (옵션)

## 💻 로컬 CLI 배포

### 사전 요구사항

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) 설치
- Node.js 및 패키지 매니저 (pnpm/yarn/npm)
- 환경변수 파일 설정

### 배포 명령어

#### 🚀 기본 배포
```bash
# 최신 버전으로 프로덕션 배포
npm run deploy

# 스테이징 배포
npm run deploy:staging
```

#### 🏷️ 자동 버전 생성 배포
```bash
# 패치 버전 자동 생성 후 배포 (v1.0.0 → v1.0.1)
npm run deploy:patch

# 마이너 버전 자동 생성 후 배포 (v1.0.1 → v1.1.0)
npm run deploy:minor

# 메이저 버전 자동 생성 후 배포 (v1.1.0 → v2.0.0)
npm run deploy:major
```

#### 📦 특정 버전 배포
```bash
# 특정 버전으로 배포
./scripts/deploy.sh --version v1.2.0

# 특정 버전으로 스테이징 배포
./scripts/deploy.sh --version v1.2.0 --staging
```

#### 📊 버전 관리
```bash
# 현재 Git 태그 확인
npm run version:current

# 대화형 버전 생성
npm run version:create

# Git 태그 목록 확인
npm run versions

# S3 프로덕션 버전 목록
npm run versions:s3:prod

# S3 스테이징 버전 목록
npm run versions:s3:staging
```

### 배포 스크립트 기능

- 🔍 환경변수 검증
- 📦 의존성 자동 설치
- 🧪 테스트 자동 실행
- 🔍 린트 검사
- 🔨 프로젝트 빌드
- 🏷️ Git 태그 자동 생성
- ☁️ S3 버전별 업로드
- 🧹 오래된 버전 자동 정리
- 🌐 CloudFront 캐시 무효화
- 📊 배포 결과 리포트

## 🔄 롤백 시스템

### GitHub Actions 롤백

1. **롤백 워크플로우 실행**
   - Repository → Actions → "Rollback Deployment" 선택
   - "Run workflow" 클릭 후 설정:
     - **롤백 버전**: 되돌릴 버전 (예: v1.0.1)
     - **환경**: `production` 또는 `staging`

2. **자동 기능**
   - ✅ 버전 존재 여부 확인
   - ✅ 현재 버전 자동 백업
   - ✅ 롤백 실행
   - ✅ CloudFront 캐시 무효화
   - ✅ 프로덕션 롤백 시 이슈 자동 생성

### 로컬 CLI 롤백

#### 🔄 대화형 롤백
```bash
# 프로덕션 대화형 롤백
npm run rollback

# 스테이징 대화형 롤백
npm run rollback:staging
```

#### 📋 롤백 명령어
```bash
# 특정 버전으로 롤백
./scripts/rollback.sh --version v1.0.1

# 스테이징 환경 롤백
./scripts/rollback.sh --version v1.0.1 --staging

# 사용 가능한 버전 목록 확인
./scripts/rollback.sh --list

# 대화형 모드
./scripts/rollback.sh --interactive
```

### 롤백 안전장치

- **자동 백업**: 롤백 전 현재 버전 백업
- **메타데이터**: 롤백 정보 및 시간 기록
- **복원 가능**: 백업에서 언제든 복원 가능
- **버전 검증**: 존재하지 않는 버전으로 롤백 방지

## 🌍 배포 환경

### 프로덕션 환경
- **버킷**: `woo-bottle.com`
- **URL**: `https://woo-bottle.com` (또는 S3 정적 웹사이트 URL)
- **용도**: 실제 서비스
- **버전 관리**: 최신 3개 버전 자동 유지
- **배포 방식**: GitHub Actions 또는 로컬 CLI
- **롤백**: 즉시 이전 버전으로 복원 가능
- **CDN**: CloudFront 권장

### 프로덕션 환경
- **버킷**: `woo-bottle.com`
- **URL**: `https://woo-bottle.com`
- **용도**: 실제 서비스 환경
- **버전 관리**: Git 태그 기반 버전 시스템
- **배포 방식**: 선택적 사용 (강제하지 않음)
- **롤백**: 프로덕션과 동일한 롤백 시스템

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
