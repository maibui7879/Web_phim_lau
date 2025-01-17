import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaFilm, FaClock, FaTv, FaChild, FaBroadcastTower, FaBars, FaArrowLeft, FaSearch } from 'react-icons/fa';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome className="mr-2" /> },
    { path: '/new-movies', label: 'Phim mới', icon: <FaClock className="mr-2" /> },
    { path: '/movies', label: 'Phim lẻ', icon: <FaFilm className="mr-2" /> },
    { path: '/series', label: 'Phim bộ', icon: <FaTv className="mr-2" /> },
    { path: '/animation', label: 'Phim Hoạt hình', icon: <FaChild className="mr-2" /> },
    { path: '/tv-shows', label: 'Phim truyền hình', icon: <FaBroadcastTower className="mr-2" /> },
  ];

  const getLinkClass = (path) =>
    location.pathname === path
      ? 'font-bold text-red-700'
      : 'hover:text-red-700 hover:font-bold';

  return (
    <>
      <header className="bg-gray-800 text-white fixed z-10 w-full shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="w-8 h-8 mr-2">
              <img src="logo.png" alt="Logo" className="w-full h-full object-contain" />
            </span>
            <Link to="/">
              BERO<span className="text-red-500">FLIX</span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-2 py-2 ${getLinkClass(path)}`}
              >
                {icon}
                {label}
              </Link>
            ))}
            <div className="flex items-center border border-gray-500 rounded-lg px-2">
              <input
                type="text"
                className="bg-gray-800 text-white px-2 py-1 outline-none"
                placeholder="Search..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button
                className="text-red-500 hover:text-white px-2"
                onClick={handleSearch}
              >
                <FaSearch />
              </button>
            </div>
          </nav>

          {/* Hamburger Menu for Mobile */}
          <button
            className="md:hidden flex items-center text-white text-2xl"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* Sidebar Modal */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="fixed left-0 top-0 bg-gray-800 text-white h-full w-64 shadow-lg z-30">
            <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={toggleSidebar} className="text-white text-2xl">
                <FaArrowLeft />
              </button>
            </div>
            <nav className="flex flex-col mt-4 space-y-4 px-4">
              {navLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-4 py-2 ${getLinkClass(path)}`}
                  onClick={toggleSidebar}
                >
                  {icon}
                  {label}
                </Link>
              ))}
              <div className="flex items-center border border-gray-500 rounded-lg px-2 ">
                <input
                  type="text"
                  className="bg-gray-800 text-white px-2 py-1 outline-none w-5/6"
                  placeholder="Search..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button
                  className=" bg-gray-800 text-red-500 hover:text-white"
                  onClick={() => {
                    handleSearch();
                    toggleSidebar();
                  }}
                >
                  <FaSearch />
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
