import React from 'react';
import {Link} from "react-router-dom";

export default function Navbar(props) {

  return (
    <div className="Navbar">
      <Link to='/' className="Navbar__link Navbar__link--main">The good place</Link>
      <Link to='/' className="Navbar__link">Accueil</Link>
      <Link to='/posts' className="Navbar__link">Articles</Link>
    </div>
  );
}
