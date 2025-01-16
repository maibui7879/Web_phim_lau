import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleDoubleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

function Series() {
  const [series, setSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeries(currentPage);
  }, [currentPage]);

  const fetchSeries = async (page) => {
    try {
      const response = await axios.get(
        `https://phimapi.com/v1/api/danh-sach/phim-bo?page=${page}`
      );
      const updatedData = await Promise.all(
        response.data.data.items.map(async (item) => {
          const movieDetailResponse = await axios.get(
            `https://phimapi.com/phim/${item.slug}`
          );
          const movie = {
            ...item,
            poster_url: movieDetailResponse.data.movie.poster_url,
          };
          return movie;
        })
      );
      setSeries(updatedData);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching series:', error);
    }
  };

  const handleSeriesClick = (slug) => {
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
          className={`px-3 py-2 rounded ${i === currentPage
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Phim Bộ</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {series.map((movie) => (
          <div
            key={movie._id}
            className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700"
            onClick={() => handleSeriesClick(movie.slug)}
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
      <div className="flex justify-center mt-8">
        {renderPagination()}
      </div>
    </div>
  );
}

export default Series;
