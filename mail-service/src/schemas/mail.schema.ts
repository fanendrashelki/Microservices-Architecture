import { z } from 'zod'

export const MailSchemas = z.object({
  email: z.email('Invalid Email'),
  subject: z.string().min(5),
  body: z.string(),
  from: z.string()
})


export type Mail = z.infer<typeof MailSchemas>