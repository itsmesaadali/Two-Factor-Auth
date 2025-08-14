import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../common/utils/AppError";
import {z} from "zod";
import { REFRESH_PATH } from "../common/utils/cookie";
import { clearAuthenticationCookies } from "../common/utils/date-time";

const formatZodError = (res:Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) =>({
    field: err.path.join('.'),
    message:err.message
  }));

  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    messag:'Validation failed',  
    errors:errors,
  })
}

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  console.error(`Error occured on PATH: ${req.path}`, error);

  if(req.path === REFRESH_PATH) {
    clearAuthenticationCookies(res)
  }

  if(error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message:'Invalid JSON format, please check request body'
    })
  }

  if(error instanceof z.ZodError) {
    return formatZodError(res,error)
  }

  if(error instanceof AppError) {
    return res.status(error.statusCode).json({
        message:error.message,
        errorCode: error.errorCode
    })
  }
  

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message:'Internal Server ',
    error: error?.message || 'Unknown error occured '
  })
};
