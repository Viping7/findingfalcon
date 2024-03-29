import React, { Component } from 'react';
import { HashRouter, Route ,Switch, Redirect} from "react-router-dom";
import {Provider} from "react-redux";
import store from './store';
import './App.css';
import SearchComponent from './components/searchComponent/Search';
import { createHashHistory } from 'history';
import Header from './components/headerComponent/Header';
import ResponseComponent from './components/responseComponent/Response';
import Footer from './components/footerComponent/Footer';
const history = createHashHistory();

class App extends Component {
  constructor(props){
    super(props);
    localStorage.setItem('id',"5c894c58bdaa7a17f4f0979f");
  }
  render() {
    return (
      <Provider store = {store}>
          <HashRouter history={history}>
            <Header></Header>
            <Switch>
               <Redirect from="/" to="/search" exact="true"/>
               <Route path='/search' component = {SearchComponent}></Route>
               <Route path='/response' component = {ResponseComponent}></Route>
            </Switch>
            <Footer></Footer>
          </HashRouter>
      </Provider>
    );
  }
}

export default App;
