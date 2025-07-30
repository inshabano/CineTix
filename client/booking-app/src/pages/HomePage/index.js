import { useState, useEffect, useRef } from "react";
import { Flex } from "antd";
import { getAllMovies } from "../../services/movies";
import { Link } from "react-router-dom";
import "./index.css";
import Banner from "../../components/banner";
import Loader from "../../components/Loader";

const Home = () => {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    fetchMoviesData();
  }, []);

  const fetchMoviesData = async () => {
    setLoading(true);
    setError(null);
    setShowInitialLoader(true);

    try {
      const moviesData = await getAllMovies();
      console.log(moviesData);
      if (moviesData.success) {
        setMovies(moviesData.data);
      } else {
        setError(moviesData.message || "Failed to fetch movies.");
        setMovies([]);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("An unexpected error occurred while fetching movies.");
      setMovies([]);
    } finally {
      const minLoaderTime = 500;
      const startTime = Date.now();

      setLoading(false);

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

  if (showInitialLoader) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <div
          className="main-content-area"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h2>Error: {error}</h2>
          <p>Please try again later.</p>
        </div>
      </>
    );
  }

  return (
    <div>
      <Banner />

      <div className="main-content-area">
        <Flex justify="center" align="center" wrap>
          {movies && movies.length > 0
            ? movies.map((movie) => {
                return (
                  <Link
                    to={`/movie/${movie._id}`}
                    className="movie-link"
                    key={movie._id}
                  >
                    <div className="movie-card">
                      <img
                        width={230}
                        height={330}
                        src={movie.poster}
                        alt={movie.movieName + " Poster"}
                      />
                      <h3 width={200} wrap>
                        {movie.movieName}
                      </h3>
                    </div>
                  </Link>
                );
              })
            : !loading && (
                <p style={{ fontSize: "1.2em", color: "#555" }}>
                  No movies available.
                </p>
              )}
        </Flex>
      </div>
    </div>
  );
};

export default Home;
