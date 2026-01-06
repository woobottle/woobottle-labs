#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   pnpm ship -- "feat: message"
#   pnpm ship -- -m "feat: message"
#
# Notes:
# - Stages ALL changes (git add -A)
# - Commits if there are staged changes
# - Pushes current HEAD to origin

cd "$(git rev-parse --show-toplevel)"

REMOTE_NAME="${REMOTE_NAME:-origin}"
DEFAULT_MESSAGE_PREFIX="${DEFAULT_MESSAGE_PREFIX:-chore: auto ship}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository."
  exit 1
fi

if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  echo "Remote '$REMOTE_NAME' not found."
  exit 1
fi

BRANCH="$(git branch --show-current)"
if [[ -z "${BRANCH}" ]]; then
  echo "Detached HEAD; refusing to ship."
  exit 1
fi

MESSAGE=""
if [[ "${1:-}" == "-m" ]]; then
  MESSAGE="${2:-}"
elif [[ "${1:-}" != "" ]]; then
  MESSAGE="$*"
fi

if [[ -z "$MESSAGE" ]]; then
  MESSAGE="${DEFAULT_MESSAGE_PREFIX} ($(date '+%Y-%m-%d %H:%M'))"
fi

if [[ -z "$(git status --porcelain)" ]]; then
  echo "Working tree clean; nothing to ship."
  exit 0
fi

git add -A

if git diff --cached --quiet; then
  echo "No staged changes after add; nothing to ship."
  exit 0
fi

git commit -m "$MESSAGE"
git push "$REMOTE_NAME" HEAD

echo "Shipped to $REMOTE_NAME/$BRANCH"


