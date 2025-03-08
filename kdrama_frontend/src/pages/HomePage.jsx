import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FilterBar from '../components/FilterBar';
import MovieBox from '../components/MovieBox';
import SearchBar from '../components/SearchBar';
import './HomePage.css'

const HomePage = () => {
  const [pages, setPages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    min_score: '',
    max_score: '',
    score: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const containerRef = useRef(null);
  const topSentinelRef = useRef(null);
  const bottomSentinelRef = useRef(null);
  const updatingRef = useRef(false);
  const prevPageRef = useRef(currentPage);

  // Fetch movies for a specific page and update pages state.
  const fetchKdramas = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/', {
        params: { ...filters, page: pageNumber, query: searchQuery },
      });
      const data = response.data;
      setPages((prev) => ({
        ...prev,
        [pageNumber]: data.results,
      }));
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes: reset pages and load page 1.
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPages({});
    setCurrentPage(1);
    fetchKdramas(1);
  };

  // Handle search submission.
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Hide the search bar when a query is submitted.
    setShowSearchBar(false);
    setPages({});
    setCurrentPage(1);
    fetchKdramas(1);
  };

  // Optionally, you could toggle a filter panel here.
  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Fetch initial page when filters or searchQuery change.
  useEffect(() => {
    fetchKdramas(1);
  }, [filters, searchQuery]);

  // Intersection Observers for top and bottom sentinels.
  useEffect(() => {
    const options = { root: containerRef.current, threshold: 0.5 };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (updatingRef.current) return; // skip if already updating

        // Scrolling Down: Bottom sentinel visible.
        if (entry.target === bottomSentinelRef.current && entry.isIntersecting) {
          if (currentPage < totalPages && !pages[currentPage + 1]) {
            updatingRef.current = true;
            fetchKdramas(currentPage + 1);
            setTimeout(() => {
              updatingRef.current = false;
            }, 500);
          }
          setCurrentPage((prev) => prev + 1);
        }

        // Scrolling Up: Top sentinel visible.
        if (entry.target === topSentinelRef.current && entry.isIntersecting) {
          if (currentPage > 1) {
            updatingRef.current = true;
            setCurrentPage((prev) => prev - 1);
            setTimeout(() => {
              updatingRef.current = false;
            }, 500);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);

    if (topSentinelRef.current) observer.observe(topSentinelRef.current);
    if (bottomSentinelRef.current) observer.observe(bottomSentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [pages, totalPages, currentPage]);

  // Listen to container scroll to toggle search bar visibility.
  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      // If scrolled near the top, show the search bar.
      if (scrollTop < 50) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
      }
    }
  };

  return (
    <div className="home-page">
      {showSearchBar && (
        <SearchBar onSearch={handleSearch} onToggleFilters={handleToggleFilters} />
      )}
      {showFilters && <FilterBar onFilterChange={handleFilterChange} className="filter-bar"/>}
      {error && <p>{error}</p>}
      <div
        className="movie-box-container"
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          overflowY: 'scroll',
          height: '80vh',
          scrollSnapType: 'y mandatory',
          position: 'relative',
        }}
      >
        {/* Top Sentinel */}
        <div ref={topSentinelRef} style={{ height: '20px' }} />

        {/* Render only the current page */}
        {pages[currentPage] && (
          <div
            key={currentPage}
            data-page={currentPage}
            style={{ scrollSnapAlign: 'start', minHeight: '80vh' }}
          >
            <MovieBox movies={pages[currentPage]} pageNumber={currentPage} />
          </div>
        )}

        {/* Bottom Sentinel */}
        <div ref={bottomSentinelRef} style={{ height: '20px' }} />
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default HomePage;
