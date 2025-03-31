import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchBar.jsx";
import TrademarkResults from "./components/TrademarkResults.jsx";
import OwnerResults from "./components/OwnerResults.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search/trademark" element={<TrademarkResults />} />
        <Route path="/search/owner" element={<OwnerResults />} />
      </Routes>
    </Router>
  );
};

export default App;
