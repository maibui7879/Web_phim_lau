import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [embedLink, setEmbedLink] = useState(null); // State to store the embed link
  const iframeRef = useRef(null); // Ref for the iframe element

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`https://phimapi.com/phim/${slug}`);
        console.log("API Response:", response.data);

        if (response.data?.episodes) {
          response.data.movie.episodes = response.data.episodes;
        } else {
          console.error("Episodes data is missing from the API response.");
        }

        setMovie(response.data.movie);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  const handleEpisodeClick = (episodeSlug) => {
    console.log("Episode slug clicked:", episodeSlug);

    if (!movie?.episodes || !Array.isArray(movie.episodes)) {
      console.error('Movie or episodes data is missing or not in the expected format.');
      return;
    }

    // Find the episode in the movie's episodes array
    const episode = movie.episodes.find((server) =>
      server.server_data?.some((data) => data.slug === episodeSlug)
    );

    if (episode) {
      const selectedData = episode.server_data.find((data) => data.slug === episodeSlug);
      if (selectedData && selectedData.link_embed) {
        console.log("Embed Link found:", selectedData.link_embed);
        setEmbedLink(selectedData.link_embed); // Set the embed link state
      } else {
        console.log("Embed link not found for this episode.");
        setEmbedLink(null); // Reset if no link is found
      }
    } else {
      console.log("Episode not found.");
    }
  };

  useEffect(() => {
    if (embedLink && iframeRef.current) {
      // Scroll to the iframe once the embed link is set
      iframeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [embedLink]); // Only trigger the scroll when embedLink changes

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (!movie) {
    return <div className="text-center text-white">Movie not found.</div>;
  }

  const hasSingleEpisode = movie.episode_total === "1"; // Check if there is only one episode

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-4">
      <div className="min-h-screen bg-gray-800 text-white p-6 w-1/2 mx-auto ">
        <div className="flex flex-col md:flex-row items-start mt-12">
          <img
            src={movie.poster_url}
            alt={movie.name}
            className="w-full md:w-1/3 rounded-lg shadow-lg mb-4 md:mb-0"
          />
          <div className="md:ml-6 flex-1">
            <h1 className="text-3xl font-bold mb-6">{movie.name}</h1>
            <p className="text-sm mb-4">{movie.content}</p>
            <p className="text-sm text-gray-400 mb-2"><b>Đạo diễn:</b> {movie.director[0] || 'Unknown'}</p>
            <p className="text-sm text-gray-400 mb-2"><b>Diễn viên:</b> {movie.actor.join(', ')}</p>
          </div>
        </div>

        {/* Display iframe when embed link is available */}
        {embedLink && !hasSingleEpisode && (
          <div className="mt-6" ref={iframeRef}>
            <h2 className="text-2xl font-bold mb-6 ml-4">Xem phim ngay:</h2>
            <iframe
              src={embedLink}
              frameBorder="0"
              width="100%"
              height="500px"
              title="Episode Video"
              allowFullScreen
            />
          </div>
        )}

        {/* Display iframe for single episode movies */}
        {hasSingleEpisode && movie.episodes && movie.episodes[0]?.server_data && movie.episodes[0]?.server_data[0]?.link_embed && (
          <div className="mt-6" ref={iframeRef}>
            <h2 className="text-2xl font-bold mb-6 ml-4">Xem phim ngay:</h2>
            <iframe
              src={movie.episodes[0].server_data[0].link_embed}
              frameBorder="0"
              width="100%"
              height="500px"
              title="Episode Video"
              allowFullScreen
            />
          </div>
        )}

        {/* Display episode selection for movies with multiple episodes */}
        {!hasSingleEpisode && (
          <>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Chọn tập phim</h2>
            <div className="grid grid-cols-5 gap-2 mt-8">
              {[...Array(parseInt(movie.episode_total))].map((_, index) => (
                <button
                  key={index}
                  className="px-2 py-1 bg-gray-600 rounded hover:bg-blue-500 text-white"
                  onClick={() => handleEpisodeClick(`tap-${String(index + 1).padStart(2, '0')}`)} // Ensure format is "tap-01", "tap-02"
                >
                  Tập {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
