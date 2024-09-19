import { NextFunction, Request, Response } from 'express'

export const formatterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalJson = res.json

  res.json = (data) => {
    let formattedResponse
    if (res.statusCode > 400) {
      formattedResponse = data
    } else {
      formattedResponse = {
        success: true,
        data: data,
      }
    }

    return originalJson.call(res, formattedResponse)
  }

  next()
}
