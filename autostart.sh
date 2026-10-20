#!/usr/bin/env bash
# Автозапуск «Люмена» на портах 12000 и 12001.
#
# Вызывается из .openhands/setup.sh — штатной точки входа OpenHands, которая
# срабатывает при каждом старте работы с репозиторием. Файл лежит в /workspace,
# а /workspace — единственный постоянный том: он переживает пересоздание
# контейнера. Прежние хуки в ~/.bashrc и /etc/profile.d сбрасывались к образу
# вместе с остальной файловой системой, поэтому сервер и оставался лежать.
#
# Запускается молча и не мешает работе: если сервер уже жив, ничего не делает.
set -u

# Корень репозитория ищем от самого файла, а не от текущего каталога: агент
# может вызвать скрипт откуда угодно.
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$DIR/serve.sh" ] || DIR="/workspace/project"

# Замок: несколько оболочек могут стартовать разом, а сторож должен быть один.
LOCK="/tmp/lumen-autostart.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  # Замок есть. Если он остался от прошлого запуска и старше минуты — снимаем.
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +1 2>/dev/null)" ]; then
    rmdir "$LOCK" 2>/dev/null
  fi
  mkdir "$LOCK" 2>/dev/null || exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

for port in 12000 12001; do
  if curl -s -o /dev/null --max-time 2 "http://localhost:$port/index.html"; then
    continue
  fi
  nohup "$DIR/serve.sh" "$port" >/dev/null 2>&1 &
done
