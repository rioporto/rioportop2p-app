import Link from 'next/link';
import { Check, X } from 'lucide-react';

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  notIncluded?: string[];
  cta: string;
  href: string;
  popular?: boolean;
  gradient: string;
  icon: React.ElementType;
}

export default function PricingCard({
  name,
  description,
  price,
  period,
  features,
  notIncluded,
  cta,
  href,
  popular = false,
  gradient,
  icon: Icon
}: PricingCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
      popular ? 'ring-2 ring-orange-500' : ''
    }`}>
      {popular && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4">
          <div className="rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
            MAIS POPULAR
          </div>
        </div>
      )}

      <div className="p-8">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {description}
        </p>

        <div className="mb-8">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
            {price}
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            {period}
          </span>
        </div>

        <Link
          href={href}
          className={`mb-8 block w-full rounded-full bg-gradient-to-r ${gradient} py-3 text-center font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5`}
        >
          {cta}
        </Link>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            O que está incluído:
          </h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {notIncluded && notIncluded.length > 0 && (
            <>
              <h4 className="font-semibold text-gray-900 dark:text-white mt-6">
                Não incluído:
              </h4>
              <ul className="space-y-3">
                {notIncluded.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}