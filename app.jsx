import React from 'react';
import ReactDOM from 'react-dom';
import Hand from './frontend/hand';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Hand />, document.getElementById('main')
  );
});
