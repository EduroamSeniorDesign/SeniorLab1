import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineChart from './Chart'
import Axios from 'axios';
var qs = require('qs');


class App extends Component {
  url = '192.168.43.89:5000'
  constructor(props) {
    super(props)
    this.state = {
      testdata: [],
      current: 100,
      currentScale: 'C',
      number: '13194159830',
      lowTemp: 0,
      highTemp: 50000,
      visited: false,
      sendEnable: false,
      highTempMessage: 'The temperature is very high. Its ',
      lowTempMessage: 'The temperature is very low. Its ',
      outVal: 'NO DATA',
      intervalID: 0
    };
  }
  handleInputChange = (event) => {
    console.log(event);
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      sendEnable: false
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
        Body: `${this.state.highTempMessage + temp}`,
        From: '+17128230557',
        To: '+' + this.state.number
      })
    }
    if (hl === 'low') {
      this.postToTwilio({
        Body: `${this.state.lowTempMessage + temp}!`,
        From: '+17128230557',
        To: '+' + this.state.number
      })
    }
  }

  componentDidMount() {
    console.log(this.state);
    let url = `http://${this.url}/all`
    Axios.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      timeout: 2000
    }).then((initialdata) => {
      initialdata = initialdata.data.data.map((a) => {
        let b = {}
        b.x = a.time
        b.y = a.tempC
        return b;
      })
      initialdata = initialdata. reverse()
      if(initialdata.length){
        this.setState({ testdata: initialdata,
          outVal: initialdata[0].y.toFixed(3) })
      }else{
        this.setState({ testdata: initialdata,
          outVal: 'Sensor Faulty' })
      }
    }).catch( err => {
        console.error(err)
        this.setState({
          outVal:'NO DATA'
        })
      }
    ).finally(() => {
      this.startInterval();
    })
  }

  toF = (temp) => temp * (9 / 5) + 32
  toC = (temp) => (temp-32) * (5 / 9)

  startInterval = () => {
    this.interval = setInterval(async () => {
      let datain
      try {
        let url = `http://${this.url}/recent`
        let receved = await Axios.get(url, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          timeout: 3000
        })
        if (this.state.currentScale === 'F') {
          receved.data.tempC = this.toF(receved.data.tempC)
        }
        if(receved.data.tempC==null){
          this.setState({
            outVal:'SENSOR ERROR'
          })
        }else{
          this.setState({
            outVal:receved.data.tempC.toFixed(3)
          })
        }
        datain = { x: receved.data.time, y: receved.data.tempC };
      }
      catch (err) {
        this.setState({
          outVal:'NO DATA'
        })
        datain = { x: 0, y: Number.NaN }
      }

      let data = this.state.testdata;
      data.unshift(datain);
      this.setState({ testdata: data })
      if (datain.y > this.state.highTemp && !this.state.visited&&this.state.sendEnable) {
        this.sendMessage('high', datain.y);
        this.setState({ visited: true })
      } else if (datain.y < this.state.lowTemp &&!isNaN(datain.y) && !this.state.visited&&this.state.sendEnable) {
        this.sendMessage('low', datain.y)
        this.setState({ visited: true })
      } else if (datain.y < this.state.highTemp && datain.y > this.state.lowTemp && this.state.visited) {
        console.log(this.state)
        this.setState({ visited: false })
      }
    }, 1000)
  }
  switchScales = () => {
    clearInterval(this.interval);
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
    let receved = await Axios.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      timeout: 1000
    })

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            High Temp: <input type="text" name="highTemp" value={this.state.highTemp} onChange={this.handleInputChange} />
            High Temp Message: <textarea style={{resize:'none'}} type="text" name="highTempMessage" value={this.state.highTempMessage} onChange={this.handleInputChange} />
          </p>
          <p>
            Low Temp: <input type="text" name="lowTemp" value={this.state.lowTemp} onChange={this.handleInputChange} />
            Low Temp Message: <textarea type="text"style={{resize:'none'}}  name="lowTempMessage" value={this.state.lowTempMessage} onChange={this.handleInputChange} />
          </p>
          Number to Send To: <input type="text" name="number" value={this.state.number} onChange={this.handleInputChange} />
          <button onClick={() => this.setState({ sendEnable: true })}>Enable Sending ({this.state.sendEnable ? 'Enabled' : 'Disabled'})</button>
        </header>
        <p className="App-intro">
          The temperature read is currently {this.state.outVal} {this.state.currentScale + ' '}
          <button onClick={this.switchScales}>
            Switch Scale
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
