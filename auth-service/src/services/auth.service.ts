import { Otp } from "../models/otp.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/generateToken";
import { findUser } from "../utils/findUser";
import { checkUserExists } from "../utils/checkUserExists";
import { SignupType, LoginType } from "../schemas/user.schema"


interface ISignUpData {
  fullName: string;
  email: string;
  password: string;
  role: "User" | "Worker" | "Admin",
  otp: string;
}
interface ILoginData {
  email: string;
  password: string;
}

export const signUpService = async (data: SignupType) => {
  const { fullName, email, password, role, otp } = data;

  // check is user allreday registerd or not
  const isUserRegistered = await checkUserExists({ email }, 'Email allready registered', 409)

  // find latest otp
  const latestOtp = await Otp.findOne({ email: email }).sort({ createdAt: -1 })

  // verify
  if (!latestOtp) {
    throw new AppError(404, "Otp not found");
  }
  if (latestOtp.otp !== otp) {
    throw new AppError(422, "Otp not matched");
  }
  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create new user
  const newUser = await User.create({
    email: email,
    password: hashedPassword,
    role: role,
    fullName: fullName,
  })

  const paylod = {
    email: email,
    role: role,
    fullName: fullName,
    userId: newUser._id,
  }
  // Token generated
  const token = generateToken(paylod)

  const userObj: any = newUser.toObject();
  userObj.token = token;
  delete userObj.password
  return userObj;

}


export const loginService = async (data: LoginType) => {
  const { email, password } = data;

  // check is this email registerd or not
  const isUserExist = await findUser({ email }, 'Email not registered')

  const isMatched = await bcrypt.compare(password, isUserExist.password)
  if (!isMatched) {
    throw new AppError(422, "Password not matched");
  }

  // generate token
  const paylod = {
    email: email,
    role: isUserExist.role,
    fullName: isUserExist.fullName,
    userId: isUserExist._id,
  }

  const token = generateToken(paylod)

  const userObj: any = isUserExist.toObject();
  userObj.token = token;
  delete userObj.password
  return userObj;
}