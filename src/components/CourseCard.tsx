interface CourseCardProps {
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  modules: number;
  students: number;
  rating: number;
  bitcoinDiscount?: number;
}

export default function CourseCard({
  title,
  description,
  instructor,
  price,
  originalPrice,
  duration,
  level,
  modules,
  students,
  rating,
  bitcoinDiscount
}: CourseCardProps) {
  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avançado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getLevelStyles(level)}`}>
            {level}
          </span>
          {bitcoinDiscount && (
            <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.5 2v2.5h-1.5v-2.5h-2v2.5h-3.5v2h1.5v11h-1.5v2h3.5v2.5h2v-2.5h1.5v2.5h2v-2.5h1c2.5 0 4.5-2 4.5-4.5 0-1.4-.6-2.6-1.6-3.4.6-.8 1.1-1.8 1.1-3.1 0-2.5-2-4.5-4.5-4.5h-1v-2.5h-2zm2 6.5h1c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-1v-3zm0 5h1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-1.5v-3z"/>
              </svg>
              -{bitcoinDiscount}%
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="text-sm text-gray-500 mb-4">
          Por {instructor}
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            {renderStars(rating)}
            <span className="ml-1 font-semibold">{rating}</span>
          </div>
          <span className="text-gray-500">({students.toLocaleString('pt-BR')})</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {modules} módulos
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through mr-2">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <span className="text-2xl font-bold">
                {price === 0 ? 'Grátis' : formatPrice(price)}
              </span>
            </div>
          </div>
          {bitcoinDiscount && (
            <p className="text-xs text-orange-600 mb-3">
              Pague com Bitcoin e ganhe {bitcoinDiscount}% de desconto!
            </p>
          )}
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            {price === 0 ? 'Acessar Grátis' : 'Matricular-se'}
          </button>
        </div>
      </div>
    </div>
  );
}