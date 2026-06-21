import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '../services/userService';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address format'),
  primaryMobile: z.string().regex(/^[6-9]\d{9}$/, 'Primary mobile must be a valid 10-digit Indian mobile number'),
  secondaryMobile: z.string().regex(/^[6-9]\d{9}$/, 'Secondary mobile must be a valid 10-digit Indian mobile number').optional().or(z.literal('')),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format. Example: ABCDE1234F'),
  dateOfBirth: z.string().refine((date) => date !== '' && new Date(date) < new Date(), {
    message: 'Date of birth must be a valid past date',
  }),
  placeOfBirth: z.string().optional().or(z.literal('')),
  currentAddress: z.string().min(10, 'Current address must be at least 10 characters long'),
  permanentAddress: z.string().min(10, 'Permanent address must be at least 10 characters long'),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: UserFormValues & { id?: string };
  onSuccess?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      primaryMobile: '',
      secondaryMobile: '',
      aadhaar: '',
      pan: '',
      dateOfBirth: '',
      placeOfBirth: '',
      currentAddress: '',
      permanentAddress: '',
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      // Clean up empty optional fields before sending to API
      const payload: any = { ...data };
      if (!payload.secondaryMobile) delete payload.secondaryMobile;
      if (!payload.placeOfBirth) delete payload.placeOfBirth;

      if (initialData?.id) {
        await userService.updateUser(initialData.id, payload);
      } else {
        await userService.createUser(payload);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      // Handle standard error message structure from our custom ApiError interceptor
      setSubmitError(error.message || 'An error occurred while saving the user');
      
      // Specifically handle validation errors array sent from backend
      if (error.validationErrors && Array.isArray(error.validationErrors)) {
        const messages = error.validationErrors.map((e: any) => `${e.field}: ${e.message}`).join(' | ');
        setSubmitError(`Validation Error: ${messages}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-form-container">
      {submitError && <div className="error-banner">{submitError}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <div className="form-group">
          <label>Name *</label>
          <input type="text" {...register('name')} placeholder="John Doe" />
          {errors.name && <span className="error-text">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input type="email" {...register('email')} placeholder="john@example.com" />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Primary Mobile *</label>
            <input type="text" {...register('primaryMobile')} placeholder="9876543210" />
            {errors.primaryMobile && <span className="error-text">{errors.primaryMobile.message}</span>}
          </div>

          <div className="form-group">
            <label>Secondary Mobile</label>
            <input type="text" {...register('secondaryMobile')} placeholder="9876543211 (Optional)" />
            {errors.secondaryMobile && <span className="error-text">{errors.secondaryMobile.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Aadhaar *</label>
            <input type="text" {...register('aadhaar')} placeholder="123456789012" />
            {errors.aadhaar && <span className="error-text">{errors.aadhaar.message}</span>}
          </div>

          <div className="form-group">
            <label>PAN *</label>
            <input type="text" {...register('pan')} placeholder="ABCDE1234F" />
            {errors.pan && <span className="error-text">{errors.pan.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth *</label>
            <input type="date" {...register('dateOfBirth')} />
            {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth.message}</span>}
          </div>

          <div className="form-group">
            <label>Place of Birth</label>
            <input type="text" {...register('placeOfBirth')} placeholder="Mumbai (Optional)" />
            {errors.placeOfBirth && <span className="error-text">{errors.placeOfBirth.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Current Address *</label>
          <textarea {...register('currentAddress')} rows={3} placeholder="Full current address"></textarea>
          {errors.currentAddress && <span className="error-text">{errors.currentAddress.message}</span>}
        </div>

        <div className="form-group">
          <label>Permanent Address *</label>
          <textarea {...register('permanentAddress')} rows={3} placeholder="Full permanent address"></textarea>
          {errors.permanentAddress && <span className="error-text">{errors.permanentAddress.message}</span>}
        </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Saving...' : initialData?.id ? 'Update User' : 'Create User'}
        </button>
      </form>
    </div>
  );
};
