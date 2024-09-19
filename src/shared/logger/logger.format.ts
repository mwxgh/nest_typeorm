import { green, red, white, yellow } from 'cli-color'
import { PlatformTools } from 'typeorm/platform/PlatformTools'
import { format } from 'winston'

import { AppConstant } from '@/constants'
import { LoggerConstant } from '@/constants/logger.constant'
import { AsyncRequestContext } from '@/modules/async-context-request'
import config from '@/config/config'

export const loggerFormat = (asyncContext: AsyncRequestContext) =>
  format.printf(({ context, level, timestamp, message }): string => {
    // Get context information
    const {
      contextId = 'N/A',
      endpoint = 'N/A',
      ip = 'N/A',
      device = 'N/A',
      domain = 'N/A',
      userId = 'N/A',
      method = 'N/A',
    } = context || asyncContext.getRequestIdStore() || {}

    // Define color functions based on log level
    const colorForLevel =
      {
        [LoggerConstant.infoLevel]: green,
        [LoggerConstant.fatalLevel]: red,
        [LoggerConstant.errorLevel]: red,
        [LoggerConstant.warnLevel]: yellow,
        [LoggerConstant.debugLevel]: yellow,
      }[level] || white

    // Determine if colors should be applied based on the environment
    const environment = config().app.env
    const applyColor =
      environment === AppConstant.test || environment === AppConstant.dev
        ? (text: string) => colorForLevel(text)
        : (text: string) => text

    // Format the level and context
    const formatWithColor = (text: string) => applyColor(`[${text}]`)
    const formattedLevel = formatWithColor(level.toUpperCase())
    const formattedContext = {
      contextId: formatWithColor(contextId),
      domain: formatWithColor(domain),
      userId: formatWithColor(`LoginID: ${userId}`),
      ip: formatWithColor(`IP: ${ip}`),
      endpoint: formatWithColor(`Endpoint: ${endpoint}`),
      device: formatWithColor(`Device: ${device}`),
      method: formatWithColor(method),
    }

    // Highlight SQL queries
    const formattedMessage =
      level === LoggerConstant.infoLevel &&
      message.startsWith(LoggerConstant.queryPrefix)
        ? PlatformTools.highlightSql(message)
        : message

    // Return formatted log message
    return `[${timestamp}] ${formattedContext.contextId} ${formattedLevel} ${formattedContext.domain} ${formattedContext.userId} ${formattedContext.ip} ${formattedContext.method} ${formattedContext.endpoint} ${formattedContext.device} - ${formattedMessage}`
  })
