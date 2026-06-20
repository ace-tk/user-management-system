import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  
  email: z.string().email('Invalid email address format'),
  
  primaryMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Primary mobile must be a valid 10-digit Indian mobile number'),
    
  secondaryMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Secondary mobile must be a valid 10-digit Indian mobile number')
    .optional(),
  
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format. Example: ABCDE1234F'),
  
  dateOfBirth: z.coerce.date().refine((date) => date < new Date(), {
    message: 'Date of birth must be in the past',
  }),
  
  placeOfBirth: z.string().optional(),
  
  currentAddress: z.string().min(10, 'Current address must be at least 10 characters long'),
  
  permanentAddress: z.string().min(10, 'Permanent address must be at least 10 characters long'),
});

export const updateUserSchema = createUserSchema.partial();
