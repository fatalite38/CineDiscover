const API_KEY = '3c5ba8491b70626fc9842eb19ce22db2'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Configuração da API
export const apiConfig = {
  apiKey: API_KEY,
  baseUrl: BASE_URL,
  imageUrl: IMAGE_BASE_URL,
  posterSizes: {
    small: '/w200',
    medium: '/w500', 
    large: '/w780',
    original: '/original'
  },
  backdropSizes: {
    small: '/w300',
    medium: '/w780',
    large: '/w1280',
    original: '/original'
  }
};

// Função para obter URLs de imagem
export const getImageUrl = (path: string | null, size: 'small' | 'medium' | 'large' | 'original' = 'medium', type: 'poster' | 'backdrop' = 'poster') => {
  if (!path) return null;
  const sizeConfig = type === 'poster' ? apiConfig.posterSizes : apiConfig.backdropSizes;
  return `${apiConfig.imageUrl}${sizeConfig[size]}${path}`;
};

// Cria um cache para armazenar respostas da API
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new ApiCache();

// Função para fazer solicitações a API
async function apiRequest<T>(endpoint: string, useCache = true): Promise<T> {
  const cacheKey = endpoint;
  
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  try {
    // Cria um AbortController para cancelar a solicitação em caso de timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
      signal: controller.signal
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Armazena a resposta no cache
    if (useCache && response.ok) {
      cache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your internet connection');
    }
    console.error('API Request failed:', error);
    throw error;
  }
}

// Pesquisa filmes
export const searchMovies = async (query: string, page: number = 1) => {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }
  
  const endpoint = `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
  return apiRequest(endpoint);
};

// Exibe detalhes de um filme
export const getMovieDetails = async (movieId: number) => {
  const endpoint = `/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations,similar`;
  return apiRequest(endpoint);
};

// Exibe filmes populares
export const getPopularMovies = async (page: number = 1) => {
  const endpoint = `/movie/popular?api_key=${API_KEY}&page=${page}`;
  return apiRequest(endpoint);
};

// Exibe filmes mais votados
export const getTopRatedMovies = async (page: number = 1) => {
  const endpoint = `/movie/top_rated?api_key=${API_KEY}&page=${page}`;
  return apiRequest(endpoint);
};

// Exibe filmes em cartaz
export const getUpcomingMovies = async (page: number = 1) => {
  const endpoint = `/movie/upcoming?api_key=${API_KEY}&page=${page}`;
  return apiRequest(endpoint);
};

// Obtem todos os gêneros
export const getGenres = async () => {
  const endpoint = `/genre/movie/list?api_key=${API_KEY}`;
  return apiRequest(endpoint);
};

// Obtem filmes por gênero
export const discoverMovies = async (genreId?: number, page: number = 1) => {
  let endpoint = `/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`;
  if (genreId) {
    endpoint += `&with_genres=${genreId}`;
  }
  return apiRequest(endpoint);
};