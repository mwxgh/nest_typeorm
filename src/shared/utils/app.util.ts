import { AppConstant } from '@/constants'
import * as crypto from 'crypto'
import { ObjectType, StoreContextType } from '../interfaces'
import { AsyncRequestContext } from '@/modules/async-context-request'
import { isEmpty } from 'lodash'
import { v4 } from 'uuid'

export const replaceHiddenText = (
  text: string,
  numDigitsHidden = AppConstant.numDigitsHidden,
  characterHidden = AppConstant.characterHidden,
) => {
  const textReplaced = `${text}`.replace(
    // example : example => exam***
    new RegExp(`.{0,${numDigitsHidden}}$`),
    `${characterHidden.repeat(numDigitsHidden)}`,
  )

  if (
    typeof textReplaced === 'string' &&
    textReplaced.length >= AppConstant.maxCharacterLog
  ) {
    return (
      textReplaced.substring(0, AppConstant.maxCharacterLog) +
      `${characterHidden.repeat(numDigitsHidden)}...`
    )
  }

  return textReplaced
}

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

export const buildLogParameters = (params: ObjectType): ObjectType => {
  AppConstant.blackListField.forEach((item) => {
    if (params[item]) {
      params[item] = replaceHiddenText(params[item])
    }
  })

  return params
}

export const createStore = (
  req: any,
  asyncRequestContext: AsyncRequestContext,
): StoreContextType => {
  let store = asyncRequestContext.getRequestIdStore()

  if (isEmpty(store)) {
    const requestId = v4()

    const logContext: StoreContextType = {
      contextId: requestId,
      ip: req.headers['x-forwarded-for'] || req.ip,
      endpoint: req.raw?.url || req.originalUrl,
      device: req.headers['user-agent'],
      domain: req.hostname,
      userId: req.user?.id,
      method: req.method,
    }

    asyncRequestContext.set(logContext)
    store = logContext
  }

  return store
}
