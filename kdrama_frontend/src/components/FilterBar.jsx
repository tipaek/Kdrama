import React, { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [score, setScore] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      min_score: minScore,
      max_score: maxScore,
      score: score,
    });
  };

  return (
    <div className="filter-bar">
      <input
        type="number"
        placeholder="Min Score"
        value={minScore}
        onChange={(e) => setMinScore(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Score"
        value={maxScore}
        onChange={(e) => setMaxScore(e.target.value)}
      />
      <input
        type="number"
        placeholder="Exact Score"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
      <button onClick={handleFilterChange}>Apply Filters</button>
    </div>
  );
};

export default FilterBar;
