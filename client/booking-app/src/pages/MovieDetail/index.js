import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import styles from './movieDetail.module.css';
import { getMovieData } from "../../services/movies";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

const getLocalFormattedDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MovieDetail = () => {
    const [movie, setMovie] = useState(null);
    const { movieid } = useParams();
    const navigate = useNavigate();
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await getMovieData(movieid);
                if (response && response.data) {
                    setMovie(response.data);
                } else {
                    console.error("Failed to fetch movie data:", response);
                    setMovie(null);
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setMovie(null);
            }
        };

        fetchMovieDetails();
    }, [movieid]);

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

    if (!movie) {
        return (
            <>
                <Navbar />
                <div className={styles.loadingMessage}>Loading movie details...</div>
                <Footer />
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
            <Navbar />

            <div
                className={styles.posterDetailsBackground}
                style={{ backgroundImage: `url(${movie.poster})` }}
            >
                <div className={styles.posterDetailsOverlay}>
                    <img src={movie.poster} alt={movie.movieName} className={styles.poster} />

                    <div className={styles.details}>
                        <h2>{movie.movieName}</h2>
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
            <Footer/>
        </div>
    );
};

export default MovieDetail;