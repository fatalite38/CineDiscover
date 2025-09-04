import React from 'react';

export function MovieSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-800" />
      <div className="p-4">
        <div className="h-4 bg-gray-800 rounded mb-2" />
        <div className="h-3 bg-gray-800 rounded w-2/3" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieSkeleton key={index} />
      ))}
    </div>
  );
}