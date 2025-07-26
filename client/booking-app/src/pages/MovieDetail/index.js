import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import styles from './movieDetail.module.css';
import { getMovieData } from "../../services/movies";
import { addMovieToWatchlist, removeMovieFromWatchlist, getWatchlist } from "../../services/watchlist";
import Loader from '../../components/Loader'; 
import mojs from '@mojs/core';
import $ from 'jquery';

const getLocalFormattedDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MovieDetail = () => {
    const [error, setError] = useState(null);
    const [showInitialLoader, setShowInitialLoader] = useState(true);
    const [movie, setMovie] = useState(null);
    const { movieid } = useParams();
    const navigate = useNavigate();
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(true);
     const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const heartButtonRef = useRef(null);
    const mojsTimelineRef = useRef(null);


    useEffect(() => {
        const fetchMovieDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getMovieData(movieid);
                if (response && response.data) {
                    setMovie(response.data);
                } else {
                    console.error("Failed to fetch movie data:", response);
                    setMovie(null);
                    setError(response.message || "Failed to fetch movie details.");
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setMovie(null);
                setError("An unexpected error occurred while fetching movie details.");
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

        fetchMovieDetails();
    }, [movieid]);

   useEffect(() => {
        if (heartButtonRef.current && mojs) { 
            const el = heartButtonRef.current;

            
            if (!mojsTimelineRef.current) {
                const scaleCurve = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');

                const tween1 = new mojs.Burst({
                    parent: el,
                    radius: { 0: 100 },
                    angle: { 0: 45 },
                    y: -10,
                    count: 10,
                    children: {
                        shape: 'circle',
                        radius: 30,
                        fill: ['red', 'white'],
                        strokeWidth: 15,
                        duration: 500,
                    }
                });

                const tween2 = new mojs.Tween({
                    duration: 900,
                    onUpdate: function(progress) {
                        const scaleProgress = scaleCurve(progress);
                        el.style.WebkitTransform = el.style.transform = 'scale3d(' + scaleProgress + ',' + scaleProgress + ',1)';
                    }
                });
                
                const tween3 = new mojs.Burst({
                    parent: el,
                    radius: { 0: 100 },
                    angle: { 0: -45 },
                    y: -10,
                    count: 10,
                    children: {
                        shape: 'circle',
                        radius: 30,
                        fill: ['white', 'red'],
                        strokeWidth: 15,
                        duration: 400,
                    }
                });

                const timeline = new mojs.Timeline();
                timeline.add(tween1, tween2, tween3);
                mojsTimelineRef.current = timeline; 
            }

            
            if (isInWatchlist) {
                el.classList.add(styles.activeHeart); 
            } else {
                el.classList.remove(styles.activeHeart);
            }

            
            return () => {
                
                
            };
        }
    }, [isInWatchlist, movieid]); 

    const handleWatchlistToggle = async () => {
        if (!movieid) return;

        setWatchlistLoading(true);
        try {
            let response;
            if (isInWatchlist) {
                response = await removeMovieFromWatchlist(movieid);
            } else {
                response = await addMovieToWatchlist(movieid);
            }

            if (response.success) {
                setIsInWatchlist(!isInWatchlist); 
                
                if (!isInWatchlist && mojsTimelineRef.current) {
                    mojsTimelineRef.current.replay(); 
                }
            } else {
                if (response.message === "User not authenticated.") {
                    alert("Please log in to add movies to your watchlist.");
                    navigate('/login');
                } else {
                    alert(response.message || "Failed to update watchlist.");
                }
            }
        } catch (err) {
            console.error("Watchlist operation failed:", err);
            alert("An error occurred. Please try again.");
        } finally {
            setWatchlistLoading(false);
        }
    };


    const getSelectableDates = () => {
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const handleDateSelect = (date) => {
        const formattedDate = getLocalFormattedDateString(date);
        setShowCalendar(false);
        navigate(`/movie/${movieid}/shows?date=${formattedDate}`);
    };

  
    if (showInitialLoader) {
        return <Loader />;
    }
    
    
    if (error) {
        return (
            <>
                <div className="ms-3 pt-3">
                    <h2>Error: {error}</h2>
                </div>
            </>
        );
    }

    if (!movie) {
        return (
            <>
                <div className={styles.loadingMessage}>No movie details found.</div>
            </>
        );
    }

    const directorName = movie.director && movie.director.name ? movie.director.name : 'N/A';
    const castData = movie.cast && Array.isArray(movie.cast) ? movie.cast : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const selectableDates = getSelectableDates();
    
    return (
        <div className={styles.container}>

            <div
                className={styles.posterDetailsBackground}
                style={{ backgroundImage: `url(${movie.poster})` }}
            >
                <div className={styles.posterDetailsOverlay}>
                    <img src={movie.poster} alt={movie.movieName} className={styles.poster} />

                    <div className={styles.details}>
                       <div className={styles.titleAndWatchlist}>
                            <h2>{movie.movieName}</h2>
                            {/* The heart button element */}
                            <div 
                                id="heart" 
                                ref={heartButtonRef} 
                                className={`${styles.watchlistHeartButton} ${isInWatchlist ? styles.activeHeart : ''}`} 
                                onClick={handleWatchlistToggle}
                                disabled={watchlistLoading} 
                                title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                            >
                            </div>
                        </div>
                        <p><strong>Duration:</strong> {movie.duration}</p>
                        <p><strong>Genre:</strong> {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                        <p><strong>Language:</strong> {movie.language}</p>
                        <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}</p>

                        <button
                            className={styles.bookButton}
                            onClick={() => setShowCalendar(true)}
                        >
                            🎟️ Book Now
                        </button>
                    </div>
                </div>
            </div>

            {showCalendar && (
                <div className={styles.calendarOverlay}>
                    <div className={styles.calendarBox}>
                        <button className={styles.closeCalendarBtn} onClick={() => setShowCalendar(false)}>X</button>
                        <h3>Select a Date</h3>
                        <div className={styles.simpleCalendar}>
                            <div className={styles.calendarHeader}>
                                <span className={styles.monthYear}>{currentMonthYear}</span>
                                <div className={styles.navArrows}>
                                    <span className={`${styles.arrow} ${styles.disabled}`}>&lt;</span>
                                    <span className={`${styles.arrow} ${styles.disabled}`}>&gt;</span>
                                </div>
                            </div>
                            <div className={styles.weekDays}>
                                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                            </div>
                            <div className={styles.daysGrid}>
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                    <span key={`empty-${i}`} className={styles.emptyDay}></span>
                                ))}

                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                    const dateObj = new Date(today.getFullYear(), today.getMonth(), day);
                                    dateObj.setHours(0, 0, 0, 0);

                                    const isSelectable = selectableDates.some(
                                        d => d.getTime() === dateObj.getTime()
                                    );
                                    const isToday = dateObj.getTime() === today.getTime();

                                    return (
                                        <span
                                            key={day}
                                            className={`${styles.day} ${isSelectable ? styles.selectableDay : styles.disabledDay} ${isToday ? styles.todayDay : ''}`}
                                            onClick={() => isSelectable && handleDateSelect(dateObj)}
                                        >
                                            {day}
                                        </span>
                                    );
                                })}
                            </div>
                            <div className={styles.calendarFooter}>
                                <button className={styles.todayButton} onClick={() => handleDateSelect(new Date())}>Today</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className={styles.aboutSection}>
                <h3>🎞️ About the Movie</h3>
                <p>{movie.description}</p>
            </div>

            <div className={styles.peopleSection}>
                <h3>🎬 Director</h3>
                <div className={styles.castList}>
                    <div className={styles.personCard}>
                        {movie.director && movie.director.photo ? (
                            <img src={movie.director.photo} alt={movie.director.name} className={styles.personPhoto} />
                        ) : (
                            <div className={styles.personPhotoPlaceholder}>?</div>
                        )}
                        <span className={styles.personName}>{directorName}</span>
                    </div>
                </div>

                <h3>🎭 Cast</h3>
                <div className={styles.castList}>
                    {castData.length > 0 ? (
                        castData.map((actor, index) => (
                            <div key={index} className={styles.personCard}>
                                {actor.photo ? (
                                    <img src={actor.photo} alt={actor.name} className={styles.personPhoto} />
                                ) : (
                                    <div className={styles.personPhotoPlaceholder}>?</div>
                                )}
                                <span className={styles.personName}>{actor.name}</span>
                                {actor.characterName && (
                                    <span className={styles.characterName}>({actor.characterName})</span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No cast information available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;