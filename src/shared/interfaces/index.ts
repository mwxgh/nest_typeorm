import { ExportConstant } from '@/constants'
import type { AsyncRequestContext } from '@/modules/async-context-request'
import type { Logger } from 'winston'

export type ExceptionFilterType = {
  asyncRequestContext: AsyncRequestContext
  logger: Logger
}

export type UserProp = {
  id: number
  role: number
}

export type IAttachment = {
  filename: string
  content?: any
  path?: string
  contentType?: string
  cid?: string
  encoding?: string
  contentDisposition?: 'attachment' | 'inline' | undefined
  href?: string
}

export type ObjectType = { [key: string]: any }

export type ExportHeaderType<T> = Partial<{ [K in keyof T]: string }>

export type ExportType<T> = {
  entities: T[]
  headers?: ExportHeaderType<T>
  encoding?: typeof ExportConstant.defaultFormatCsv | typeof ExportConstant.UTF8
}

export type StoreContextType = {
  contextId: string | undefined
  ip: string | undefined
  endpoint: string | undefined
  device: string | undefined
  domain: string | undefined
  userId?: number | undefined
  method?: string | undefined
}

export type ItemDeletedType = {
  message: string
  customCode?: number
}

export type SendMailType = {
  email: string
  data: object
  attachments?: IAttachment[]
}
