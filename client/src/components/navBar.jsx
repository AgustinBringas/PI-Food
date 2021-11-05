import React from 'react';
import SearchBar from './searchBar.jsx';
import { Link } from 'react-router-dom';
import LogoIcon from '../icons/logoIcon.jsx';
import './navBar.css'



export default function NavBar({search=true,onSearch}) {
  return (
    <div className="nav-container">
      <nav className='navbar'>
        <Link to='/home'>
          <span>
            <LogoIcon id='logoHenry' width={48} height={48} />
          </span>
        </Link>
        <ul className='nav-items'>
          <li>
            <Link className='link' to='/home'>Home</Link>
          </li>
          <li>
            <Link className='link' to='/create-recipe'>Create a recipe</Link>
          </li>
          <li>
            <Link className='link' to='/about'>About</Link>
          </li>
        </ul>
        {search ? <SearchBar onSearch={onSearch}/> : null}
        
      </nav>
    </div>
  );
};