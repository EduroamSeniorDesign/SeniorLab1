import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './Chart'
import Axios from 'axios';
var qs = require('qs');


class App extends Component {
  url = '192.168.86.39:5000'
  constructor(props) {
    super(props)
    this.state = {
      testdata: [],
      current: 100,
      currentScale: 'C',
      number: '13194159830',
      lowTemp: 0,
      highTemp: 50000,
      visited: false
    };
  }
  handleInputChange = (event) => {
    console.log(event);
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  postToTwilio = async (message) => {
    const accountSid = 'AC932d4e912ca2519f89b850c523de7447';
    const authToken = '3f0ede03771209d3a8f1f3c2f91XXX6c';
    //fab with 5
    let auth = {
      username: accountSid,
      password: authToken
    }


    await Axios.post(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, qs.stringify(message), { auth: auth })
    //await Axios({ method:'post', url: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, auth:auth, params:message})
  }
  sendMessage = (hl, temp) => {
    if (hl === 'high') {
      this.postToTwilio({
        Body: `The temperature is very high. Its ${temp} degrees!`,
        From: '+17128230557',
        To: '+' + this.state.number
      })
    }
    if (hl === 'low') {
      this.postToTwilio({
        Body: `The temperature is very low. Its ${temp} degrees!`,
        From: '+17128230557',
        To: '+' + this.state.number
      })
        .then(message => console.log(message.sid))
        .done();
    }
  }

  componentDidMount() {
    console.log(this.state);
    let url = `http://${this.url}/all`
    Axios.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    }).then((initialdata) => {
      initialdata = initialdata.map((a) => {
        let b = {}
        b.x = a.time
        b.y = a.data
        return b;
      })
      this.setState({ testdata: initialdata })
    }).catch(err => console.error(err))
    this.startInterval();
  }

  toF = (temp) => temp * (9 / 5) + 32
  toC = (temp) => temp * (5 / 9) - 32

  startInterval = () => {
    this.interval = setInterval(async () => {
      let datain
      try {
        let url = `http://${this.url}/recent`
        let receved = await Axios.get(url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        })
        if (this.state.currentScale === 'F') {
          receved.time = this.ToC(receved.time)
        }
        datain = { x: receved.time, y: receved.tempC };
      }
      catch (err) {
        datain = { x: 0, y: null }
      }

      let data = this.state.testdata;
      data.push(datain);
      this.setState({ testdata: data, current: 0 })
      if (datain.y > this.state.highTemp && !this.state.visited) {
        this.sendMessage('high', datain.y);
        this.setState({ visited: true })
      } else if (datain.y < this.state.lowTemp && !this.state.visited) {
        this.sendMessage('low', datain.y)
        this.setState({ visited: true })
      } else if (datain.y < this.state.highTemp && datain.y > this.state.lowTemp && this.state.visited) {
        console.log(this.state)
        this.setState({ visited: false })
      }
    }, 1000)

  }
  switchScales = () => {
    clearInterval();
    if (this.state.currentScale === 'F') {
      let temp = this.state.testdata.map((a) => {
        a.y = this.toC(a.y)
        return a
      })
      this.setState({ testdata: temp, currentScale: 'C' })
      this.startInterval();
    }
    else if (this.state.currentScale === 'C') {
      let temp = this.state.testdata.map((a) => {
        a.y = this.toF(a.y)
        return a
      })
      this.setState({ testdata: temp, currentScale: 'F' })
      console.log(this.state)
      this.startInterval();
    }
  }
  postButton = async () => {
    let url = `http://${this.url}/post`
    await Axios.post(url, { seconds: 10 },{
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          High Temp: <input type="text" name="highTemp" value={this.state.highTemp} onChange={this.handleInputChange} />
          Low Temp: <input type="text" name="lowTemp" value={this.state.lowTemp} onChange={this.handleInputChange} />
          Number to Send To: <input type="text" name="number" value={this.state.number} onChange={this.handleInputChange} />
        </header>
        <p className="App-intro">
          <button onClick={this.switchScales}>
            Switch Scale(Currently this.state.currentScale)
        </button>
          <LineChart dataset={this.state.testdata} data={{
            labels: [],
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
          <button onClick={this.postButton}>Display on pi</button>
        </p>
      </div>
    );
  }
}

export default App;
