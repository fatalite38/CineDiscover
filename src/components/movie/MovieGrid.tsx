import React from 'react';
import { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
  showFavoriteButton?: boolean;
}

export function MovieGrid({ movies, onMovieClick, showFavoriteButton = true }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-400 text-lg mb-2">Nenhum filme encontrado</p>
        <p className="text-gray-500 text-sm">Tente buscar por outro título</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onDetailsClick={onMovieClick}
          showFavoriteButton={showFavoriteButton}
        />
      ))}
    </div>
  );
}