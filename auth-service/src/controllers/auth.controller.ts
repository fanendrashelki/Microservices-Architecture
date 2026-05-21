import { NextFunction, Request, Response } from "express"
import { forgotPasswordSchema, LoginSchema, resetPasswordSchema, SignupSchema, updatePasswordSchema, UserSchemas, VerifyOtpSchema, UserType, sendEmailSchema } from "../schemas/user.schema";
import { sendEmailService } from "../services/otp.service";
import { ApiResponse } from "../types/apiResponse.types";
import { AppError } from "../utils/AppError";
import { loginService, signUpService } from "../services/auth.service";
import { forgortPasswordVerifyOtpService, forgotPasswordService, resetPasswordService, updatePasswordService } from "../services/password.service";
import z, { treeifyError } from "zod";





export const sendEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const result = UserSchemas.safeParse(req.body)
    const result = sendEmailSchema.safeParse(req.body)
    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error)
      return next(
        new AppError(
          400,
          "Validation failed",
          formattedErrors
        )
      );
    }
    const { email } = req.body;

    const newotp = await sendEmailService({ email })


    res.status(201).json({
      success: true,
      message: "otp send successfully",
      data: newotp
    } as ApiResponse<typeof newotp>)

  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    })

  }
}

export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = SignupSchema.safeParse(req.body)

    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error)
      return next(
        new AppError(
          400,
          "Validation failed",
          formattedErrors
        )
      );
    }
    // fetch data
    const { fullName, email, password, role, otp } = req.body;
    // call signup service
    const newUser = await signUpService({ fullName, email, password, role, otp });


    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }

    res.cookie("token", newUser.token, options).status(201).json({
      success: true,
      message: "signup successfully",
      data: newUser
    } as ApiResponse<typeof newUser>)

  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    })
  }
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = LoginSchema.safeParse(req.body)
    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error)
      return next(
        new AppError(
          400,
          "Validation failed",
          formattedErrors
        )
      );
    }
    const { email, password } = req.body;

    // call Login serrvice 
    const loginServiceCall = await loginService({ email, password })

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }
    // return response
    res.cookie("token", loginServiceCall.token, options).status(200).json({
      success: true,
      message: "Login Successfully",
      data: loginServiceCall,
    } as ApiResponse<typeof loginServiceCall>)

  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    })
  }
}

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = forgotPasswordSchema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error)
      return next(new AppError(400, 'Validation failed', formattedErrors))
    }

    const { email } = req.body;
    // call Services
    const forgotPasswordServiceCall = await forgotPasswordService({ email })


    // return response
    res.status(201).json({
      success: true,
      message: "Otp send successfully for forgot password",
      data: forgotPasswordServiceCall,
    } as ApiResponse<typeof forgotPasswordServiceCall>)

  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server error",
    })
  }
}

export const forgorPasswordVerifyOtpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = VerifyOtpSchema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error)
      return next(new AppError(400, 'Validation failed', formattedErrors))
    }
    const { email, otp } = req.body
    // call Services
    const updateUser = await forgortPasswordVerifyOtpService({ email, otp });

    // return response
    res.status(200).json({
      success: true,
      message: "Otp verified successfully",
      data: updateUser,
    } as ApiResponse<typeof updateUser>)

  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server error",
    })
  }
}


export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = resetPasswordSchema.safeParse(req.body)

    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error)

      return next(new AppError(400, 'Validation failed', formattedErrors))
    }
    const { resetToken, password, confirmPassword } = req.body;
    // call the reset password service
    const resetPasswordServiceCall = await resetPasswordService({ resetToken, password });

    // return response
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    } as ApiResponse<null>)
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server error",
    })
  }
}

export const updatePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = updatePasswordSchema.safeParse(req.body)

    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error)
      return next(new AppError(404, "Validation error", formattedErrors))
    }
    // fetch data
    const { userId, password, oldPassword, confirmPassword } = req.body;
    // call the service
    const updatePasswordServiceCall = await updatePasswordService({ userId, password, oldPassword });

    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
      data: updatePasswordServiceCall,
    } as ApiResponse<typeof updatePasswordServiceCall>)

  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server error",
    })
  }
}