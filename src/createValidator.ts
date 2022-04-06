import {
  NestedValidator,
  NestedValidatorResult,
  Validator,
  ValidatorConfig,
  ValidatorConfigField,
  ValidatorResult,
} from './types'

export const createValidator = <T>(config: ValidatorConfig<T>): Validator<T> => {
  const validateNested = createNestedValidator<T, T>(config)
  return (value) => validateNested(value, value)
}

export const createNestedValidator = <BASE, T>(config: ValidatorConfig<BASE, T>): NestedValidator<BASE, T> => {
  const fields = {} as FieldValidators<BASE, T>
  for (const key of Object.keys(config) as Array<keyof T>) {
    fields[key] = createFieldValidator(config[key])
  }
  return (value, base) => {
    let result: NestedValidatorResult<T> = {
      isValid: true,
      fields: {} as NestedValidatorResult<T>['fields'],
    }
    for (const key of Object.keys(fields) as Array<keyof T>) {
      const validateField = fields[key]
      const fieldValue = value[key]
      const fieldResult = validateField(fieldValue, value, base)
      result.isValid &&= fieldResult.isValid
      result.fields[key] = fieldResult
    }
    return result
  }
}

const createFieldValidator = <BASE, T, K extends keyof T>(config: ValidatorConfigField<BASE, T, keyof T>): ValidateField<BASE, T, K> => {
  if (Array.isArray(config)) {
    // The config is an array of validation functions.
    // This means that the value should be treated as an atom.
    return (value: T[K], _record: T, base: BASE) => {
      const errors: string[] = []
      for (const validate of config) {
        const okOrMessage = validate(value, base)
        if (okOrMessage !== true) {
          errors.push(okOrMessage)
        }
      }
      return { isValid: errors.length === 0, errors }
    }
  }
  if (typeof config === 'function') {
    // It's a nested validator.
    return config as unknown as Validator<T[K]>
  }
  // Its a nested validation config.
  const validateNested = createNestedValidator(config as ValidatorConfig<BASE, T[K]>)
  return (value, _record, base) => validateNested(value, base)
}

type FieldValidators<BASE, T> = {
  [K in keyof T]: ValidateField<BASE, T, K>
}

interface ValidateField<BASE, T, K extends keyof T> {
  (value: T[K], record: T, base: BASE): ValidatorResult<T[K]>
}
