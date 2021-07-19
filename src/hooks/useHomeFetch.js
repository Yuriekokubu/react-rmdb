import React, { useState, useEffect, useRef } from 'react';

//API
import API from '../API';

//Helpers
import { isPersistedState } from '../helpers';

const initialState = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

const useHomeFetch = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isloadingMore, setIsloadingMore] = useState(false);

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
    if (!searchTerm) {
      const sessionState = isPersistedState('homeState');

      if (sessionState) {
        console.log('Grabbing from SessionStorage');
        setState(sessionState);
        return;
      }
    }
    console.log('Grabbing from API');
    setState(initialState);
    fetchMovie(1, searchTerm);
  }, [searchTerm]);

  // Load More
  useEffect(() => {
    if (!isloadingMore) return;

    fetchMovie(state.page + 1, searchTerm);
    setIsloadingMore(false);
  }, [isloadingMore, searchTerm, state.page]);

  //Write to SessionStorage
  useEffect(() => {
    if (!searchTerm) sessionStorage.setItem('homeState', JSON.stringify(state));
  }, [searchTerm, state]);

  return {
    state,
    loading,
    error,
    setSearchTerm,
    searchTerm,
    setIsloadingMore,
  };
};

export { useHomeFetch };
