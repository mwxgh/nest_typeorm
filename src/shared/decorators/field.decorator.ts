/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators } from '@nestjs/common'
import type { ApiPropertyOptions } from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import * as moment from 'moment'
import { RegexConstant } from '@/constants'
import { ApiEnumProperty, ApiUUIDProperty } from './property.decorator'
import {
  PhoneNumberSerializer,
  ToArray,
  ToBoolean,
  ToLowerCase,
  ToUpperCase,
} from './transform.decorator'
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsNullable,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsTimeString,
  IsUndefinable,
  IsValidContentType,
  Max,
  MaxLength,
  Min,
  MinLength,
} from './validator.decorator'

type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>

type IFieldOptions = {
  each?: boolean
  swagger?: boolean
  nullable?: boolean
  groups?: string[]
  message?: string | undefined
}

type INumberFieldOptions = {
  min?: number
  max?: number
  int?: boolean
  isPositive?: boolean
} & IFieldOptions

type IStringFieldOptions = {
  minLength?: number
  maxLength?: number
  toLowerCase?: boolean
  toUpperCase?: boolean
  messageIsNotEmpty?: string
} & IFieldOptions

type IArrayFieldOptions = {
  minSize?: number
  maxSize?: number
  arrayUnique?: string
} & IFieldOptions

type IBooleanFieldOptions = IFieldOptions
type IEnumFieldOptions = IFieldOptions

export const NumberField = (
  options: Omit<ApiPropertyOptions, 'type'> &
    INumberFieldOptions &
    IArrayFieldOptions = {},
): PropertyDecorator => {
  const decorators = [Type(() => Number)]

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }))
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Number, ...options }))
  }

  if (options.each) {
    decorators.push(IsArray())

    if (options.minSize) {
      decorators.push(ArrayMinSize(options.minSize))
    }

    if (options.maxSize) {
      decorators.push(ArrayMaxSize(options.maxSize))
    }
  }

  if (options.int) {
    /**
     * Use int = true when you specifically require an integer value.
     */
    decorators.push(IsInt({ each: options.each }))
  } else {
    /**
     * Use int = false when you need to accept both integer and floating-point numbers.
     */
    decorators.push(IsNumber({ each: options.each }))
  }

  if (typeof options.min === 'number') {
    decorators.push(
      Min(options.min, {
        message: options.message || `$field must be greater than $1`,
        each: options.each,
      }),
    )
  }

  if (typeof options.max === 'number') {
    decorators.push(
      Max(options.max, {
        message: options.message || `$field must be less than $1`,
        each: options.each,
      }),
    )
  }

  if (options.isPositive) {
    decorators.push(
      IsPositive({
        message: 'enter an unsigned integer',
        each: options.each,
      }),
    )
  }

  return applyDecorators(...decorators)
}

export const NumberFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    INumberFieldOptions &
    IArrayFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    NumberField({ required: false, nullable: true, ...options }),
  )
}

export const StringField = (
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator => {
  const decorators = [Type(() => String)]

  if (options.nullable) {
    decorators.push(
      IsNullable({ each: options.each }),
      IsOptional({ each: options.each }),
    )
  } else {
    const option = { each: options.each }

    if (options.messageIsNotEmpty) {
      Object.assign(option, { message: options.messageIsNotEmpty })
    }

    decorators.push(IsNotEmpty(option))
  }

  decorators.push(IsString({ each: options.each }))

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    )
  }

  if (options.minLength) {
    decorators.push(MinLength(options.minLength, { each: options.each }))
  }

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }))
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase())
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase())
  }

  return applyDecorators(...decorators)
}

export const StringFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    StringField({ required: false, nullable: true, ...options }),
  )
}

export const PasswordField = (
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  const decorators = [StringField({ ...options, minLength: 6 }), IsNotEmpty()]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  return applyDecorators(...decorators)
}

export const PasswordFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    PasswordField({ required: false, ...options }),
  )
}

export const BooleanField = (
  options: Omit<ApiPropertyOptions, 'type'> & IBooleanFieldOptions = {},
): PropertyDecorator => {
  const decorators = [IsNotEmpty(), ToBoolean(), IsBoolean()]

  if (options.nullable) {
    decorators.push(
      IsNullable({ each: options.each }),
      IsOptional({ each: options.each }),
    )
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }))
  }

  return applyDecorators(...decorators)
}

export const BooleanFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IBooleanFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    BooleanField({ required: false, ...options, nullable: true }),
  )
}

export const EnumField = <TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName' | 'isArray'> &
    IEnumFieldOptions = {},
): PropertyDecorator => {
  const enumValue = getEnum()
  const decorators = [IsNotEmpty(), IsEnum(enumValue, { each: options.each })]

  if (options.nullable) {
    decorators.push(
      IsNullable({ each: options.each }),
      IsOptional({ each: options.each }),
    )
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.each) {
    decorators.push(ToArray())
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiEnumProperty(getEnum, { ...options, isArray: options.each }),
    )
  }

  return applyDecorators(...decorators)
}

export const ClassField = (
  options: RequireField<ApiPropertyOptions, 'type'> & IArrayFieldOptions,
): PropertyDecorator => {
  const decorators: Array<PropertyDecorator> = [
    ValidateNested({ each: options.each }),
    Type(options.type as any),
    options.arrayUnique ? ArrayUnique(options.arrayUnique) : undefined,
    options.isArray ? IsArray() : undefined,
    options.minSize ? ArrayMinSize(options.minSize) : undefined,
    options.maxSize ? ArrayMaxSize(options.maxSize) : undefined,
    ...(options.nullable
      ? [IsNullable(), IsOptional()]
      : [IsNotEmpty({ each: options.each })]),
    options.required ? IsDefined() : undefined,
    options.swagger !== false
      ? ApiProperty({ isArray: true, ...options })
      : undefined,
  ].filter(Boolean) as Array<PropertyDecorator>

  return applyDecorators(...decorators)
}

export const EnumFieldOptional = <TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
    IEnumFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    EnumField(getEnum, { required: false, ...options, nullable: true }),
  )
}

export const ClassFieldOptional = (
  options: RequireField<ApiPropertyOptions, 'type'> & IArrayFieldOptions,
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    ClassField({ required: false, ...options }),
  )
}

export const EmailField = (
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    StringField({ toLowerCase: true, ...options }),
    IsEmail({}, { message: 'Please enter a valid email address' }),
  )
}

export const EmailFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    EmailField({ required: false, nullable: true, ...options }),
  )
}

export const PhoneField = (
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    IsNotEmpty(),
    IsPhoneNumber({ region: 'JP' }),
    PhoneNumberSerializer(),
  ]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }))
  }

  return applyDecorators(...decorators)
}

export const PhoneFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    PhoneField({ required: false, ...options }),
  )
}

export const UUIDField = (
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    Type(() => String),
    IsNotEmpty(),
    IsUUID('4', { each: options.each }),
  ]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiUUIDProperty(options))
  }

  if (options.each) {
    decorators.push(ToArray())
  }

  return applyDecorators(...decorators)
}

export const UUIDFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    UUIDField({ required: false, ...options }),
  )
}

export const URLField = (
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    IsNotEmpty(),
    StringField(options),
    IsUrl({}, { each: true }),
  ]

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }))
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  return applyDecorators(...decorators)
}

export const URLFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    URLField({ required: false, ...options }),
  )
}

export const DateField = (
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [Type(() => Date)]

  if (options.nullable) {
    decorators.push(IsNullable(), IsOptional({ each: options.each }))
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Date, ...options }))
  }

  decorators.push(
    IsDate(options),
    Transform(({ value }) => value && new Date(value)),
  )

  return applyDecorators(...decorators)
}

export const DateFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    DateField({ ...options, required: false, nullable: true }),
  )
}

export type Time = `${number}:${number}`

export const TimeField = (
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    Type(() => String),
    IsNotEmpty(),
    IsTimeString('HH:mm', RegexConstant.timeFormatHHmm),
  ]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: 'hh:mm', ...options }))
  }

  decorators.push(
    Transform(
      (value) => value && moment(`2000-01-01 ${value}`).format('HH:mm:ss'),
    ),
  )

  return applyDecorators(...decorators)
}

export const TimeFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    TimeField({ ...options, required: false }),
  )
}

export const ContentTypeField = (
  contentType: string[],
  errorMessage: string,
): PropertyDecorator => {
  return applyDecorators(IsValidContentType(contentType, errorMessage))
}

export const JSONField = (
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = []

  if (options.nullable) {
    decorators.push(IsNullable(), IsOptional({ each: options.each }))
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: 'string', ...options }))
  }

  decorators.push(IsJSON(options))

  return applyDecorators(...decorators)
}

export const JSONFieldOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    JSONField({ ...options, required: false, nullable: true }),
  )
}
