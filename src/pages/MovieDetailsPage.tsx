import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, Heart, ArrowLeft, ExternalLink, Users, Award } from 'lucide-react';
import { MovieDetails, Credits } from '../types/movie';
import { getMovieDetails, getImageUrl } from '../services/tmdbApi';
import { LazyImage } from '../components/common/LazyImage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { MovieGrid } from '../components/movie/MovieGrid';
import { useAppContext } from '../context/AppContext';

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppContext();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getMovieDetails(parseInt(id));
        setMovie(response);
        setCredits(response.credits);
      } catch (error) {
        console.error('Error loading movie details:', error);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleRetry = () => {
    if (id) {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading movie details..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <ErrorMessage message={error || 'Movie not found'} onRetry={handleRetry} />
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'large', 'backdrop');
  const posterUrl = getImageUrl(movie.poster_path, 'large', 'poster');
  const rating = Math.round(movie.vote_average * 10) / 10;
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Unknown';
  
  // Obter o diretor do filme
  const director = credits?.crew.find(person => person.job === 'Director');
  
  // Obter os 6 atores principais
  const mainCast = credits?.cast.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Seção Principal do Filme */}
      <div className="relative">
        {backdropUrl && (
          <div className="absolute inset-0 h-96 md:h-[500px] overflow-hidden">
            <LazyImage
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
          </div>
        )}

        <div className="relative container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Movie Poster */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <LazyImage
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 pt-8 md:pt-16">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  {movie.title}
                </h1>
                
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    isFavorite(movie.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800/80 text-gray-400 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite(movie.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {movie.tagline && (
                <p className="text-orange-400 text-lg italic mb-4">"{movie.tagline}"</p>
              )}

              {/* Movie Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span>{releaseYear}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>{runtime}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-gray-400">({movie.vote_count.toLocaleString()} votes)</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-orange-400">Visão Geral</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>

              {/* Director */}
              {director && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-orange-400 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Diretor
                  </h3>
                  <p className="text-gray-300 text-lg">{director.name}</p>
                </div>
              )}

              {/* External Links */}
              <div className="flex flex-wrap gap-4">
                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Site Oficial
                  </a>
                )}
                
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver no IMDb
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {mainCast.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-orange-400">
            <Users className="w-6 h-6" />
            Main Cast
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mainCast.map((actor) => (
              <div key={actor.id} className="text-center group">
                <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800">
                  <LazyImage
                    src={getImageUrl(actor.profile_path, 'medium', 'poster')}
                    alt={actor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-semibold text-sm mb-1 text-white">{actor.name}</h4>
                <p className="text-gray-400 text-xs">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Production Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Production Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-orange-400">Detalhes da produção</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2 font-medium">{movie.status}</span>
              </div>
              
              <div>
                <span className="text-gray-400">Língua original:</span>
                <span className="ml-2 font-medium uppercase">{movie.original_language}</span>
              </div>
              
              {movie.budget > 0 && (
                <div>
                  <span className="text-gray-400">Orçamento:</span>
                  <span className="ml-2 font-medium">${movie.budget.toLocaleString()}</span>
                </div>
              )}
              
              {movie.revenue > 0 && (
                <div>
                  <span className="text-gray-400">Receita:</span>
                  <span className="ml-2 font-medium">${movie.revenue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Production Companies */}
          {movie.production_companies.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Empresas de produção</h3>
              <div className="space-y-2">
                {movie.production_companies.slice(0, 5).map((company) => (
                  <div key={company.id} className="text-gray-300">
                    {company.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Countries */}
          {movie.production_countries.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Países de produção</h3>
              <div className="space-y-2">
                {movie.production_countries.map((country) => (
                  <div key={country.iso_3166_1} className="text-gray-300">
                    {country.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}