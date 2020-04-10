export type PropertyAnnotation = (
  target: { readonly constructor: any },
  propertyKey: string
) => void

export const SECRET_METADATA = Symbol('secret')

export const Secret = (): PropertyAnnotation => (target: object, propertyKey: string): void => {
  Reflect.set(target, SECRET_METADATA, [
    ...(Reflect.get(target, SECRET_METADATA) || []),
    propertyKey
  ])
}
