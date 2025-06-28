// src/pages/SearchPage/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/navbar';
import { Flex } from 'antd';
import { searchMovies } from '../../services/movies';
import styles from './search.module.css';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('query');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) {
                setSearchResults([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
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
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    return (
        <div>
            <Navbar />
            <div className={styles['main-content-area']}>
                <h1 className={styles['search-heading']}>Search Results for: "{searchQuery}"</h1>

                {loading && <p className={styles['loading-text']}>Loading results...</p>}
                {error && <p className={styles['error-message']}>{error}</p>}
                {!loading && !error && searchResults.length === 0 && (
                    <p className={styles['no-results']}>No movies found matching "{searchQuery}".</p>
                )}

                {!loading && !error && searchResults.length > 0 && (
                    <Flex vertical gap="30px" className={styles['results-container']}>
                        {searchResults.map((movie) => (
                            <div key={movie._id} className={styles['movie-card']}>
                                <img
                                    src={movie.poster}
                                    alt={movie.movieName + " Poster"}
                                    className={styles['movie-poster']}
                                />
                                <div className={styles['movie-details']}>
                                    <h3 className={styles['movie-title']}>
                                        {movie.movieName}{' '}
                                    </h3>
                                    <p className={styles['movie-date']}>
                                        {movie.releaseDate ? new Date(movie.releaseDate).toDateString() : 'Release date not available'}
                                    </p>
                                    <p className={styles['movie-description']}>
                                        {movie.description || 'No description available.'}
                                    </p>
                                    <p className={styles['movie-info']}><strong>Duration:</strong> {movie.duration}</p>
                                    <p className={styles['movie-info']}><strong>Genre:</strong>  {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                                    <p className={styles['movie-info']}><strong>Language:</strong> {movie.language}</p>
                                </div>
                            </div>
                        ))}
                    </Flex>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
