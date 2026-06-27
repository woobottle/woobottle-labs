# JPEG → WebP 변환 (통합 변환기) 설계

작성일: 2026-06-27

## 배경

기존에 `PNG → WebP` 변환 기능(`features/webp-conversion`)과 `/png-to-webp` 페이지가 존재한다.
변환 로직(`convertPngFileToWebp`)은 `createImageBitmap` + canvas `toDataURL('image/webp')` 기반이라
입력 포맷에 무관하게 동작한다. 따라서 JPEG 지원은 입력 필터/카피만 일반화하면 된다.

## 결정 사항

- **통합 변환기**: 단일 컨버터가 PNG·JPEG를 모두 받아 WebP로 변환한다. (코드 중복 제거)
- **툴 목록 노출**: 사이드바/홈에 `PNG → WebP`, `JPEG → WebP` 두 항목을 각각 노출한다.
- **라우트**: `/png-to-webp`(기존)와 `/jpeg-to-webp`(신규) 두 라우트가 같은 통합 페이지 컴포넌트를
  렌더하되, 포맷별 metadata(title/keywords)를 따로 둬 SEO 인덱싱 페이지를 확보한다.

## 변경/추가 파일

1. `features/webp-conversion/lib/png-to-webp.ts`
   - `convertPngFileToWebp` → `convertImageFileToWebp`로 일반화(로직 동일). 파일명 규칙은 이미
     `.png/.jpg/.jpeg/.webp`를 모두 제거하므로 변경 불필요.
2. `features/webp-conversion/ui/png-to-webp-converter.tsx`
   - `accept="image/png,image/jpeg"`, 입력 필터 `/\.(png|jpe?g)$/i`, 라벨 "PNG·JPEG 파일 선택".
   - 호출부를 `convertImageFileToWebp`로 갱신.
3. `components/pages/png-to-webp/ui/png-to-webp-page.tsx`
   - 통합 페이지로. 제목/문구를 prop으로 받아 포맷별 변형 가능하게 한다(기본은 PNG·JPEG 통합 문구).
4. 신규 `app/jpeg-to-webp/page.tsx`
   - 같은 페이지 컴포넌트를 JPEG 중심 문구/metadata로 렌더.
5. `entities/tool/model/tools.ts`
   - 기존 `png-to-webp` 항목 유지 + `jpeg-to-webp` 항목 추가(`/jpeg-to-webp`).

## 데이터 흐름 / 에러처리 / 테스트

- 흐름: 파일 선택 → 클라이언트 canvas 변환 → dataURL 미리보기 → 개별/ZIP 다운로드. 기존과 동일.
- 에러처리: canvas 2D context 없을 때 throw(기존 유지).
- 검증: `pnpm build`(정적 export) 통과 확인. 기존에 단위 테스트 없음 — 신규 추가는 선택.
