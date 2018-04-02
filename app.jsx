import React from 'react';
import { Route } from 'react-router-dom';
import Hand from './frontend/hand';
import Navbar from './frontend/navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <Route exact path="/" component={Hand} />
    </div>
  );
};

export default App;
