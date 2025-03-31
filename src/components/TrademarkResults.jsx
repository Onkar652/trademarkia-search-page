import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TrademarkResults.css";
import SearchPage from "./SearchBar";

const TrademarkResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  
  // Filter states
  const [owner, setOwner] = useState("");
  const [lawFirm, setLawFirm] = useState("");
  const [attorney, setAttorney] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchTrademarkData = async () => {
      if (!query) return;
      setLoading(true);
      setError(null);
      
      try {
        const url = `https://vit-tm-task.api.trademarkia.app/api/v3/us`;
        const requestBody = {
          input_query: query,
          input_query_type: "",
          sort_by: "default",
          status: status ? [status] : [],
          exact_match: false,
          date_query: false,
          owners: owner ? [owner] : [],
          attorneys: attorney ? [attorney] : [],
          law_firms: lawFirm ? [lawFirm] : [],
          mark_description_description: [],
          classes: [],
          page: 1,
          rows: 10,
          sort_order: "desc",
          states: [],
          counties: [],
        };
        
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }
        
        const result = await response.json();
        setData(result.body?.hits?.hits || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrademarkData();
  }, [query, owner, lawFirm, attorney, status]);

  const handleFilterChange = () => {
    const params = new URLSearchParams({ query });
    if (owner) params.set("owner", owner);
    if (lawFirm) params.set("lawFirm", lawFirm);
    if (attorney) params.set("attorney", attorney);
    if (status) params.set("status", status);
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="trademark-results">
      <h2>Trademark Results {query ? `for "${query}"` : ""}</h2>

      {/* Filters Section */}
      <div className="filters">
        <input type="text" placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <input type="text" placeholder="Law Firm" value={lawFirm} onChange={(e) => setLawFirm(e.target.value)} />
        <input type="text" placeholder="Attorney" value={attorney} onChange={(e) => setAttorney(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={handleFilterChange}>Apply Filters</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && data.length === 0 && <p>No trademarks found.</p>}

      {!loading && !error && data.length > 0 && (
        <table className="trademark-table">
          <thead>
            <tr>
              <th>Mark</th>
              <th>Details</th>
              <th>Status</th>
              <th>Class / Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item._source?.mark_identification || "No Name"}</td>
                <td>
                  <strong>Owner:</strong> {item._source?.owner || "Unknown"} <br />
                  <strong>Attorney:</strong> {item._source?.attorneys?.join(", ") || "N/A"} <br />
                  <strong>Law Firm:</strong> {item._source?.law_firm || "N/A"} <br />
                  <strong>Reg. No.:</strong> {item._source?.registration_number || "N/A"}
                </td>
                <td>{item._source?.status_type || "N/A"}</td>
                <td>
                  <strong>Class:</strong> {item._source?.class_codes?.join(", ") || "N/A"} <br />
                  <strong>Description:</strong> {item._source?.mark_description_description?.join(" | ") || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrademarkResults;