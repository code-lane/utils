import winston, { Logger } from 'winston'
import { Format } from 'logform'
import safeJsonStringify from 'safe-json-stringify'
import { omit, isEmpty } from 'lodash'

const multiLineJsonArguments = winston.format.printf((info) => {
  const other = omit(info, ['timestamp', 'label', 'level', 'message', '_inlineMeta'])
  const inline = info._inlineMeta || info.meta?._inlineMeta

  return `${info.timestamp} [${info.label}] ${info.level} ${info.message} ${
    !isEmpty(other) ? `: ${safeJsonStringify(other, undefined, inline ? undefined : 2)}` : ''
  }`
})

const format = winston.format.combine(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ...({
    true: [winston.format.splat(), winston.format.timestamp(), winston.format.json()],
    false: [
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.timestamp(),
      multiLineJsonArguments
    ]
  } as { [key: string]: Format[] })[
    String(process.env.LOGGER_IS_JSON ? process.env.LOGGER_IS_JSON : false)
  ]
)

export const createLogger = (label = 'app'): Logger => {
  if (!winston.loggers.has(label)) {
    const level = String(
      process.env[`LOGGER_${label}_LEVEL`] ??
        process.env[`LOGGER_${label.toUpperCase()}_LEVEL`] ??
        process.env.LOGGER_LEVEL
    )
    if (!winston.config.npm.levels[level]) {
      throw new Error(
        `Invalid log level "${level}" from "LOGGER_${label}_LEVEL" or "LOGGER_${label.toUpperCase()}_LEVEL" env. variable`
      )
    }
    winston.loggers.add(label, {
      level: level,
      format: format,
      defaultMeta: {
        label
      },
      transports: [new winston.transports.Console()]
    })
  }
  return winston.loggers.get(label)
}

export default createLogger('app')
