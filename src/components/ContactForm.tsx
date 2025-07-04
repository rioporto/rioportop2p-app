'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, User, MessageSquare, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: 'general' | 'support' | 'partnership' | 'complaint';
  honeypot: string; // Campo honeypot para anti-spam
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
    honeypot: '' // Campo honeypot
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);

  // Rate limiting - permite apenas 1 envio a cada 60 segundos
  const RATE_LIMIT_MS = 60000;

  // Validações
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Telefone (opcional, mas se preenchido deve ser válido)
    if (formData.phone) {
      const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Telefone inválido. Use o formato: (11) 98765-4321';
      }
    }

    // Assunto
    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Assunto deve ter pelo menos 5 caracteres';
    }

    // Mensagem
    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Mensagem não pode exceder 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatar telefone enquanto digita
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar honeypot (se estiver preenchido, é spam)
    if (formData.honeypot) {
      console.log('Spam detectado via honeypot');
      return;
    }

    // Verificar rate limit
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const remainingTime = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
      setSubmitStatus('error');
      setSubmitMessage(`Por favor, aguarde ${remainingTime} segundos antes de enviar novamente.`);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          type: formData.type,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Mensagem enviada com sucesso!');
        setLastSubmitTime(now);
        
        // Limpar formulário
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          type: 'general',
          honeypot: ''
        });
        setErrors({});
        
        // Resetar status após 5 segundos
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitStatus('error');
      setSubmitMessage('Erro ao enviar mensagem. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Contato */}
      <div>
        <label className="block text-sm font-medium mb-2">Tipo de Contato</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as ContactFormData['type'] })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
        >
          <option value="general">Informações Gerais</option>
          <option value="support">Suporte Técnico</option>
          <option value="partnership">Parcerias</option>
          <option value="complaint">Reclamações</option>
        </select>
      </div>

      {/* Nome */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <User className="inline w-4 h-4 mr-1" />
          Nome Completo *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 ${
            errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Seu nome completo"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Mail className="inline w-4 h-4 mr-1" />
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 ${
            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Telefone */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Phone className="inline w-4 h-4 mr-1" />
          Telefone (opcional)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 ${
            errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="(11) 98765-4321"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Assunto */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Assunto *
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 ${
            errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Assunto da mensagem"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
        )}
      </div>

      {/* Mensagem */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <MessageSquare className="inline w-4 h-4 mr-1" />
          Mensagem *
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 resize-none ${
            errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Digite sua mensagem aqui..."
        />
        <div className="flex justify-between mt-1">
          <div>
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message}</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {formData.message.length}/1000
          </p>
        </div>
      </div>

      {/* Campo Honeypot (invisível) */}
      <div style={{ display: 'none' }}>
        <input
          type="text"
          name="website"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Feedback de Status */}
      {submitStatus !== 'idle' && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          submitStatus === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          {submitStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm">{submitMessage}</p>
        </div>
      )}

      {/* Botão de Envio */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90 text-white'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Enviar Mensagem
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Ao enviar este formulário, você concorda com nossa{' '}
        <a href="/politica-de-privacidade" className="text-primary hover:underline">
          Política de Privacidade
        </a>
      </p>
    </form>
  );
}