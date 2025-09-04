import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/movie/SearchBar';
import { MovieGrid } from '../components/movie/MovieGrid';
import { MovieGridSkeleton } from '../components/movie/MovieSkeleton';
import { Pagination } from '../components/common/Pagination';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { searchMovies, getPopularMovies } from '../services/tmdbApi';
import { Movie } from '../types/movie';
import { TrendingUp, Zap } from 'lucide-react';

export function SearchPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Carregar filmes populares ao iniciar
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await getPopularMovies(1);
        dispatch({ 
          type: 'SET_SEARCH_RESULTS', 
          payload: {
            results: response.results,
            page: response.page,
            totalPages: response.total_pages,
            totalResults: response.total_results
          }
        });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Failed to load popular movies. Please check your internet connection.' 
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadPopularMovies();
  }, [dispatch]);

  // Pesquisar filmes
  const handleSearch = async (query: string, page: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_CURRENT_QUERY', payload: query });
      
      const response = await searchMovies(query, page);
      dispatch({ 
        type: 'SET_SEARCH_RESULTS', 
        payload: {
          results: response.results,
          page: response.page,
          totalPages: response.total_pages,
          totalResults: response.total_results
        }
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: `Failed to search for "${query}". Please try again.` 
      });
    }
  };

  // Mudar página
  const handlePageChange = (page: number) => {
    if (state.currentQuery) {
      handleSearch(state.currentQuery, page);
    } else {
      const loadPopularPage = async () => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const response = await getPopularMovies(page);
          dispatch({ 
            type: 'SET_SEARCH_RESULTS', 
            payload: {
              results: response.results,
              page: response.page,
              totalPages: response.total_pages,
              totalResults: response.total_results
            }
          });
        } catch (error) {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: 'Failed to load movies. Please try again.' 
          });
        }
      };
      loadPopularPage();
    }
  };

  // clicar em um filme
  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  // tentar novamente
  const handleRetry = () => {
    if (state.currentQuery) {
      handleSearch(state.currentQuery, state.currentPage);
    } else {
      window.location.reload();
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              CineDiscover
            </h1>
            <p className="text-gray-400">Descubra seus filmes favoritos</p>
          </div>
          
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <MovieGridSkeleton count={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            CineDiscover
          </h1>
          <p className="text-gray-400 text-lg mb-6">Descubra seus filmes favoritos</p>
          
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        <div className="mb-6">
          {state.currentQuery ? (
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Zap className="w-5 h-5 text-orange-500" />
              <span>Resultados para "{state.currentQuery}"</span>
              <span className="text-orange-400">({state.totalResults.toLocaleString()} resultados)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Filmes populares</span>
            </div>
          )}
        </div>

        {/* Error State */}
        {state.error && (
          <ErrorMessage message={state.error} onRetry={handleRetry} />
        )}

        {/* Loading State */}
        {state.isLoading && !state.error && (
          <MovieGridSkeleton count={20} />
        )}

        {/* Results Grid */}
        {!state.isLoading && !state.error && state.searchResults.length > 0 && (
          <>
            <MovieGrid 
              movies={state.searchResults} 
              onMovieClick={handleMovieClick}
            />
            
            {/* Pagination */}
            <Pagination
              currentPage={state.currentPage}
              totalPages={Math.min(state.totalPages, 500)} // TMDB API limit
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Empty State */}
        {!state.isLoading && !state.error && state.searchResults.length === 0 && state.currentQuery && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">Nenhum filme encontrado</h3>
            <p className="text-gray-400 mb-6">Tente buscar outro título</p>
            <button
              onClick={() => {
                dispatch({ type: 'CLEAR_SEARCH_RESULTS' });
                window.location.reload();
              }}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Tente novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}