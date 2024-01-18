import * as crypto from 'crypto'

export const generatePassword = (): string => {
  const length = 8
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numericChars = '0123456789'
  const specialChars = '!@#$%^&*()'

  let password = ''

  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
  password += numericChars[Math.floor(Math.random() * numericChars.length)]
  password += specialChars[Math.floor(Math.random() * specialChars.length)]

  const remainingLength = length - 4

  const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars
  for (let i = 0; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  password = password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')

  return password
}

export const hashMD5 = (data: string): string =>
  crypto.createHash('md5').update(data).digest('hex')

export const promiseAllConcurrency = async <T>(
  collection: Array<() => Promise<T>>,
  concurrency = 3,
): Promise<T[]> => {
  const head = collection.slice(0, concurrency)
  const tail = collection.slice(concurrency)
  const result: T[] = []
  const errors: any[] = []
  const execute = async (
    promise: () => Promise<T>,
    i: number,
    next: () => Promise<void>,
  ) => {
    try {
      result[i] = await promise()
      if (!errors.length) {
        await next()
      }
    } catch (error) {
      errors.push(error)
    }
  }
  const runNext = async () => {
    const i = collection.length - tail.length
    const promise = tail.shift()
    if (promise !== undefined) {
      await execute(promise, i, runNext)
    }
  }
  await Promise.all(head.map((promise, i) => execute(promise, i, runNext)))

  if (errors.length) {
    throw errors[0]
  }
  return result
}
