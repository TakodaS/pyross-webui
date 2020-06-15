/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";
import {data} from './data/testingData.json';

export function makeChart(label: string){
	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end

	// Create map instance
	let container = am4core.create(label, am4core.Container)
	  container.width = am4core.percent(100);
  container.height = am4core.percent(100);
	let  mapChart= container.createChild(am4maps.MapChart);

// zoomout on background click (seems broken)
	//mapChart.chartContainer.background.events.on("hit", function () { zoomOut() });
	mapChart.height = am4core.percent(100);
  mapChart.seriesContainer.draggable = false;
  mapChart.seriesContainer.resizable = false;
  mapChart.maxZoomLevel = 1;
	// Set map definition
	 mapChart.geodata = am4geodata_ukCountiesHigh;
console.log(mapChart.geodata)
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

  mapChart.events.on("ready", function (ev) {
    var ireland = polygonSeries.getPolygonById("IE");
    console.log("ireland:", ireland);
    ireland.setState("disabled");
    //ireland.interactionsEnabled = false;
    //ireland.events.disable();
  });

  // Create a custom state
  var disabledState = polygonTemplate.states.create("disabled");
  disabledState.properties.fill = am4core.color("#001");
  disabledState.properties.fillOpacity = 0.2;
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
	// Create an event to toggle "active" state
	polygonTemplate.events.on("hit", function(ev) {
		ev.target.isActive = !ev.target.isActive;
		console.log(ev.target)
		console.log(polygonSeries)
		console.log(ev.target.getPropertyValue("id"))
		randomValues() //right now random values are plotten
	})


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
	lineChart.data = data;
	//console.log(polygonTemplate, activeState)
	// below doesn't seem to work
	//lineChart.dataSource.url = "./data/testingData.json"
	//	lineChart.dataSource.parser = new am4core.JSONParser();
	//	console.log(lineChart.data)
	//	var mydata = JSON.parse("./data/testingData.json");

	//var graticuleSeries =  mapChart.series.push(new am4maps.GraticuleSeries());
let xAxis = lineChart.xAxes.push(new am4charts.DateAxis());
xAxis.renderer.minGridDistance = 40;

// Create value axis
let yAxis = lineChart.yAxes.push(new am4charts.ValueAxis());

// Create series
let series1 = lineChart.series.push(new am4charts.LineSeries());
lineChart.dateFormatter.dateFormat = "yyyy-MM-dd";
series1.dataFields.dateX = "date";
series1.dataFields.valueY = "value";
series1.strokeWidth = 2;	//}); // end am4core.ready()i

function randomValues(){
	//lineChart
for (let i of lineChart.data) {
		i.value += Math.random()*10 
	//console.log(i.ay)
}
series1.invalidateRawData()
}
};
