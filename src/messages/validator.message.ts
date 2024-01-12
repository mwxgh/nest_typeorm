export const ValidationMessage = {
  invalid: '$field has an invalid value',
  isInt: '$field must be an integer.',
  isNotEmpty: '$field must be input',
  isAlphaNumeric: '$field must be alphabets and numbers',
  isNumber: '$field must be a number',
  isPositive: '$field must be a positive number',
  isString: '$field must be a string',
  isArray: '$field must be an array',
  isNumberString: '$field must be a string of number',
  isBoolean: '$field must be a boolean',
  isDate: '$field must be a Date instance',
  isTime: '$field must be a Time instance',
  isTimeStringFormat: '$field must be a time string format',
  isEmail: '$field must be an email',
  isJsonString: '$field must be a json string',
  arrayMaxSize: '$field must contain not more than $1 elements',
  arrayMinSize: '$field must contain at least $1 elements',
  arrayUnique: '$field must contain element unique',
  isHexColorStringFormat: '$field must be hex color format',
  isInvalidDataWithStatus:
    'There are some invalid data with user retirement status',
  isLessOrEqual: '$field must be less than or equal $argument',
  isGreaterOrEqual: '$field must be greater than or equal $argument',
  isLessThan: '$field must be less than $1',
  isGreaterThan: '$field must be greater than $1',
  passwordRule:
    'Please use at least 10 characters, including uppercase letters, lowercase letters, numbers, and symbols.',
  maxLength: 'MaxLength',
  phoneRule: 'Only half-width numbers and $1~$2 numbers can be used.',
  minLength: 'MinLength',
  isLaterWithDateOrTimeOnly: 'Cannot enter a time before the start time',
  timeEarlierThanField: 'Please enter a date earlier than $field',
  validPhoneDigit: 'ValidPhoneDigit',
  untilCurrentTime: 'Input is possible up to the current time',
  maxUploadFile: 'Only 10 file upload buttons are available',
  emailMatchWith: 'Does not match the email address entered',
}
