import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface KYCDocument {
  url: string;
  publicId: string;
  type: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, documents } = await request.json();

    if (!userId || !documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: 'userId e documents são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se todos os documentos obrigatórios foram enviados
    const requiredDocs = ['rg_front', 'rg_back', 'cpf', 'proof_of_address', 'selfie'];
    const uploadedTypes = documents.map((doc: KYCDocument) => doc.type);
    const missingDocs = requiredDocs.filter(doc => !uploadedTypes.includes(doc));

    if (missingDocs.length > 0) {
      return NextResponse.json(
        { error: `Documentos faltando: ${missingDocs.join(', ')}` },
        { status: 400 }
      );
    }

    // Criar registro de verificação KYC
    const kycData = {
      user_id: userId,
      verification_level: 1, // Nível inicial
      status: 'pending',
      documents: documents,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Inserir ou atualizar registro KYC
    const { data, error } = await supabase
      .from('kyc_verifications')
      .upsert(kycData, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar KYC:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar verificação KYC' },
        { status: 500 }
      );
    }

    // Atualizar perfil do usuário
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        kyc_status: 'pending',
        kyc_submitted_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError);
    }

    // Enviar email de confirmação
    try {
      const emailResponse = await fetch(`${request.nextUrl.origin}/api/kyc/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'submission_received'
        })
      });

      if (!emailResponse.ok) {
        console.error('Erro ao enviar email de confirmação');
      }
    } catch (emailError) {
      console.error('Erro ao enviar notificação:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Documentos KYC enviados com sucesso',
      data: {
        kycId: data.id,
        status: data.status,
        verificationLevel: data.verification_level
      }
    });

  } catch (error: any) {
    console.error('Erro no upload KYC:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar KYC', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar status KYC do usuário
    const { data, error } = await supabase
      .from('kyc_verifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao buscar KYC:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar verificação KYC' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({
        exists: false,
        message: 'Nenhuma verificação KYC encontrada'
      });
    }

    return NextResponse.json({
      exists: true,
      data: {
        status: data.status,
        verificationLevel: data.verification_level,
        submittedAt: data.submitted_at,
        reviewedAt: data.reviewed_at,
        documents: data.documents,
        rejectionReason: data.rejection_reason
      }
    });

  } catch (error: any) {
    console.error('Erro ao buscar status KYC:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar KYC', details: error.message },
      { status: 500 }
    );
  }
}