//////////////////////////////////////////////////
//Data getting utility to convert raw compact JSON into format accepted
//by am4charts
/////////////////////////////////////////////////
import * as utils from './utils.ts';
var math = require('mathjs');

export function dataForChart(data, xval, yval, age="children", region="GB-CM") {
	//exports data of 1 region in format that can be plotted
	let datRA = data[region][age];
	let xvals = datRA[xval]
	let yvals = datRA[yval]
	let dataForChart = [];
	for (var i=0; i <= xvals.length; i++){
		dataForChart.push({"x": xvals[i],
			"y": yvals[i]}
	}
	return dataForChart;
}



function combinedData(data, xval, yval, ages=["children"], regions=["GB-CM"]){
	var datRA, xvals, yvals, yout, xout;
	if utils.arraysEqual(regions, ["all"]){
		regions=Object.keys(data)
		regions.pop(); //remove "default" KEYVALUE
	}
	if utils.arraysEqual(ages, ["all"]){
		ages=["children", "Adults"]; //Needs to be fixed
	}
	for (var county of regions){
		for (var age of ages){
			try {
			datRA = data[county][age];
			xvals = data[county][xval];
			yvals = datRA[yval];
			
			if (typeof xout === 'undefined'){
				xout=xvals;
			}
			else if (xout != xvals){
				console.log("time series differs");
			}
			if (typeof yout === 'undefined'){
				yout = yvals;
			} else {
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

export function convertData(data, xval, yval, ages=[], regions=[]){
	if (ages.length == 0){
		ages=["all"];
	}
	if (regions.length==0){
		regions=["all"]
	}
	var dataForChart = [];
	var data = combinedData(data, xval, yval, ages, regions);
	var xvals = data[0];
	var yvals = data[1];
	for (var i=0; i<xvals.length; i++){
		dataForChart.push({"x": xvals[i],
			"y": yvals[i]}
	}
	return dataForChart;
}

export function getAgeData(data, currentTime, ages=["children", "Adults"]){
	//returns age data for pie chart along with proportions
	//at current time
	var datRA, ageTotal, t, closest, index, ageDict;
	var pieList = [];
	var goal = currentTime;
	var regions=Object.keys(data)
	regions.pop(); //remove "default" KEYVALUE
	for (var age of ages){
		ageTotal=0;
		ageDict = {};
		for (var county of regions){
			datRA = data[county][age];
			t = data[county]["t"];
			closest = t.reduce(function(prev, curr) {
				return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);});
			index = t.indexOf(closest);
			for (var key of Object.keys(datRA)){
				ageTotal += datRA[key][index];
			}
			
		}
		ageDict["ageRange"]=age;
		ageDict["value"]=Math.round(ageTotal);
		pieList.push(ageDict);
	}
	return pieList;
}

