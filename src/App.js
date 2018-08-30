import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  LineChart  from './Chart'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <LineChart data={[{
            x: 10,
            y: 20
          }, {
            x: 15,
            y: 10
          }]} />
        </p>
      </div>
    );
  }
}

export default App;
