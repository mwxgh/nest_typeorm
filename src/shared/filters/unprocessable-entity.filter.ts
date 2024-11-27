import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus, UnprocessableEntityException } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import type { FastifyReply } from 'fastify'
import { isEmpty } from 'lodash'
import { Attributes, ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '../interfaces'

type IndexedValidationError = {
  index?: number
} & ValidationError

type EntityName = keyof typeof Attributes

@Catch(UnprocessableEntityException)
export class UnprocessableFilter
  implements ExceptionFilter<UnprocessableEntityException> {
  constructor(private readonly filterParam: ExceptionFilterType) { }

  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam

    const statusCode = HttpStatus.UNPROCESSABLE_ENTITY
    logger.error(
      ErrorMessage[statusCode],
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<FastifyReply>()
    asyncRequestContext.exit()

    const res = exception.getResponse() as {
      message: ValidationError[]
      error: string
    }

    const validationErrors = res.message
    const messages = this.validationFilter(validationErrors)

    return response.code(statusCode).send({
      statusCode,
      message: ErrorMessage[statusCode],
      details: messages,
    })
  }

  private validationFilter(validationErrors: IndexedValidationError[]): any {
    return validationErrors.map((error) => {
      const { property, constraints, contexts, children, target, index } = error

      if (!constraints && children && !isEmpty(children)) {
        return {
          index,
          property,
          message: this.validationFilter(children),
        }
      }

      const { message } = this.buildErrorMessage(
        property,
        constraints as Record<string, string>,
        contexts,
        target ?? {},
      )

      return {
        index,
        property,
        message,
      }
    })
  }

  private buildErrorMessage(
    property: string,
    constraints: Record<string, string>,
    contexts: any,
    target: object,
  ) {
    const key = Object.keys(constraints)[0]
    const attribute = this.getAttributeName(property, target)
    const message = this.formatErrorMessage(
      constraints[key],
      attribute,
      contexts?.[key]?.value,
    )

    return { key, message }
  }

  private getAttributeName(property: string, target: object) {
    const entityName = (target?.constructor as any)?.entity as EntityName
    const attributes = Attributes[entityName]

    return (attributes as any)?.[property] || property
  }

  private formatErrorMessage(message: string, attribute: string, $1: any) {
    let formattedMessage = message.replace('$field', attribute)
    // TODO : refactor this if message has more than one $1
    if ($1) {
      formattedMessage = formattedMessage.replace('$1', `${$1}`)
    }

    return formattedMessage
  }
}
