'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  details?: any;
}

interface SystemStatus {
  status: 'ok' | 'error' | 'warning';
  timestamp: string;
  environment: string;
  services: ServiceStatus[];
  summary: {
    total: number;
    ok: number;
    error: number;
    warning: number;
  };
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/system-check');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: 'ok' | 'error' | 'warning') => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: 'ok' | 'error' | 'warning') => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  if (loading && !status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Verificando status do sistema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Erro ao verificar status: {error}</p>
          <button
            onClick={fetchStatus}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Status do Sistema</h1>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {status && (
          <>
            {/* Overall Status */}
            <div className={`rounded-lg p-6 mb-8 ${getStatusColor(status.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.status)}
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Sistema {status.status === 'ok' ? 'Operacional' : status.status === 'warning' ? 'Com Avisos' : 'Com Problemas'}
                    </h2>
                    <p className="text-sm opacity-75">
                      Última verificação: {new Date(status.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">Ambiente</p>
                  <p className="font-semibold uppercase">{status.environment}</p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{status.summary.total}</p>
                <p className="text-gray-600 dark:text-gray-400">Serviços</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{status.summary.ok}</p>
                <p className="text-gray-600 dark:text-gray-400">Operacionais</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-yellow-600">{status.summary.warning}</p>
                <p className="text-gray-600 dark:text-gray-400">Avisos</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{status.summary.error}</p>
                <p className="text-gray-600 dark:text-gray-400">Erros</p>
              </div>
            </div>

            {/* Services List */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Status dos Serviços</h3>
              <div className="space-y-4">
                {status.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {service.message}
                        </p>
                      </div>
                    </div>
                    {service.details && (
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        {Object.entries(service.details).map(([key, value]) => (
                          <p key={key}>
                            {key}: {String(value)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Details */}
            <details className="mt-8 bg-card rounded-lg p-6">
              <summary className="cursor-pointer font-semibold">Detalhes Técnicos</summary>
              <pre className="mt-4 p-4 bg-background rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(status, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </div>
  );
}