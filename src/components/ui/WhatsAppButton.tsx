'use client';

import React from 'react';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  className?: string;
  children: React.ReactNode;
}

export function WhatsAppButton({ 
  phone, 
  message, 
  className = '', 
  children 
}: WhatsAppButtonProps) {
  const link = getWhatsAppLink(phone, message);
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {children}
    </a>
  );
}