import { useState, useEffect, useRef } from 'react';
import Navbar from "..//../components/navbar";
import {Flex} from "antd";
import { getAllMovies } from '../../services/movies';
import './index.css'

const Home = () => {
    const [movies, setMovies] = useState(null);
    useEffect(() => {
        fetchMoviesData();
    },[]);

    const fetchMoviesData = async ()=>{
        const moviesData = await getAllMovies();
        console.log(moviesData)
        if(moviesData.success){
            setMovies(moviesData.data)
        }
    }

    return(
        <div>
            <Navbar/>
            <div className="main-content-area">
                <Flex justify='center' align='center' wrap>
                    {
                        movies && movies.map((movie) => {
                            return (
                                <div key={movie._id} className='movie-card'>
                                    <img width={230} height={330} src={movie.poster} alt={movie.movieName + " Poster"} />
                                    <h3 width={200} wrap>{movie.movieName}</h3>
                                </div>
                            )
                        })
                    }
                </Flex>
            </div>
        </div>
    )
}

export default Home;