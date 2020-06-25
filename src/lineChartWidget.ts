import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// Local imports
import { mapOfUKWidget } from "./mapOfUKWidget";
import { pieChartWidget } from "./pieChartWidget";
import { dm } from "./index";
import { jsdata } from "./index";


//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class lineChartWidget {
    private _name: string;
    private mchart: mapOfUKWidget;
    private pchart: pieChartWidget;
    // private _selectedCounties: Set<number>;
    // private _selectedAges: Set<string>;
    private _lineChart: am4charts.XYChart;
    private cacheCounties: Set<number>;
    private cacheAges: Set<string>;
    private _data: any;
    

    //constructor(name: string, selectedCounties: Set<number>, selectedAges: Set<string>) {
    constructor(name: string, mchart: mapOfUKWidget, pchart: pieChartWidget) {
        this._name = name;
        this.mchart = mchart;
        this.pchart = pchart;
        // this._selectedCounties = mchart.selectedCounties;
        // this._selectedAges = pchart.selectedAges;
        holdClassThisContext = this;
        this._lineChart = am4core.create("linechart", am4charts.XYChart);
        this.cacheCounties = new Set();
        this.cacheAges = new Set();
        this.initLineChart();
        //this.setEvents();
    };

    //////////////////////////////Public Interface////////////////////////////////////////
    // 
    //
    public get lineChart(): am4charts.XYChart {
        return this._lineChart;
    }
    //
    public get data(): any {
        return this._data;
    }
    public set data(value: any) {
        this._lineChart.data = this._data = value;
    }
    //
    public updateDataRequest() {
        //console.log("checking for changes");
        this._lineChart.data = dm.convertData(jsdata, "t", "S",
            Array.from(this.pchart.selectedAges), Array.from(this.mchart.selectedCounties));
        this._lineChart.invalidateData();
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
        this.lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(this.pchart.selectedAges), ["all"]);
        var series1 = this.lineChart.series.push(new am4charts.LineSeries());
        series1.dataFields.valueX = "x";
        series1.dataFields.valueY = "y";

    }// end initLineChart

}// end class lineChartWidget


// Export
export { lineChartWidget };

