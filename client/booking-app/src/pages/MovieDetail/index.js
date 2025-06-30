import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import styles from './movieDetail.module.css';
import { getMovieData } from "../../services/movies";
import Navbar from "../../components/navbar";

const MovieDetail = () => {
    const [movie, setMovie] = useState(null);
    const { movieid } = useParams();

    useEffect(() => {
        fetchMovieDetails();
    }, []);

    const fetchMovieDetails = async () => {
        const response = await getMovieData(movieid);
        if (response.success) {
            setMovie(response.data);
        }
    };

    if (!movie) return <div className={styles.loading}>Loading movie details...</div>;

    return (
        <div>
        <Navbar/>
        <div className={styles.container}>
            <div className={styles.posterDetailsBackground}
            style={{ backgroundImage: `url(${movie.poster})` }}
            >
            <div className={styles.posterDetailsOverlay}>
                <img src={movie.poster} alt={movie.movieName} className={styles.poster} />
                <div className={styles.details}>
                <h2>{movie.movieName}</h2>
                <p><strong>Duration:</strong> {movie.duration} mins</p>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <p><strong>Language:</strong> {movie.language}</p>
                <p><strong>Release Date:</strong> {movie.releaseDate}</p>
                </div>
            </div>
            </div>


            <div className={styles.aboutSection}>
                <h3>About the Movie</h3>
                <p>{movie.description}</p>
            </div>

            <div className={styles.peopleSection}>
                <h3>Director</h3>
                <div className={styles.personCard}>
                    <img src={movie.directorPhoto} alt={movie.director} className={styles.personPhoto} />
                    <p>{movie.director}</p>
                </div>

                <h3>Cast</h3>
                <div className={styles.castList}>
                    {movie.cast?.map((actor, index) => (
                        <div key={index} className={styles.personCard}>
                            <img src={actor.photo} alt={actor.name} className={styles.personPhoto} />
                            <p>{actor.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
};

export default MovieDetail;
