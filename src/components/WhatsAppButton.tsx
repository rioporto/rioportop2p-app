'use client';

interface WhatsAppButtonProps {
  text: string;
  className: string;
  children: React.ReactNode;
}

export default function WhatsAppButton({ text, className, children }: WhatsAppButtonProps) {
  const handleClick = () => {
    window.open(`https://wa.me/552120187776?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}