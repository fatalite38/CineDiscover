import React, { useState, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useAppContext } from '../../context/AppContext';

interface SearchBarProps {
  onSearch: (query: string, page?: number) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Pesquisar filmes..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const { state, addToSearchHistory } = useAppContext();
  const debouncedQuery = useDebounce(query, 500);

  // Executar a pesquisa quando o query mudar
  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery.trim());
      addToSearchHistory(debouncedQuery.trim());
    }
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      addToSearchHistory(query.trim());
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    onSearch(historyQuery);
    setShowHistory(false);
  };

  const clearQuery = () => {
    setQuery('');
    setShowHistory(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder={placeholder}
            className="w-full bg-gray-800 text-white pl-12 pr-12 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Lista suspensa do histórico de pesquisa */}
      {showHistory && state.searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Histórico</span>
            </div>
          </div>
          
          <div className="py-2">
            {state.searchHistory.map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(historyQuery)}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {historyQuery}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fundo preto transparente para ocultar o histórico */}
      {showHistory && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}