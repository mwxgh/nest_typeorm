import { Transform, TransformOptions } from 'class-transformer'
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js'
import { castArray, isArray, isNil, map, trim } from 'lodash'
import { RegexConstant } from '@/constants'
import { isDateFormatWithoutTime } from '../utils'

/**
 * @description trim spaces from start and end, replace multiple spaces with one.
 * @example
 * @ApiProperty()
 * @IsString()
 * @Trim()
 * name: string;
 * @returns PropertyDecorator
 * @constructor
 */
export const Trim: PropertyDecorator = Transform((params) => {
  const value = params.value as string[] | string

  if (isArray(value)) {
    return map(value, (v) => trim(v).replace(/\s\s+/g, ' '))
  }

  return trim(value).replace(/\s\s+/g, ' ')
})

export const ToBoolean = (options?: TransformOptions): PropertyDecorator =>
  Transform(
    (params) => {
      switch (params.value) {
        case 'true':
          return true
        case 'false':
          return false
        case 1:
          return true
        case 0:
          return false
        default:
          return params.value
      }
    },
    { toClassOnly: true, ...(options && options) },
  )

export const ToTime = (options?: TransformOptions): PropertyDecorator =>
  Transform(
    (params) => (params.value ? params.value.slice(0, -3) : undefined),
    {
      ...(options && options),
    },
  )

/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns PropertyDecorator
 * @constructor
 */
export const ToInt: PropertyDecorator = Transform(
  (params) => {
    const value = params.value as string
    return Number.parseInt(value, 10)
  },
  { toClassOnly: true },
)

/**
 * @description transforms to array, specially for query params
 * @example
 * @IsNumber()
 * @ToArray()
 * name: number;
 * @constructor
 */
export function ToArray(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value

      if (isNil(value)) {
        return []
      }

      return castArray(value)
    },
    { toClassOnly: true },
  )
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value

      if (!value) {
        return
      }

      if (!Array.isArray(value)) {
        return value.toLowerCase()
      }

      return value.map((v) => v.toLowerCase())
    },
    {
      toClassOnly: true,
    },
  )
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return
    }

    if (!Array.isArray(value)) {
      return value.toUpperCase()
    }

    return value.map((v) => v.toUpperCase())
  })
}

export const PhoneNumberSerializer: (
  defaultCountry?: CountryCode,
) => PropertyDecorator = (defaultCountry = 'JP') =>
  Transform(
    ({ value }) => parsePhoneNumber(value as string, defaultCountry).number,
  )

export const DateFormat: () => PropertyDecorator = () =>
  Transform(({ value }) =>
    value
      ? `${isDateFormatWithoutTime(value) ? value : value.toISOString()}`
          .split('-')
          .join('/')
      : undefined,
  )

export const EscapeString: () => PropertyDecorator = () =>
  Transform(({ value }) =>
    value ? value.replace(RegexConstant.escapeString, '\\$&') : undefined,
  )

export const NullToDefault: (defaultValue?: number) => PropertyDecorator = (
  defaultValue = 0,
) => Transform(({ value }) => (value ? parseInt(value) : defaultValue))
