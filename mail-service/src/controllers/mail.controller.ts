import express, { NextFunction, Request, Response } from "express";
import { MailSchemas } from "../schemas/mail.schema";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../types/apiResponse.types";
import { sendMailService } from "../services/mail.services";
export interface IMailData {
  email: string;
  subject: string;
  body: string;
  from: string;
}
export const sendMailController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = MailSchemas.safeParse(req.body)

    if (!result.success) {
      return next(
        new AppError(
          400,
          "Validation failed",
          result.error.flatten().fieldErrors
        )
      );
    }
    const { email, subject, body, from } = req.body




    const mailSend = await sendMailService({
      email, subject, body, from
    })



    res.status(201).json({
      success: true,
      message: "otp send successfully",
    } as ApiResponse<null>)

  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    })

  }
}