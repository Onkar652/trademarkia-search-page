import React, { useState, useEffect } from "react";
import "./SearchBar.css";
import YourComponent from "./owner";
const SearchLayout = () => {
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("");
  const [lawFirm, setLawFirm] = useState("");
  const [attorney, setAttorney] = useState("");
  const [status, setStatus] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
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
  

  const [debouncedFilters, setDebouncedFilters] = useState({
    query: "",
    owner: "",
    lawFirm: "",
    attorney: "",
    status: "",
    page: 1,
    rows: 10,
  });

  const [totalResults, setTotalResults] = useState(0); // ✅ total hits
  const [currentPage, setCurrentPage] = useState(1); // ✅ page tracking
  const [rowsPerPage, setRowsPerPage] = useState(10); // ✅ rows per page

  const fetchResultsByOwner = async (ownerName, page = 1, rows = 10) => {
    try {
      const response = await fetch("https://vit-tm-task.api.trademarkia.app/api/v3/us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input_query: ownerName,
          input_query_type: "owner",
          sort_by: "default",
          sort_order: "desc",
          exact_match: false,
          date_query: false,
          owners: [],
          attorneys: [],
          law_firms: [],
          status: [],
          classes: [],
          mark_description_description: [],
          states: [],
          counties: [],
          page,
          rows
        })
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
  
      const data = await response.json();
      console.log("Trademark results:", data.hits);
      return data;
    } catch (error) {
      console.error("Error fetching trademark data by owner:", error);
      return null;
    }
  };
  

  const fetchData = async ({
    input_query,
    owner,
    lawFirm,
    attorney,
    status,
    page,
    rows
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://vit-tm-task.api.trademarkia.app/api/v3/us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input_query,
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
          page,
          rows,
          sort_order: "desc",
          states: [],
          counties: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const result = await response.json();
      setData(result.body?.hits?.hits || []);
      setTotalResults(result.body?.hits?.total?.value || 0); // ✅
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter a search term");
      return;
    }

    setCurrentPage(1);
    setDebouncedFilters({
      query,
      owner,
      lawFirm,
      attorney,
      status,
      page: 1,
      rows: rowsPerPage
    });
  };

  const clearFilters = () => {
    setOwner("");
    setLawFirm("");
    setAttorney("");
    setStatus("");

    setCurrentPage(1); // ✅ Reset page
    setDebouncedFilters({
      query,
      owner: "",
      lawFirm: "",
      attorney: "",
      status: "",
      page: 1,
      rows: rowsPerPage
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (debouncedFilters.query.trim()) {
        fetchData({
          input_query: debouncedFilters.query,
          owner: debouncedFilters.owner,
          lawFirm: debouncedFilters.lawFirm,
          attorney: debouncedFilters.attorney,
          status: debouncedFilters.status,
          page: debouncedFilters.page,
          rows: debouncedFilters.rows
        });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [debouncedFilters]);

  useEffect(() => {
    if (query.trim()) {
      const timeout = setTimeout(() => {
        setDebouncedFilters({
          query,
          owner,
          lawFirm,
          attorney,
          status,
          page: currentPage,
          rows: rowsPerPage
        });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [owner, lawFirm, attorney, status, currentPage, rowsPerPage]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query.trim() && owner.trim()) {
        fetchOwnerOnly(owner.trim());
        console.log("🔍 Triggering fetchOwnerOnly with:", owner);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [owner, query, currentPage, rowsPerPage, status]);


  const toggleExpand = (idx) => {
    setExpandedRows((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  //  Pagination helpers
  const totalPages = Math.ceil(totalResults / rowsPerPage);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
    <div className="search-page-container">
      {/* 🔍 Top Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search for trademarks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* 📊 Search Results + Filters */}
      <div className="search-layout">
        <div className="results-section">
          {loading && <p>🔄 Searching...</p>}
          {error && <p style={{ color: "red" }}>❌ {error}</p>}
          {!loading && !error && data.length === 0 && query && <p>No Results Found</p>}

          {!loading && data.length > 0 && (
            <>
              <p>Showing {data.length} of {totalResults} results</p>

              <table className="results-table">
                <thead>
                  <tr>
                    <th>Mark</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Class/Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => {
                    const trademark = item._source;
                    const isExpanded = expandedRows[idx];
                    const descriptionArray = trademark?.classifications?.map(c => c.description) || [];
                    const fullText = descriptionArray.join(" | ");
                    const shortText = fullText.slice(0, 100);

                    return (
                      <tr key={idx}>
                        <td><strong>{trademark.search_bar?.mark_identification || "No Name"}</strong></td>
                        <td>
                          <p><strong>Owner:</strong> {trademark.search_bar?.owner || "N/A"}</p>
                          <p><strong>Attorney:</strong> {trademark.search_bar?.attorneys || "N/A"}</p>
                          <p><strong>Law Firm:</strong> {trademark.search_bar?.law_firm || "N/A"}</p>
                          <p><strong>Serial No:</strong> {trademark.serial_number || "N/A"}</p>
                          <p><strong>Reg No:</strong> {trademark.registration_number || "N/A"}</p>
                          <p><strong>Filing Date:</strong> {trademark.filing_date || "N/A"}</p>
                          <p><strong>Reg Date:</strong> {trademark.registration_date || "N/A"}</p>
                          <p><strong>Mark Type:</strong> {trademark.mark_type || "N/A"}</p>
                        </td>
                        <td>{trademark.status_type || "N/A"}</td>
                        <td>
                          {fullText.length <= 100 ? (
                            fullText || "N/A"
                          ) : (
                            <>
                              {isExpanded ? fullText : `${shortText}... `}
                              <button className="read-more-btn" onClick={() => toggleExpand(idx)}>
                                {isExpanded ? "Read less" : "Read more"}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/*  Pagination Controls */}
              <div className="pagination-controls">
                <button disabled={currentPage === 1} onClick={handlePrev}>⬅️ Prev</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={handleNext}>Next ➡️</button>

                <select value={rowsPerPage} onChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </>
          )}
        </div>

        
        <div className="filters-section">
           <h3>Filters</h3>
          {/* <input
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

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button> */}
          <YourComponent />
        </div> 
      </div>
    </div>
  );
};

export default SearchLayout;
