import React, { useState } from 'react';

const SearchBar = ({ onSearch, onToggleFilters }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={onToggleFilters}>Filters</button>
    </div>
  );
};

export default SearchBar;