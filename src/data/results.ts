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
    C extends ValidatorOfConfig<T[K], any>
      ? (C extends (...args: any[]) => infer P ? P : never)
      :
    C extends NestedValidatorConfig<BASE, T[K]>
      ? ValidatorResultOfConfig<BASE, T[K], C>
      :
    never
