import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Flex } from "antd";
import { searchMovies } from "../../services/movies";
import styles from "./search.module.css";
import Loader from "../../components/Loader";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setError(null);
      setShowInitialLoader(true);

      if (!searchQuery) {
        setSearchResults([]);
        setShowInitialLoader(false);
        return;
      }

      try {
        const response = await searchMovies(searchQuery);
        if (response.success) {
          setSearchResults(response.data);
        } else {
          setError(response.message || "Could not fetch search results.");
          setSearchResults([]);
        }
      } catch (err) {
        setError("An error occurred while fetching search results.");
        setSearchResults([]);
      } finally {
        const minLoaderTime = 500;
        const startTime = Date.now();

        const elapsedTime = Date.now() - startTime;
        const remainingTime = minLoaderTime - elapsedTime;

        if (remainingTime > 0) {
          setTimeout(() => {
            setShowInitialLoader(false);
          }, remainingTime);
        } else {
          setShowInitialLoader(false);
        }
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  if (showInitialLoader) {
    return <Loader />;
  }

  return (
    <div>
      <div className={styles["main-content-area"]}>
        <h1 className={styles["search-heading"]}>
          Search Results for: "{searchQuery}"
        </h1>

        {error && <p className={styles["error-message"]}>{error}</p>}
        {!error && searchResults.length === 0 && (
          <p className={styles["no-results"]}>
            {searchQuery
              ? `No movies found matching "${searchQuery}".`
              : "Please enter a search query."}
          </p>
        )}

        {!error && searchResults.length > 0 && (
          <Flex vertical gap="30px" className={styles["results-container"]}>
            {searchResults.map((movie) => (
              <Link to={`/movie/${movie._id}`} key={movie._id}>
                <div className={styles["movie-card"]}>
                  <img
                    src={movie.poster}
                    alt={movie.movieName + " Poster"}
                    className={styles["movie-poster"]}
                  />
                  <div className={styles["movie-details"]}>
                    <h3 className={styles["movie-title"]}>
                      {movie.movieName}{" "}
                    </h3>
                    <p className={styles["movie-date"]}>
                      {movie.releaseDate
                        ? new Date(movie.releaseDate).toDateString()
                        : "Release date not available"}
                    </p>
                    <p className={styles["movie-description"]}>
                      {movie.description || "No description available."}
                    </p>
                    <p className={styles["movie-info"]}>
                      <strong>Duration:</strong> {movie.duration}
                    </p>
                    <p className={styles["movie-info"]}>
                      <strong>Genre:</strong>{" "}
                      {Array.isArray(movie.genre)
                        ? movie.genre.join(", ")
                        : movie.genre}
                    </p>
                    <p className={styles["movie-info"]}>
                      <strong>Language:</strong> {movie.language}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </Flex>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
