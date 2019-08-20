import React, { Component } from 'react';
import './Header.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { resetAll } from '../../actions/resetAction';
class Header extends Component {
  constructor(props){
    super(props)
    this.reset = this.reset.bind(this);
    this.home = this.home.bind(this);
  }

  reset(){
    this.props.resetAll()
  }

  home(){
    this.reset();
    this.props.history.push('/search')
  }

  render()  
  {
    return (
      <header>
       <nav className="navbar navbar-expand-lg  fixed-top na-cp">
        <div className="container">          
            <h3>Finding Falcone</h3>
              <ul className="navbar-nav navbar-right">
                <li className="nav-item">
                  <a onClick={this.reset} className="nav-link">Reset</a>
                </li>
          
                <li className="nav-item">
                <a onClick = {this.home} className="nav-link" to="/notification">Home</a>
                </li>
              </ul>
            </div>
       </nav>
      </header>
    );
  }
}
const mapStatesToProps = state => ({
  resetTriggered: state.search.resetTriggered
})
export default withRouter(connect(mapStatesToProps,{resetAll})(Header))