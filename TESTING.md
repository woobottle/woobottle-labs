# 테스트 가이드

이 프로젝트는 Jest와 React Testing Library를 사용하여 포괄적인 테스트 스위트를 제공합니다.

## 🧪 테스트 구조

### 테스트 유형

1. **단위 테스트 (Unit Tests)**
   - 개별 함수와 유틸리티 테스트
   - `src/entities/timer/__tests__/timer-utils.test.ts`
   - `src/shared/ui/__tests__/button.test.tsx`

2. **훅 테스트 (Hook Tests)**
   - React 커스텀 훅 테스트
   - `src/features/pomodoro-timer/__tests__/use-pomodoro-timer.test.ts`

3. **컴포넌트 테스트 (Component Tests)**
   - 개별 컴포넌트 렌더링 및 상호작용 테스트
   - `src/features/pomodoro-timer/__tests__/timer-display.test.tsx`
   - `src/features/pomodoro-timer/__tests__/timer-controls.test.tsx`

4. **통합 테스트 (Integration Tests)**
   - 전체 기능 워크플로우 테스트
   - `src/features/pomodoro-timer/__tests__/pomodoro-timer.test.tsx`
   - `src/features/pomodoro-timer/__tests__/pomodoro-integration.test.tsx`

## 🚀 테스트 실행

### 모든 테스트 실행
```bash
npm test
```

### 워치 모드로 테스트 실행
```bash
npm run test:watch
```

### 커버리지 리포트와 함께 테스트 실행
```bash
npm run test:coverage
```

### 특정 테스트 파일 실행
```bash
npm test timer-utils.test.ts
```

### 특정 테스트 케이스 실행
```bash
npm test -- --testNamePattern="formatTime"
```

## 📋 테스트 커버리지

현재 테스트는 다음 영역을 커버합니다:

### ✅ 타이머 유틸리티 함수들
- `formatTime`: 시간 포맷팅 (MM:SS)
- `getPhaseTime`: 페이즈별 시간 계산
- `getNextPhase`: 다음 페이즈 결정 로직
- `getPhaseInfo`: 페이즈 정보 반환
- `showNotification`: 브라우저 알림 표시
- `updatePageTitle`: 페이지 제목 업데이트
- `requestNotificationPermission`: 알림 권한 요청
- `getTodayString`: 오늘 날짜 문자열 생성

### ✅ 뽀모도로 타이머 훅 (usePomodoroTimer)
- 초기 상태 설정
- 타이머 제어 (시작, 일시정지, 리셋, 건너뛰기)
- 타이머 실행 및 카운트다운
- 설정 업데이트
- 통계 관리
- 자동 시작 기능
- 로컬 스토리지 지속성

### ✅ 타이머 컴포넌트들
- **TimerDisplay**: 시간 표시, 페이즈별 UI, 진행률, 세션 정보
- **TimerControls**: 버튼 상태, 클릭 이벤트, 아이콘 표시
- **PomodoroTimer**: 전체 컴포넌트 렌더링, 설정 모달, 통계 표시

### ✅ 통합 테스트
- 전체 뽀모도로 사이클 완료
- 일시정지/재개 기능
- 타이머 리셋
- 페이즈 건너뛰기
- 설정 변경 및 자동 시작
- 통계 추적 및 초기화
- 로컬 스토리지 지속성

### ✅ UI 컴포넌트
- **Button**: 다양한 variant, size, 상태, 이벤트 처리

## 🔧 테스트 설정

### Jest 설정 (`jest.config.js`)
- Next.js와 통합된 Jest 설정
- TypeScript 지원
- 모듈 경로 매핑 (FSD 아키텍처 지원)
- 커버리지 수집 설정

### 테스트 셋업 (`jest.setup.js`)
- Testing Library DOM 매처
- localStorage 모킹
- Notification API 모킹
- window.confirm 모킹
- 가짜 타이머 설정

## 📝 테스트 작성 가이드라인

### 1. 테스트 파일 명명 규칙
- 단위 테스트: `*.test.ts` 또는 `*.test.tsx`
- 통합 테스트: `*-integration.test.tsx`
- 테스트 파일은 `__tests__` 폴더에 위치

### 2. 테스트 구조
```typescript
describe('컴포넌트/함수명', () => {
  describe('기능 그룹', () => {
    it('should 구체적인 동작', () => {
      // 테스트 코드
    });
  });
});
```

### 3. 모킹 가이드라인
- 외부 의존성은 모킹
- localStorage, Notification API 등 브라우저 API 모킹
- 타이머 관련 테스트는 `jest.useFakeTimers()` 사용

### 4. 비동기 테스트
- `waitFor`를 사용하여 비동기 상태 변경 대기
- `user-event`를 사용하여 실제 사용자 상호작용 시뮬레이션

## 🐛 테스트 디버깅

### 테스트 실패 시 확인사항
1. 모킹이 올바르게 설정되었는지 확인
2. 비동기 작업이 완료될 때까지 대기하는지 확인
3. 가짜 타이머 사용 시 `act()` 함수로 감싸기
4. 컴포넌트 언마운트 후 정리 작업 확인

### 유용한 디버깅 명령어
```bash
# 특정 테스트만 실행
npm test -- --testNamePattern="should start timer"

# 상세한 출력과 함께 실행
npm test -- --verbose

# 실패한 테스트만 재실행
npm test -- --onlyFailures
```

## 📊 커버리지 목표

- **함수 커버리지**: 90% 이상
- **라인 커버리지**: 85% 이상
- **브랜치 커버리지**: 80% 이상

## 🔄 CI/CD 통합

테스트는 다음 상황에서 자동으로 실행됩니다:
- Pull Request 생성 시
- main 브랜치에 푸시 시
- 배포 전 빌드 과정에서

## 📚 추가 리소스

- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [React Testing Library 가이드](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
