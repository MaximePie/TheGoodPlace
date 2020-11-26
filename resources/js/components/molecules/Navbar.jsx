import React from 'react';
import {Link} from "react-router-dom";

export default function Navbar(props) {

  return (
    <div className="Navbar">
      <Link to='/' className="Navbar__link Navbar__link--main">Articles</Link>
    </div>
  );
}
