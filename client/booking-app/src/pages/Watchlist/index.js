import React, { useEffect, useState } from "react";
import {
  getWatchlist,
  removeMovieFromWatchlist,
} from "../../services/watchlist";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import styles from "./watchlist.module.css";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWatchlist();
      if (response.success) {
        const validWatchlist = response.data.filter((movie) => movie !== null);
        setWatchlist(validWatchlist);
      } else {
        if (response.message === "User not authenticated.") {
          alert("Please log in to view your watchlist.");
          navigate("/login");
        } else {
          setError(response.message || "Failed to fetch watchlist.");
        }
      }
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      setError("An unexpected error occurred while fetching your watchlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (movieId) => {
    setLoading(true);
    try {
      const response = await removeMovieFromWatchlist(movieId);
      if (response.success) {
        fetchUserWatchlist();
      } else {
        alert(response.message || "Failed to remove movie.");
      }
    } catch (err) {
      console.error("Error removing movie:", err);
      alert("An error occurred while removing the movie.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className={styles.emptyWatchlist}>
          Your watchlist is empty. Start adding some movies!
        </p>
      ) : (
        <div className={styles.movieGrid}>
          {watchlist.map((movie) => (
            <div key={movie._id} className={styles.movieCard}>
              <img
                src={movie.poster}
                alt={movie.movieName}
                className={styles.moviePoster}
                onClick={() => navigate(`/movie/${movie._id}`)}
              />
              <h3 className={styles.movieTitle}>{movie.movieName}</h3>
              <p className={styles.movieGenre}>
                {Array.isArray(movie.genre)
                  ? movie.genre.join(", ")
                  : movie.genre}
              </p>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveFromWatchlist(movie._id)}
                disabled={loading}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
