export type ValueType = string | boolean | number | undefined

export type PropertyAnnotation = (
  target: { readonly constructor: any },
  propertyKey: string
) => void

export interface Options {
  readonly type?: 'string' | 'number' | 'boolean'
  readonly required?: boolean
}

export type Param1 = string | readonly string[] | Options | undefined

export interface PropertyMeta extends Options {
  readonly envVarName: readonly string[]

  transform(value: string): ValueType
}

const transformMap = {
  string: (value: string): string => value,
  number: parseFloat,
  boolean: (value: string): boolean | undefined => {
    if (['true', '1', 't'].includes(value)) {
      return true
    }
    if (['false', '0', 'f'].includes(value)) {
      return false
    }
    return undefined
  }
}

export const ENV_METADATA = Symbol('env')

function findEnvVarName(param1: Param1, propertyKey: string): readonly string[] {
  if (typeof param1 === 'string') {
    return [param1]
  }
  if (Array.isArray(param1)) {
    return param1
  }
  return [propertyKey]
}

function findOptions(param1: Param1, param2: Options | undefined): Options {
  if (param2) {
    return param2
  }
  if (param1 && typeof param1 === 'object' && param1.constructor === Object) {
    return param1 as Options
  }
  return {}
}

export function Env(param1?: Param1, param2?: Options): PropertyAnnotation {
  return (target: object, propertyKey: string): void => {
    const envVarName = findEnvVarName(param1, propertyKey)
    const decoratorOptions = findOptions(param1, param2)

    const propertyOptions: PropertyMeta = {
      envVarName: envVarName,
      ...decoratorOptions,
      transform: transformMap[decoratorOptions.type ?? 'string']
    }
    Reflect.set(target, ENV_METADATA, {
      ...(Reflect.get(target, ENV_METADATA) || {}),
      [propertyKey]: propertyOptions
    })
  }
}
