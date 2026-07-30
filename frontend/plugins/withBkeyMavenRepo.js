const { withProjectBuildGradle } = require('@expo/config-plugins');

// @bkey-inc/bmoni_embedded_sdk resolves me.bkey.ip:bmonisigner on the app's
// own runtime classpath (see the SDK's README). expo-build-properties'
// android.extraMavenRepos writes to gradle.properties, but nothing in this
// SDK's Gradle template (expo-root-project plugin) reads that property, so
// it's a no-op here — inject the repo directly into build.gradle instead.
const BKEY_MAVEN_REPO_URL = 'https://bkey-inc.github.io/package-distribution/maven';
const REPO_LINE = `    maven { url '${BKEY_MAVEN_REPO_URL}' }`;

module.exports = function withBkeyMavenRepo(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      throw new Error('withBkeyMavenRepo only supports Groovy build.gradle files');
    }

    const contents = config.modResults.contents;
    if (contents.includes(BKEY_MAVEN_REPO_URL)) {
      return config;
    }

    const allprojectsRepositories = /(allprojects\s*{\s*repositories\s*{)/;
    if (!allprojectsRepositories.test(contents)) {
      throw new Error('withBkeyMavenRepo could not find `allprojects { repositories {` in android/build.gradle');
    }

    config.modResults.contents = contents.replace(
      allprojectsRepositories,
      `$1\n${REPO_LINE}`
    );

    return config;
  });
};
