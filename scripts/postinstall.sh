#!/usr/bin/env bash
# postinstall.sh — re-applies node_modules patches that cannot be upstreamed yet.
# Runs automatically after every `npm install` / `npm ci`.

set -euo pipefail

NITRO_PKG="node_modules/react-native-nitro-modules/android/src/main/java/com/margelo/nitro/NitroModulesPackage.kt"

if [ -f "$NITRO_PKG" ]; then
  # Fix: NitroModulesPackage uses Kotlin named args that don't match RN 0.76 constructor
  # parameter names (_canOverrideExistingModule / _needsEagerInit with underscore prefix).
  # Switch to positional arguments so the call compiles against both constructor signatures.
  sed -i '' \
    -e 's/canOverrideExistingModule = false,/false,/' \
    -e 's/needsEagerInit = false,/false,/' \
    -e 's/isCxxModule = false,/false,/' \
    -e 's/isTurboModule = isTurboModule,/isTurboModule,/' \
    "$NITRO_PKG"
  echo "[postinstall] Patched $NITRO_PKG"
fi

