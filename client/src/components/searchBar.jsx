import React, { useState } from "react";
import SearchIcon from "../icons/searchIcon";
import './searchBar.css'


export default function SearchBar({onSearch}) {
  let [name, setName]  = useState([])
  return (
    <div className='search-container'>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSearch(name);
      }}>
        <input
          className='search-bar'
          type="text"
          placeholder="Recipe..."
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button id='submit-btn' type="submit">
          <SearchIcon width='25' height='25'/>
        </button>
      </form>
    </div>
  );
}
