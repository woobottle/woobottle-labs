#!/bin/bash

# Claude Code Notification Handler
# stdin으로 JSON 입력을 받아 macOS 알림 표시

# JSON 입력 읽기
read -r json_input

# jq로 필드 추출
notification_type=$(echo "$json_input" | jq -r '.notification_type // ""')
message=$(echo "$json_input" | jq -r '.message // ""')

# 메시지가 너무 길면 자르기 (macOS 알림 제한)
if [ ${#message} -gt 100 ]; then
  message="${message:0:100}..."
fi

# notification_type에 따라 알림 표시
case "$notification_type" in
  "idle_prompt")
    osascript -e "display notification \"${message:-Claude가 입력을 기다립니다}\" with title \"Claude Code\" sound name \"Glass\""
    ;;
  "permission_prompt")
    osascript -e "display notification \"${message:-권한 승인이 필요합니다}\" with title \"Claude Code\" sound name \"Ping\""
    ;;
  "auth_success")
    osascript -e "display notification \"인증 성공\" with title \"Claude Code\" sound name \"Submarine\""
    ;;
  *)
    if [ -n "$message" ]; then
      osascript -e "display notification \"$message\" with title \"Claude Code\" sound name \"Glass\""
    fi
    ;;
esac

exit 0
