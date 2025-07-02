// Configuração e utilitários do Cloudinary

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  uploadPreset: 'rio-porto-kyc' // Criar este preset no Cloudinary
};

// Gerar URL de upload direto (client-side)
export function getUploadUrl() {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
}

// Gerar assinatura para upload seguro (server-side only)
export async function generateUploadSignature(folder: string, userId: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp,
    folder: `kyc/${userId}`,
    upload_preset: CLOUDINARY_CONFIG.uploadPreset
  };
  
  // Esta função deve ser chamada apenas no servidor
  // A assinatura real seria gerada com crypto
  return {
    signature: 'generated-signature',
    timestamp,
    api_key: CLOUDINARY_CONFIG.apiKey,
    folder: params.folder
  };
}

// Fazer upload de arquivo
export async function uploadToCloudinary(file: File, folder: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', folder);
  
  try {
    const response = await fetch(getUploadUrl(), {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      size: data.bytes,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Validar arquivo antes do upload
export function validateFile(file: File, type: 'document' | 'selfie') {
  const maxSize = type === 'document' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB para docs, 5MB para selfies
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (file.size > maxSize) {
    return { valid: false, error: `Arquivo muito grande. Máximo: ${maxSize / 1024 / 1024}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não permitido. Use: JPG, PNG ou WebP' };
  }
  
  return { valid: true };
}

// Transformar URL da imagem
export function getOptimizedImageUrl(url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
}) {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const transformations = [];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  
  const transformString = transformations.join(',');
  
  // Inserir transformações na URL do Cloudinary
  return url.replace('/upload/', `/upload/${transformString}/`);
}