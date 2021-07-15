import React, { useState, useEffect, useRef } from 'react';

//API
import API from '../API';

const initialState = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

const useHomeFetch = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchMovie = async (page, searchTerm = '') => {
    try {
      setError(false);
      setLoading(true);

      const movies = await API.fetchMovies(searchTerm, page);

      setState((prev) => ({
        ...movies,
        results:
          page > 1 ? [...prev.results, ...movies.results] : [...movies.results],
      }));
      setLoading(false);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchMovie(1, searchTerm);
  }, [searchTerm]);

  return { state, loading, error, setSearchTerm, searchTerm };
};

export { useHomeFetch };
