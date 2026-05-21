import jwt from 'jsonwebtoken'
import { Types } from 'mongoose';
import { AppError } from './AppError';


interface IData {
  email: string;
  role: "User" | "Worker" | "Admin";
  fullName: string;
  userId: Types.ObjectId;
}
export const generateToken = (data: IData) => {

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new AppError(500, "Internal Server error")
  }
  const token = jwt.sign({
    email: data.email,
    role: data.role,
    fullName: data.fullName,
    userId: data.userId.toString(),
  }, JWT_SECRET, {
    expiresIn: "7d"
  });

  return token
}