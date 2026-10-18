#!/usr/bin/env bash
# Запуск Windows 12 на локальном статическом сервере.
# Использование: ./serve.sh [порт]   (по умолчанию 12000)
set -u

PORT="${1:-12000}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG="/tmp/windows12-$PORT.log"

# Уже слушает — ничего не делаем.
if curl -s -o /dev/null --max-time 2 "http://localhost:$PORT/index.html"; then
  echo "Уже запущено: http://localhost:$PORT/"
  exit 0
fi

cd "$DIR" || exit 1
nohup python3 -m http.server "$PORT" --bind 0.0.0.0 > "$LOG" 2>&1 &
disown

for _ in $(seq 1 20); do
  sleep 0.25
  if curl -s -o /dev/null --max-time 2 "http://localhost:$PORT/index.html"; then
    echo "Запущено: http://localhost:$PORT/  (pid $!, лог $LOG)"
    exit 0
  fi
done

echo "Не удалось запустить сервер. Смотрите $LOG" >&2
exit 1
