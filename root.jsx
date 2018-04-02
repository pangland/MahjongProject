import { HashRouter } from 'react-router-dom';
import App from './app';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <HashRouter>
      <App />
    </HashRouter>, document.getElementById('main')
  );
});
