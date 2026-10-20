"""Сборка lumen.zip — архива «Люмена» для скачивания.

Кладём только то, что нужно для запуска на домашнем компьютере: оболочку,
ядро, сервер и инструкцию. Значок встроен в код, отдельного файла с картинкой
нет.

Запуск: python3 mkzip.py
"""
import os
import zipfile

SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SRC, 'lumen.zip')

# (файл на диске, имя внутри архива)
FILES = [
    ('index.html', 'index.html'),
    ('styles.css', 'styles.css'),
    ('os.js', 'os.js'),
    ('server.py', 'server.py'),
    ('README.txt', 'ЧИТАТЬ.txt'),
    ('start-windows.bat', 'Запустить-Windows.bat'),
    ('start-mac-linux.command', 'Запустить-Linux-macOS.command'),
]

if os.path.exists(OUT):
    os.remove(OUT)

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for disk, inner in FILES:
        path = os.path.join(SRC, disk)
        if not os.path.isfile(path):
            raise SystemExit('нет файла: ' + path)
        z.write(path, 'lumen/' + inner)

print('размер: %d б' % os.path.getsize(OUT))

# Проверяем, что архив целый и читается.
with zipfile.ZipFile(OUT) as z:
    bad = z.testzip()
    print('повреждений:', 'нет' if bad is None else bad)
    print('файлов внутри: %d' % len(z.infolist()))
    for i in z.infolist():
        print('  %s (%d б)' % (i.filename, i.file_size))
