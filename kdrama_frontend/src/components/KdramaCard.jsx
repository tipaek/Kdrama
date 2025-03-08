import React from 'react';

const KdramaCard = ({ title, score, posterPath, overview }) => {
  return (
    <div className="kdrama-card">
      <img src={`https://image.tmdb.org/t/p/w200${posterPath}`} alt={title} />
      <h3>{title}</h3>
      <p>Rating: {score}</p>
      <p>{overview}</p>
    </div>
  );
};

export default KdramaCard;
