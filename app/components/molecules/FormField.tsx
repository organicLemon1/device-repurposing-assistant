import React from 'react';
import { Label } from '../atoms/Label';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, children, className = '', id }) => {
  return (
    <div className={`mb-4 w-full ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
};
