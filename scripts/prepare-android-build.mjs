import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const androidRoot = resolve(process.cwd(), 'android')
const wrapperPath = resolve(androidRoot, 'gradle/wrapper/gradle-wrapper.properties')
const propertiesPath = resolve(androidRoot, 'gradle.properties')

const wrapper = readFileSync(wrapperPath, 'utf8')
const distributionUrl = 'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.13-bin.zip'
if (!/^distributionUrl=.*$/m.test(wrapper)) {
  throw new Error(`Gradle distribution URL was not found in ${wrapperPath}`)
}
writeFileSync(wrapperPath, wrapper.replace(/^distributionUrl=.*$/m, distributionUrl))

const properties = readFileSync(propertiesPath, 'utf8')
if (!/^android\.overridePathCheck=true$/m.test(properties)) {
  writeFileSync(propertiesPath, `${properties.trimEnd()}\nandroid.overridePathCheck=true\n`)
}
