import { Request, Response } from 'express'

export const errorHandlerMiddleware = (
  err: Error & { statusCode: number },
  req: Request,
  res: Response
): void => {
  const statusCode = err.statusCode || 500
  const errorResponse = {
    success: false,
    data: {
      message: err.message || 'Internal Server Error',
    },
  }

  res.status(statusCode).json(errorResponse)
}
