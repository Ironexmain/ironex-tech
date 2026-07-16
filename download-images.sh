#!/bin/bash
# ═══════════════════════════════════════════════════
#  IRONEX — скачать все фотографии с detalmet.ru
#  Запуск: bash download-images.sh
# ═══════════════════════════════════════════════════

SITE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "📁 Создаём папки..."
mkdir -p "$SITE/images/photos"
mkdir -p "$SITE/images/cases"

PHOTOS=(
  prod-2045 prod-2044 prod-2039 prod-2035 prod-1022
  gen-laser gen-bending gen-welding gen-milling gen-hydro
  gen-plasma gen-punch gen-tig gen-laser-weld gen-kim
  shop-16 shop-01 shop-03 shop-08 shop-06
  shop-14 shop-05 shop-15 shop-11 shop-17
)

CASES=(
  korpus-rea-d16t valy-reduktora-40h server-rack-42u
  modul-aisi304 kronshtein-titan-vt6
)

ok=0; fail=0

echo "⬇️  Скачиваем фотографии (25 файлов)..."
for name in "${PHOTOS[@]}"; do
  url="https://detalmet.ru/images/photos/$name.webp"
  dest="$SITE/images/photos/$name.webp"
  http=$(curl -s -L -w "%{http_code}" --max-time 20 -o "$dest" "$url")
  size=$(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest" 2>/dev/null || echo 0)
  if [ "$http" = "200" ] && [ "$size" -gt 1000 ]; then
    echo "  ✓ photos/$name.webp"
    ((ok++))
  else
    echo "  ✗ photos/$name.webp (HTTP $http)"
    ((fail++))
  fi
done

echo "⬇️  Скачиваем кейсы (5 файлов)..."
for name in "${CASES[@]}"; do
  url="https://detalmet.ru/images/cases/$name.webp"
  dest="$SITE/images/cases/$name.webp"
  http=$(curl -s -L -w "%{http_code}" --max-time 20 -o "$dest" "$url")
  size=$(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest" 2>/dev/null || echo 0)
  if [ "$http" = "200" ] && [ "$size" -gt 1000 ]; then
    echo "  ✓ cases/$name.webp"
    ((ok++))
  else
    echo "  ✗ cases/$name.webp (HTTP $http)"
    ((fail++))
  fi
done

echo "⬇️  og.webp (OG-изображение)..."
http=$(curl -s -L -w "%{http_code}" --max-time 20 \
  -o "$SITE/images/og.webp" \
  "https://detalmet.ru/images/og.webp")
size=$(stat -f%z "$SITE/images/og.webp" 2>/dev/null || stat -c%s "$SITE/images/og.webp" 2>/dev/null || echo 0)
if [ "$http" = "200" ] && [ "$size" -gt 1000 ]; then
  echo "  ✓ og.webp"
  ((ok++))
else
  echo "  ✗ og.webp (HTTP $http)"
  ((fail++))
fi

echo ""
echo "════════════════════════════════════"
if [ "$fail" -eq 0 ]; then
  echo "✅ Готово: все $ok файлов скачаны"
  echo "   Теперь загрузи папку ironex-site"
  echo "   на Netlify (drag & drop)."
else
  echo "✅ Скачано: $ok файлов"
  echo "⚠️  Ошибки:  $fail файлов"
  echo "   Проверь интернет и запусти снова."
fi
echo "════════════════════════════════════"
echo ""
