"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgeData = exports.convertData = exports.dataForChart = void 0;
//////////////////////////////////////////////////
//Data getting utility to convert raw compact JSON into format accepted
//by am4charts
/////////////////////////////////////////////////
const utils = __importStar(require("./utils.ts"));
var math = require('mathjs');
function dataForChart(data, xval, yval, age = "children", region = "GB-CM") {
    //exports data of 1 region in format that can be plotted
    let datRA = data[region][age];
    let xvals = datRA[xval];
    let yvals = datRA[yval];
    let dataForChart = [];
    for (var i = 0; i <= xvals.length; i++) {
        dataForChart.push({ "x": xvals[i],
            "y": yvals[i] });
    }
    return dataForChart;
}
exports.dataForChart = dataForChart;
function combinedData(data, xval, yval, ages = ["children"], regions = ["GB-CM"]) {
    var datRA, xvals, yvals, yout, xout;
    if (utils.arraysEqual(regions, ["all"])) {
        regions = Object.keys(data);
        regions.pop(); //remove "default" KEYVALUE
    }
    if (utils.arraysEqual(ages, ["all"])) {
        ages = ["children", "Adults"]; //Needs to be fixed
    }
    for (var county of regions) {
        for (var age of ages) {
            try {
                datRA = data[county][age];
                xvals = data[county][xval];
                yvals = datRA[yval];
                if (typeof xout === 'undefined') {
                    xout = xvals;
                }
                else if (xout != xvals) {
                    console.log("time series differs");
                }
                if (typeof yout === 'undefined') {
                    yout = yvals;
                }
                else {
                    yout = math.add(yout, yvals);
                }
            }
            catch (TypeError) {
                console.log(county, age, " not supported");
                return combinedData(data, xval, yval, ages, ["all"]);
            }
        }
    }
    return [xout, yout];
}
function convertData(data, xval, yval, ages = [], regions = []) {
    if (ages.length == 0) {
        ages = ["all"];
    }
    if (regions.length == 0) {
        regions = ["all"];
    }
    var dataForChart = [];
    var data = combinedData(data, xval, yval, ages, regions);
    var xvals = data[0];
    var yvals = data[1];
    for (var i = 0; i < xvals.length; i++) {
        dataForChart.push({ "x": xvals[i],
            "y": yvals[i] });
    }
    return dataForChart;
}
exports.convertData = convertData;
function getAgeData(data, currentTime, ages = ["children", "Adults"]) {
    //returns age data for pie chart along with proportions
    //at current time
    var datRA, ageTotal, t, closest, index, ageDict;
    var pieList = [];
    var goal = currentTime;
    var regions = Object.keys(data);
    regions.pop(); //remove "default" KEYVALUE
    for (var age of ages) {
        ageTotal = 0;
        ageDict = {};
        for (var county of regions) {
            datRA = data[county][age];
            t = data[county]["t"];
            closest = t.reduce(function (prev, curr) {
                return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
            });
            index = t.indexOf(closest);
            for (var key of Object.keys(datRA)) {
                ageTotal += datRA[key][index];
            }
        }
        ageDict["ageRange"] = age;
        ageDict["value"] = Math.round(ageTotal);
        pieList.push(ageDict);
    }
    return pieList;
}
exports.getAgeData = getAgeData;
//# sourceMappingURL=dataMap.js.map