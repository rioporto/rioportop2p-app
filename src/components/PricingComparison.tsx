import { Check, X } from 'lucide-react';

interface ComparisonFeature {
  name: string;
  basic: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

interface PricingComparisonProps {
  features?: ComparisonFeature[];
  className?: string;
}

const defaultFeatures: ComparisonFeature[] = [
  { name: 'Transações mensais', basic: 'Até R$ 10K', pro: 'Até R$ 100K', enterprise: 'Ilimitado' },
  { name: 'Taxa de transação', basic: '2.5%', pro: '1.5%', enterprise: 'A partir de 0.8%' },
  { name: 'Suporte', basic: 'Chat', pro: '24/7 Prioritário', enterprise: 'Dedicado' },
  { name: 'KYC', basic: 'Básico', pro: 'Completo', enterprise: 'Personalizado' },
  { name: 'Métodos de pagamento', basic: 'PIX', pro: 'Múltiplos', enterprise: 'Todos + Custom' },
  { name: 'API de integração', basic: false, pro: true, enterprise: true },
  { name: 'Relatórios avançados', basic: false, pro: true, enterprise: true },
  { name: 'White-label', basic: false, pro: false, enterprise: true },
  { name: 'Gerente de conta', basic: false, pro: false, enterprise: true },
];

export default function PricingComparison({ 
  features = defaultFeatures,
  className = ""
}: PricingComparisonProps) {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-400 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
              Recurso
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
              Básico
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-orange-600">
              Pro
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-purple-600">
              Enterprise
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {features.map((feature, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {feature.name}
              </td>
              <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                {renderValue(feature.basic)}
              </td>
              <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                {renderValue(feature.pro)}
              </td>
              <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                {renderValue(feature.enterprise)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}