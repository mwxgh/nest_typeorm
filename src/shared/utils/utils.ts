import * as moment from 'moment-timezone';

import { AppConstant, RegexConstant } from '@/constants';

export const getVariableName = <TResult>(getVar: () => TResult): string => {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts[memberParts.length - 1];
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  return array.reduce((acc, _, i) => {
    if (i % size === 0) {
      acc.push(array.slice(i, i + size));
    }
    return acc;
  }, [] as T[][]);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const createRandomValueCsv = (length: number): string => {
  const array: number[] = [];

  for (let i = 0; i < length; i++) {
    const randomValue = Math.floor(Math.random() * 100) + 1;
    array.push(randomValue);
  }

  return array.join(',');
};

export const getExampleCsvSwagger = (
  headers: { [k: string]: string },
  data?: string,
): string => {
  let exampleValue: string;
  const headerValue = Object.values(headers);

  const header = headerValue.join(',');
  if (data) {
    exampleValue = data;
  } else {
    exampleValue = createRandomValueCsv(headerValue.length);
  }

  return `${header}\n${exampleValue}`;
};

export const arraysAreEqual = <T>(array1: T[], array2: T[]): boolean => {
  if (array1.length !== array2.length) {
    return false;
  }

  return array1.every((element, index) => element === array2[index]);
};

export const getLastUserNumber = async (repository: any): Promise<number> => {
  const validUsernamePattern = `^[A-Z]{2}[0-9]{4}$`;
  const lastUsername = await repository
    .createQueryBuilder()
    .withDeleted()
    .select(`MAX(RIGHT(username, 4))`, 'lastFourChars')
    .where('username REGEXP :pattern', { pattern: `${validUsernamePattern}` })
    .getRawOne();
  const lastUserNumber = parseInt(lastUsername.lastFourChars);

  return isNaN(lastUserNumber) ? 0 : lastUserNumber;
};

export const generatePrefixedDateCode = (
  prefix: string,
  id: number,
): string => {
  const date = moment().tz(AppConstant.locationMomentTimezone).format('YYMMDD');
  return `${prefix}${date}${String(id).padStart(6, '0')}`;
};

export const generatePrefixedRandomCode = (
  prefix: string,
  id: number,
  length = 6,
): string => {
  const setOfNumbers = '0123456789';
  const randomNumberString = Array.from({ length }, () =>
    setOfNumbers.charAt(Math.floor(Math.random() * setOfNumbers.length)),
  ).join('');

  return `${prefix}${randomNumberString}${String(id).padStart(6, '0')}`;
};

export const isDateFormatWithoutTime = (dateString: string): boolean => {
  return RegexConstant.regexDateFormatWithoutTime.test(dateString);
};
