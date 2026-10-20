#!/usr/bin/env bash
# Запуск «Люмена» на macOS и Linux.
cd "$(dirname "$0")" || exit 1

# Подойдёт python3 или python.
if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "Не найден Python. Установите Python 3 и запустите снова."
  exit 1
fi

echo
echo "  Запуск «Люмена»..."
echo "  Не закрывайте это окно. Остановить — Ctrl+C."
echo

# Открываем браузер через пару секунд, когда сервер уже поднялся.
if command -v open >/dev/null 2>&1; then
  (sleep 2 && open http://localhost:12000/) &
elif command -v xdg-open >/dev/null 2>&1; then
  (sleep 2 && xdg-open http://localhost:12000/) &
fi

exec "$PY" server.py 12000
