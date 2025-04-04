import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchBar.jsx";
import TrademarkResults from "./components/TrademarkResults.jsx";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search/trademark" element={<TrademarkResults />} />
      </Routes>
    </Router>
  );
};

export default App;
