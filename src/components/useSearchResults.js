import { useState, useCallback } from "react";

const API_URL = "https://vit-tm-task.api.trademarkia.app/api/v3/us";

const useSearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, rows: 10, total: 0 });

  const fetchResults = useCallback(async (filters) => {
    setLoading(true);
    setError(null);

    const {
      input_query = "",
      input_query_type = "",
      owners = [],
      attorneys = [],
      law_firms = [],
      status = [],
      classes = [],
      mark_description_description = [],
      states = [],
      counties = [],
      page = 1,
      rows = 10,
      sort_by = "default",
      sort_order = "desc",
      exact_match = false,
      date_query = false,
    } = filters;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input_query,
          input_query_type,
          owners,
          attorneys,
          law_firms,
          status,
          classes,
          mark_description_description,
          states,
          counties,
          page,
          rows,
          sort_by,
          sort_order,
          exact_match,
          date_query
        })
      });

      if (!res.ok) throw new Error("Failed to fetch results");

      const data = await res.json();
      setResults(data.hits || []);
      setPagination({ page, rows, total: data.total || 0 });
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    pagination,
    fetchResults,
  };
};

export default useSearchResults;
