/**
 * This module is based on https://www.npmjs.com/package/env-decorator v1.0.0
 * with some modifications (env-decorator didn't allow to apply more than 1 decorator)
 */
import { ENV_METADATA, PropertyMeta, ValueType } from './env.decorator'
import { SECRET_METADATA } from './secret.decorator'

function findEnvValue(propertyMeta: PropertyMeta): string | undefined {
  return propertyMeta.envVarName
    .map((envVarName: string) => process.env[envVarName])
    .find((envValue?: string) => envValue !== undefined)
}

function tryCast(envValue: string | undefined, { envVarName, transform }: PropertyMeta): ValueType {
  if (envValue === undefined) {
    return undefined
  }

  try {
    return transform(envValue)
  } catch (err) {
    throw new Error(`Failed to transform property ${envVarName} (value: ${envValue})`)
  }
}

function checkValueRequired(propertyMeta: PropertyMeta, envValue: ValueType): void {
  if (propertyMeta.required && envValue === undefined) {
    throw new Error(`Missing variable: ${propertyMeta.envVarName}`)
  }
}

function getEnvValue(envs: any, key: string | number | symbol): any | undefined {
  const propertyMeta = envs[key]
  if (key !== 'constructor' && propertyMeta) {
    const envValue = tryCast(findEnvValue(propertyMeta), propertyMeta)
    checkValueRequired(propertyMeta, envValue)
    return envValue
  }
  return undefined
}

export default function loadConfig<T extends object>(Config: new () => T): T {
  const config: T = new Config()
  return new Proxy(config, {
    get(target: any, p: string | number | symbol): any {
      const envs: object = Reflect.get(target, ENV_METADATA) || {}
      if (p === 'toString') {
        const secrets = Reflect.get(target, SECRET_METADATA) || []
        return () =>
          JSON.stringify(
            target,
            (key, value) => {
              if (secrets.includes(key)) {
                return '*****'
              }
              const envValue = getEnvValue(envs, key)
              if (envValue !== undefined) {
                return envValue
              }
              return value
            },
            2
          )
      }
      const envValue = getEnvValue(envs, p)
      if (envValue !== undefined) {
        return envValue
      }
      if (target[p] === undefined) {
        // try to find key in process.env and return it
        return process.env[String(p)] ?? target[p]
      }
      return target[p]
    }
  })
}
