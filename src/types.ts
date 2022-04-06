
export interface Validator<T> {
  (value: T): NestedValidatorResult<T>
}

export interface NestedValidator<BASE, T> {
  (value: T, base: BASE): NestedValidatorResult<T>
}

export interface Validate<V, T> {
  (value: V, record: T): true | string
}

export type ValidatorConfig<BASE, T = BASE> = {
  [K in keyof T]: ValidatorConfigField<BASE, T, K>
}

export type ValidatorConfigField<BASE, T, K extends keyof T> =
  Validator<T[K]> | Array<Validate<T[K], BASE>> | ValidatorConfig<BASE, T[K]>

export type ValidatorResult<T> =
  NestedValidatorResult<T> | AtomValidatorResult

export interface NestedValidatorResult<T> {
  isValid: boolean
  fields: {
    [K in keyof T]: ValidatorResult<T[K]>
  }
}

export interface AtomValidatorResult {
  isValid: boolean
  errors: string[]
}
