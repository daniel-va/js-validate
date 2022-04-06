import { createValidator } from '../createValidator'
import { AtomValidatorResult, NestedValidatorResult } from '../data/results'

describe('createForm', () => {
  describe('flat validation', () => {
    interface Person {
      name: string
      age: number
    }

    const person: Person = { name: 'Peter', age: 42 }

    test('validation with no validators is valid', () => {
      const validatePerson = createValidator<Person>()({
        name: [],
        age: [],
      })
      const result = validatePerson(person)
      expect(result.isValid).toBeTruthy()
      expect(result.fields.name.isValid).toBeTruthy()
      expect(result.fields.age.isValid).toBeTruthy()
    })

    test('untyped factory create the same validator', () => {
      const validatePerson = createValidator<Person>({
        name: [],
        age: [],
      })
      const result = validatePerson(person)
      expect(result.isValid).toBeTruthy()
      expect(result.fields.name.isValid).toBeTruthy()
      expect(result.fields.age.isValid).toBeTruthy()
    })

    test('result contains all configured fields', () => {
      const validatePerson = createValidator<Person>()({
        name: [],
        age: [],
      })
      const result = validatePerson(person)
      const resultKeys = Object.keys(result.fields)
      expect(resultKeys).toHaveLength(2)
      expect(resultKeys).toContain('name')
      expect(resultKeys).toContain('age')
      expect(result.fields.name.isValid).toBeTruthy()
      expect(result.fields.age.isValid).toBeTruthy()
    })

    test('single error causes invalid result', () => {
      const message = 'is invalid'
      const validatePerson = createValidator<Person>()({
        name: [],
        age: [() => message],
      })
      const result = validatePerson(person)
      expect(result.isValid).toBeFalsy()

      const { name, age } = result.fields

      expect(name.isValid).toBeTruthy()
      expect(name.errors).toHaveLength(0)

      expect(age.isValid).toBeFalsy()
      expect(age.errors).toHaveLength(1)
      expect(age.errors).toContain(message)
    })

    test('multiple validators are executed in sequence', () => {
      const validatePerson = createValidator<Person>()({
        name: [
          () => true,
          () => 'a',
          () => 'b',
        ],
        age: [
          () => '1',
          () => '2',
          () => true,
          () => '3',
        ],
      })
      const result = validatePerson(person)
      expect(result.isValid).toBeFalsy()

      const { name, age } = result.fields

      expect(name.isValid).toBeFalsy()
      expect(name.errors).toEqual(['a', 'b'])

      expect(age.isValid).toBeFalsy()
      expect(age.errors).toEqual(['1', '2', '3'])
    })
  })

  describe('nested field validation', () => {
    interface Activity {
      name: string
      location: {
        start: string
        end: string
      }
    }
    const activity: Activity = {
      name: 'Camping Weekend',
      location: {
        start: 'Train Station',
        end: 'Airport',
      },
    }

    test('validation with no validators is valid', () => {
      const validateActivity = createValidator<Activity>()({
        name: [],
        location: {
          start: [],
          end: [],
        },
      })
      const result = validateActivity(activity)
      expect(result.isValid).toBeTruthy()

      const { name, location } = result.fields

      expect(name.isValid).toBeTruthy()
      expect(name.errors).toHaveLength(0)

      expect(location.isValid).toBeTruthy()

      const { start, end } = location.fields

      expect(start.isValid).toBeTruthy()
      expect(start.errors).toHaveLength(0)

      expect(end.isValid).toBeTruthy()
      expect(end.errors).toHaveLength(0)
    })

    test('nested errors cause whole validation to be invalid', () => {
      const validateActivity = createValidator<Activity>()({
        name: [],
        location: {
          start: [() => 'message'],
          end: [],
        },
      })
      const result = validateActivity(activity)
      expect(result.isValid).toBeFalsy()

      const { name, location } = result.fields

      expect(name.isValid).toBeTruthy()
      expect(name.errors).toHaveLength(0)

      expect(location.isValid).toBeFalsy()

      const { start, end } = location.fields

      expect(start.isValid).toBeFalsy()
      expect(start.errors).toEqual(['message'])

      expect(end.isValid).toBeTruthy()
      expect(end.errors).toHaveLength(0)
    })
  })

  describe('nested validators', () => {
    interface Person {
      name: string
      address: Address
    }
    interface Address {
      city: string
      street: string
    }

    const person: Person = {
      name: 'Alice',
      address: {
        city: 'Somewhere',
        street: 'Nowhere',
      },
    }

    test('validation with no validators is valid', () => {
      const validateAddress = createValidator<Address>()({
        city: [],
        street: [],
      })
      const validatePerson = createValidator<Person>()({
        name: [],
        address: validateAddress,
      })

      const result = validatePerson(person)
      expect(result.isValid).toBeTruthy()

      let f = result.fields.address

      const { name, address } = result.fields
      expect(name.isValid).toBeTruthy()
      expect(name.errors).toHaveLength(0)
      expect(address.isValid).toBeTruthy()

      const { city, street } = address.fields
      expect(city.isValid).toBeTruthy()
      expect(city.errors).toHaveLength(0)
      expect(street.isValid).toBeTruthy()
      expect(city.errors).toHaveLength(0)
    })
  })
})
