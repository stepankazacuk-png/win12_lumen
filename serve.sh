#!/usr/bin/env bash
# Запуск «Люмена».
#
# Использование:
#   ./serve.sh [порт]        запустить (по умолчанию 12000)
#   ./serve.sh stop [порт]   остановить
#
# Сервер держит и файлы системы, и живой браузер (настоящий Chromium на
# сервере), и прокси. Рядом работает сторож: если сервер завершится, он
# поднимет его снова. После перезапуска контейнера запустите ./serve.sh заново.
set -u

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACTION="start"
PORT="12000"
if [ "${1:-}" = "stop" ]; then
  ACTION="stop"
  PORT="${2:-12000}"
elif [[ "${1:-}" =~ ^[0-9]+$ ]]; then
  PORT="$1"
elif [ -n "${1:-}" ]; then
  echo "Использование: ./serve.sh [порт|stop]" >&2
  exit 2
fi

PIDFILE="/tmp/lumen-$PORT.pid"
LOG="/tmp/lumen-$PORT.log"

alive() { curl -s -o /dev/null --max-time 2 "http://localhost:$PORT/index.html"; }

stop_it() {
  if [ -f "$PIDFILE" ]; then
    pid="$(cat "$PIDFILE" 2>/dev/null || true)"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null
      for _ in $(seq 1 20); do
        kill -0 "$pid" 2>/dev/null || break
        sleep 0.2
      done
      kill -9 "$pid" 2>/dev/null
    fi
    rm -f "$PIDFILE"
  fi
  pkill -f "python3 .*server.py $PORT" 2>/dev/null
  pkill -f "lumen-chrome-9333" 2>/dev/null
  sleep 0.5
}

if [ "$ACTION" = "stop" ]; then
  stop_it
  echo "Остановлено (порт $PORT)"
  exit 0
fi

if alive; then
  echo "Уже запущено: http://localhost:$PORT/"
  exit 0
fi

cd "$DIR" || exit 1

# Сторож: сервер упал — поднимаем снова. Пока жив сторож, живёт и система.
nohup bash -c '
  PORT="$1"; DIR="$2"; LOG="$3"
  cd "$DIR" || exit 1
  while true; do
    python3 server.py "$PORT" >> "$LOG" 2>&1
    echo "$(date "+%H:%M:%S") сервер остановился, перезапуск через 2 с" >> "$LOG"
    sleep 2
  done
' _ "$PORT" "$DIR" "$LOG" > /dev/null 2>&1 &
echo $! > "$PIDFILE"
disown

for _ in $(seq 1 40); do
  sleep 0.25
  if alive; then
    echo "Запущено: http://localhost:$PORT/"
    echo "  живой браузер: настоящий Chromium на сервере"
    echo "  прокси: /__proxy"
    echo "  журнал: $LOG"
    exit 0
  fi
done

echo "Не удалось запустить сервер. Смотрите $LOG" >&2
exit 1
