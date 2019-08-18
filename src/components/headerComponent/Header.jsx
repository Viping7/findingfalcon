import React, { Component } from 'react';
import './Header.scss';
import {Link} from 'react-router-dom';
class Header extends Component {
  render()  
  {
    return (
      <header>
       <nav className="navbar navbar-expand-lg  static-top na-cp">
        <div className="container">          
            <h3>Finding Falcone</h3>
            <ul className="navbar-nav navbar-right">
              <li className="nav-item">
                <a href ='javascript:;' className="nav-link">Reset</a>
              </li>
              
              <li className="nav-item">
              <a href ='javascript:;' className="nav-link" to="/notification">Geek trust home</a>
              </li>
          
            </ul>
        </div>
       </nav>
      </header>
    );
  }
}

export default Header;
