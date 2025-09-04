import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Movie, MovieDetails } from '../types/movie';

// Iniciar interface
interface AppState {
  favorites: Movie[];
  searchHistory: string[];
  isLoading: boolean;
  error: string | null;
  searchResults: Movie[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  currentQuery: string;
}

// Tipos de ações
type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_RESULTS'; payload: { results: Movie[]; page: number; totalPages: number; totalResults: number } }
  | { type: 'SET_CURRENT_QUERY'; payload: string }
  | { type: 'ADD_FAVORITE'; payload: Movie }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'LOAD_FAVORITES'; payload: Movie[] }
  | { type: 'ADD_TO_SEARCH_HISTORY'; payload: string }
  | { type: 'LOAD_SEARCH_HISTORY'; payload: string[] }
  | { type: 'CLEAR_SEARCH_RESULTS' };

// Estado inicial
const initialState: AppState = {
  favorites: [],
  searchHistory: [],
  isLoading: false,
  error: null,
  searchResults: [],
  currentPage: 1,
  totalPages: 0,
  totalResults: 0,
  currentQuery: ''
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload.results,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults,
        isLoading: false,
        error: null
      };
      
    case 'SET_CURRENT_QUERY':
      return { ...state, currentQuery: action.payload };
      
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload];
      return { ...state, favorites: newFavorites };
      
    case 'REMOVE_FAVORITE':
      const filteredFavorites = state.favorites.filter(movie => movie.id !== action.payload);
      return { ...state, favorites: filteredFavorites };
      
    case 'LOAD_FAVORITES':
      return { ...state, favorites: action.payload };
      
    case 'ADD_TO_SEARCH_HISTORY':
      const updatedHistory = [action.payload, ...state.searchHistory.filter(item => item !== action.payload)].slice(0, 5);
      return { ...state, searchHistory: updatedHistory };
      
    case 'LOAD_SEARCH_HISTORY':
      return { ...state, searchHistory: action.payload };
      
    case 'CLEAR_SEARCH_RESULTS':
      return { ...state, searchResults: [], currentPage: 1, totalPages: 0, totalResults: 0, currentQuery: '' };
      
    default:
      return state;
  }
}

// Context interfaces
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  addToSearchHistory: (query: string) => void;
}

// Create context
const AppContext = createContext<AppContextType | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar os favoritos e o histórico de pesquisa do localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('movieFavorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
      }
      
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        dispatch({ type: 'LOAD_SEARCH_HISTORY', payload: history });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Salvar os favoritos na localStorage
  useEffect(() => {
    try {
      localStorage.setItem('movieFavorites', JSON.stringify(state.favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [state.favorites]);

  // Salvar o histórico de pesquisa na localStorage
  useEffect(() => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory));
    } catch (error) {
      console.error('Error saving search history to localStorage:', error);
    }
  }, [state.searchHistory]);

  // funções auxiliares
  const addToFavorites = (movie: Movie) => {
    if (!isFavorite(movie.id)) {
      dispatch({ type: 'ADD_FAVORITE', payload: movie });
    }
  };

  const removeFromFavorites = (movieId: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: movieId });
  };

  const isFavorite = (movieId: number): boolean => {
    return state.favorites.some(movie => movie.id === movieId);
  };

  const addToSearchHistory = (query: string) => {
    if (query.trim()) {
      dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: query.trim() });
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      addToSearchHistory
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}