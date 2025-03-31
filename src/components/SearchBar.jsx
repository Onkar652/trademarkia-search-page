import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css"; 

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("");
  const [lawFirm, setLawFirm] = useState("");
  const [attorney, setAttorney] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter a search term");
      return;
    }

  
    const params = new URLSearchParams({ query });
    if (owner) params.set("owner", owner);
    if (lawFirm) params.set("lawFirm", lawFirm);
    if (attorney) params.set("attorney", attorney);
    if (status) params.set("status", status);

    navigate(`/search/trademark?${params.toString()}`);
  };

  return (
    <div className="search-container">
      {/* Search Bar */}
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>

     
      <div className="filters">
        <input
          type="text"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          type="text"
          placeholder="Law Firm"
          value={lawFirm}
          onChange={(e) => setLawFirm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Attorney"
          value={attorney}
          onChange={(e) => setAttorney(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

     
      <div className="search-menu">
        <button
          className="trademark-button"
          onClick={() => navigate(`/search/trademark?query=${query}`)}
        >
          Trademarks
        </button>
        <button
          className="owner-button"
          onClick={() => navigate(`/search/owner?query=${query}`)}
        >
          Owners
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
