import React from 'react';
import KdramaCard from './KdramaCard';
import './MovieBox.css'

const MovieBox = ({ movies, pageNumber }) => {
    return (
        <div className="movie-box">
            <h2>Page {pageNumber}</h2>
            <div className="movie-grid">
                {movies.map((movie) => (
                    <KdramaCard
                        key={movie.id}
                        title={movie.name}
                        score={movie.vote_average}
                        posterPath={movie.poster_path}
                        overview={movie.overview}
                    />
                ))}
            </div>

        </div>
    );
};

export default MovieBox;