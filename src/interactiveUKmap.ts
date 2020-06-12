/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";

export function makeChart(label: string){
	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end

	// Create map instance
	let container = am4core.create(label, am4core.Container)
	  container.width = am4core.percent(100);
  container.height = am4core.percent(100);
	let  mapChart= container.createChild(am4maps.MapChart);
	mapChart.height = am4core.percent(100);
		mapChart.zoomControl = new am4maps.ZoomControl();
	  mapChart.zoomControl.align = "middle";
	  mapChart.zoomControl.marginRight = 0;
	  mapChart.zoomControl.valign = "middle";
	// Set map definition
	 mapChart.geodata = am4geodata_ukCountiesHigh;

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

	// Create an event to toggle "active" state
	polygonTemplate.events.on("hit", function(ev) {
	  ev.target.isActive = !ev.target.isActive;
	})


	let buttonsAndChartContainer = container.createChild(am4core.Container);
	buttonsAndChartContainer.layout = "vertical";
	buttonsAndChartContainer.height = am4core.percent(45); // make this bigger if you want more space for the  mapChart
	buttonsAndChartContainer.width = am4core.percent(50);
	buttonsAndChartContainer.valign = "bottom";
	// Chart & slider container
	let  mapChartAndSliderContainer = buttonsAndChartContainer.createChild(am4core.Container);
	 mapChartAndSliderContainer.layout = "vertical";
	 mapChartAndSliderContainer.height = am4core.percent(100);
	 mapChartAndSliderContainer.width = am4core.percent(100);
	 mapChartAndSliderContainer.background = new am4core.RoundedRectangle();
	 mapChartAndSliderContainer.background.fill = am4core.color("#000000");
	 mapChartAndSliderContainer.background.cornerRadius(30, 30, 0, 0)
	 mapChartAndSliderContainer.background.fillOpacity = 0.25;
	 mapChartAndSliderContainer.paddingTop = 12;
	 mapChartAndSliderContainer.paddingBottom = 0;
	let lineChart =  mapChartAndSliderContainer.createChild(am4charts.XYChart);
  lineChart.fontSize = "0.8em";
  lineChart.paddingRight = 30;
  lineChart.paddingLeft = 30;
  lineChart.maskBullets = false;
  lineChart.zoomOutButton.disabled = true;
  lineChart.paddingBottom = 5;
  lineChart.paddingTop = 3;

	lineChart.data = [{
  "x": 1,
  "ay": 6.5,
  "by": 2.2,
  "aValue": 15,
  "bValue": 10
}, {
  "x": 2,
  "ay": 12.3,
  "by": 4.9,
  "aValue": 8,
  "bValue": 3
}, {
  "x": 3,
  "ay": 12.3,
  "by": 5.1,
  "aValue": 16,
  "bValue": 4
}, {
  "x": 5,
  "ay": 2.9,
  "aValue": 9
}, {
  "x": 7,
  "by": 8.3,
  "bValue": 13
}, {
  "x": 10,
  "ay": 2.8,
  "by": 13.3,
  "aValue": 9,
  "bValue": 13
}, {
  "x": 12,
  "ay": 3.5,
  "by": 6.1,
  "aValue": 5,
  "bValue": 2
}, {
  "x": 13,
  "ay": 5.1,
  "aValue": 10
}, {
  "x": 15,
  "ay": 6.7,
  "by": 10.5,
  "aValue": 3,
  "bValue": 10
}, {
  "x": 16,
  "ay": 8,
  "by": 12.3,
  "aValue": 5,
  "bValue": 13
}, {
  "x": 20,
  "by": 4.5,
  "bValue": 11
}, {
  "x": 22,
  "ay": 9.7,
  "by": 15,
  "aValue": 15,
  "bValue": 10
}, {
  "x": 23,
  "ay": 10.4,
  "by": 10.8,
  "aValue": 1,
  "bValue": 11
}, {
  "x": 24,
  "ay": 1.7,
  "by": 19,
  "aValue": 12,
  "bValue": 3
}];
	//var graticuleSeries =  mapChart.series.push(new am4maps.GraticuleSeries());

	//}); // end am4core.ready()
};

export function interactivePlot(label: string){
	let container = am4core.create(label, am4core.Container);
  container.width = am4core.percent(100);
  container.height = am4core.percent(100);
  container.fontSize = "0.9em";
	 // buttons &  mapChartcontainer
	let buttonsAndChartContainer = container.createChild(am4core.Container);
	buttonsAndChartContainer.layout = "vertical";
	buttonsAndChartContainer.height = am4core.percent(45); // make this bigger if you want more space for the  mapChart
	buttonsAndChartContainer.width = am4core.percent(100);
	buttonsAndChartContainer.valign = "bottom";
	// Chart & slider container
	let  mapChartAndSliderContainer = buttonsAndChartContainer.createChild(am4core.Container);
	 mapChartAndSliderContainer.layout = "vertical";
	 mapChartAndSliderContainer.height = am4core.percent(100);
	 mapChartAndSliderContainer.width = am4core.percent(100);
	 mapChartAndSliderContainer.background = new am4core.RoundedRectangle();
	 mapChartAndSliderContainer.background.fill = am4core.color("#000000");
	 mapChartAndSliderContainer.background.cornerRadius(30, 30, 0, 0)
	 mapChartAndSliderContainer.background.fillOpacity = 0.25;
	 mapChartAndSliderContainer.paddingTop = 12;
	 mapChartAndSliderContainer.paddingBottom = 0;
	let lineChart =  mapChartAndSliderContainer.createChild(am4charts.XYChart);
  lineChart.fontSize = "0.8em";
  lineChart.paddingRight = 30;
  lineChart.paddingLeft = 30;
  lineChart.maskBullets = false;
  lineChart.zoomOutButton.disabled = true;
  lineChart.paddingBottom = 5;
  lineChart.paddingTop = 3;

	lineChart.data = [{
  "x": 1,
  "ay": 6.5,
  "by": 2.2,
  "aValue": 15,
  "bValue": 10
}, {
  "x": 2,
  "ay": 12.3,
  "by": 4.9,
  "aValue": 8,
  "bValue": 3
}, {
  "x": 3,
  "ay": 12.3,
  "by": 5.1,
  "aValue": 16,
  "bValue": 4
}, {
  "x": 5,
  "ay": 2.9,
  "aValue": 9
}, {
  "x": 7,
  "by": 8.3,
  "bValue": 13
}, {
  "x": 10,
  "ay": 2.8,
  "by": 13.3,
  "aValue": 9,
  "bValue": 13
}, {
  "x": 12,
  "ay": 3.5,
  "by": 6.1,
  "aValue": 5,
  "bValue": 2
}, {
  "x": 13,
  "ay": 5.1,
  "aValue": 10
}, {
  "x": 15,
  "ay": 6.7,
  "by": 10.5,
  "aValue": 3,
  "bValue": 10
}, {
  "x": 16,
  "ay": 8,
  "by": 12.3,
  "aValue": 5,
  "bValue": 13
}, {
  "x": 20,
  "by": 4.5,
  "bValue": 11
}, {
  "x": 22,
  "ay": 9.7,
  "by": 15,
  "aValue": 15,
  "bValue": 10
}, {
  "x": 23,
  "ay": 10.4,
  "by": 10.8,
  "aValue": 1,
  "bValue": 11
}, {
  "x": 24,
  "ay": 1.7,
  "by": 19,
  "aValue": 12,
  "bValue": 3
}];
}
