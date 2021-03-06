import React, { Component, PropTypes, } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    WebView,
    Image,
    Dimensions
} from 'react-native';

const win = Dimensions.get('window');

class ChartWeb extends Component {
    constructor(props){
        super(props);

        this.state={
            init1: `<html>
        <head>
            <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
            <style media="screen" type="text/css">
                html, body {
                    margin: 0,
                    padding: 0,
                    width: 100%;
                    height: 100%;
                }

                #container {
                    width:100%;
                    height:100%;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    position:absolute;
                }
            </style>
        </head>
        <body>
            <div id="container"></div>
            <script src="https://code.highcharts.com/highcharts.js"></script>
             ${props.stock ? '<script src="https://code.highcharts.com/stock/highstock.js"></script>'
                                      : '<script src="https://code.highcharts.com/highcharts.js"></script>'}
            <script src="https://code.highcharts.com/modules/exporting.js"></script>
            <script>
                var chart = Highcharts.chart('container', `,
            end1: `    );

                chart.reflow();

                setTimeout(function() {chart.reflow()}, 0);
                setTimeout(function() {chart.reflow()}, 100);
            </script>
        </body>
    </html>`,
            init:`<html>
                    <style media="screen" type="text/css">
                    #container {
                        width:100%;
                        height:100%;
                        top:0;
                        left:0;
                        right:0;
                        bottom:0;
                        position:absolute;
                    }
                    </style>
                    <head>
                        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
                        ${props.stock ? '<script src="https://code.highcharts.com/stock/highstock.js"></script>'
                                      : '<script src="https://code.highcharts.com/highcharts.js"></script>'}
                        <script src="https://code.highcharts.com/modules/exporting.js"></script>
                        <script>
                        $(function () {
                            Highcharts.${props.stock ? 'stockChart' : 'chart'}('container', `,
            end:`           );
                        });
                        </script>
                    </head>
                    <body>
                        <div id="container">
                        </div>
                    </body>
                </html>`,
            Wlayout:{
                height:win.height,
                width:win.width
            }
        }
    }

    // used to resize on orientation of display
    reRenderWebView(e) {
        this.setState({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        })
    }

    render() {
        let config = JSON.stringify(this.props.config, function (key, value) {//create string of json but if it detects function it uses toString()
            return (typeof value === 'function') ? value.toString() : value;
        });


        config = JSON.parse(config)
        let concatHTML = this.state.init1 + `${flattenObject(config)}` + this.state.end1;

        return (
            <WebView
                onLayout={this.reRenderWebView}
                style={[styles.full, this.props.style]}
                source={{ html: concatHTML, baseUrl: 'web/' }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={false}
                scrollEnabled={false}
                automaticallyAdjustContentInsets={false}
            />
        );
    };
};

var flattenObject = function (obj, str='{') {
    Object.keys(obj).forEach(function(key) {
        str += `${key}: ${flattenText(obj[key])}, `
    })
    return `${str.slice(0, str.length - 2)}}`
};

var flattenText = function(item) {
    var str = ''
    if (item && typeof item === 'object' && item.length == undefined) {
        str += flattenObject(item)
    } else if (item && typeof item === 'object' && item.length !== undefined) {
        str += '['
        item.forEach(function(k2) {
            str += `${flattenText(k2)}, `
        })
        str = str.slice(0, str.length - 2)
        str += ']'
    } else if(typeof item === 'string' && item.slice(0, 8) === 'function') {
        str += `${item}`
    } else if(typeof item === 'string') {
        str += `\"${item.replace(/"/g, '\\"')}\"`
    } else {
        str += `${item}`
    }
    return str
};

var styles = StyleSheet.create({
    full: {
        flex: 1,
        backgroundColor: "transparent"
    }
});

module.exports = ChartWeb;
