#!/bin/zsh
set -e
cd -- "$(dirname -- "$0")/field"
if ! command -v node >/dev/null 2>&1; then
  print 'Node.js 22 or newer is required. Install Node, then run this launcher again.'
  read -r '?Press Return to close. '
  exit 1
fi
if [[ ! -d node_modules ]]; then npm ci; fi
npm run dev &
vend_server_pid=$!
trap 'kill "$vend_server_pid" 2>/dev/null || true' EXIT INT TERM
for vend_attempt in {1..30}; do
  if curl -fsS 'http://localhost:5173/' >/dev/null 2>&1; then
    open -a 'Google Chrome' 'http://localhost:5173'
    break
  fi
  if ! kill -0 "$vend_server_pid" 2>/dev/null; then
    print 'The server stopped. Review the error above.'
    read -r '?Press Return to close. '
    exit 1
  fi
  sleep 1
done
wait "$vend_server_pid"
