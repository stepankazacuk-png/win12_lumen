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

# Заранее проверяем право на запись файлов: у fine-grained токена раздел
# «Contents» по умолчанию только на чтение, и тогда push падает с невнятным
# 403. Лучше сказать прямо, чего не хватает.
CAN_WRITE="$(curl -s -o /dev/null -w '%{http_code}' -X PUT \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${REPO}/contents/.push-probe" \
  -d '{"message":"probe","content":"cHJvYmU="}')"

if [ "$CAN_WRITE" = "403" ] || [ "$CAN_WRITE" = "404" ]; then
  cat <<'TXT'
Токен принят, но права на запись нет.

У fine-grained токена права раздаются по разделам. Включите:
  Contents        — Read and write   (нужно для заливки файлов)
  Administration  — Read and write   (включить Pages)
  Pages           — Read and write   (публикация сайта)

Проще всего выпустить классический токен с одним правом «repo»:
https://github.com/settings/tokens/new?scopes=repo
TXT
  exit 1
fi

# Пробная запись удалась — убираем след, чтобы он не попал в репозиторий.
PROBE_SHA="$(curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/contents/.push-probe" \
  | python3 -c 'import sys,json;print(json.load(sys.stdin).get("sha",""))' 2>/dev/null)"
[ -n "$PROBE_SHA" ] && curl -s -o /dev/null -X DELETE \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/contents/.push-probe" \
  -d "{\"message\":\"cleanup\",\"sha\":\"${PROBE_SHA}\"}"

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
