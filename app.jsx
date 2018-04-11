import React from 'react';
import { Route } from 'react-router-dom';
import Hand from './frontend/hand';
import Classroom from './frontend/classroom';
import Navbar from './frontend/navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <Route exact path="/" component={Hand} />
      <Route exact path="/classroom" component={Classroom} />
    </div>
  );
};

export default App;
