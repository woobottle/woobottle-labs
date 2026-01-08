---
description: 변경사항을 커밋하고 원격에 푸시
argument-hint: [commit-message]
allowed-tools: Bash(git:*)
---

## 컨텍스트

- 현재 브랜치: !`git branch --show-current`
- Git 상태: !`git status --short`
- 스테이징된 변경사항: !`git diff --staged --stat`
- 스테이징 안된 변경사항: !`git diff --stat`

## 작업

1. 모든 변경사항을 스테이징 (`git add .`)
2. 커밋 메시지로 커밋 생성
   - 인자가 제공되면: "$ARGUMENTS" 사용
   - 인자가 없으면: 변경사항을 분석하여 적절한 커밋 메시지 생성
3. 원격 저장소에 푸시

## 커밋 메시지 규칙

- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 변경
- style: 코드 포맷팅
- refactor: 리팩토링
- test: 테스트 추가/수정
- chore: 기타 변경

## 주의사항

- 푸시 전 현재 브랜치와 원격 브랜치 상태 확인
- force push는 절대 사용하지 않음
