//////////////////////////////////////////////////
//Data getting utility to convert raw compact JSON into format accepted
//by am4charts
/////////////////////////////////////////////////
var math = require('mathjs');

export function dataForChart(data, xval, yval, age="children", region="GB-CM") {
	//exports data of 1 region in format that can be plotted
	let datRA = data[region][age];
	let xvals = datRA[xval]
	let yvals = datRA[yval]
	let dataForChart = [];
	console.log(math.pi);	
	for (var i=0; i <= xvals.length; i++){
		dataForChart.push({"x": xvals[i],
			"y": yvals[i]}
	}
	return dataForChart;
}



function combinedData(data, xval, yval, ages=["children"], regions=["GB-CM"]){
	var datRA, xvals, yvals, yout, xout;
	for (var county of regions){
		for (var age of ages){
			datRA = data[county][age];
			xvals = data[county][xval];
			yvals = datRA[yval];
			console.log(yvals);
			if (typeof xout === 'undefined'){
				xout=xvals;
			else if (xout != xvals){
				console.log("time series differs");
			}
			if (typeof yout === 'undefined'){
				yout = yvals;
				console.log(yout, yvals);
			}
			else {
				yout = math.add(yout, yvals);
			}
			}

		}}
	console.log(xout, yout)
	return [xout, yout];
}

export function convertData(data, xval, yval, ages=["children"], regions=["GB-CM"]){
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

