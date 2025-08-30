# 🧪 WooBottle Labs

다양한 웹 도구들을 제공하는 실험적인 프로젝트입니다. [Next.js](https://nextjs.org) 기반으로 구축되었으며, [FSD(Feature-Sliced Design)](https://feature-sliced.design/) 아키텍처를 따릅니다.

## 🚀 주요 기능

- **텍스트 분석기**: 글자 수, 단어 수, 문단 수 등 텍스트 통계 분석
- **계산기**: 기본적인 수학 계산 기능
- **아이콘 생성기**: 다양한 크기의 아이콘 생성 및 다운로드
- **면적 변환기**: 다양한 면적 단위 간 변환
- **포모도로 타이머**: 생산성 향상을 위한 시간 관리 도구
- **통계 대시보드**: 사용 통계 및 분석 정보

## 🏗️ 아키텍처

이 프로젝트는 **FSD(Feature-Sliced Design)** 방법론을 따라 구조화되어 있습니다:

```
src/
├── app/               # 애플리케이션 초기화, 라우팅
├── components/pages/  # 페이지 컴포넌트
├── widgets/          # 복합 UI 블록
├── features/         # 비즈니스 기능
├── entities/         # 비즈니스 엔티티
└── shared/           # 재사용 코드
```

자세한 아키텍처 규칙은 [FSD 마이그레이션 가이드](./FSD-MIGRATION.md)를 참조하세요.

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- pnpm (권장) 또는 npm/yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/woobottle-labs.git
cd woobottle-labs

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 사용 가능한 스크립트

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 실행
pnpm lint         # 코드 린팅
pnpm test         # 테스트 실행
pnpm test:watch   # 테스트 감시 모드
```

## 📦 배포

이 프로젝트는 **간소화된 GitHub Actions 기반 배포 시스템**을 사용합니다.

### 🚀 자동 배포

GitHub Actions를 통한 원클릭 배포:

1. **Repository → Actions → "Simplified S3 Deploy with Versioning"**
2. **"Run workflow" 클릭**
3. 배포 옵션 선택:
   - **자동 버전 생성**: patch/minor/major 선택
   - **사용자 정의 버전**: v1.2.0 형식으로 입력
   - **현재 버전**: 기본값으로 배포

### 🔄 롤백

문제 발생 시 이전 버전으로 즉시 롤백:

1. **Repository → Actions → "Simplified Rollback"**
2. **롤백할 버전 입력** (예: v1.0.0)
3. **확인란에 "yes" 입력**
4. **"Run workflow" 실행**

### 📋 배포 시스템 특징

- ✅ **자동 버전 관리**: 시맨틱 버저닝 지원
- ✅ **안전한 롤백**: 자동 백업 및 복원
- ✅ **버전 추적**: 상세한 배포 이력 관리
- ✅ **캐시 최적화**: CloudFront 자동 무효화
- ✅ **오래된 버전 정리**: 최신 3개 버전만 유지

자세한 배포 가이드는 [간소화된 배포 시스템](./docs/SIMPLIFIED-DEPLOYMENT.md)을 참조하세요.

## 🧪 테스트

```bash
# 전체 테스트 실행
pnpm test

# 특정 파일 테스트
pnpm test timer-utils.test.ts

# 커버리지 포함 테스트
pnpm test --coverage

# 감시 모드로 테스트
pnpm test:watch
```

## 📚 문서

- [FSD 아키텍처 가이드](./FSD-MIGRATION.md)
- [간소화된 배포 시스템](./docs/SIMPLIFIED-DEPLOYMENT.md)
- [버전 디버그 가이드](./docs/VERSION-DEBUG-GUIDE.md)
- [커스텀 도메인 설정](./docs/CUSTOM-DOMAIN-SETUP.md)

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 코딩 규칙

- **FSD 아키텍처** 준수
- **TypeScript** 사용
- **테스트 코드** 작성
- **린트 규칙** 준수

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 🔗 링크

- **프로덕션**: [https://woo-bottle.com](https://woo-bottle.com)
- **GitHub**: [https://github.com/your-username/woobottle-labs](https://github.com/your-username/woobottle-labs)
- **이슈 트래커**: [GitHub Issues](https://github.com/your-username/woobottle-labs/issues)

---

**WooBottle Labs** - 실험적인 웹 도구들의 놀이터 🧪✨
