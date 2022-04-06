import {
  AtomValidatorConfig,
  NestedValidatorConfig,
  ValidatorConfigField,
} from './configs'
import { Validator, ValidatorOfConfig } from './validators'

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

export type ValidatorResultOfConfig<BASE, T, C extends NestedValidatorConfig<BASE, T>> = {
  isValid: boolean,
  fields: {
    [K in keyof T]: ValidatorFieldResult<BASE, T, K, C[K]>
  }
}

type ValidatorFieldResult<BASE, T, K extends keyof T, C extends ValidatorConfigField<BASE, unknown>> =
    C extends AtomValidatorConfig<BASE, T[K]>
      ? AtomValidatorResult
      :
    C extends ValidatorOfConfig<any, infer CP>
      ? ValidatorResultOfConfig<T[K], T[K], CP>
      :
    C extends Validator<T[K]>
      ? ValidatorResult<T[K]>
      :
    C extends NestedValidatorConfig<BASE, T[K]>
      ? ValidatorResultOfConfig<BASE, T[K], C>
      :
    never
