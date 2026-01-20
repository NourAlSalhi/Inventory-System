import { Response } from "express";

export const success = <T>(
  res: Response,
  data: T,
  message = "Success"
) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const failure = (
  res: Response,
  message: string,
  status = 400,
  error?: any
) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};
