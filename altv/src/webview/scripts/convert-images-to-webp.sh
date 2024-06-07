find public/assets -name "*.png" -exec sh -c 'cwebp -q 90 "$1" -o "${1%.png}.webp" && rm "$1"' _ {} \;
