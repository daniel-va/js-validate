import { ValidatorConfig } from './configs'
import { NestedValidatorResult, ValidatorResultOfConfig } from './results'

export interface Validator<T> {
  (value: T): NestedValidatorResult<T>
}

export interface NestedValidator<BASE, T> {
  (value: T, base: BASE): NestedValidatorResult<T>
}

export interface Validate<V, T> {
  (value: V, record: T): true | string
}

export interface ValidatorOfConfig<T, C extends ValidatorConfig<T>> extends Validator<T> {
  (value: T): ValidatorResultOfConfig<T, T, C>
}
