'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url: string;
}

interface GoogleReviewsProps {
  placeId?: string;
}

export function GoogleReviews({ placeId = 'ChIJfbBquYSBmQARFwAerehRUew' }: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key não configurada');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined' && window.google) {
      loadPlaceDetails();
    }
  }, [GOOGLE_MAPS_API_KEY, placeId]);

  const loadPlaceDetails = () => {
    try {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        placeId: placeId,
        fields: ['reviews', 'rating', 'user_ratings_total', 'name']
      };

      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setReviews(place.reviews || []);
          setRating(place.rating || 0);
          setTotalReviews(place.user_ratings_total || 0);
          setLoading(false);
        } else {
          setError('Erro ao carregar avaliações');
          setLoading(false);
        }
      });
    } catch (err) {
      setError('Erro ao conectar com Google Maps');
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={loadPlaceDetails}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-2xl font-bold mb-6">Avaliações do Google</h3>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando avaliações...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Rating Summary */}
            <div className="mb-6 text-center border-b pb-6">
              <div className="flex justify-center items-center gap-2 mb-2">
                <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
                <div className="flex">{renderStars(Math.round(rating))}</div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Baseado em {totalReviews} avaliações no Google
              </p>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review, index) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    {review.profile_photo_url && (
                      <img
                        src={review.profile_photo_url}
                        alt={review.author_name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{review.author_name}</h4>
                        <span className="text-sm text-gray-500">
                          {review.relative_time_description}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Link to Google Maps */}
            <div className="mt-6 text-center">
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${placeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Ver todas as avaliações no Google Maps →
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}