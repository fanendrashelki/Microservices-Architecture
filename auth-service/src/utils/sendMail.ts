import axios from 'axios'
import { AppError } from './AppError'

interface IMailData {
  email: string
  subject: string
  body: string
  from?: string
}

export const sendMail = async (data: IMailData) => {
  const EMAIL_HOST = process.env.EMAIL_HOST
  if (!EMAIL_HOST) {
    throw new AppError(500, 'EMAIL_HOST is missing')
  }
  try {
    const response = await axios.post(EMAIL_HOST, data)
  } catch (error) {
    throw new AppError(500, 'Failed to send email')
  }

}