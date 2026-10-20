#!/usr/bin/env bash
# Заливка «Люмена» на GitHub одной командой.
#
# Нужен свой токен: у автоматического доступа в этом окружении только чтение,
# запись он запрещает. Создайте токен на https://github.com/settings/tokens
# (тип «Fine-grained» или «Classic» с правом «repo») и запустите:
#
#     GITHUB_TOKEN=ваш_токен ./push-to-github.sh
#
# Токен берётся из переменной и в файлы проекта не записывается.
set -u

REPO="${REPO:-stepankazacuk-png/win12_lumen}"
BRANCH="${BRANCH:-main}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Нужен токен. Запустите так:"
  echo "    GITHUB_TOKEN=ваш_токен $0"
  exit 1
fi

cd "$DIR" || exit 1

echo "Заливаю в $REPO, ветка $BRANCH..."

# Токен передаём на один вызов, в конфиг git не пишем.
git push "https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO}.git" \
  "HEAD:refs/heads/${BRANCH}" || exit 1

echo
echo "Готово. Осталось включить сайт:"
echo "  1. Откройте https://github.com/${REPO}/settings/pages"
echo "  2. В разделе «Build and deployment» выберите Source: «GitHub Actions»."
echo "  3. Через минуту сайт появится по адресу"
echo "     https://stepankazacuk-png.github.io/win12_lumen/"
