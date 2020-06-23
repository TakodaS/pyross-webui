/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";
// import * as jsdata from './data/UK.json';
// import * as dm from './dataMap';
// import * as utils from './utils';
// import * as ui from './UIwidgets';
import { jsdata } from "./index";
import { dm } from "./index";
import { utils } from "./index";
import { ui } from "./index";
import { mapOfUKWidget } from "./mapOfUKWidget";

export function makeChart(label: string){
	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end
	var dataForChart = [];
	var selectedCounties = new Set();
	var selectedAges = new Set(["children"]);
	//selectedAges.add("children");
	var cacheCounties = new Set();
	var cacheAges = new Set();


	////////////////////////////////////////////////////////////// 
	// Create containers 
	////////////////////////////////////////////////////////////// 
	//let container = am4core.create(label, am4core.Container)
	//container.width = am4core.percent(100);
	//container.height = am4core.percent(100);
	//container.layout = "horizontal";
	//let UIcontainer = container.createChild(am4core.Container);
	//let UIwidth = 50;
	//UIcontainer.width = am4core.percent(UIwidth);
	//UIcontainer.height = am4core.percent(100);
	//let outputContainer = container.createChild(am4core.Container);
	//outputContainer.width = am4core.percent(100-UIwidth);
	//outputContainer.height = am4core.percent(100);

	////////////////////////////////////////////////////
	//UUI charts
	//let mapChart = ui.UKmap("mapchart", selectedCounties);
	var mc = new mapOfUKWidget();
	let mapChart = mc.getUKMap();
	console.log("mapChart is:", mapChart);


	// let pieChart = ui.pieChart("piechart" , selectedAges);

	// pieChart.data = dm.getAgeData(jsdata, 100);
	// ///////////////////////////////////////////////////////////////////////
	// //Output charts
	// //////////////////////////////////////////////////////////////////////

	// let lineChart = am4core.create("linechart", am4charts.XYChart);
	// //lineChart.height = am4core.percent(25);
	// lineChart.responsive.enabled = true;
	// lineChart.height = 250
	// lineChart.width = am4core.percent(100);
	// lineChart.fontSize = "0.8em";
	// lineChart.paddingRight = 30;
	// lineChart.paddingLeft = 30;
	// lineChart.maskBullets = false;
	// lineChart.zoomOutButton.disabled = true;
	// lineChart.paddingBottom = 5;
	// lineChart.paddingTop = 3;
	// let title = lineChart.titles.push(new am4core.Label());
	// title.text = "Fake COVID-19 cases";
	// title.marginBottom = 15;


	// let xAxis = lineChart.xAxes.push(new am4charts.ValueAxis());
	// xAxis.renderer.minGridDistance = 40;

	// // Create value axis
	// let yAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
	// lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(selectedAges), ["all"]);
	// var series1 = lineChart.series.push(new am4charts.LineSeries());
	// series1.dataFields.valueX = "x";
	// series1.dataFields.valueY = "y";


	// //////////////////////////////////////////////////
	// //Events
	// ////////////////////////////////////////////////////
	// 	setInterval(function() {
	// 		//console.log("checking for changes");
	// 		if ( !(utils.eqSet(cacheCounties, selectedCounties))  &&
	// 			utils.eqSet(cacheAges, selectedAges) )  {
	// 			//console.log("difference detected");
	// 			lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(selectedAges), Array.from(selectedCounties));
	// 			lineChart.invalidateData();

	// 			cacheAges = new Set(selectedAges);
	// 			cacheCounties = new Set(selectedCounties);
	// 		}

	// 	}, 300);
	// 	// Add or subtract slices value from total value

};


