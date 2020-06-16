/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";
import * as jsdata from './data/UK.json';
import * as dm from './dataMap.ts';
import * as utils from './utils.ts';

export function makeChart(label: string){
	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end

	////////////////////////////////////////////////////////////// 
	// Create map instance
	////////////////////////////////////////////////////////////// 
	let container = am4core.create(label, am4core.Container)
	container.width = am4core.percent(100);
	container.height = am4core.percent(100);
	let  mapChart= container.createChild(am4maps.MapChart);

	// zoomout on background click (seems broken)
	//mapChart.chartContainer.background.events.on("hit", function () { zoomOut() });
	mapChart.width = am4core.percent(50);
	mapChart.height = am4core.percent(100);
	mapChart.seriesContainer.draggable = false;
	mapChart.seriesContainer.resizable = false;
	mapChart.maxZoomLevel = 1;
	// Set map definition
	mapChart.geodata = am4geodata_ukCountiesHigh;
	//console.log(mapChart.geodata)
	// Set projection
	mapChart.projection = new am4maps.projections.Miller();

	// Create map polygon series
	var polygonSeries =  mapChart.series.push(new am4maps.MapPolygonSeries());
	polygonSeries.mapPolygons.template.strokeWidth = 0.5;

	// Exclude Antartica
	// polygonSeries.exclude = ["AQ"];

	// Make map load polygon (like country names) data from GeoJSON
	polygonSeries.useGeodata = true;

	// Configure series
	var polygonTemplate = polygonSeries.mapPolygons.template;
	polygonTemplate.tooltipText = "{name}";
	polygonTemplate.fill =  mapChart.colors.getIndex(0);

	// Create hover state and set alternative fill color
	var hs = polygonTemplate.states.create("hover");
	hs.properties.fill =  mapChart.colors.getIndex(2);

	// Create active state
	var activeState = polygonTemplate.states.create("active");
	activeState.properties.fill =  mapChart.colors.getIndex(4);

	// Create highlight state and set alternative fill color (alias for hover)
	// This is a duplicate of hover, but is needed because hover contains additional hidden logic
	var highlightState = polygonTemplate.states.create("highlight");
	highlightState.properties.fill = mapChart.colors.getIndex(2);

	var aliasActiveState = polygonTemplate.states.create("aliasActive");
	aliasActiveState.properties.fill = mapChart.colors.getIndex(4);

	var aliasDefaultState = polygonTemplate.states.create("aliasDefault");
	aliasDefaultState.properties.fill = mapChart.colors.getIndex(0);


	//Small map to toggle features
	mapChart.smallMap = new am4maps.SmallMap();
	mapChart.smallMap.series.push(polygonSeries);

	// Disable pan and zoom comtrols
	mapChart.smallMap.draggable = false;
	mapChart.smallMap.resizable = false;
	mapChart.smallMap.maxZoomLevel = 1;
	mapChart.smallMap.rectangle.strokeWidth = 0;
	//mapChart.smallMap.tooltipText = "UK";
	// mapChart.smallMap.create("hover");
	//mapChart.smallMap.properties.fill = am4core.color("#ffffff");
	//mapChart.smallMap.togglable = true;
	//mapChart.smallMap.events.disable();

	// Create a custom state
	var disabledState = polygonTemplate.states.create("disabled");
	disabledState.properties.fill = am4core.color("#001");
	disabledState.properties.fillOpacity = .2;
	disabledState.properties.shiftRadius = 0;
	disabledState.properties.scale = 1;
	disabledState.properties.hoverable = false;
	disabledState.properties.clickable = false;

	polygonSeries.mapPolygons.template.adapter.add("tooltipText", function(text, target) {
		if (target.dataItem.dataContext.id == "IE") {
			return "";
		}
		return text;
	});

	var smallSeries = mapChart.smallMap.series.getIndex(0);
	var smallTemplate = smallSeries.mapPolygons.template;
	smallTemplate.stroke = smallSeries.mapPolygons.template.fill;
	smallTemplate.strokeWidth = 0;
	smallTemplate.polygon.fill = mapChart.colors.getIndex(4);
	smallTemplate.polygon.fillOpacity = 1;

	let buttonsAndChartContainer = container.createChild(am4core.Container);
	buttonsAndChartContainer.layout = "vertical";
	var bccWidth = 30;
	buttonsAndChartContainer.height = am4core.percent(100); // make this bigger if you want more space for the  mapChart
	buttonsAndChartContainer.width = am4core.percent(bccWidth);
	buttonsAndChartContainer.valign = "bottom";
	buttonsAndChartContainer.x = am4core.percent(100-bccWidth);
	buttonsAndChartContainer.verticalCenter = "top";
	// Chart & slider container
	let  mapChartAndSliderContainer = buttonsAndChartContainer.createChild(am4core.Container);
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
	let pieSeries = mapChartAndSliderContainer.createChild(am4charts.PieSeries);
	pieSeries.labels.template.disabled = true;
	pieSeries.ticks.template.disabled = true;
	pieSeries.labels.template.disabled = true;
	pieSeries.ticks.template.disabled = true;
	///////////////////////////////////////////////////////////////////////
	//Line charts
	//////////////////////////////////////////////////////////////////////

	let lineChart =  mapChartAndSliderContainer.createChild(am4charts.XYChart);
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
	//	lineChart.data = children;
	//console.log(lineChart.data)
	//console.log(polygonTemplate, activeState)
	// below doesn't seem to work
	//lineChart.dataSource.url = "./data/testingData.json"
	//	lineChart.dataSource.parser = new am4core.JSONParser();
	//	console.log(lineChart.data)
	//	var mydata = JSON.parse("./data/testingData.json");

	//var graticuleSeries =  mapChart.series.push(new am4maps.GraticuleSeries());

	// Create series
	//let series1 = lineChart.series.push(new am4charts.LineSeries());
	//lineChart.dateFormatter.dateFormat = "yyyy-MM-dd";
	//series1.dataFields.valueX = "t";
	//series1.dataFields.valueY = "S";
	//series1.strokeWidth = 2;	//}); // end am4core.ready()i

	var dataMapForChart = new Map();
	var dataForChart = [];
	var selectedCounties = new Set();
	var selectedAges = new Set(["children"]);
	//selectedAges.add("children");
	var cacheCounties = new Set();
	var cacheAges = new Set();

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
	// Create an event to toggle "active" state


	polygonTemplate.events.on("hit", function(ev) {
		var data = ev.target.dataItem.dataContext;
		if (ev.target.isActive) {
			selectedCounties.delete(data.id);	
		} else if (data.id != "IE") {
			selectedCounties.add(data.id);
		}
		ev.target.isActive = !ev.target.isActive
		console.log(selectedCounties);
		// slow, want to wait a second before updating. 
		}
		
	//Disable Ireland
	var ireland;
	mapChart.events.on("ready", function (ev) {
		ireland = polygonSeries.getPolygonById("IE");
		//console.log("ireland:", ireland);
		ireland.setState("disabled");
		//ireland.interactionsEnabled = false;
		//ireland.events.disable();
	});


	//////////////////////////////////////////
	// smallMap events 

	//If any county is already selected, select all counties. If all are selected, deselect all.
	mapChart.smallMap.events.on("hit", function (ev) {
		mapChart.goHome();    //Big map does not move when smallMap is clicked on
		if (allCountiesAreActive()) {
			polygonSeries.mapPolygons.each(function (mapPolygon) {
				mapPolygon.dispatchImmediately("hit")
			})
		} else if (atLeastOneCountyIsActive()) {
			polygonSeries.mapPolygons.each(function (mapPolygon) {
				if (!mapPolygon.isActive) {
					//mapPolygon.dispatch("hit")
					mapPolygon.dispatchImmediately("hit");
				}
				mapPolygon.setState("aliasActive");
			})
		} else {   //All counties are inactive
			polygonSeries.mapPolygons.each(function (mapPolygon) {
				mapPolygon.dispatchImmediately("hit")
			})
		}
		setSmallMapColor();
		ireland.setState("disabled");
	}) //end hit


	function setSmallMapColor() {
		if (allCountiesAreActive()) {
			smallTemplate.polygon.fill = mapChart.colors.getIndex(0); 
		} else {
			smallTemplate.polygon.fill = mapChart.colors.getIndex(4);
		}
		ireland.setState("disabled");
	}

	////////////////////////////
	// Using 2 separate functions for clarity
	function atLeastOneCountyIsActive() {
		let oneActive = false;
		polygonSeries.mapPolygons.each(function (mapPolygon) {
			if (mapPolygon.isActive) {
				oneActive = true;
			}
		})
		return oneActive;
	}

	function allCountiesAreActive() { let allActive = true;
		polygonSeries.mapPolygons.each(function (mapPolygon) { if (
			(!mapPolygon.isActive) &&
			(mapPolygon.dataItem.dataContext.id != "IE")) {
			//	console.log("*******NOT ACTIVE*******", mapPVolygon,
			//	console				"name:", mapPolygon.dataItem.dataContext.name,
			//	console	"acive?", mapPolygon.isActive) 
			allActive =
				false; } }); return allActive; 
	}
		setInterval(function() {
			console.log("checking for changes");
			if !(utils.eqSet(cacheCounties, selectedCounties) &&
				utils.eqSet(cacheAges, selectedAges)){
				console.log("difference detected");
				lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(selectedAges), Array.from(selectedCounties));
				lineChart.invalidateData();

				cacheAges = new Set(selectedAges);
				cacheCounties = new Set(selectedCounties);
			}

					}, 300);

};


