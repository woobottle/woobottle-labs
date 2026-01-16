# S3 빠른 롤백 시스템 설계

## 개요

CloudFront Origin Path 전환을 활용한 빠른 롤백 시스템입니다.
기존 S3 Batch Operations 방식(수~십 분)에서 **수 초~1분** 내 롤백이 가능합니다.

---

## 아키텍처

### 디렉토리 구조

```
s3://woo-bottle.com/
├── releases/
│   ├── deploy-20241215-143022-a1b2c3d/   # 릴리스 1
│   │   ├── index.html
│   │   ├── about.html
│   │   └── _next/...
│   ├── deploy-20241216-091500-f3e4d5c/   # 릴리스 2
│   │   └── ...
│   └── deploy-20241217-120000-g5h6i7j/   # 릴리스 3 (현재 서비스 중)
│       └── ...
└── releases-metadata.json                 # 릴리스 목록 관리
```

### releases-metadata.json 구조

```json
{
  "current": "deploy-20241217-120000-g5h6i7j",
  "releases": [
    {
      "tag": "deploy-20241217-120000-g5h6i7j",
      "timestamp": "2024-12-17T12:00:00Z",
      "commitSha": "g5h6i7j",
      "version": "1.2.3"
    },
    {
      "tag": "deploy-20241216-091500-f3e4d5c",
      "timestamp": "2024-12-16T09:15:00Z",
      "commitSha": "f3e4d5c",
      "version": "1.2.2"
    }
  ],
  "maxReleases": 5
}
```

---

## 워크플로우 변경사항

### 1. deploy.yml 변경

#### 주요 변경점
- 루트 경로 → `/releases/{deployment-tag}/` 경로에 배포
- `releases-metadata.json` 업데이트
- CloudFront Origin Path 변경
- 오래된 릴리스 정리 (최근 5개 유지)

#### 핵심 스텝

```yaml
- name: Upload to versioned release path
  run: |
    BUCKET="woo-bottle.com"
    RELEASE_PATH="releases/${{ env.DEPLOYMENT_TAG }}"

    # 버전별 경로에 업로드
    aws s3 sync ./out/ "s3://$BUCKET/$RELEASE_PATH/" --delete

- name: Update releases metadata
  run: |
    # releases-metadata.json 다운로드 및 업데이트
    # 새 릴리스 추가, 현재 버전 업데이트

- name: Update CloudFront Origin Path
  run: |
    # CloudFront Distribution 설정에서 Origin Path 변경
    aws cloudfront get-distribution-config ...
    # Origin Path를 /releases/{deployment-tag}로 변경
    aws cloudfront update-distribution ...

- name: Cleanup old releases
  run: |
    # 최근 5개 제외하고 삭제
```

### 2. rollback.yml 변경

#### 주요 변경점
- S3 Batch Operations 제거
- CloudFront Origin Path 변경만 수행
- 매우 간단하고 빠른 롤백

#### 새로운 롤백 워크플로우

```yaml
name: Quick Rollback

on:
  workflow_dispatch:
    inputs:
      target_release:
        description: '롤백할 릴리스 태그'
        required: false
      rollback_steps:
        description: '몇 단계 이전으로 롤백? (1 = 바로 이전)'
        required: false
        default: '1'

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2

    - name: Determine rollback target
      run: |
        # releases-metadata.json에서 롤백 대상 결정
        # target_release가 있으면 해당 버전으로
        # 없으면 rollback_steps만큼 이전 버전으로

    - name: Update CloudFront Origin Path
      run: |
        # CloudFront Origin Path 변경 (수 초 내 완료)

    - name: Update releases metadata
      run: |
        # current를 롤백 대상으로 업데이트

    - name: Invalidate CloudFront cache
      run: |
        aws cloudfront create-invalidation \
          --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
          --paths "/*"
```

---

## 동작 시나리오

### 배포 시나리오

```
1. 빌드 완료
2. s3://bucket/releases/deploy-xxx/ 에 업로드
3. releases-metadata.json 업데이트
4. CloudFront Origin Path → /releases/deploy-xxx
5. 캐시 무효화
6. 오래된 릴리스 정리 (6번째부터 삭제)
```

### 롤백 시나리오 (1단계 이전으로)

```
1. releases-metadata.json 조회
2. 이전 릴리스 태그 확인: deploy-yyy
3. CloudFront Origin Path → /releases/deploy-yyy
4. releases-metadata.json의 current 업데이트
5. 캐시 무효화
6. 완료! (총 소요: ~1분)
```

---

## CloudFront 설정 변경 방법

### Origin Path 변경 (AWS CLI)

```bash
# 1. 현재 설정 가져오기
aws cloudfront get-distribution-config \
  --id $DISTRIBUTION_ID \
  --query '{ETag: ETag, Config: DistributionConfig}' \
  > /tmp/cf-config.json

# 2. Origin Path 수정
jq '.Config.Origins.Items[0].OriginPath = "/releases/deploy-xxx"' \
  /tmp/cf-config.json > /tmp/cf-config-updated.json

# 3. 설정 업데이트
aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --if-match $(jq -r '.ETag' /tmp/cf-config.json) \
  --distribution-config file:///tmp/cf-config-updated.json
```

---

## 롤백 시간 비교

| 방식 | 예상 시간 | 비고 |
|------|----------|------|
| **기존 (S3 Batch)** | 5~15분 | 파일 수에 따라 증가 |
| **신규 (Origin 전환)** | 30초~2분 | 파일 수와 무관 |

---

## 필요한 IAM 권한

기존 권한에 추가로 필요:

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudfront:GetDistributionConfig",
    "cloudfront:UpdateDistribution"
  ],
  "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
}
```

---

## 주의사항

1. **S3 버전 관리 불필요**: 이 방식에서는 S3 Versioning이 필수가 아님
2. **스토리지 비용**: 릴리스 5개 × 빌드 크기만큼 스토리지 사용
3. **최초 마이그레이션**: 기존 루트 경로 파일들을 `/releases/` 구조로 이전 필요
4. **CloudFront Origin Path**: 빈 문자열(`""`)이 아닌 `/releases/xxx` 형식 사용

---

## 마이그레이션 계획

### Phase 1: 준비
- [ ] IAM 권한 추가 (cloudfront:UpdateDistribution)
- [ ] releases-metadata.json 초기 파일 생성

### Phase 2: 배포 워크플로우 수정
- [ ] deploy.yml 수정
- [ ] 테스트 배포 실행

### Phase 3: 롤백 워크플로우 교체
- [ ] rollback.yml 신규 버전으로 교체
- [ ] 롤백 테스트

### Phase 4: 정리
- [ ] 기존 루트 경로 파일 삭제 (선택)
- [ ] S3 Versioning 비활성화 (선택, 비용 절감)

---

## 구현 승인 후 다음 단계

설계 승인 시 다음 파일들을 수정합니다:

1. `.github/workflows/deploy.yml` - 버전별 경로 배포 + Origin 전환
2. `.github/workflows/rollback.yml` - 간소화된 빠른 롤백
3. `releases-metadata.json` 초기 파일 생성 (최초 1회)
