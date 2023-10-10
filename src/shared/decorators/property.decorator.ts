import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

import { getVariableName } from '../utils';

export const ApiBooleanProperty = (
  options: Omit<ApiPropertyOptions, 'type'> = {},
): PropertyDecorator => {
  return ApiProperty({ type: Boolean, ...options });
};

export const ApiBooleanPropertyOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> = {},
): PropertyDecorator => {
  return ApiBooleanProperty({ required: false, ...options });
};

export const ApiUUIDProperty = (
  options: Omit<ApiPropertyOptions, 'type' | 'format'> &
    Partial<{ each: boolean }> = {},
): PropertyDecorator => {
  return ApiProperty({
    type: options.each ? [String] : String,
    format: 'uuid',
    isArray: options.each,
    ...options,
  });
};

export const ApiUUIDPropertyOptional = (
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'required'> &
    Partial<{ each: boolean }> = {},
): PropertyDecorator => {
  return ApiUUIDProperty({ required: false, ...options });
};

export const ApiEnumProperty = <TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type'> & { each?: boolean } = {},
): PropertyDecorator => {
  const enumValue = getEnum() as any;

  return ApiProperty({
    type: 'enum',
    // throw error during the compilation of swagger
    // isArray: options.each,
    enum: enumValue,
    enumName: getVariableName(getEnum),
    ...options,
  });
};

export const ApiEnumPropertyOptional = <TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & {
    each?: boolean;
  } = {},
): PropertyDecorator => {
  return ApiEnumProperty(getEnum, { required: false, ...options });
};
