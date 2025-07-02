import React from 'react'

export const CryptoCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12 mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
      </div>
    </div>
  )
}

export const CryptoListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <CryptoCardSkeleton key={index} />
      ))}
    </div>
  )
}