import React from 'react';
import SearchBar from './searchBar.jsx';
import { Link } from 'react-router-dom';
import './navBar.css'
import LogoIcon from '../icons/logoIcon.jsx';
import CreateBtn from '../icons/create-btn.jsx';



export default function NavBar({search=true,onSearch}) {
  return (
    <div className="nav-container">
      <nav className='navbar'>
        <Link id='logo-icon' to='/home'>
          <span>
            <LogoIcon width={210} height={90} />
          </span>
        </Link>
        <div id='linea-separadora'></div>
        <Link id='create-btn' to='/create-recipe'>
          <span>
            <CreateBtn width={210} height={70}/>
          </span>
        </Link>


        
      </nav>
      <div  className='search-bar-nav'>
        {search ? <SearchBar onSearch={onSearch}/> : null}
      </div>
    </div>
  );
};