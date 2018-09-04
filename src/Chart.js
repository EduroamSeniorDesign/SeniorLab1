import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Chart, Line } from 'react-chartjs-2';
import Hammer from 'hammerjs';
import zoom from 'chartjs-plugin-zoom'
import streaming from 'chartjs-plugin-streaming'



class LineChart extends Component {
    refreshChart = (chart)=>{
        chart.data.datasets[0].data = this.props.dataset;

    }
    config = {
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                type: 'realtime'    // x axis will auto-scroll from right to left
            }],
        },
        plugins: {
            streaming: {            // enabled by default
                duration: 300000,    // data in the past 20000 ms will be displayed
                refresh: 1000,      // onRefresh callback will be called every 1000 ms
                frameRate: 30,      // chart is drawn 30 times every second
                pause: false,       // chart is not paused    
                ttl:300000,// data will be automatically deleted as it disappears off the chart
                // a callback to update datasets
                onRefresh: this.refreshChart
            }
        },
        title: {
            display: this.props.display,
            text: this.props.title
        },
        pan: {
            enabled: true,    // Enable panning
            mode: 'x',        // Allow panning in the x direction
            rangeMin: {
                x: null       // Min value of the delay option
            },
            rangeMax: {
                x: null       // Max value of the delay option
            }
        },
        zoom: {
            enabled: true,    // Enable zooming
            mode: 'x',        // Allow zooming in the x direction
            rangeMin: {
                x: null       // Min value of the duration option
            },
            rangeMax: {
                x: null       // Max value of the duration option
            }
        }
    }

    render() {
        return (
            <Line data ={this.props.data} options = {this.config}/>
        );
    }
}




export default LineChart;
