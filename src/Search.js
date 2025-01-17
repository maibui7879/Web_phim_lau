import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword');

  useEffect(() => {
    if (keyword) {
      fetchSearchResults(keyword);
    }
  }, [keyword]);

  const fetchSearchResults = async (keyword) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://phimapi.com/v1/api/tim-kiem?keyword=${keyword}&limit=100`);
      setSearchResults(response.data.data.items);
    } catch (err) {
      setError('An error occurred while fetching search results');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (slug) => {
    navigate(`/phim/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 ">
      {loading ? (
        <div className="text-center text-xl text-gray-300">Đang tải...</div>  // Loading message
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : searchResults.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold mb-4 mt-20 mx-auto"><p className="mx-auto">Kết quả tìm kiếm cho <span className="text-red-500">"{keyword}"</span></p> </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((item) => (
              <div
                key={item._id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700"
                onClick={() => handleMovieClick(item.slug)}
              >
                <img
                  src={`https://phimimg.com/${item.thumb_url}`}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded"
                />
                <h3 className="text-lg font-semibold mt-4 truncate">{item.name}</h3>
                <p className="text-sm text-gray-400">{item.origin_name}</p>
                <p className="text-sm text-gray-400">Năm: {item.year}</p>

              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Search;
