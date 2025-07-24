import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import styles from './TheatresShowsPage.module.css';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { getTheatresAndShowtimes } from '../../services/shows';
import { getMovieData } from '../../services/movies';
import Loader from '../../components/Loader';

const getLocalFormattedDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TheatresShowsPage = () => {
    const { movieid } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedDate, setSelectedDate] = useState(() => {
        const dateParam = searchParams.get('date');
        let initialDate;
        if (dateParam) {
            const parts = dateParam.split('-');
            initialDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
            initialDate = new Date();
        }
        initialDate.setHours(0, 0, 0, 0);
        return initialDate;
    });

    const [theatres, setTheatres] = useState([]);
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            const formattedDate = getLocalFormattedDateString(selectedDate);

            try {
                const movieResponse = await getMovieData(movieid);
                if (movieResponse && movieResponse.success) {
                    setMovieDetails(movieResponse.data);
                } else {
                    console.error("Failed to fetch movie details:", movieResponse);
                    setError(movieResponse?.message || "Failed to load movie details.");
                    // Do not return here, allow showsResponse to try fetching
                }

                const showsResponse = await getTheatresAndShowtimes(movieid, formattedDate);
                if (showsResponse && showsResponse.success) {
                    setTheatres(showsResponse.data);
                } else {
                    setError(showsResponse?.message || "Failed to load theatres and showtimes.");
                    setTheatres([]);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("An error occurred while fetching data. Please try again.");
                setTheatres([]);
            } finally {
                // Introduce a minimum loading time for the loader
                const minLoaderTime = 500;
                const startTime = Date.now();

                const elapsedTime = Date.now() - startTime;
                const remainingTime = minLoaderTime - elapsedTime;

                if (remainingTime > 0) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, remainingTime);
                } else {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [movieid, selectedDate, location.search]);


    const getCalendarDates = () => {
        const dates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 5; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const handleDateChange = (date) => {
        date.setHours(0, 0, 0, 0);
        setSelectedDate(date);
        const formattedDate = getLocalFormattedDateString(date);
        setSearchParams({ date: formattedDate });
    };

    if (isLoading) {
        return <Loader />; // Use the Loader component
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className={styles.errorMessage}>Error: {error}</div>
                <Footer />
            </>
        );
    }

    const calendarDates = getCalendarDates();

    return (
        <div className={styles.container}>
            <Navbar />

            <div className={styles.movieHeader}>
                <h1>
                    {movieDetails?.movieName}
                    {movieDetails?.language && <span className={styles.movieLanguage}> ({movieDetails.language})</span>}
                </h1>
                {movieDetails?.genre && movieDetails.genre.length > 0 && (
                    <div className={styles.movieGenres}>
                        {movieDetails.genre.map((g, index) => (
                            <span key={index} className={styles.genreTag}>{g}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.horizontalCalendar}>
                {calendarDates.map((date) => {
                    const isSelected = date.getTime() === selectedDate.getTime();
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                    const dayOfMonth = date.getDate();
                    const monthShort = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

                    return (
                        <div
                            key={date.toISOString()}
                            className={`${styles.dateCard} ${isSelected ? styles.selectedDateCard : ''}`}
                            onClick={() => handleDateChange(date)}
                        >
                            <span className={styles.dayOfWeek}>{dayOfWeek}</span>
                            <span className={styles.dayOfMonth}>{dayOfMonth}</span>
                            <span className={styles.monthShort}>{monthShort}</span>
                        </div>
                    );
                })}
            </div>

            <div className={styles.theatreList}>
                {theatres.length === 0 ? (
                    <p className={styles.noShowsMessage}>No shows available for {movieDetails?.movieName || 'this movie'} on {selectedDate.toDateString()}.</p>
                ) : (
                    theatres.map(theatre => (
                        <div key={theatre._id} className={styles.theatreCard}>
                            <div className={styles.theatreCardContent}>
                                <div className={styles.theatreDetails}>
                                    <div className={styles.theatreNameAddress}>
                                        <div className={styles.theatreNameWrapper}>
                                            <h3>{theatre.name}</h3>
                                        </div>
                                        <p className={styles.theatreAddress}>{theatre.address}</p>
                                        <div className={styles.theatreFeatures}>
                                            <span className={styles.featureIcon}>📱 M-Ticket</span>
                                            <span className={styles.featureIcon}>🍔 Food & Beverage</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.showtimesWrapper}>
                                    {theatre.showtimes.length > 0 ? (
                                        theatre.showtimes
                                            .sort((a, b) => {
                                                const timeA = new Date(`1970/01/01 ${a.time}`);
                                                const timeB = new Date(`1970/01/01 ${b.time}`);
                                                return timeA - timeB;
                                            })
                                            .map(showtime => (
                                                <Link
                                                    to={`/booking/${showtime.showId}`}
                                                    key={showtime.showId}
                                                    className={styles.showtimeBtn}
                                                >

                                                    {showtime.time}
                                                    {showtime.type && <span className={styles.showtimeType}>{showtime.type}</span>}
                                                </Link>

                                            ))
                                    ) : (
                                        <p className={styles.noShowtimesForTheatre}>No showtimes for this theatre on this date.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Footer />
        </div>
    );
};

export default TheatresShowsPage;