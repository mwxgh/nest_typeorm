import { green, red, white, yellow } from 'cli-color'
import { PlatformTools } from 'typeorm/platform/PlatformTools'
import { format } from 'winston'

import { AppConstant } from '@/constants'
import { LoggerConstant } from '@/constants/logger.constant'
import { AsyncRequestContext } from '@/modules/async-context-request'
import config from '@/config/config'

export const loggerFormat = (asyncContext: AsyncRequestContext) =>
  format.printf(({ context, level, timestamp, message }): string => {
    let { contextId, endpoint, ip, device, domain, userId, method } =
      context || asyncContext.getRequestIdStore() || {}

    timestamp = `[${timestamp}]`
    let colorFunction

    switch (level) {
      case LoggerConstant.infoLevel:
        colorFunction = green

        break
      case LoggerConstant.fatalLevel:
      case LoggerConstant.errorLevel:
        colorFunction = red

        break

      case LoggerConstant.warnLevel:
      case LoggerConstant.debugLevel:
        colorFunction = yellow

        break
      default:
        colorFunction = white
        break
    }

    const environment = config().app.env

    if (![AppConstant.test, AppConstant.dev].includes(environment)) {
      colorFunction = (text: string) => text
    }

    level = colorFunction(`[${level.toUpperCase()}]`)
    domain = colorFunction(`[${domain}]`)
    userId = colorFunction(`[LoginID: ${userId}]`)
    ip = colorFunction(`[IP: ${ip}]`)
    endpoint = colorFunction(`[Endpoint: ${endpoint}]`)
    device = colorFunction(`[Device: ${device}]`)
    method = colorFunction(`[${method}]`)

    contextId = colorFunction(`[${contextId}]`)

    if (
      LoggerConstant.infoLevel == level &&
      message.startsWith(LoggerConstant.queryPrefix)
    ) {
      message = PlatformTools.highlightSql(message)
    }

    return `${timestamp} ${contextId} ${level} ${domain} ${userId} ${ip} ${method} ${endpoint} ${device} - ${message}`
  })
