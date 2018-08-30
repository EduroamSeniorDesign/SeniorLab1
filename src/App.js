import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './Chart'

class App extends Component {
  render() {
    let labels = Array.from({ length: 300 }, (v, k) => 300 - k)
    let current = 100;
    let testdata = Array.from({ length: 300 }, (v, k) => {
      if(k<10||k>50){
        console.log(current);  
        let random = Math.random() < 0.5 ? -1 : 1;
        current = current + random;
        return current;
      }
      else
        return null;
    })
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <LineChart data={{
            labels: labels,
            datasets: [
              {
                backgroundColor: 'rgba(255,0,0,.2)',
                label: "Temperature",
                data: testdata,
                borderDash: [5, 5]
              }
            ]
          }} />
        </p>
      </div>
    );
  }
}

export default App;
