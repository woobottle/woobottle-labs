#!/bin/bash

# 오래된 매니페스트 파일 정리 스크립트
# 사용법: ./cleanup-old-manifests.sh [days] [bucket-name]

set -e

# 기본값 설정
DAYS_OLD=${1:-30}
BUCKET=${2:-"woo-bottle.com"}
DRY_RUN=${3:-false}

echo "🧹 매니페스트 파일 정리 시작"
echo "================================"
echo "버킷: $BUCKET"
echo "기준: ${DAYS_OLD}일 이상 된 파일"
echo "드라이런: $DRY_RUN"
echo ""

# 날짜 계산
CUTOFF_DATE=$(date -d "$DAYS_OLD days ago" '+%Y-%m-%d')
echo "📅 기준 날짜: $CUTOFF_DATE 이전 파일들"

# 오래된 매니페스트 파일 찾기
echo "🔍 오래된 매니페스트 파일 검색 중..."

MANIFEST_COUNT=0
TOTAL_SIZE=0

aws s3api list-objects-v2 \
  --bucket "$BUCKET" \
  --prefix "batch-operations/rollback-manifest-" \
  --query "Contents[?LastModified<='${CUTOFF_DATE}T23:59:59Z'].[Key,Size,LastModified]" \
  --output text | while read -r key size last_modified; do
  
  if [ -n "$key" ]; then
    MANIFEST_COUNT=$((MANIFEST_COUNT + 1))
    TOTAL_SIZE=$((TOTAL_SIZE + size))
    
    echo "📄 발견: $key (크기: $(numfmt --to=iec $size), 날짜: $last_modified)"
    
    # 매니페스트 메타데이터 확인
    METADATA=$(aws s3api head-object --bucket "$BUCKET" --key "$key" --query "Metadata" --output json 2>/dev/null || echo "{}")
    ROLLBACK_MODE=$(echo "$METADATA" | jq -r '."rollback-mode" // "unknown"')
    TARGET_VERSION=$(echo "$METADATA" | jq -r '."target-version" // "unknown"')
    TOTAL_FILES=$(echo "$METADATA" | jq -r '."total-files" // "unknown"')
    
    echo "   → 롤백 모드: $ROLLBACK_MODE"
    echo "   → 대상 버전: $TARGET_VERSION"
    echo "   → 파일 수: $TOTAL_FILES"
    
    # 태그 정보 확인
    TAGS=$(aws s3api get-object-tagging --bucket "$BUCKET" --key "$key" --query "TagSet" --output json 2>/dev/null || echo "[]")
    STATUS=$(echo "$TAGS" | jq -r '.[] | select(.Key=="status") | .Value' 2>/dev/null || echo "unknown")
    JOB_ID=$(echo "$TAGS" | jq -r '.[] | select(.Key=="job-id") | .Value' 2>/dev/null || echo "unknown")
    
    echo "   → 상태: $STATUS"
    echo "   → 작업 ID: $JOB_ID"
    
    if [ "$DRY_RUN" = "false" ]; then
      echo "🗑️ 삭제 중..."
      aws s3 rm "s3://$BUCKET/$key"
      echo "   ✅ 삭제 완료"
    else
      echo "   🔍 드라이런: 삭제하지 않음"
    fi
    
    echo ""
  fi
done

echo "📊 정리 요약:"
echo "   - 발견된 매니페스트: $MANIFEST_COUNT개"
echo "   - 총 크기: $(numfmt --to=iec $TOTAL_SIZE)"

if [ "$DRY_RUN" = "true" ]; then
  echo "   - 실제 삭제되지 않음 (드라이런 모드)"
  echo ""
  echo "💡 실제 삭제하려면 세 번째 인수로 'false'를 전달하세요:"
  echo "   ./cleanup-old-manifests.sh $DAYS_OLD $BUCKET false"
else
  echo "   - 삭제 완료!"
fi

echo ""
echo "🎯 매니페스트 관리 팁:"
echo "   - 정기적으로 이 스크립트를 실행하여 스토리지 비용 절약"
echo "   - 중요한 매니페스트는 별도 백업 권장"
echo "   - S3 라이프사이클 정책 설정으로 자동화 가능"

echo ""
echo "✅ 매니페스트 정리 완료!"
