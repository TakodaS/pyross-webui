import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";
// import * as dm from "./dataMap";
// import * as utils from "./utils";

import { dm } from "./index";
import { utils } from "./index";

//var selectedCounties = new Set();
//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;

class mapOfUKWidget {
    //label: string;
    //selectedCounties: any;
    //label: string;
    //selectedCounties: any;
    private _mapChart: am4maps.MapChart;
    private polygonTemplate: am4maps.MapPolygon;
    private polygonSeries: am4maps.MapPolygonSeries;
    private _selectedCounties: Set<number> = new Set();
    private inactiveColor: any;
    private activeColor: any;
    //private highlightColor: any;
    private highlightStrokeColor: any;
    private smallTemplate: any;

    
    constructor() {
        this._selectedCounties = new Set();
        this.getThisContext();
        this.initLargeMap();
        this.initSmallMap();
        this.setEvents();
        //this.addControlButtons();
    }

    //////////////////////////////Public Interface////////////////////////////////////////
    // 
    //
    public get mapChart(): am4maps.MapChart {
        return this._mapChart;
    }
    //
    public get selectedCounties() {
        return this._selectedCounties;
    }
    public set selectedCounties(value) {
        this._selectedCounties = value;
    }
    //
    //
    //////////////////////////////////////////////////////////////////////////////////////



    ///////////////////// Private Interface...not to be used by consumer
    private getThisContext(): void { holdClassThisContext = this };

    private initLargeMap(): void {
        this._mapChart = am4core.create("mapchart", am4maps.MapChart);
        //this.mapChart.width = am4core.percent(50);
        //this.mapChart.height = am4core.percent(100);
        this._mapChart.seriesContainer.draggable = false;
        //this._mapChart.seriesContainer.resizable = false;
        //this._mapChart.zoomLevel = 1;
        //this._mapChart.maxZoomLevel = 1;

        // Set map definition
        this._mapChart.geodata = am4geodata_ukCountiesHigh;
        // Set projection
        this._mapChart.projection = new am4maps.projections.Miller();
        this._mapChart.scale = 1;

        // Create map polygon series  (UK minus Ireland)
        this.polygonSeries = this._mapChart.series.push(new am4maps.MapPolygonSeries());
        // Exclude Ireland
        this.polygonSeries.exclude = ["IE"];
        // Make map load polygon (like country names) data from GeoJSON
        this.polygonSeries.useGeodata = true;
        //polygonSeries.zoom = 0.4;

        ////////// COLORS
        this.inactiveColor = am4core.color("#A3C1AD"); //Cambidge Blue!
        this.activeColor = am4core.color("#002147");  //Oxford Blue
        //this.highlightColor = am4core.color("yellow");
        this.highlightStrokeColor = am4core.color("black");

        this.polygonTemplate = this.polygonSeries.mapPolygons.template;
        this.polygonTemplate.strokeWidth = 0.5;
        this.polygonTemplate.tooltipText = "{name}";
        this.polygonTemplate.fill = this.inactiveColor;


        // Create hover state and set alternative fill color
        //   var hs = polygonTemplate.states.create("hover");
        // 	hs.properties.fill = highlightColor;

        // Create active state
        //   var activeState = polygonTemplate.states.create("active");
        // 	activeState.properties.fill = activeColor;

        // Create highlight state and set alternative fill color (alias for hover)
        // This is a duplicate of hover, but is needed because hover contains additional hidden logic
        //These are all custom states.
        let highlightState = this.polygonTemplate.states.create("highlight");
        //highlightState.properties.fill = highlightColor;
        highlightState.properties.fillOpacity = 0.6;
        highlightState.properties.stroke = this.highlightStrokeColor;
        highlightState.properties.strokeWidth = 3;

        let aliasActiveState = this.polygonTemplate.states.create("aliasActive");
        aliasActiveState.properties.fill = this.activeColor;
        aliasActiveState.properties.fillOpacity = 1;
        aliasActiveState.properties.stroke = am4core.color("white");
        aliasActiveState.properties.strokeWidth = 1;
        
        let aliasInactiveState = this.polygonTemplate.states.create("aliasInactive");
        aliasInactiveState.properties.fill = this.inactiveColor;
        aliasInactiveState.properties.fillOpacity = 1;
        aliasInactiveState.properties.stroke = am4core.color("white");
        aliasInactiveState.properties.strokeWidth = 1;
            

        ///////////////////////////////////////////////////////////////////////////////////////////////
        // Create map polygon series  (Ireland only)
        let polygonSeriesIE = this._mapChart.series.push(new am4maps.MapPolygonSeries());
        // Include Ireland Only
        polygonSeriesIE.include = ["IE"];
        // Make map load polygon (like country names) data from GeoJSON
        polygonSeriesIE.useGeodata = true;
        let templateIE = polygonSeriesIE.mapPolygons.template;
        templateIE.strokeWidth = 0.5;
        templateIE.tooltipText = "{name}";
        templateIE.fill = am4core.color("green"); //green :)
        templateIE.fillOpacity = 0.3;

    } // end initLargeMap

    private initSmallMap(): void {
        this._mapChart.smallMap = new am4maps.SmallMap();
        this._mapChart.smallMap.series.push(this.polygonSeries);

        // Disable pan and zoom comtrols
        this._mapChart.smallMap.draggable = false;
        this._mapChart.smallMap.resizable = false;
        this._mapChart.smallMap.rectangle.strokeWidth = 0;
        this._mapChart.smallMap.scale = 1;

        let smallSeries = this._mapChart.smallMap.series.getIndex(0);
        this.smallTemplate = smallSeries.mapPolygons.template;
        //smallTemplate.stroke = smallSeries.mapPolygons.template.fill;
        this.smallTemplate.strokeWidth = 0;
        this.smallTemplate.fill = this.activeColor;
        //smallTemplate.polygon.fill = am4core.color("tan");
        // smallTemplate.polygon.fillOpacity = 1;
    } //end initSmallMap

    
    //////////////////////////////////////////////////
    //Events
    ////////////////////////////////////////////////////
   // onClickGood = (e: Event) => { this.info = e.message }
    //Sprite.events: am4core.SpriteEventDispatcher<am4core.AMEvent<am4maps.MapPolygon, am4maps.IMapPolygonEvents>>
    private setEvents(): void {
        //The following alias(S) are needed as the context of "this" within the event handlers is "undefined"!
        // let aliasCheckIfAllCountriesAreSame = this.checkIfAllCountiesAreSame;
        // let aliasMapChart = this.mapChart;
        // let aliasGetSmallMapColor = this.getSmallMapColor;
        // let aliasPolygonSeries = this.polygonSeries;
        // let aliasActiveColor = this.activeColor;
        // let aliasInactiveColor = this.inactiveColor;
        // let aliasThisContext = this;

        this.polygonTemplate.events.on("hit", function (ev) {
            let mappoly = ev.target;
            let data = mappoly.dataItem.dataContext;

            mappoly.isActive = !mappoly.isActive;
            if (mappoly.isActive) {
                holdClassThisContext._selectedCounties.add(data.id);
                mappoly.setState("aliasActive");
            } else {
                holdClassThisContext._selectedCounties.delete(data.id);
                mappoly.setState("aliasInactive");
            }
            //aliasCheckIfAllCountriesAreSame();
            holdClassThisContext.checkIfAllCountiesAreSame();
        });

        
    // secondMethod = () => {
    //         this.checkIfAllCountiesAreSame();
    // }
    
    // secondMethod2 = () => {
    //     let thisC = this.printIt;
    //     this.polygonTemplate.events.on("hit", function (ev) {
    //         thisC();
    //     }
    // });

    // printIt(): void {
    //     console.log("PRINTINT ITIT T TITITIT");
    // }
        
        this.polygonTemplate.events.on("over", function (ev) {
            let mappoly = ev.target;
            mappoly.setState("highlight");
            });

        this.polygonTemplate.events.on("out", function (ev) {
            let mappoly = ev.target;
            if (mappoly.isActive) {
                mappoly.setState("aliasActive");
            } else {
                mappoly.setState("aliasInactive");
            }
        };
    
    

        // Set active status (and therefore color) of the BIG MAP to be the same as smallMap.  Toggle smallMap color.
        this._mapChart.smallMap.events.on("hit", function (ev) {
            holdClassThisContext.mapChart.goHome(); //Big map does not move when smallMap is clicked on
            if (holdClassThisContext.getSmallMapColor() == holdClassThisContext.activeColor) {
                //make all counties active
                holdClassThisContext.polygonSeries.mapPolygons.each(function (mapPolygon) {
                    if (!mapPolygon.isActive) {
                        mapPolygon.dispatchImmediately("hit");
                    }
                })
            } else {
                //make all counties inative
                holdClassThisContext.polygonSeries.mapPolygons.each(function (mapPolygon) {
                    if (mapPolygon.isActive) {
                    mapPolygon.dispatchImmediately("hit");
                    }
                })
            }
        })  //end hit smallMap

        // Hover has complicated hidden behaviours so use a simple custom "highlight" (only changes colour)
        this._mapChart.smallMap.events.on("over", function (event) {
            let smcolor = holdClassThisContext.getSmallMapColor();
            if (smcolor == holdClassThisContext.inactiveColor) {
                holdClassThisContext.polygonSeries.mapPolygons.each(function (mapPolygon) {
                    mapPolygon.setState("aliasInactive");
                })
            } else {
                holdClassThisContext.polygonSeries.mapPolygons.each(function (mapPolygon) {
                    mapPolygon.setState("aliasActive");
                })
            }
            //polygonTemplate.tooltipText = "UK: [bold]{name}[/]";
        });

        this._mapChart.smallMap.events.on("out", function (event) {
            holdClassThisContext.polygonSeries.mapPolygons.each(function (mapPolygon) {
                if (mapPolygon.isActive) {
                    mapPolygon.setState("aliasActive");
                } else if (!mapPolygon.isActive) {
                    mapPolygon.setState("aliasInactive");
                } else {
                    console.log("WRONG COLOR");
                }
            })
        });

    }; //end setEvents


    // Event Helpers
    private checkIfAllCountiesAreSame() {
        let allActive = true;
        let allInactive = true;
        let smcolor: am4core.Color = holdClassThisContext.getSmallMapColor();

        holdClassThisContext.polygonSeries.mapPolygons.each(function (mapPolygon) {
            if (mapPolygon.isActive) {
                allInactive = false;
            } else {
                allActive = false;
            }
        })

        if (smcolor == holdClassThisContext.activeColor && allActive) {
            holdClassThisContext.setSmallMapColor(holdClassThisContext.inactiveColor);
        } else if (smcolor == holdClassThisContext.inactiveColor && allInactive) {
            holdClassThisContext.setSmallMapColor(holdClassThisContext.activeColor);
        }
    }) //end checkIfAllCountiesAreSame


    private setSmallMapColor(smcolor: am4core.Color): void {
        if ((smcolor == holdClassThisContext.inactiveColor)) {
            holdClassThisContext.smallTemplate.polygon.fill = holdClassThisContext.inactiveColor;
        } else {   //if ((smcolor == holdClassThisContext.activeColor)) {
            holdClassThisContext.smallTemplate.polygon.fill = holdClassThisContext.activeColor;
        }
    }

    private getSmallMapColor():am4core.Color {
        if (holdClassThisContext.smallTemplate.polygon.fill == holdClassThisContext.inactiveColor) {
            return holdClassThisContext.inactiveColor;
        } else {
            return holdClassThisContext.activeColor;
        }
    }
        
    private smallMapColorToggle():void {
        if (holdClassThisContext.getSmallMapColor() == holdClassThisContext.inactiveColor) {
            holdClassThisContext.setSmallMapColor(holdClassThisContext.activeColor);
        } else  {
            holdClassThisContext.setSmallMapColor(holdClassThisContext.inactiveColor);
        }
    }
        
    
    // addControlButtons() {
    //     // Add zoom control
    //     this._mapChart.zoomControl = new am4maps.ZoomControl();
    //     this._mapChart.zoomControl.scale = 1;

    //     // Add button
    //     button = this._mapChart.chartContainer.createChild(am4core.Button);
    //     button.padding(5, 5, 5, 5);
    //     button.align = "right";
    //     button.marginRight = 15;
    //     button.icon = new am4core.Sprite();
    //     button.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    // }
        
    // button.events.on("hit", function() {
    //     holdClassThisContext._mapChart.goHome();
    // });

    

} //end class mapOfUKWidget



// Export 
export { mapOfUKWidget };
