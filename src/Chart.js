import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Chart, Line } from 'react-chartjs-2';
import Hammer from 'hammerjs';
import zoom from 'chartjs-plugin-zoom'



class LineChart extends Component {
    config = {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    max: this.props.maxY,
                    min: 0,
                    stepSize: 3
                }
            }]
        },
        title: {
            display: this.props.display,
            text: this.props.title
        },
        pan: {
            enabled: true,
            mode: 'x'
        },
        zoom: {
            enabled: true,
            mode: 'xy'
        }
    }
    componentWillMount() {
        Chart.plugins.register(zoom)
    }
    render() {
        return (
            <Line data ={this.props.data} options = {this.options}/>
        );
    }
}





export default LineChart;
