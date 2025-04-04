import { useState } from "react";
import "./owenr.css";

const ownerSuggestions = [
  { name: "Nike inc.", count: 123 },
  { name: "Brs inc.", count: 7 },
  { name: "Nike securities lp", count: 4 },
  { name: "Adar import and distributing corporation", count: 2 },
  { name: "Better packages incorporated", count: 1 },
  { name: "Campomar s l", count: 1 },
  { name: "Campomar sl", count: 1 },
  { name: "Campomar sociedad limitada", count: 1 },
  { name: "Cho dongho", count: 1 },
  { name: "Conrad landry", count: 1 }
];

const YourComponent = () => {
  const [owner, setOwner] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lawFirm, setLawFirm] = useState("");
  const [attorney, setAttorney] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOwnerChange = (e) => {
    setOwner(e.target.value);
    setShowSuggestions(true);
  };

  const handleOwnerSelect = (name) => {
    setOwner(name);
    setShowSuggestions(false);
  };

  const filteredSuggestions = ownerSuggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(owner.toLowerCase())
  );

  const fetchData = async () => {
    setLoading(true);
    let url = "https://vit-tm-task.api.trademarkia.app/api/v3/us";
    if (owner) {
      const encodedOwner = encodeURIComponent(owner);
      url += `?owners=${encodedOwner}`;
    }

    const bodyData = {
        input_query: owner
          ? "owners"
          : attorney
          ? "attorneys"
          : lawFirm
          ? "law_firms"
          : "", // default or fallback
      
        input_query_type: "",
        sort_by: "default",
        status: status ? [status.toLowerCase()] : [],
        exact_match: false,
        date_query: false,
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
      

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      setResults(data?.body?.hits?.hits || []);
    } catch (error) {
      console.error("❌ API Fetch Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setOwner("");
    setLawFirm("");
    setAttorney("");
    setStatus("");
    setResults([]);
  };

  return (
    <div className="filters-wrapper">
      <div className="filters-section">
        <h3>Filters</h3>

        <div className="autocomplete-container">
  <input
    type="text"
    placeholder="Owner"
    value={owner}
    onChange={handleOwnerChange}
    onFocus={() => setShowSuggestions(true)}
    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
  />
  {showSuggestions && filteredSuggestions.length > 0 && (
    <ul className="suggestion-list">
      {filteredSuggestions.map((suggestion, i) => (
        <li
          key={i}
          onMouseDown={() => handleOwnerSelect(suggestion.name)}
        >
          {suggestion.name} ({suggestion.count})
        </li>
      ))}
    </ul>
  )}
</div>


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
          <option value="registered">Registered</option>
          <option value="dead">Dead</option>
        </select>

        <button className="search-btn" onClick={fetchData}>
          Search
        </button>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="results-section">
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          results.map((item, index) => {
            const source = item._source;
            return (
              <div key={index} className="result-item">
                <h4>{source.mark_identification}</h4>
                <p><strong>Owner:</strong> {source.current_owner}</p>
                <p><strong>Law Firm:</strong> {source.law_firm}</p>
                <p><strong>Attorney:</strong> {source.attorney_name}</p>
                <p><strong>Status:</strong> {source.status_type}</p>
                <p><strong>Registration No:</strong> {source.registration_number}</p>
                <p><strong>Filing Date:</strong> {new Date(source.filing_date * 1000).toLocaleDateString()}</p>
                <details>
                  <summary>Descriptions</summary>
                  <ul>
                    {source.mark_description_description?.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </details>
              </div>
            );
          })
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default YourComponent;
