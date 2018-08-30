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
                    max: 200,
                    min: 0,
                    stepSize: 5
                }
            }]
        },
        title: {
            display: this.props.display,
            text: this.props.title
        },
        pan: {
            //Issue panning in one direction
            enabled: false,
            mode: 'xy',
        },
        zoom: {
            enabled: false,
            mode: 'xy',
            drag: false,
            rangeMin: {
                // Format of min pan range depends on scale type
                y: -40
            },
            rangeMax: {
                // Format of max pan range depends on scale type
                y: 500
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
