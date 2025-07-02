import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCryptoQuote } from '@/lib/coinmarketcap';

interface ServiceStatus {
  name: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  details?: any;
}

export async function GET() {
  const services: ServiceStatus[] = [];
  
  // 1. Check Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      services.push({
        name: 'Supabase',
        status: 'error',
        message: 'Missing credentials'
      });
    } else {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      services.push({
        name: 'Supabase',
        status: error ? 'error' : 'ok',
        message: error ? error.message : `Connected successfully (${count || 0} users)`,
        details: { url: supabaseUrl }
      });
    }
  } catch (error: any) {
    services.push({
      name: 'Supabase',
      status: 'error',
      message: error.message
    });
  }

  // 2. Check Stack Auth
  try {
    const stackProjectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
    const stackKey = process.env.STACK_SECRET_SERVER_KEY;
    
    services.push({
      name: 'Stack Auth',
      status: stackProjectId && stackKey ? 'ok' : 'error',
      message: stackProjectId && stackKey ? 'Configured' : 'Missing credentials',
      details: { projectId: stackProjectId }
    });
  } catch (error: any) {
    services.push({
      name: 'Stack Auth',
      status: 'error',
      message: error.message
    });
  }

  // 3. Check Resend
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM_EMAIL;
    
    if (!resendKey) {
      services.push({
        name: 'Resend (Email)',
        status: 'error',
        message: 'Missing API key'
      });
    } else {
      // Test API key validity
      const response = await fetch('https://api.resend.com/emails', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${resendKey}`
        }
      });
      
      services.push({
        name: 'Resend (Email)',
        status: response.ok ? 'ok' : 'error',
        message: response.ok ? `Configured (from: ${resendFrom})` : 'Invalid API key',
        details: { fromEmail: resendFrom }
      });
    }
  } catch (error: any) {
    services.push({
      name: 'Resend (Email)',
      status: 'error',
      message: error.message
    });
  }

  // 4. Check CoinMarketCap
  try {
    const cmcKey = process.env.COINMARKETCAP_API_KEY;
    
    if (!cmcKey) {
      services.push({
        name: 'CoinMarketCap',
        status: 'error',
        message: 'Missing API key'
      });
    } else {
      const quote = await getCryptoQuote('BTC');
      services.push({
        name: 'CoinMarketCap',
        status: quote ? 'ok' : 'error',
        message: quote ? `Working (BTC: R$ ${quote.price_brl.toLocaleString('pt-BR')})` : 'Failed to fetch quote'
      });
    }
  } catch (error: any) {
    services.push({
      name: 'CoinMarketCap',
      status: 'error',
      message: error.message
    });
  }

  // 5. Check WhatsApp
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  services.push({
    name: 'WhatsApp',
    status: whatsappNumber === '552120187776' ? 'ok' : 'warning',
    message: whatsappNumber ? `Configured: +${whatsappNumber}` : 'Missing number',
    details: { number: whatsappNumber }
  });

  // 6. Check Google Maps
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  services.push({
    name: 'Google Maps',
    status: mapsKey ? 'ok' : 'warning',
    message: mapsKey ? 'API key configured' : 'Missing API key',
    details: { hasKey: !!mapsKey }
  });

  // 7. Check Google Analytics
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  services.push({
    name: 'Google Analytics',
    status: gaId === 'G-GCQEWQZLGJ' ? 'ok' : 'warning',
    message: gaId ? `Configured: ${gaId}` : 'Missing measurement ID',
    details: { measurementId: gaId }
  });

  // 8. Check Cloudinary
  const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudinaryKey = process.env.CLOUDINARY_API_KEY;
  services.push({
    name: 'Cloudinary',
    status: cloudinaryName && cloudinaryKey ? 'ok' : 'warning',
    message: cloudinaryName ? `Configured: ${cloudinaryName}` : 'Missing configuration',
    details: { cloudName: cloudinaryName }
  });

  // Calculate overall status
  const errorCount = services.filter(s => s.status === 'error').length;
  const warningCount = services.filter(s => s.status === 'warning').length;
  const overallStatus = errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'ok';

  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services,
    summary: {
      total: services.length,
      ok: services.filter(s => s.status === 'ok').length,
      error: errorCount,
      warning: warningCount
    }
  });
}