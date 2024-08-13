import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TabComponent from './components/TabComponent';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TabComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
