import { Validate, Validator } from './validators'

export type ValidatorConfig<T> = NestedValidatorConfig<T, T>

export type NestedValidatorConfig<BASE, T> = {
  [K in keyof T]: ValidatorConfigField<BASE, T[K]>
}

export type ValidatorConfigField<BASE, V> =
  Validator<V> | AtomValidatorConfig<BASE, V> | NestedValidatorConfig<BASE, V>

export type AtomValidatorConfig<BASE, V> = Array<Validate<V, BASE>>
