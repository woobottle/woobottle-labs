# 간소화된 배포 시스템

## 개요

기존의 복잡한 bash 스크립트 기반 배포 시스템을 GitHub Actions 라이브러리를 활용한 간단하고 명확한 시스템으로 개선했습니다.

## 주요 개선사항

### ✅ 이전 (복잡한 구조)
- 여러 개의 bash 스크립트 (`deploy.sh`, `setup-s3-redirect.sh`, `version-utils.sh` 등)
- 스크립트 간 복잡한 의존성
- 디버깅과 유지보수의 어려움
- 환경 설정의 복잡성

### 🚀 개선 후 (간소화된 구조)
- GitHub Actions 라이브러리 활용
- 명확한 단계별 워크플로우
- 내장된 오류 처리 및 로깅
- 간단한 설정과 사용법

## 새로운 워크플로우

### 1. 배포 워크플로우 (`deploy-simplified.yml`)

#### 주요 기능
- **자동 버전 관리**: `paulhatch/semantic-version` 액션 사용
- **S3 배포**: `aws-actions/amazon-s3-deploy` 액션 사용
- **CloudFront 무효화**: `chetan/invalidate-cloudfront-action` 액션 사용
- **자동 정리**: 오래된 버전 자동 삭제 (최신 3개 유지)

#### 사용법
```bash
# GitHub Actions 웹 인터페이스에서 실행
# Repository → Actions → "Simplified S3 Deploy with Versioning" → "Run workflow"

# 옵션:
# - 자동 버전 생성: patch/minor/major
# - 사용자 정의 버전: v1.2.0 형식
# - 현재 버전으로 배포 (기본값)
```

#### 배포 과정
1. **코드 체크아웃** - 최신 코드 가져오기
2. **환경 설정** - Node.js, pnpm 설치
3. **의존성 설치** - `pnpm install --frozen-lockfile`
4. **품질 검사** - 테스트 및 린트 실행
5. **버전 결정** - 자동/수동 버전 설정
6. **태그 생성** - Git 태그 자동 생성 (자동 버전인 경우)
7. **빌드** - `pnpm build`
8. **버전 정보 주입** - 빌드에 버전 메타데이터 추가
9. **S3 배포** - 버전별 + 현재 + 루트 배포
10. **웹사이트 설정** - S3 호스팅 및 권한 설정
11. **메타데이터 생성** - 배포 정보 JSON 생성
12. **캐시 무효화** - CloudFront 캐시 갱신 (선택사항)
13. **정리** - 오래된 버전 삭제
14. **결과 출력** - 배포 요약 정보

### 2. 롤백 워크플로우 (`rollback-simplified.yml`)

#### 주요 기능
- **안전한 롤백**: 현재 버전 자동 백업
- **버전 검증**: 롤백 대상 버전 존재 확인
- **확인 절차**: 'yes' 입력으로 실수 방지
- **메타데이터 추적**: 롤백 이력 관리

#### 사용법
```bash
# GitHub Actions 웹 인터페이스에서 실행
# Repository → Actions → "Simplified Rollback" → "Run workflow"

# 필수 입력:
# - target_version: 롤백할 버전 (예: v1.0.0)
# - confirm_rollback: "yes" (확인용)
```

#### 롤백 과정
1. **확인 검증** - 'yes' 입력 확인
2. **AWS 설정** - 자격증명 구성
3. **버전 확인** - 롤백 대상 버전 존재 검증
4. **현재 백업** - 현재 버전을 백업 폴더에 저장
5. **롤백 실행** - 지정 버전을 current 및 루트로 복사
6. **메타데이터 생성** - 롤백 정보 기록
7. **캐시 무효화** - CloudFront 캐시 갱신 (선택사항)
8. **결과 확인** - 롤백 성공 여부 검증

## 버전 관리 시스템

### 버전 구조
```
S3 버킷 구조:
woo-bottle.com/
├── index.html              # 직접 접근용 (루트)
├── current/                # 현재 활성 버전
│   ├── index.html
│   ├── deploy-info.json
│   └── ...
├── versions/               # 모든 버전 보관
│   ├── v1.0.0/
│   ├── v1.0.1/
│   └── v1.1.0/
└── backups/                # 롤백 시 백업
    ├── pre_rollback_20240830_120000/
    └── ...
```

### 버전 정보 파일

#### `version.js` (클라이언트용)
```javascript
window.__APP_VERSION__ = {
  "name": "woobottle-labs",
  "version": "v1.0.0",
  "buildTime": "2024-08-30T12:00:00.000Z",
  "buildNumber": "123",
  "git": {
    "commitHash": "abc123...",
    "shortHash": "abc123",
    "branch": "main",
    "tag": "v1.0.0"
  },
  "environment": "production",
  "ci": true
};
```

#### `deploy-info.json` (배포 메타데이터)
```json
{
  "version": "v1.0.0",
  "timestamp": "2024-08-30T12:00:00Z",
  "environment": "production",
  "bucket": "woo-bottle.com",
  "commit_hash": "abc123...",
  "branch": "main",
  "build_number": "123",
  "workflow_url": "https://github.com/..."
}
```

## 설정 요구사항

### GitHub Secrets
다음 시크릿들이 설정되어야 합니다:

```bash
# 필수
AWS_ACCESS_KEY_ID       # AWS 액세스 키
AWS_SECRET_ACCESS_KEY   # AWS 시크릿 키
AWS_REGION             # AWS 리전 (예: ap-northeast-2)

# 선택사항
CLOUDFRONT_DISTRIBUTION_ID  # CloudFront 배포 ID (캐시 무효화용)
```

### AWS 권한
AWS 사용자는 다음 권한이 필요합니다:

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
        "s3:ListBucket",
        "s3:PutBucketWebsite",
        "s3:PutBucketPolicy"
      ],
      "Resource": [
        "arn:aws:s3:::woo-bottle.com",
        "arn:aws:s3:::woo-bottle.com/*"
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

## 사용 가이드

### 일반 배포
1. GitHub 저장소의 Actions 탭으로 이동
2. "Simplified S3 Deploy with Versioning" 워크플로우 선택
3. "Run workflow" 클릭
4. 옵션 선택:
   - 자동 버전 생성을 원하면 "auto_version" 체크 후 타입 선택
   - 특정 버전을 원하면 "custom_version"에 입력
   - 기본값으로 두면 현재 버전으로 배포
5. "Run workflow" 실행

### 긴급 롤백
1. GitHub 저장소의 Actions 탭으로 이동
2. "Simplified Rollback" 워크플로우 선택
3. "Run workflow" 클릭
4. 롤백할 버전 입력 (예: v1.0.0)
5. 확인란에 "yes" 입력
6. "Run workflow" 실행

### 버전 확인
배포된 사이트에서 브라우저 콘솔을 열면 버전 정보를 확인할 수 있습니다:
```javascript
// 콘솔에서 자동 출력되는 정보 확인
// 또는 직접 호출
window.getAppVersion()
```

## 장점

### 🎯 간소화
- 복잡한 bash 스크립트 제거
- GitHub Actions 라이브러리의 검증된 기능 활용
- 명확한 단계별 프로세스

### 🔒 안전성
- 자동 백업 시스템
- 버전 검증 및 확인 절차
- 실패 시 자동 롤백 (워크플로우 레벨)

### 📊 가시성
- 실시간 로그 및 진행 상황 확인
- 배포 이력 추적
- 상세한 메타데이터 기록

### 🚀 성능
- 병렬 처리 최적화
- 효율적인 캐시 관리
- 자동 정리 시스템

### 🔧 유지보수
- 표준화된 GitHub Actions 사용
- 명확한 설정과 문서화
- 쉬운 디버깅과 문제 해결

## 마이그레이션 가이드

### 기존 시스템에서 전환
1. 새로운 워크플로우 파일 확인
2. GitHub Secrets 설정
3. 테스트 배포 실행
4. 기존 스크립트 파일 백업 후 제거

### 주의사항
- 첫 배포 시 기존 S3 구조와 호환성 확인
- CloudFront 설정이 있다면 배포 후 캐시 무효화 확인
- 롤백 테스트를 통한 안전성 검증

## 문제 해결

### 일반적인 문제
1. **AWS 권한 오류**: Secrets 설정 및 IAM 권한 확인
2. **빌드 실패**: 로컬에서 `pnpm build` 테스트
3. **S3 업로드 실패**: 버킷 이름 및 리전 확인
4. **CloudFront 무효화 실패**: Distribution ID 확인

### 디버깅
- GitHub Actions 로그에서 상세한 오류 정보 확인
- 각 단계별 출력 메시지 검토
- AWS CLI 명령어 직접 테스트 (로컬에서)

## 향후 개선 계획

- [ ] Slack/Discord 알림 통합
- [ ] 자동 테스트 결과 리포트
- [ ] 성능 모니터링 통합
- [ ] 다중 환경 지원 (staging/production)
- [ ] 자동 보안 스캔 통합
