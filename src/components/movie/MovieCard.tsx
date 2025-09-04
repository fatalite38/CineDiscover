import React from 'react';
import { Star, Calendar, Heart } from 'lucide-react';
import { Movie } from '../../types/movie';
import { LazyImage } from '../common/LazyImage';
import { getImageUrl } from '../../services/tmdbApi';
import { useAppContext } from '../../context/AppContext';

interface MovieCardProps {
  movie: Movie;
  onDetailsClick: (movieId: number) => void;
  showFavoriteButton?: boolean;
}

export function MovieCard({ movie, onDetailsClick, showFavoriteButton = true }: MovieCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext();
  
  const posterUrl = getImageUrl(movie.poster_path, 'medium', 'poster');
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
  const rating = Math.round(movie.vote_average * 10) / 10;
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleCardClick = () => {
    onDetailsClick(movie.id);
  };

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3]">
        <LazyImage
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite button */}
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite(movie.id) 
                ? 'bg-red-500/90 text-white' 
                : 'bg-black/50 text-gray-300 hover:bg-red-500/90 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite(movie.id) ? 'fill-current' : ''}`} />
          </button>
        )}
        
        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full backdrop-blur-sm">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-semibold">{rating}</span>
          </div>
        )}
      </div>
      
      {/* Movie Info */}
      <div className="p-4" onClick={handleCardClick}>
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{releaseYear}</span>
          </div>
          
          {movie.vote_count > 0 && (
            <span className="text-gray-500">{movie.vote_count} votes</span>
          )}
        </div>
      </div>
      
      {/* Details */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-gray-300 text-xs line-clamp-3 mb-3">
          {movie.overview || 'No description available.'}
        </p>
        
        <button 
          onClick={handleCardClick}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}