/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
//import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";
import * as jsdata from './data/UK.json';
import * as dm from './dataMap';
import * as utils from './utils';
import * as ui from './UIwidgets';

function allCountiesAreActive(): Boolean {
	let allActive = true;
	polygonSeries.mapPolygons.each(function (mapPolygon) {
		if (
			(!mapPolygon.isActive) &&
			(mapPolygon.dataItem.dataContext.id != "IE")) {
			//	console.log("*******NOT ACTIVE*******", mapPVolygon,
			//	console				"name:", mapPolygon.dataItem.dataContext.name,
			//	console	"acive?", mapPolygon.isActive) 
			allActive =
				false;
		}
	}); return allActive;
}

//export function makeChart(label: string) {
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
	// Create map instance
	////////////////////////////////////////////////////////////// 
	let container = am4core.create(label, am4core.Container)
	container.width = am4core.percent(100);
	container.height = am4core.percent(100);
	let mapChart = ui.UKmap(container, selectedCounties);

	/////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	let buttonsAndChartContainer = container.createChild(am4core.Container);
	buttonsAndChartContainer.layout = "vertical";
	var bccWidth = 30;
	buttonsAndChartContainer.height = am4core.percent(100); // make this bigger if you want more space for the  mapChart
	buttonsAndChartContainer.width = am4core.percent(bccWidth);
	buttonsAndChartContainer.valign = "bottom";
	buttonsAndChartContainer.x = am4core.percent(100 - bccWidth);
	buttonsAndChartContainer.verticalCenter = "top";
	// Chart & slider container
	let mapChartAndSliderContainer = buttonsAndChartContainer.createChild(am4core.Container);
	mapChartAndSliderContainer.layout = "vertical";
	mapChartAndSliderContainer.height = am4core.percent(25);
	mapChartAndSliderContainer.width = am4core.percent(100);
	mapChartAndSliderContainer.background = new am4core.RoundedRectangle();
	//mapChartAndSliderContainer.background.fill = am4core.color("#000000");
	mapChartAndSliderContainer.background.cornerRadius(30, 0, 30, 30)
	mapChartAndSliderContainer.background.fillOpacity = 0.1;
	mapChartAndSliderContainer.paddingTop = 12;
	mapChartAndSliderContainer.paddingBottom = 0;
	///////////////////////////////////////////////////////////////////////
	//Pie chart
	//////////////////////////////////////////////////////////////////////
	let pieChart = ui.pieChart(mapChart , selectedAges);

	pieChart.data = dm.getAgeData(jsdata, 100);
	///////////////////////////////////////////////////////////////////////
	//Line charts
	//////////////////////////////////////////////////////////////////////

	let lineChart = mapChartAndSliderContainer.createChild(am4charts.XYChart);
	//lineChart.height = am4core.percent(25);
	lineChart.responsive.enabled = true;
	lineChart.height = 250
	lineChart.width = am4core.percent(100);
	lineChart.fontSize = "0.8em";
	lineChart.paddingRight = 30;
	lineChart.paddingLeft = 30;
	lineChart.maskBullets = false;
	lineChart.zoomOutButton.disabled = true;
	lineChart.paddingBottom = 5;
	lineChart.paddingTop = 3;
	let title = lineChart.titles.push(new am4core.Label());
	title.text = "Fake COVID-19 cases";
	title.marginBottom = 15;


	let xAxis = lineChart.xAxes.push(new am4charts.ValueAxis());
	xAxis.renderer.minGridDistance = 40;

	// Create value axis
	let yAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
	lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(selectedAges), ["all"]);
	var series1 = lineChart.series.push(new am4charts.LineSeries());
	series1.dataFields.valueX = "x";
	series1.dataFields.valueY = "y";


	//////////////////////////////////////////////////
	//Events
	////////////////////////////////////////////////////
		setInterval(function() {
			console.log("checking for changes");
			if !((utils.eqSet(cacheCounties, selectedCounties)) &&
				utils.eqSet(cacheAges, selectedAges)){
				console.log("difference detected");
				lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(selectedAges), Array.from(selectedCounties));
				lineChart.invalidateData();

				cacheAges = new Set(selectedAges);
				cacheCounties = new Set(selectedCounties);
			}

		}, 300);
		// Add or subtract slices value from total value

		// setInterval(function() {
		// 	console.log("checking for changes");
		// 	if (!(utils.eqSet(cacheCounties, selectedCounties)) &&
		// 		utils.eqSet(cacheAges, selectedAges)){
		// 		console.log("difference detected");
		// 		lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(selectedAges), Array.from(selectedCounties));
		// 		lineChart.invalidateData();

		// 		cacheAges = new Set(selectedAges);
		// 		cacheCounties = new Set(selectedCounties);
		// 	}

		// }, 300); 




