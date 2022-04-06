import { createValidator } from '../createValidator'

describe('createForm', () => {
  describe('flat validation', () => {
    interface Person {
      name: String
      age: number
    }

    test('validation with no validators is valid', () => {
      const validatePerson = createValidator<Person>({
        name: [],
        age: [],
      })

      const person: Person = { name: 'Peter', age: 42 }
      const result = validatePerson(person)
      expect(result.isValid).toBeTruthy()
    })

    test('result contains all configured fields', () => {
      const validatePerson = createValidator<Person>({
        name: [],
        age: [],
      })
      const person: Person = { name: 'Peter', age: 42 }
      const result = validatePerson(person)
      const resultKeys = Object.keys(result.fields)
      expect(resultKeys).toHaveLength(2)
      expect(resultKeys).toContain('name')
      expect(resultKeys).toContain('age')
      expect(result.fields.name.isValid).toBeTruthy()
      expect(result.fields.age.isValid).toBeTruthy()
    })
  })
})
