import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { MovieGrid } from '../components/movie/MovieGrid';
import { useAppContext } from '../context/AppContext';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { state, removeFromFavorites } = useAppContext();

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      state.favorites.forEach(movie => {
        removeFromFavorites(movie.id);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">Meus Favoritos</h1>
          </div>
          
          {state.favorites.length > 0 && (
            <div className="flex items-center justify-center gap-4">
              <p className="text-gray-400">
                {state.favorites.length} filme{state.favorites.length !== 1 ? 's' : ''} adicionado
              </p>
              
              <button
                onClick={clearAllFavorites}
                className="flex items-center gap-2 px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Limpar todos
              </button>
            </div>
          )}
        </div>

        {/* Favorites Grid */}
        {state.favorites.length > 0 ? (
          <MovieGrid 
            movies={state.favorites} 
            onMovieClick={handleMovieClick}
            showFavoriteButton={true}
          />
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">Nenhum filme favorito</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Comece a adicionar filmes aos seus favoritos clicando no coração na página de detalhes de um filme.
            </p>
            
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
            >
              Descobrir filmes
              {/* Discover Movies */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}