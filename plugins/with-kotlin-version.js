const {
  withGradleProperties,
  withProjectBuildGradle,
} = require('@expo/config-plugins');

const withKotlinVersion = (config, { kotlinVersion = '2.0.21' } = {}) => {
  const withBuildGradle = withProjectBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;

    const extAssignmentRegex = /kotlinVersion\s*=\s*findProperty\('android\.kotlinVersion'\)\s*\?:\s*'[^']+'/;
    const versionedClasspath = `classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:\${kotlinVersion}")`;
    const versionlessClasspath = "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')";

    // Keep kotlinVersion coming from gradle.properties, with a safe fallback.
    if (extAssignmentRegex.test(contents)) {
      contents = contents.replace(
        extAssignmentRegex,
        `kotlinVersion = findProperty('android.kotlinVersion') ?: '${kotlinVersion}'`,
      );
    } else if (!contents.includes('kotlinVersion = findProperty(\'android.kotlinVersion\')')) {
      contents = contents.replace(
        /buildscript\s*\{/,
        `buildscript {\n  ext {\n    kotlinVersion = findProperty('android.kotlinVersion') ?: '${kotlinVersion}'\n  }`,
      );
    }

    if (contents.includes(versionlessClasspath)) {
      contents = contents.replace(versionlessClasspath, versionedClasspath);
    } else if (!contents.includes('org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}')) {
      contents = contents.replace(
        /classpath\('com\.facebook\.react:react-native-gradle-plugin'\)/,
        `classpath('com.facebook.react:react-native-gradle-plugin')\n    ${versionedClasspath}`,
      );
    }

    mod.modResults.contents = contents;
    return mod;
  });

  return withGradleProperties(withBuildGradle, (mod) => {
    const key = 'android.kotlinVersion';
    const existing = mod.modResults.find((item) => item.type === 'property' && item.key === key);

    if (existing) {
      existing.value = kotlinVersion;
    } else {
      mod.modResults.push({ type: 'property', key, value: kotlinVersion });
    }

    return mod;
  });
};

module.exports = withKotlinVersion;

