import { Otp } from "../models/otp.model";
import { sendMailTemplate } from "../templetes/otp.template";
import { findUser } from "../utils/findUser";
import otpGenerator from 'otp-generator'
import { sendMail } from "../utils/sendMail";
import { AppError } from "../utils/AppError";
import crypto from 'crypto'
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { passwordResetTemplate } from "../templetes/passwordReset.template";
import { passwordUpdateTemplate } from "../templetes/passwordUpdate.template";
import { ForgotPasswordType, verifyOtpType, ResetPasswordType, UpdatePasswordType } from "../schemas/user.schema"

export const forgotPasswordService = async (data: ForgotPasswordType) => {
  const { email } = data;

  // check user exists or not
  const isUserExist = await findUser({ email }, 'Email not registerd', 409)

  // generate new otp
  const otp = await otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // Save otp in DB
  const newOtp = await Otp.create({
    otp: otp,
    email: email,
  });

  const mailData = {
    email: email,
    subject: "for otp verification",
    body: sendMailTemplate(Number(otp)),
    from: "Servora"
  }
  const mail = sendMail(mailData);

  return newOtp;
}

export const forgortPasswordVerifyOtpService = async (data: verifyOtpType) => {
  const { email, otp } = data;

  const latestOtp = await Otp.findOne({ email: email }).sort({ createdAt: -1 });

  // validation
  if (!latestOtp) {
    throw new AppError(404, "Otp not found or expired")
  }

  if (latestOtp.otp !== otp) {
    throw new AppError(422, "Otp not matched");
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  const userUpdate = await User.findOneAndUpdate({ email: email }, {
    resetToken: resetToken, resetTokenExpiry: Date.now() + 10 * 60 * 1000
  }, { returnDocument: 'after' }).select('-password')

  return userUpdate;
}

export const resetPasswordService = async (data: ResetPasswordType) => {
  const { resetToken, password } = data;

  // find the user with the help of token
  const userDetails = await User.findOne({ resetToken: resetToken });

  // validation
  if (!userDetails) {
    throw new AppError(404, "Session expired");
  }

  if (userDetails.resetTokenExpiry < String(Date.now())) {
    throw new AppError(400, "Session expired");
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // update the user
  const updatedUser = await User.findOneAndUpdate({ resetToken: resetToken }, {
    password: hashedPassword,
    resetToken: "",
    resetTokenExpiry: ""
  }, { returnDocument: "after" });

  const mailData = {
    email: userDetails.email,
    subject: "Password Reset Successfully – Account Secured",
    body: passwordResetTemplate(userDetails.fullName, userDetails.email),
    from: "Servora"
  }
  const mail = sendMail(mailData);
  return updatedUser;
}


export const updatePasswordService = async (data: UpdatePasswordType) => {
  const { userId, password, oldPassword } = data;
  // check user exists or not
  const userDetails = await findUser({ _id: userId }, 'User not found', 404)

  // match old password
  const isOldPasswordMatched = await bcrypt.compare(oldPassword, userDetails.password);

  if (!isOldPasswordMatched) {
    throw new AppError(422, "Old password not matched")
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // update the user password
  const UpdateUser = await User.findByIdAndUpdate(userId, {
    password: hashedPassword
  }, { returnDocument: "after" }).select('-password')

  const mailData = {
    email: userDetails.email,
    subject: "Password Reset Successfully – Servora Account Secured",
    body: passwordUpdateTemplate(userDetails.fullName, userDetails.email),
    from: "Servora"
  }

  const mail = sendMail(mailData);
}