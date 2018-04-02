import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
  render() {
    return (
      <div className='navbar'>
        <Link to={'/'}>
          <button>Base Page</button>
        </Link>

        <Link to={'/classroom'}>
          <button>Create Hands</button>
        </Link>
      </div>
    );
  }
}

export default Navbar;
