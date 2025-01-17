import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().max(20),
    avatar: z.string().optional()
   
  }),
});

export default {
  userValidationSchema,
};
