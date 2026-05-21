import { User } from '../models/user.model'
import { AppError } from './AppError'

export const findUser = async (
  query: object,
  message = 'User not found',
  statusCode = 404
) => {

  const user = await User.findOne(query)

  if (!user) {
    throw new AppError(statusCode, message)
  }

  return user
}