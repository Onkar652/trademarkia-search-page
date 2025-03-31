import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./OwnerResults.css"; 

const OwnerResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://vit-tm-task.api.trademarkia.app/api/v3/us", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input_query: query,
            input_query_type: "",
            sort_by: "default",
            status: [],
            exact_match: false,
            date_query: false,
            owners: [],
            attorneys: [],
            law_firms: [],
            mark_description_description: [],
            classes: [],
            page: 1,
            rows: 10,
            sort_order: "desc",
            states: [],
            counties: [],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const result = await response.json();
        setOwners(result.body?.hits?.hits || []);
      } catch (error) {
        console.error("Error fetching owner data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [query]);

  return (
    <div className="owner-results-container">
      <h2>Owner Results for "{query}"</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && owners.length === 0 && <p>No owners found.</p>}

      <div className="owner-cards">
        {!loading &&
          !error &&
          owners.length > 0 &&
          owners.map((owner, index) => {
            const source = owner._source || {};

            return (
              <div className="owner-card" key={index}>
                <h3>{source.current_owner || "Unknown Owner"}</h3>
                <p><strong>Trademarks:</strong> {source.class_codes?.length || "N/A"}</p>
                <p><strong>Attorney:</strong> {source.attorney || "N/A"}</p>
                <p><strong>Law Firm:</strong> {source.law_firm || "N/A"}</p>
                <p><strong>Mark:</strong> {source.mark_identification || "Not Available"}</p>
                <button className="view-more-btn">View More</button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OwnerResults;
