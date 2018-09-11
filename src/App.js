import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './Chart'
import Axios from 'axios';



class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      testdata: Array.from({ length: 300 }, (x, y) => {
        let time = new Date();
        time.setSeconds(time.getSeconds() - (300 - y));
        return { x: time, y: Math.random() * 100 }
      }
      ),
      current: 100,
      currentScale: 'C',
      number: '3194159830',
      lowTemp: 0,
      highTemp: 90
    };
  }
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  postToTwilio = async (message)=>{
    const accountSid = 'AC932d4e912ca2519f89b850c523de7447';
    const authToken = '3f0ede03771209d3a8f1f3c2f91f5b6c';
    let auth = {
      username: accountSid,
      password: authToken
    }
    await Axios({ method:'post', url: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, auth:auth, params:message})
  }
  sendMessage = (hl, temp) => {
    if (hl === 'high') {
     this.postToTwilio({
          body: `The temperature is very high. Its ${temp} degrees!`,
          From: '+17128230557',
          To: this.state.number
        })
    }
    if (hl === 'low') {
      this.postToTwilio({
          body: `The temperature is very low. Its ${temp} degrees!`,
          From: '+17128230557',
          to: this.state.number
        })
        .then(message => console.log(message.sid))
        .done();
    }
  }

  componentDidMount() {
    console.log(this.state);
    this.startInterval();
  }

  toF = (temp) => temp * (9 / 5) + 32
  toC = (temp) => temp * (5 / 9) - 32

  startInterval = () => {
    this.interval = setInterval(() => {
      console.log(this.state);
      let random = Math.random() < 0.5 ? -1 : 1;
      random = this.state.current + random;
      let datain = { x: new Date(), y: random };
      let data = this.state.testdata;
      console.log(datain)
      data.push(datain);
      this.setState({ testdata: data, current: random })
      if(datain.y > this.state.highTemp){
        this.sendMessage('high',datain.y);
      }else if(datain.y < this.state.lowTemp){
        this.sendMessage('low',datain.y)
      }
    }, 1000)

  }
  switchScales = () => {
    this.clearInterval();
    if (this.state.currentScale === 'F') {
      let temp = this.state.testdata.map((a) => {
        a.y = this.toC(a.y)
        return a
      })
      this.setState({ testdata: temp, currentScale: 'C' })
    }
    else if (this.state.currentScale === 'C') {
      let temp = this.state.testdata.map((a) => {
        a.y = this.toF(a.y)
        return a
      })
      this.setState({ testdata: temp, currentScale: 'F' })
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          High Temp: <input type="text" name="highTemp" value={this.state.highTemp} onChange={this.handleChange} />
          Low Temp: <input type="text" name="lowTemp" value={this.state.lowTemp} onChange={this.handleChange} />
          Number to Send To: <input type="text" name="number" value={this.state.number} onChange={this.handleChange} />
        </header>
        <p className="App-intro">
          <LineChart dataset={this.state.testdata} data={{
            labels: this.state.labels,
            datasets: [
              {
                backgroundColor: 'rgba(255,0,0,.2)',
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
