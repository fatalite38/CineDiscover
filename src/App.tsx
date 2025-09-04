import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { SearchPage } from './pages/SearchPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { FavoritesPage } from './pages/FavoritesPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SearchPage />} />
            <Route path="movie/:id" element={<MovieDetailsPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;