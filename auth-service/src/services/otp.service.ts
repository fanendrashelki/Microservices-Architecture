
import otpGenerator from 'otp-generator'
import { Otp } from "../models/otp.model";
import { sendMailTemplate } from "../templetes/otp.template";
import { sendMail } from '../utils/sendMail';
import { checkUserExists } from '../utils/checkUserExists';
import { EmailType } from "../schemas/user.schema"


export const sendEmailService = async (data: EmailType) => {
  const { email } = data

  // check is user allreday registerd or not
  const existingUser = await checkUserExists({ email }, 'Email already registered ', 409)

  // generate OTP
  const newOtp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  })

  // Save otp in DB

  const otpDoc = await Otp.create({
    email: email,
    otp: newOtp
  })

  const mailData = {
    email: email,
    subject: "for otp verification",
    body: sendMailTemplate(Number(newOtp)),
    from: "Servora"
  }


  const mail = sendMail(mailData)

  return otpDoc;

}