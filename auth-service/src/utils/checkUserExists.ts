import { User } from '../models/user.model'
import { AppError } from './AppError'

export const checkUserExists = async (
  query: object,
  message = 'User already exists',
  statusCode = 409
) => {

  const user = await User.findOne(query)

  if (user) {
    throw new AppError(statusCode, message)
  }
}