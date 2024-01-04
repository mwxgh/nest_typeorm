/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transform } from 'class-transformer'

export const Default = (defaultValue: any) =>
  Transform(
    ({ value }) =>
      value === null || value === undefined ? defaultValue : value,
    {
      toClassOnly: true,
    },
  )
