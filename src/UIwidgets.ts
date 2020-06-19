import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";
import * as dm from './dataMap';
import * as utils from './utils';

export function UKmap(label: string, selectedCounties: Set){
	let mapChart = am4core.create(label, am4maps.MapChart);
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

	// Create map polygon series  (UK minus Ireland)
	var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
	// Exclude Ireland
	polygonSeries.exclude = ["IE"];
	// Make map load polygon (like country names) data from GeoJSON
	polygonSeries.useGeodata = true;

	var polygonTemplate = polygonSeries.mapPolygons.template;
	polygonTemplate.strokeWidth = 0.5;
	polygonTemplate.tooltipText = "{name}";
	polygonTemplate.fill = am4core.color("#E8CCBF");

	// Create hover state and set alternative fill color
	var hs = polygonTemplate.states.create("hover");
	hs.properties.fill = mapChart.colors.getIndex(2);

	// Create active state
	var activeState = polygonTemplate.states.create("active");
	activeState.properties.fill = mapChart.colors.getIndex(4);

	// Create highlight state and set alternative fill color (alias for hover)
	// This is a duplicate of hover, but is needed because hover contains additional hidden logic
	var highlightState = polygonTemplate.states.create("highlight");
	highlightState.properties.fill = mapChart.colors.getIndex(2);

	var aliasActiveState = polygonTemplate.states.create("aliasActive");
	aliasActiveState.properties.fill = mapChart.colors.getIndex(4);

	var aliasDefaultState = polygonTemplate.states.create("aliasDefault");
	aliasDefaultState.properties.fill = mapChart.colors.getIndex(0);

	///////////////////////////////////////////////////////////////////////////////////////////////
	// Create map polygon series  (Ireland only)
	var polygonSeriesIE = mapChart.series.push(new am4maps.MapPolygonSeries());
	// Include Ireland Only
	polygonSeriesIE.include = ["IE"];
	// Make map load polygon (like country names) data from GeoJSON
	polygonSeriesIE.useGeodata = true;
	var PolygonTemplateIE = polygonSeriesIE.mapPolygons.template;
	PolygonTemplateIE.strokeWidth = 0.5;
	PolygonTemplateIE.tooltipText = "{name}";
	PolygonTemplateIE.fill = am4core.color("#99C78F");  //green :)
	PolygonTemplateIE.fillOpacity = 0.3

	// Create hover state and set alternative fill color
	var hs = PolygonTemplateIE.states.create("hover");
	hs.properties.fill = mapChart.colors.getIndex(2);

	// Create active state
	var activeState = PolygonTemplateIE.states.create("active");
	activeState.properties.fill = mapChart.colors.getIndex(4);

	// Create highlight state and set alternative fill color (alias for hover)
	// This is a duplicate of hover, but is needed because hover contains additional hidden logic
	var highlightState = PolygonTemplateIE.states.create("highlight");
	highlightState.properties.fill = mapChart.colors.getIndex(2);

	var aliasActiveState = PolygonTemplateIE.states.create("aliasActive");
	aliasActiveState.properties.fill = mapChart.colors.getIndex(4);

	var aliasDefaultState = PolygonTemplateIE.states.create("aliasDefault");
	aliasDefaultState.properties.fill = mapChart.colors.getIndex(0);

	
	////////////////////////////////////////////////////////////////////////////
	// Small Map
	//
	//Small map to toggle features
	mapChart.smallMap = new am4maps.SmallMap();
	mapChart.smallMap.series.push(polygonSeries);

	// Disable pan and zoom comtrols
	mapChart.smallMap.draggable = false;
	mapChart.smallMap.resizable = false;
	mapChart.smallMap.rectangle.strokeWidth = 0;

	var smallSeries = mapChart.smallMap.series.getIndex(0);
	var smallTemplate = smallSeries.mapPolygons.template;
	smallTemplate.stroke = smallSeries.mapPolygons.template.fill;
	smallTemplate.strokeWidth = 0;
	smallTemplate.polygon.fill = mapChart.colors.getIndex(4);
	smallTemplate.polygon.fillOpacity = 1;


	//////////////////////////////////////////////////
	//Events
	////////////////////////////////////////////////////
	// Create an event to toggle "active" state

	polygonTemplate.events.on("hit", function (ev) {
		var data = ev.target.dataItem.dataContext;
		if (ev.target.isActive) {
			selectedCounties.delete(data.id);
		} else {
			selectedCounties.add(data.id);
		}
		ev.target.isActive = !ev.target.isActive
	});
		
	// If any county is already selected, select all counties. If all are selected, deselect all
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
	}); //end hit


	function setSmallMapColor():void {
		if (allCountiesAreActive()) {
			smallTemplate.polygon.fill = mapChart.colors.getIndex(0);
		} else {
			smallTemplate.polygon.fill = mapChart.colors.getIndex(4);
		}
	}

	////////////////////////////
	// Using 2 separate functions for clarity
	function atLeastOneCountyIsActive(): Boolean {
		let oneActive = false;
		polygonSeries.mapPolygons.each(function (mapPolygon) {
			if (mapPolygon.isActive) {
				oneActive = true;
			}
		})
		return oneActive;
	}

	function allCountiesAreActive() {
		let allActive = true;
		polygonSeries.mapPolygons.each(function (mapPolygon) {
			if ((!mapPolygon.isActive)) {
				allActive =false;
			}
		});
		return allActive; 	
	}

return mapChart;
}; //end export ukMap


////////////////////////////////////////////////////////////////////////////////////////

export function pieChart(label: string, selectedAges: Set){	
	let pieChart = am4core.create(label, am4charts.PieChart);
	pieChart.hiddenState.properties.opacity = 0; // this creates initial fade-in
	pieChart.seriesContainer.zIndex = -1;
	pieChart.width = am4core.percent(20);
	pieChart.height = am4core.percent(100);
	pieChart.y = am4core.percent(-30);
	let series = pieChart.series.push(new am4charts.PieSeries());
	series.dataFields.value = "value";
	//series.dataFields.radiusValue = "value";
	series.dataFields.category = "ageRange";
	series.slices.template.cornerRadius = 6;
	series.colors.step = 3;
	pieChart.innerRadius = am4core.percent(5);

	series.hiddenState.properties.endAngle = -90;

	series.labels.template.text = "{ageRange}";
	series.slices.template.tooltipText = "{value}";

	let as1 = series.slices.template.states.getKey("active");
	as1.properties.shiftRadius = 0.4;
	as1.properties.strokeWidth = 2;
	as1.properties.strokeOpacity = 1;
	as1.properties.fillOpacity = 1;

	// Put a thick border around each Slice
	series.slices.template.stroke = am4core.color("#4a2abb");
	series.slices.template.strokeWidth = 1;
	series.slices.template.strokeOpacity = 0.2;
	series.slices.template.fillOpacity = 1;
	// series.labels.template.disabled = true;
	// series.ticks.template.disabled = true;

	//curved labels
	series.alignLabels = false;
	series.labels.template.bent = true;
	series.labels.template.radius = -10;
	series.labels.template.padding(0, 0, 0, 0);
	series.labels.template.fill = am4core.color("#000");
	series.ticks.template.disabled = true;

	//rotated labels
	// series.ticks.template.disabled = true;
	// series.alignLabels = false;
	// series.labels.template.text = "{ageRange}";
	// series.labels.template.radius = am4core.percent(-40);
	// series.labels.template.fill = am4core.color("black");
	// series.labels.template.relativeRotation = 90;

	//Fonts
	series.labels.template.fontSize = 10;
	series.labels.template.fontFamily = "Times";
	series.labels.template.fontWeight = "bold";

	//pieChart.legend = new am4charts.Legend();

	//Label: total of selected slices

	var label = new am4core.Label();
	label.parent = series;
	//var total = totalValue();
	var total = 0;
	label.text = total;
	label.align = "center";
	label.isMeasured = false;
	//label.zIndex = 10;
	//label.text = "0";
	label.horizontalCenter = "middle";
	label.verticalCenter = "middle";
	//label.x = pieChart.x;
	//label.y = pieChart.y;
	label.fontSize = 15;
	label.fontFamily = "Times";
	label.fontWeight = "bold";
	series.slices.template.events.on("hit", function (ev) {
		let data = ev.target.dataItem.dataContext;                              
		let hitValue = data.value;                                             
		if (!ev.target.isActive) {
			total = total - hitValue;
			selectedAges.add(ev.target.dataItem.dataContext["ageRange"]);
		} else {
			total = total + hitValue;
			selectedAges.delete(ev.target.dataItem.dataContext["ageRange"]);
		}
		label.text = total;
	}); // end event hit

	///////////////////////////////////
	//Propogate hover and hit events on a label to the underlying slice
	series.labels.template.events.on("hit", function (ev) {
		let parentSlice = ev.target._dataItem._slice;
		parentSlice.dispatchImmediately("hit");
	});
	return pieChart;
} // end export pieChart

