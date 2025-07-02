'use client';

import { useState, useRef } from 'react';
import { Upload, Camera, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadToCloudinary, validateFile } from '@/lib/cloudinary';

interface UploadedFile {
  url: string;
  publicId: string;
  type: string;
}

interface KYCUploadProps {
  userId: string;
  onComplete: (files: UploadedFile[]) => void;
}

export function KYCUpload({ userId, onComplete }: KYCUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { id: 'rg_front', label: 'RG (Frente)', type: 'document' },
    { id: 'rg_back', label: 'RG (Verso)', type: 'document' },
    { id: 'cpf', label: 'CPF', type: 'document' },
    { id: 'proof_of_address', label: 'Comprovante de Residência', type: 'document' },
    { id: 'selfie', label: 'Selfie com Documento', type: 'selfie' }
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, docType === 'selfie' ? 'selfie' : 'document');
    if (!validation.valid) {
      setError(validation.error || 'Arquivo inválido');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const result = await uploadToCloudinary(file, `kyc/${userId}/${docType}`);
      
      const uploadedFile: UploadedFile = {
        url: result.url,
        publicId: result.publicId,
        type: docType
      };

      setUploadedFiles(prev => [...prev.filter(f => f.type !== docType), uploadedFile]);
      
      // Avançar para próximo passo se não for o último
      const currentIndex = documentTypes.findIndex(d => d.id === docType);
      if (currentIndex < documentTypes.length - 1) {
        setCurrentStep(currentIndex + 2);
      }
    } catch (err: any) {
      setError('Erro ao fazer upload. Tente novamente.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const isDocumentUploaded = (docType: string) => {
    return uploadedFiles.some(f => f.type === docType);
  };

  const handleComplete = () => {
    onComplete(uploadedFiles);
  };

  const removeFile = (docType: string) => {
    setUploadedFiles(prev => prev.filter(f => f.type !== docType));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Verificação de Documentos (KYC)</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Progresso</span>
            <span className="text-sm text-gray-600">
              {uploadedFiles.length} de {documentTypes.length} documentos
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadedFiles.length / documentTypes.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Document Upload Steps */}
        <div className="space-y-6">
          {documentTypes.map((doc, index) => {
            const isUploaded = isDocumentUploaded(doc.id);
            const isCurrent = currentStep === index + 1;
            
            return (
              <div 
                key={doc.id}
                className={`border rounded-lg p-6 transition-all ${
                  isCurrent ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
                } ${isUploaded ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isUploaded ? 'bg-green-600 text-white' : isCurrent ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {isUploaded ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    <h3 className="text-lg font-semibold">{doc.label}</h3>
                  </div>
                  
                  {isUploaded && (
                    <button
                      onClick={() => removeFile(doc.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {isUploaded ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Documento enviado com sucesso</span>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={doc.type === 'selfie' ? selfieInputRef : fileInputRef}
                      type="file"
                      accept="image/*"
                      capture={doc.type === 'selfie' ? 'user' : undefined}
                      onChange={(e) => handleFileSelect(e, doc.id)}
                      className="hidden"
                      id={`file-${doc.id}`}
                    />
                    
                    <label
                      htmlFor={`file-${doc.id}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-colors ${
                        isCurrent 
                          ? 'bg-primary text-white hover:bg-primary/90' 
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : doc.type === 'selfie' ? (
                        <Camera className="w-5 h-5" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                      {uploading ? 'Enviando...' : doc.type === 'selfie' ? 'Tirar Foto' : 'Selecionar Arquivo'}
                    </label>
                    
                    {doc.type === 'selfie' && (
                      <p className="text-sm text-gray-600 mt-2">
                        Tire uma selfie segurando seu documento de identidade próximo ao rosto
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Complete Button */}
        {uploadedFiles.length === documentTypes.length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Concluir Verificação
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">Instruções Importantes:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Documentos devem estar legíveis e sem cortes</li>
            <li>• Aceitos: RG, CNH, Passaporte ou RNE</li>
            <li>• Comprovante de residência deve ter no máximo 3 meses</li>
            <li>• A selfie deve mostrar claramente seu rosto e o documento</li>
            <li>• Formatos aceitos: JPG, PNG, WebP (máx. 10MB)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}