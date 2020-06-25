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
import { jsdata } from "./index";

//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class lineChartWidget {
    private _name: string;
    private _selectedCounties: Set<number>;
    private _selectedAges: Set<string>;
    private _lineChart: am4charts.XYChart;
    private cacheCounties: Set<number>;
    private cacheAges: Set<string>;

    constructor(name: string, selectedCounties: Set<number>, selectedAges: Set<string>) {
        this._name = name;
        this._selectedCounties = selectedCounties;
        this._selectedAges = selectedAges;
        holdClassThisContext = this;
        this._lineChart = am4core.create("linechart", am4charts.XYChart);
        this.cacheCounties = new Set();
        this.cacheAges = new Set();
        this.initLineChart();
        this.setEvents();
    };

    //////////////////////////////Public Interface////////////////////////////////////////
    // 
    //
    // Getters & Setters

    public get lineChart(): am4charts.XYChart {
        return this._lineChart;
    }

    public get selectedAges(): Set<string> {
        return this._selectedAges;
    }
    public set selectedAges(value: Set<string>) {
        this._selectedAges = value;
    }

    public get selectedCounties(): Set<number> {
        return this._selectedCounties;
    }
    public set selectedCounties(value: Set<number>) {
        this._selectedCounties = value;
    }

    //
    //
    //////////////////////////////////////////////////////////////////////////////////////



    ///////////////////// Private Interface...not to be used by consumer

    initLineChart(): void {

        //this.lineChart = am4core.create("linechart", am4charts.XYChart);
        //lineChart.height = am4core.percent(25);
        this.lineChart.responsive.enabled = true;
        this.lineChart.height = 250
        this.lineChart.width = am4core.percent(100);
        this.lineChart.fontSize = "0.8em";
        this.lineChart.paddingRight = 30;
        this.lineChart.paddingLeft = 30;
        this.lineChart.maskBullets = false;
        this.lineChart.zoomOutButton.disabled = true;
        this.lineChart.paddingBottom = 5;
        this.lineChart.paddingTop = 3;
        let title = this.lineChart.titles.push(new am4core.Label());
        title.text = "Fake COVID-19 cases";
        title.marginBottom = 15;


        let xAxis = this.lineChart.xAxes.push(new am4charts.ValueAxis());
        xAxis.renderer.minGridDistance = 40;

        // Create value axis
        let yAxis = this.lineChart.yAxes.push(new am4charts.ValueAxis());
        this.lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(this._selectedAges), ["all"]);
        var series1 = this.lineChart.series.push(new am4charts.LineSeries());
        series1.dataFields.valueX = "x";
        series1.dataFields.valueY = "y";

    }// end initLineChart

    setEvents(): void {

        setInterval(function() {
            //console.log("checking for changes");
            if ( !(utils.eqSet(holdClassThisContext.cacheCounties, holdClassThisContext._selectedCounties))  &&
                utils.eqSet(holdClassThisContext.cacheAges, holdClassThisContext.selectedAges) )  {
                //console.log("difference detected");
                holdClassThisContext.lineChart.data = dm.convertData(jsdata, "t", "S",
                    Array.from(holdClassThisContext.selectedAges), Array.from(holdClassThisContext._selectedCounties));
                holdClassThisContext.lineChart.invalidateData();

                holdClassThisContext.cacheAges = new Set(holdClassThisContext.selectedAges);
                holdClassThisContext.cacheCounties = new Set(holdClassThisContext._selectedCounties);
            }

        }, 300);
        // Add or subtract slices value from total value
        
    }// end setEvents
}// end class lineChartWidget


// Export
export { lineChartWidget };

