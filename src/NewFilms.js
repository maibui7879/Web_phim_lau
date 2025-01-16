import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleDoubleLeft, faAngleRight, faAngleDoubleRight, faPlay } from '@fortawesome/free-solid-svg-icons';

function NewFilms() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);  // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [movies]);

  const fetchMovies = async (page) => {
    try {
      const response = await axios.get(
        `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`
      );
      setMovies(response.data.items);
      setTotalPages(response.data.pagination.totalPages);
      setLoading(false);  // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);  // Ensure loading is set to false in case of an error
    }
  };

  const handleMovieClick = (slug) => {
    navigate(`/phim/${slug}`);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-2 rounded ${
            i === currentPage
              ? 'bg-blue-700 text-white'
              : 'bg-gray-700 hover:bg-blue-600 text-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-700 hover:bg-blue-600 text-gray-300 rounded disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </button>
        <button
          onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-700 hover:bg-blue-600 text-gray-300 rounded disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        {pages}
        <button
          onClick={() => handlePageClick(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-700 hover:bg-blue-600 text-gray-300 rounded disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-700 hover:bg-blue-600 text-gray-300 rounded disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
      </div>
    );
  };

  const renderSlider = () => {
    if (movies.length < 1) return null;

    return (
      <div className="relative h-dvh overflow-hidden mb-8 mt-10">
        {movies.slice(0, 5).map((movie, index) => (
          <div
            key={movie._id}
            onClick={() => handleMovieClick(movie.slug)}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${movie.poster_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-transparent to-gray-900 flex items-end p-6">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2 truncate">{movie.name}</h2>
                <p className="text-sm text-gray-300">{movie.origin_name}</p>
                <p className="text-sm text-gray-300">Năm: {movie.year}</p>
                <button className="rounded-full bg-green-800 px-4 py-2 mt-4 flex items-center space-x-2">
                  <FontAwesomeIcon icon={faPlay} />
                  <span><b>Xem ngay</b></span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {loading ? (
        <div className="text-center text-xl text-gray-300">Đang tải...</div>  // Loading message
      ) : (
        <>
          {renderSlider()}
          <h1 className="text-3xl font-bold mb-6">Khám Phá</h1>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700"
                onClick={() => handleMovieClick(movie.slug)}
              >
                <img
                  src={movie.poster_url}
                  alt={movie.name}
                  className="w-full h-64 object-cover rounded"
                />
                <h2 className="text-xl font-semibold mt-4 truncate">{movie.name}</h2>
                <p className="text-sm text-gray-400">{movie.origin_name}</p>
                <p className="text-sm text-gray-400">Năm: {movie.year}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">{renderPagination()}</div>
        </>
      )}
    </div>
  );
}

export default NewFilms;
