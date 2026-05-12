/**
 * Expo config plugin that pins the Kotlin Gradle plugin version in the
 * top-level android/build.gradle after every `expo prebuild`.
 *
 * Problem: The generated build.gradle sets `ext.kotlinVersion` but declares
 * the classpath WITHOUT a version, so the React Native BOM overrides it to
 * 1.9.24.  Compose Compiler 1.5.15 requires >= 1.9.25, causing build failure.
 *
 * Fix: replace the versionless classpath declaration with one that uses
 * `"${kotlinVersion}"` so the explicit ext value is honoured.
 */
const { withProjectBuildGradle } = require('@expo/config-plugins');

const withKotlinVersion = (config, { kotlinVersion = '1.9.25' } = {}) => {
  return withProjectBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;

    // Ensure ext.kotlinVersion is set to the desired version (overrides default)
    contents = contents.replace(
      /kotlinVersion\s*=\s*findProperty\('android\.kotlinVersion'\)\s*\?:\s*'[^']+'/,
      `kotlinVersion = findProperty('android.kotlinVersion') ?: '${kotlinVersion}'`,
    );

    // Pin the classpath to use the explicit kotlinVersion variable
    const versionless = "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')";
    const versioned = `classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:\${kotlinVersion}")`;

    if (contents.includes(versionless)) {
      contents = contents.replace(versionless, versioned);
    }
    // Already patched — no-op
    mod.modResults.contents = contents;
    return mod;
  });
};

module.exports = withKotlinVersion;

