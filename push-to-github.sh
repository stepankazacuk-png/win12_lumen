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
PUSH_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO}.git"

if [ "${FORCE:-0}" = "1" ]; then
  # История была переписана (убраны коды и пароли), поэтому обычная отправка
  # не пройдёт: старые коммиты в родстве с новыми не состоят. Перезаписываем.
  echo "Внимание: перезаписываю историю ветки $BRANCH (FORCE=1)."
  git push --force "$PUSH_URL" "HEAD:refs/heads/${BRANCH}" || exit 1
else
  git push "$PUSH_URL" "HEAD:refs/heads/${BRANCH}" || {
    echo
    echo "Отправка отклонена. Если история была переписана, запустите с FORCE=1:"
    echo "    GITHUB_TOKEN=ваш_токен FORCE=1 $0"
    exit 1
  }
fi

# Старый релиз хранит архив с прежними исходниками, где были коды. Удаляем
# релиз и тег, затем собираем заново из чистых файлов — тег создастся сам.
if [ "${FORCE:-0}" = "1" ]; then
  echo "Обновляю релиз v1.0..."
  python3 mkzip.py >/dev/null 2>&1 || true
  OLD_ID="$(curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    "https://api.github.com/repos/${REPO}/releases" \
    | python3 -c 'import sys,json
try:
    d=json.load(sys.stdin)
except Exception:
    d=[]
for r in (d if isinstance(d,list) else []):
    if r.get("tag_name")=="v1.0": print(r["id"]); break' 2>/dev/null)"
  if [ -n "$OLD_ID" ]; then
    curl -s -o /dev/null -X DELETE -H "Authorization: Bearer ${GITHUB_TOKEN}" \
      "https://api.github.com/repos/${REPO}/releases/${OLD_ID}"
    echo "  старый релиз удалён"
  fi
  curl -s -o /dev/null -X DELETE -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    "https://api.github.com/repos/${REPO}/git/refs/tags/v1.0"
  NEW_ID="$(curl -s -X POST -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/releases" \
    -d '{"tag_name":"v1.0","name":"Люмен 1.0","body":"Готовая сборка: распакуйте архив и запустите Запустить-Windows.bat (Windows) или Запустить-Linux-macOS.command (macOS/Linux). Вход — по паролю учётной записи, запасной вход — код владельца за ссылкой «Забыли пароль?».","draft":false,"prerelease":false}' \
    | python3 -c 'import sys,json;print(json.load(sys.stdin).get("id",""))' 2>/dev/null)"
  if [ -n "$NEW_ID" ] && [ -f lumen.zip ]; then
    curl -s -o /dev/null -X POST -H "Authorization: Bearer ${GITHUB_TOKEN}" \
      -H "Content-Type: application/zip" \
      --data-binary @lumen.zip \
      "https://uploads.github.com/repos/${REPO}/releases/${NEW_ID}/assets?name=lumen.zip"
    git tag -f v1.0 >/dev/null 2>&1 || true
    echo "  релиз v1.0 собран заново с чистым архивом"
  else
    echo "  релиз создать не удалось — проверьте права токена на «Contents»"
  fi
fi

echo
echo "Готово. Осталось включить сайт:"
echo "  1. Откройте https://github.com/${REPO}/settings/pages"
echo "  2. В разделе «Build and deployment» выберите Source: «GitHub Actions»."
echo "  3. Через минуту сайт появится по адресу"
echo "     https://stepankazacuk-png.github.io/win12_lumen/"
