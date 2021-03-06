import * as am4core from "@amcharts/amcharts4/core"
import * as am4maps from "@amcharts/amcharts4/maps"

//local imports
import { lineChartWidget } from "./lineChartWidget"
//import { ukmapdatamod } from "./ukCountiesHighModMinified.js" //This is actually a default export which can be named anything
//import { ukmapdatamod } from "./groupLADMapComplete.js"
import { ukmapdatamod } from "./data/groupMap2FieldsMin.js"

//var selectedCounties = new Set();
//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any

class mapOfUKWidget {
	private _mapChart: am4maps.MapChart | any
	private polygonTemplate: am4maps.MapPolygon | any
	private polygonSeries: am4maps.MapPolygonSeries | any
	private polygonSeriesIE: am4maps.MapPolygonSeries | any
	private _selectedCounties: Set<string> = new Set()
	private inactiveColor: any
	private activeColor: any
	//private highlightColor: any;
	private highlightStrokeColor: any
	private smallTemplate: any
	private _hitFlag: boolean = false
	private _lineChartWidget: lineChartWidget | any
	button: any

	constructor() {
		this._selectedCounties = new Set()
		this.getThisContext()
		this.initLargeMap()
		this.initSmallMap()
		this.setEvents()
		this.addControlButtons();
	}

	//////////////////////////////Public Interface////////////////////////////////////////
	//
	//
	public get mapChart(): am4maps.MapChart {
		return this._mapChart
	}
	//
	public get selectedCounties() {
		return this._selectedCounties
	}
	// public set selectedCounties(value) {
	//     this._selectedCounties = value;
	// }
	//
	public get hitFlag(): boolean {
		let bool: boolean = this._hitFlag
		this._hitFlag = !this._hitFlag
		return bool
	}
	public set hitFlag(value: boolean) {
		this._hitFlag = value
	}
	//
	public set lineChartWidget(value: lineChartWidget) {
		this._lineChartWidget = value
	}
	//
	//////////////////////////////////////////////////////////////////////////////////////

	///////////////////// Private Interface...not to be used by consumer
	private getThisContext(): void {
		holdClassThisContext = this
	}

	private initLargeMap(): void {
		this._mapChart = am4core.create("mapchart", am4maps.MapChart)
		//this.mapChart.width = am4core.percent(50);
		//this.mapChart.height = am4core.percent(100);
		//this._mapChart.seriesContainer.draggable = false
		//this._mapChart.seriesContainer.resizable = false
		this._mapChart.zoomLevel = 1
		//this._mapChart.maxZoomLevel = 1
		this._mapChart.logo.dom.outerHTML = ""

		// Set map data
		//this._mapChart.geodata = am4geodata_ukCountiesHigh;
		//chart.geodata = customUKMap // if you use a script in .html file  to the js file with "var customUKMap = { type...feature......"
		this._mapChart.geodata = ukmapdatamod // is you use ES6 or typescript  in the data file as   "export default { type...feature....."  AND an import as above

		//THE FOLLOWING DOES NOT WORK EVEN THOUGH AMCHARTS HAS AN EXAMPLE USING IT!!!!!
		//this._mapChart.geodataSource.url = "./ukCountiesHighMod.json";

		console.log("mapchart", this._mapChart);
		// Set projection
		this._mapChart.projection = new am4maps.projections.Miller()

		// Create map polygon series  (UK minus Ireland)
		this.polygonSeries = this._mapChart.series.push(
			new am4maps.MapPolygonSeries()
		)

		// Make map load polygon (like country names) data from GeoJSON  (this must be done in addition to the import and setting geodata property!!!!!)
		this.polygonSeries.useGeodata = true

		// Exclude Ireland
		//this.polygonSeries.exclude = ["IE", "GB-NIR"]
		// Make map load polygon (like country names) data from GeoJSON
		//polygonSeries.zoom = 0.4;

		//Make more space for scaling
		this._mapChart.scale = 1.13;
		this._mapChart.x = am4core.percent(-26)
		this._mapChart.y = am4core.percent(-12)

		////////// COLORS
		this.inactiveColor = am4core.color("#A3C1AD") //Cambidge Blue!
		this.activeColor = am4core.color("#002147") //Oxford Blue
		//this.highlightColor = am4core.color("yellow");
		this.highlightStrokeColor = am4core.color("black")

		this.polygonTemplate = this.polygonSeries.mapPolygons.template
		this.polygonTemplate.strokeWidth = 0.5
		this.polygonTemplate.tooltipText = "{name}"
		this.polygonTemplate.fill = this.inactiveColor

		// Create hover state and set alternative fill color
		//   var hs = polygonTemplate.states.create("hover");
		// 	hs.properties.fill = highlightColor;

		// Create active state
		//   var activeState = polygonTemplate.states.create("active");
		// 	activeState.properties.fill = activeColor;

		// Create highlight state and set alternative fill color (alias for hover)
		// This is a duplicate of hover, but is needed because hover contains additional hidden logic
		//These are all custom states.
		let highlightState = this.polygonTemplate.states.create("highlight")
		//highlightState.properties.fill = highlightColor;
		highlightState.properties.fillOpacity = 0.6
		highlightState.properties.stroke = this.highlightStrokeColor
		highlightState.properties.strokeWidth = 3

		let aliasActiveState = this.polygonTemplate.states.create("aliasActive")
		aliasActiveState.properties.fill = this.activeColor
		aliasActiveState.properties.fillOpacity = 1
		aliasActiveState.properties.stroke = am4core.color("white")
		aliasActiveState.properties.strokeWidth = 1

		let aliasInactiveState = this.polygonTemplate.states.create("aliasInactive")
		aliasInactiveState.properties.fill = this.inactiveColor
		aliasInactiveState.properties.fillOpacity = 1
		aliasInactiveState.properties.stroke = am4core.color("white")
		aliasInactiveState.properties.strokeWidth = 1

		///////////////////////////////////////////////////////////////////////////////////////////////
		// Create map polygon series  (Ireland only)
		// this.polygonSeriesIE = this._mapChart.series.push(new am4maps.MapPolygonSeries());
		// // Include Ireland Only
		// this.polygonSeriesIE.include = ["IE"];
		// // Make map load polygon (like country names) data from GeoJSON
		// this.polygonSeriesIE.useGeodata = true;
		// let templateIE = this.polygonSeriesIE.mapPolygons.template;
		// templateIE.strokeWidth = 0.5;
		// templateIE.tooltipText = "{name}";
		// templateIE.fill = am4core.color("green"); //green :)
		// templateIE.fillOpacity = 0.3;
	} // end initLargeMap

	private initSmallMap(): void {
		this._mapChart.smallMap = new am4maps.SmallMap()
		this._mapChart.smallMap.series.push(this.polygonSeries)
		//this._mapChart.smallMap.series.push(this.polygonSeriesIE);

		// Disable pan and zoom comtrols
		this._mapChart.smallMap.draggable = false
		this._mapChart.smallMap.resizable = false
		//this._mapChart.smallMap.zIndex = 1000;
		this._mapChart.smallMap.rectangle.strokeWidth = 0
		this._mapChart.smallMap.scale = 0.9

		this._mapChart.smallMap.isMeasured = false
		this._mapChart.smallMap.x = am4core.percent(78)
		//this._mapChart.smallMap.horizontalCenter = "middle";
		this._mapChart.smallMap.y = am4core.percent(45)
		//this._mapChart.smallMap.moveHtmlContainer("smallukmap");

		//this._mapChart.smallMap.zIndex = -10;
		//this._mapChart.smallMap.rectangle.fill = am4core.color("#f00", 0);
		//this._mapChart.smallMap.rectangle.fillOpacity = 0;
		this._mapChart.smallMap.background.fill = am4core.color("#f00", 0)
		//this._mapChart.smallMap.background.fill = am4core.color("red");
		//this._mapChart.smallMap.background.clickable = false;
		//this._mapChart.smallMap.background.hoverable = false;
		//this._mapChart.smallMap.rectangle.hoverable = false;

		let smallSeries = this._mapChart.smallMap.series.getIndex(0)
		this.smallTemplate = smallSeries.mapPolygons.template
		//smallTemplate.stroke = smallSeries.mapPolygons.template.fill;
		this.smallTemplate.strokeWidth = 0
		this.smallTemplate.fill = this.activeColor
	} //end initSmallMap

	//////////////////////////////////////////////////
	//Events
	////////////////////////////////////////////////////
	//Sprite.events: am4core.SpriteEventDispatcher<am4core.AMEvent<am4maps.MapPolygon, am4maps.IMapPolygonEvents>>
	private setEvents(): void {
		this.polygonTemplate.events.on("hit", function (ev: any) {
			holdClassThisContext._hitFlag = true
			let mappoly = ev.target
			let data = mappoly.dataItem.dataContext
			//console.log("MAP ON HIT is active?", mappoly.isActive);
			mappoly.isActive = !mappoly.isActive
			if (mappoly.isActive) {
				holdClassThisContext._selectedCounties.add(data.id)
				mappoly.setState("aliasActive")
			} else {
				holdClassThisContext._selectedCounties.delete(data.id)
				mappoly.setState("aliasInactive")
			}
			//aliasCheckIfAllCountriesAreSame();
			holdClassThisContext.checkIfAllCountiesAreSame()
			//holdClassThisContext._lineChartWidget.updateDataRequest();
		})

		this.polygonTemplate.events.on("over", function (ev: any) {
			let mappoly = ev.target
			mappoly.setState("highlight")
		})

		this.polygonTemplate.events.on("out", function (ev: any) {
			let mappoly = ev.target
			if (mappoly.isActive) {
				mappoly.setState("aliasActive")
			} else {
				mappoly.setState("aliasInactive")
			}
		})

		/////////////////////SMALL MAP EVENTS////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////
		// Set active status (and therefore color) of the BIG MAP to be the same as smallMap.  Toggle smallMap color.
		this._mapChart.smallMap.events.on("hit", function (ev: any) {
			holdClassThisContext.mapChart.goHome() //Big map does not move when smallMap is clicked on
			//console.log(holdClassThisContext._mapChart.smallMap);
			if (
				holdClassThisContext.getSmallMapColor() ==
				holdClassThisContext.activeColor
			) {
				//make all counties active
				holdClassThisContext.polygonSeries.mapPolygons.each(function (
					mapPolygon: any
				) {
					if (!mapPolygon.isActive) {
						mapPolygon.dispatchImmediately("hit")
					}
				})
			} else {
				//make all counties inative
				holdClassThisContext.polygonSeries.mapPolygons.each(function (
					mapPolygon: any
				) {
					if (mapPolygon.isActive) {
						mapPolygon.dispatchImmediately("hit")
					}
				})
			}
		}) //end hit smallMap

		// Hover has complicated hidden behaviours so use a simple custom "highlight" (only changes colour)
		this._mapChart.smallMap.events.on("over", function (event: any) {
			let smcolor = holdClassThisContext.getSmallMapColor()
			if (smcolor == holdClassThisContext.inactiveColor) {
				holdClassThisContext.polygonSeries.mapPolygons.each(function (
					mapPolygon: any
				) {
					mapPolygon.setState("aliasInactive")
				})
			} else {
				holdClassThisContext.polygonSeries.mapPolygons.each(function (
					mapPolygon: any
				) {
					mapPolygon.setState("aliasActive")
				})
			}
			//polygonTemplate.tooltipText = "UK: [bold]{name}[/]";
		})

		this._mapChart.smallMap.events.on("out", function (event: any) {
			holdClassThisContext.polygonSeries.mapPolygons.each(function (
				mapPolygon: any
			) {
				if (mapPolygon.isActive) {
					mapPolygon.setState("aliasActive")
				} else if (!mapPolygon.isActive) {
					mapPolygon.setState("aliasInactive")
				} else {
					console.log("WRONG COLOR")
				}
			})
		})

		this._mapChart.smallMap.events.onAll(function (event: any) {
			//console.log("Small map event", event);
		})
	} //end setEvents

	// Event Helpers
	private checkIfAllCountiesAreSame() {
		let allActive = true
		let allInactive = true
		let smcolor: am4core.Color = holdClassThisContext.getSmallMapColor()

		holdClassThisContext.polygonSeries.mapPolygons.each(function (
			mapPolygon: any
		) {
			if (mapPolygon.isActive) {
				allInactive = false
			} else {
				allActive = false
			}
		})

		if (smcolor == holdClassThisContext.activeColor && allActive) {
			holdClassThisContext.setSmallMapColor(holdClassThisContext.inactiveColor)
		} else if (smcolor == holdClassThisContext.inactiveColor && allInactive) {
			holdClassThisContext.setSmallMapColor(holdClassThisContext.activeColor)
		}
	} //end checkIfAllCountiesAreSame

	private setSmallMapColor(smcolor: am4core.Color): void {
		if (smcolor == holdClassThisContext.inactiveColor) {
			holdClassThisContext.smallTemplate.polygon.fill =
				holdClassThisContext.inactiveColor
		} else {
			//if ((smcolor == holdClassThisContext.activeColor)) {
			holdClassThisContext.smallTemplate.polygon.fill =
				holdClassThisContext.activeColor
		}
	}

	private getSmallMapColor(): am4core.Color {
		if (
			holdClassThisContext.smallTemplate.polygon.fill ==
			holdClassThisContext.inactiveColor
		) {
			return holdClassThisContext.inactiveColor
		} else {
			return holdClassThisContext.activeColor
		}
	}

	// private smallMapColorToggle():void {
	//     if (holdClassThisContext.getSmallMapColor() == holdClassThisContext.inactiveColor) {
	//         holdClassThisContext.setSmallMapColor(holdClassThisContext.activeColor);
	//     } else  {
	//         holdClassThisContext.setSmallMapColor(holdClassThisContext.inactiveColor);
	//     }
	// }

	addControlButtons() {
	    // Add zoom control
	    this._mapChart.zoomControl = new am4maps.ZoomControl();
		this._mapChart.zoomControl.scale = 1
		this._mapChart.zoomControl.isMeasured = false;
		this._mapChart.zoomControl.padding(5, 5, 5, 5)
		//this._mapChart.zoomControl.align = "right"
		//this._mapChart.zoomControl.valign = "middle"
		this._mapChart.zoomControl.x = am4core.percent(85)
		this._mapChart.zoomControl.y = am4core.percent(83)
	

	    // Add button
	    this.button = this._mapChart.chartContainer.createChild(am4core.Button);
		//this.button.padding(5, 5, 5, 5);
		this.button.isMeasured = false
		//this._mapChart.zoomControl.align = "right"
		//this._mapChart.zoomControl.valign = "middle"
		this.button.x = am4core.percent(84)
		this.button.y = am4core.percent(92)
		// this.button.align = "right"
		// this.button.valign = "bottom"
		//this.button.marginR = 15;
		//this.button.moveTo(50, 50);
	    this.button.icon = new am4core.Sprite();
		this.button.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
		this.button.zIndex = 100
		this.button.scale = 1.2
		
		this.button.events.on("hit", function () {
			holdClassThisContext._mapChart.goHome()
		})
	}

	
} //end class mapOfUKWidget

// Export
export { mapOfUKWidget }
