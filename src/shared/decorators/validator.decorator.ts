/* eslint-disable @typescript-eslint/no-explicit-any */
import { arrayUnique, ValidationOptions } from 'class-validator'
import {
  ArrayMaxSize as _ArrayMaxSize,
  ArrayMinSize as _ArrayMinSize,
  IsAlphanumeric as _IsAlphanumeric,
  IsArray as _IsArray,
  IsBoolean as _IsBoolean,
  IsDate as _IsDate,
  IsEnum as _IsEnum,
  IsInt as _IsInt,
  IsJSON as _IsJSON,
  IsNotEmpty as _IsNotEmpty,
  IsNumber as _IsNumber,
  IsNumberString as _IsNumberString,
  IsPhoneNumber as isPhoneNumber,
  IsPositive as _IsPositive,
  IsString as _IsString,
  Matches,
  Max as _Max,
  MaxLength as _MaxLength,
  Min as _Min,
  MinLength as _MinLength,
  registerDecorator,
  ValidateIf,
} from 'class-validator'
import * as moment from 'moment-timezone'

import { AppConstant, ExportConstant, RegexConstant } from '@/constants'
import { ValidationMessage } from '@/messages'

export const IsPassword = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationMessage.passwordRule,
      },
      validator: {
        validate(value: string) {
          return /^[\d!#$%&*@A-Z^a-z]*$/.test(value)
        },
      },
    })
  }
}

export const IsPhoneNumber = (
  validationOptions?: ValidationOptions & {
    region?: Parameters<typeof isPhoneNumber>[0]
  },
): PropertyDecorator => {
  return isPhoneNumber(validationOptions?.region, {
    message: ValidationMessage.phoneRule,
    ...validationOptions,
  })
}

export const IsUndefinable = (
  options?: ValidationOptions,
): PropertyDecorator => {
  return ValidateIf((obj, value) => value !== undefined, options)
}

export const IsNullable = (options?: ValidationOptions): PropertyDecorator => {
  return ValidateIf((obj, value) => value !== null, options)
}

export const AllowBlank = (options?: ValidationOptions): PropertyDecorator => {
  return ValidateIf(
    (obj, value) => ![null, undefined, ''].includes(value),
    options,
  )
}

export const IsInt = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsInt({ message: ValidationMessage.isInt, ...makeOption(options) })

export const IsNotEmpty = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsNotEmpty({
    message: ValidationMessage.isNotEmpty,
    ...makeOption(options),
  })

export const IsBoolean = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsBoolean({ message: ValidationMessage.isBoolean, ...makeOption(options) })

export const IsDate = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsDate({
    message:
      (options as ValidationOptions)?.message || ValidationMessage.isDate,
    ...makeOption(options),
  })

export const IsString = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsString({ message: ValidationMessage.isString, ...makeOption(options) })

export const IsNumberString = (
  options?: validator.IsNumericOptions,
  validOptions?: string | ValidationOptions,
): PropertyDecorator =>
  _IsNumberString(
    { ...options },
    { message: ValidationMessage.isNumberString, ...makeOption(validOptions) },
  )

export const IsAlphanumeric = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsAlphanumeric('en-US', {
    message: ValidationMessage.isAlphaNumeric,
    ...makeOption(options),
  })

export const IsNumber = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsNumber({}, { message: ValidationMessage.isNumber, ...makeOption(options) })

export const IsPositive = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsPositive({
    message: ValidationMessage.isPositive,
    ...makeOption(options),
  })

export const IsArray = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsArray({
    message: ValidationMessage.isArray,
    ...makeOption(options),
  })

export const IsTime = (validationOptions?: ValidationOptions) => {
  return Matches(RegexConstant.isTime, {
    ...validationOptions,
    message: ValidationMessage.isTime,
  })
}

export const ArrayMinSize = (
  minValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _ArrayMinSize(minValue, {
    message: ValidationMessage.arrayMinSize,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: minValue } } },
    ),
  })

export const ArrayMaxSize = (
  maxValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _ArrayMaxSize(maxValue, {
    message: ValidationMessage.arrayMaxSize,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: maxValue } } },
    ),
  })

export const ArrayUnique = (property?: string): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'arrayUnique',
      target: object.constructor,
      constraints: [],
      options: {
        message: ValidationMessage.arrayUnique,
      },
      validator: {
        validate(value: [{ [key: string]: any } | any]): boolean {
          const arrValue = property
            ? value
                .filter((entity) => !entity?.isDeleted)
                .map((e) => e[property])
            : value

          return arrayUnique(arrValue)
        },
      },
    })
  }
}

export const Max = (
  maxValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _Max(maxValue, {
    message:
      (options as ValidationOptions).message || ValidationMessage.isLessThan,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: maxValue } } },
    ),
  })

export const Min = (
  minValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _Min(minValue, {
    message:
      (options as ValidationOptions).message || ValidationMessage.isGreaterThan,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: minValue } } },
    ),
  })

export const MaxLength = (
  maxValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _MaxLength(maxValue, {
    message: ValidationMessage.maxLength,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: maxValue } } },
    ),
  })

export const MinLength = (
  minValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _MinLength(minValue, {
    message: ValidationMessage.minLength,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: minValue } } },
    ),
  })

export const IsEnum = (
  enumValue: object,
  options?: string | ValidationOptions,
): PropertyDecorator => {
  return _IsEnum(enumValue, {
    message: ValidationMessage.invalid,
    ...makeOption(options),
  })
}

export const IsLessOrEqual =
  (argument: any, validationOptions?: ValidationOptions): PropertyDecorator =>
  (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'LessOrEqual',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationMessage.isLessOrEqual.replace(
          '$argument',
          'something to less or equal',
        ),
      },
      validator: {
        validate(value: any, args: any) {
          const field2 = args.object[argument]

          return value <= field2
        },
      },
    })
  }

export const IsGreaterOrEqual =
  (
    targetOptions: {
      targetFieldName: any
      skipIfNull?: boolean
      skipIfTargetValueNull?: boolean
    },
    validationOptions?: ValidationOptions,
  ): PropertyDecorator =>
  (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'GreaterOrEqual',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationMessage.isGreaterOrEqual,
      },
      validator: {
        validate(value: any, args: any) {
          const { targetFieldName, skipIfNull, skipIfTargetValueNull } =
            targetOptions
          const targetValue = args.object[targetFieldName]

          if (
            (skipIfNull && value == undefined) ||
            (skipIfTargetValueNull && targetValue == undefined)
          ) {
            return true
          }

          return value >= targetValue
        },
      },
    })
  }

export const IsLaterWithDateOrTimeOnly =
  (
    startTimeField: any,
    skipIfNull?: boolean,
    validationOptions?: ValidationOptions,
  ): PropertyDecorator =>
  (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'Later',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationMessage.isLaterWithDateOrTimeOnly,
      },
      validator: {
        validate(value: any, args: any) {
          const startTimeValue = args.object[startTimeField]
          if (skipIfNull && value == undefined) {
            return true
          }

          return value >= startTimeValue
        },
      },
    })
  }

export const IsEarlierWithDateOrTimeOnly = (
  targetOptions: {
    targetField: any
    targetFieldName?: any
    skipIfTargetValueNull?: boolean
    skipIfNull?: boolean
  },
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  const { targetField, targetFieldName, skipIfNull, skipIfTargetValueNull } =
    targetOptions
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'Earlier',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationMessage.timeEarlierThanField.replace(
          '$field',
          targetFieldName ?? targetField,
        ),
      },
      validator: {
        validate(value: any, args: any) {
          const targetValue = args.object[targetField]
          if (
            (skipIfNull && value == undefined) ||
            (skipIfTargetValueNull && targetValue == undefined)
          ) {
            return true
          }

          return value < targetValue
        },
      },
    })
  }
}

export const IsLaterWithDateTimeConcat = (
  startDateField: any,
  startTimeField: any,
  endDateField: any,
  endTimeField: any,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'LaterWithDateConcat',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationMessage.isLaterWithDateOrTimeOnly,
      },
      validator: {
        validate(_value: any, args: any) {
          const startDateValue = args.object[startDateField]
          const endDateValue = args.object[endDateField]

          if (startDateValue < endDateValue) {
            return true
          }
          if (startDateValue > endDateValue) {
            return false
          }

          return args.object[startTimeField] <= args.object[endTimeField]
        },
      },
    })
  }
}

export const IsTimeString = (
  format: string,
  regex: RegExp,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return Matches(regex, {
    ...validationOptions,
    message: ValidationMessage.isTimeStringFormat.replace('$format', format),
  })
}

export const IsPhoneString = (
  regex: RegExp,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return Matches(regex, {
    ...validationOptions,
    message: ValidationMessage.validPhoneDigit,
  })
}

export const IsConstraintField = (
  fieldConstraint: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'ConstraintField',
      target: object.constructor,
      constraints: [fieldConstraint],
      options: {
        ...validationOptions,
        message: ValidationMessage.isNotEmpty.replace(
          '$field',
          fieldConstraint,
        ),
      },
      validator: {
        validate(_value: any, args: any) {
          return (
            args.object[fieldConstraint] &&
            args.object[fieldConstraint] !== null
          )
        },
      },
    })
  }
}

export const IsUntilCurrentTime = (
  fieldDateCompare?: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'UntilCurrentTime',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationMessage.untilCurrentTime,
      },
      validator: {
        validate(value: any, args: any) {
          const momentTimezone = moment().tz(AppConstant.locationMomentTimezone)
          const dateString = momentTimezone.format(
            ExportConstant.dateWithHyphenFormat,
          )
          const timeString = momentTimezone.format(ExportConstant.timeFormat)

          if (!fieldDateCompare) {
            const fieldDateValue = new Date(value).toISOString().split('T')[0]

            return fieldDateValue <= dateString
          }

          const fieldDateCompareValue = new Date(args.object[fieldDateCompare])
            .toISOString()
            .split('T')[0]

          if (fieldDateCompareValue < dateString) {
            return true
          }

          return value <= timeString
        },
      },
    })
  }
}

const makeOption = (
  options?: string | ValidationOptions,
): ValidationOptions | undefined => {
  return typeof options == 'string'
    ? {
        context: {
          name: options,
        },
      }
    : options
}

export const IsValidContentType =
  (contentTypes: string[], errorMessage: string): PropertyDecorator =>
  (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsValidContentType',
      target: object.constructor,
      constraints: [],
      options: {
        message: errorMessage,
      },
      validator: {
        validate(value: any): boolean {
          return !!contentTypes.find((f) => value === f)
        },
      },
    })
  }

export const IsHexColorString = (
  regex: RegExp,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return Matches(regex, {
    ...validationOptions,
    message: ValidationMessage.isHexColorStringFormat,
  })
}

export const IsJSON = (
  options?: string | ValidationOptions,
): PropertyDecorator => {
  return _IsJSON({
    ...makeOption(options),
    message: ValidationMessage.isJsonString,
  })
}

export const IsEmailMatchWith = (
  field: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'EmailMatchWith',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationMessage.emailMatchWith,
      },
      validator: {
        validate(value: any, args: any) {
          const data = args.object[field]

          return data && data === value
        },
      },
    })
  }
}
