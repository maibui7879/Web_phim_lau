import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import MovieDetail from './MovieDetailPage';
import NewFilms from './NewFilms';
import Header from './Header';
import Footer from './Footer';
import Movies from './Movies'
import Series from './Series'
import Animation from './Animation';
import TVShows from './TVShows';
function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="bg-gray-800 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/phim/:slug" element={<MovieDetail />} />
          <Route path="/new-movies" element={<NewFilms />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/animation" element={<Animation />} />
          <Route path="/tv-shows" element={<TVShows />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
