import React from 'react';
import {Link} from "react-router-dom";

export default function Navbar(props) {

  return (
    <div className="Navbar">
      <Link to='/' className="Navbar__link">Accueil</Link>
      <Link to='/path1' className="Navbar__link">Chemin 1</Link>
      <Link to='/path2' className="Navbar__link">Chemin 2</Link>
    </div>
  );
}
