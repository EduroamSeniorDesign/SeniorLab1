import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './Chart'

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      testdata : Array.from({ length: 300 }, (x,y) => {
        let time = new Date();
        time.setSeconds(time.getSeconds()-(300-y));
        return {x:time,y:Math.random()*100}
      }
    ),
      current : 100
    };
  }

  componentDidMount() {
    console.log(this.state);
    this.interval = setInterval(() => {
      console.log(this.state);
      let random = Math.random() < 0.5 ? -1 : 1;
      random = this.state.current + random;
      let datain = {x:new Date(),y:random};
      let data = this.state.testdata;
      console.log(datain)
      data.push(datain);
      this.setState({ testdata: data, current : random })
    }, 1000)
  }
  
  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <LineChart dataset={this.state.testdata} data={{
            labels: this.state.labels,
            datasets: [
              {
                backgroundColor:'rgba(255,0,0,.2)' ,
                borderColor: 'rgba(255,0,0,.2)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                label: "Temperature",
                data: this.state.testdata,
              }
            ]
          }} />
        </p>
      </div>
    );
  }
}

export default App;
