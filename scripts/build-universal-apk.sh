#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
BUNDLE_DIR="$ANDROID_DIR/app/build/outputs/bundle/release"
AAB_PATH="$BUNDLE_DIR/app-release.aab"
APKS_PATH="$BUNDLE_DIR/fintrack.apks"
UNZIP_DIR="$BUNDLE_DIR/apks_output"

if ! command -v unzip >/dev/null 2>&1; then
  echo "Error: unzip is required but not installed."
  exit 1
fi

if command -v bundletool >/dev/null 2>&1; then
  BUNDLETOOL_CMD=(bundletool)
elif [ -n "${BUNDLETOOL_JAR:-}" ]; then
  BUNDLETOOL_CMD=(java -jar "$BUNDLETOOL_JAR")
else
  echo "Error: bundletool is not installed."
  echo "Install it (brew install bundletool) or set BUNDLETOOL_JAR=/absolute/path/to/bundletool.jar"
  exit 1
fi

echo "==> Building release AAB with Gradle"
(
  cd "$ANDROID_DIR"
  ./gradlew bundleRelease
)

if [ ! -f "$AAB_PATH" ]; then
  echo "Error: AAB not found at $AAB_PATH"
  exit 1
fi

echo "==> Building universal APKS set"
"${BUNDLETOOL_CMD[@]}" build-apks \
  --bundle="$AAB_PATH" \
  --output="$APKS_PATH" \
  --mode=universal \
  --overwrite

echo "==> Unzipping APKS output"
rm -rf "$UNZIP_DIR"
mkdir -p "$UNZIP_DIR"
unzip -o "$APKS_PATH" -d "$UNZIP_DIR" >/dev/null

echo "Done."
echo "AAB: $AAB_PATH"
echo "APKS: $APKS_PATH"
echo "Unzipped files: $UNZIP_DIR"
if [ -f "$UNZIP_DIR/universal.apk" ]; then
  echo "Universal APK: $UNZIP_DIR/universal.apk"
fi

