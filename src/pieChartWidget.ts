import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// Local imports
import { lineChartWidget } from "./lineChartWidget";

//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class pieChartWidget {
    private name: string;
    private _pieChartData: any;
    private _selectedAges: Set<string>;
    private _pieChart: am4charts.PieChart;
    private series: am4charts.PieSeries;
    private _data: any;
    private _lineChartWidget: lineChartWidget;
    private totalLabel: am4core.Label = new am4core.Label();
    private total: number = 0;
    private highlightStrokeColor: any = am4core.color("red");
    private defaultColor: any = am4core.color("green");
    private activeColor: any = am4core.color("red");


    constructor(name: string, pieChartData: any, selectedAges: Set<string>) {
        this.name = name;
        this._pieChartData = pieChartData;
        this.selectedAges = selectedAges;
        holdClassThisContext = this;
        this.initPieChart();
        this.setEvents();
    };

    //////////////////////////////Public Interface////////////////////////////////////////
    // 
    //
    public get pieChart(): am4charts.PieChart {
        return this._pieChart;
    }
    public get data(): any {
        return this._data;
    }
    public set data(value: any) {
        this._data = value;
    }
    //
    public get selectedAges(): Set<string> {
        return this._selectedAges;
    }
    public set selectedAges(value: Set<string>) {
        this._selectedAges = value;
    }
    //
    public set lineChartWidget(value: lineChartWidget) {
        this._lineChartWidget = value;
    }
    //
    //
    //////////////////////////////////////////////////////////////////////////////////////


    ///////////////////// Private Interface...not to be used by consumer

    initPieChart(): void {
        this._pieChart = am4core.create(this.name, am4charts.PieChart);
        this._pieChart.data = this._pieChartData;
        this._pieChart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        //this._pieChart.seriesContainer.zIndex = -1;
        //this._pieChart.width = am4core.percent(20);
        //this._pieChart.height = am4core.percent(100);
        //this._pieChart.align = "center";
        //this._pieChart.valign;
        this._pieChart.radius = am4core.percent(60);
        this._pieChart.innerRadius = am4core.percent(0);
        //this._pieChart.x = am4core.percent(-5);

        // var miniPie = am4core.create("minipie", am4charts.PieChart);
        // miniPie.data = [{
        //     "value": "minime",
        //     "color": am4core.color("green")
        // }]
        // miniPie.radius = am4core.percent(10);
        // var miniseries = this._pieChart.series.push(new am4charts.PieSeries());
        // miniseries.labels.template.disabled = true;
        // miniseries.ticks.template.disabled = true;
        // miniPie.x = am4core.percent(80);
        // //miniseries.dataFields.value = "value";


        // Add and configure Series
        this.series = this._pieChart.series.push(new am4charts.PieSeries());
        this.series.dataFields.value = "value";
        //this.series.dataFields.radiusValue = "value";
        this.series.dataFields.category = "ageRange";

        // This creates initial animation
        this.series.hiddenState.properties.opacity = 1;
        this.series.hiddenState.properties.endAngle = -90;
        this.series.hiddenState.properties.startAngle = -90;



        this.series.slices.template.cornerRadius = 6;
        this.series.slices.template.fillOpacity = 0.7;
        this.series.slices.template.fill = this.defaultColor;

        this.series.slices.template.strokeWidth = 1;
        this.series.slices.template.stroke = am4core.color("white");
        //this.series.slices.template.tooltipText = "{ageRange}:{value}";
        this.series.slices.template.tooltipText = "";

        //rotated labels
        this.series.ticks.template.disabled = true;
        this.series.alignLabels = false;
        this.series.labels.template.text = "{ageRange}";
        this.series.labels.template.radius = am4core.percent(0);
        this.series.labels.template.relativeRotation = 90;
        //Fonts
        this.series.labels.template.fontSize = 20;
        this.series.labels.template.fontFamily = "Times";
        this.series.labels.template.fontWeight = "bold";
        this.series.labels.template.fill = am4core.color("black");
        //this.series.labels.template.zIndex = 100;

        // Override some state properties on slice and its label

        let omg = this.series.slices.template.states.create("hover");
        omg.properties.shiftRadius = 0;
        omg.properties.scale = 1.05;
        omg.properties.fillOpacity = 0.3;
        //omg.properties.fill = this.highlightStrokeColor;
        omg.properties.stroke = this.highlightStrokeColor;
        omg.properties.strokeWidth = 3;

        let omg3 = this.series.slices.template.states.create("hoverActive");
        //omg3.properties.shiftRadius = 0;
        omg3.properties.shiftRadius = 0.1;
        omg3.properties.scale = 1.05;
        omg3.properties.fillOpacity = 0.6;
        //omg3.properties.fill = this.defaultColor;
        omg.properties.stroke = this.highlightStrokeColor;
        omg.properties.strokeWidth = 3;

        let omg2 = this.series.slices.template.states.create("default");
        //omg2.properties.fillOpacity = 0.5;
        //omg2.properties.stroke = am4core.color("white");
        //omg2.properties.strokeWidth = 0;

        let as = this.series.slices.template.states.create("active");
        as.properties.fill = this.activeColor;
        as.properties.fillOpacity = 1;
        // as.properties.stroke = am4core.color("red");
        // as.properties.strokeWidth = 4;
        as.properties.shiftRadius = 0.1;


        let asl = this.series.labels.template.states.create("aliasActive");
        asl.properties.fill = this.highlightStrokeColor;

        let isl = this.series.labels.template.states.create("aliasDefault");
        isl.properties.fill = am4core.color("black");

        // Disable the active/default behaviours of pie chart
        //this.series.slices.template.togglable = false;

        // var colorSet = new am4core.ColorSet();
        // colorSet.list = [
        //     am4core.color("#A3C1AD"),  //Cambridge Blue!
        //     am4core.color("#002147"),  //Oxford Blue
        //     am4core.color("#AC8E35"),  //Dark Goldenrod
        //     am4core.color("#7D544F"),  //Tuscan Red
        //     am4core.color("#615019"),  //Field Drab
        //     am4core.color("#555555"),  //Davy's Grey
        // ].map(function (color) {
        //     return new am4core.color(color);
        // });
        // colorSet.reuse;
        //this.series.colors = colorSet;
        //this.series.colors.reuse;
        /////////////////////////////////////////
        // //this.series.colors.step = 1;
        // this.pieChart.colors.reuse;
        // ////////////


        //curved labels
        // this.series.alignLabels = false;
        // this.series.labels.template.bent = true;
        // this.series.labels.template.radius = -10;
        // this.series.labels.template.padding(0, 0, 0, 0);
        // this.series.labels.template.fill = am4core.color("#000");

        //_pieChart.legend = new am4charts.Legend();

        //totalLabel: total of selected slices
        var container = new am4core.Container();
        container.parent = this.series;
        container.horizontalCenter = "middle";
        container.verticalCenter = "middle";
        //container.width = am4core.percent(10) / Math.sqrt(2);
        //container.background.fill = am4core.color("white");
        //container.fill = am4core.color("white");
        this.totalLabel.parent = container;
        this.totalLabel.text = this.total.toString();
        this.totalLabel.fill = am4core.color("red");
        this.totalLabel.stroke = am4core.color("black");
        this.totalLabel.horizontalCenter = "middle";
        this.totalLabel.verticalCenter = "middle";
        this.totalLabel.fontSize = 30;
        this.totalLabel.fontFamily = "Verdana";
        this.totalLabel.fontWeight = "bold";
    } // end initPieChart


    private setEvents(): void {
        ///////////////////////// Pie Chart Slice Events ////////////////
        this.series.slices.template.events.on("hit", function (ev) {
            //holdClassThisContext._hitFlag = true;
            //NB  Active flag has changed on the hit event (before this code is reached)
            let slice = ev.target;
            //console.log("in slice HIT", "os", holdClassThisContext.overSlice, "ol", holdClassThisContext.overLabel);
            let label = slice._dataItem._label;
            let data = slice.dataItem.dataContext;
            let hitValue = data.value;
            if (!slice.isActive) {
                holdClassThisContext.total = holdClassThisContext.total - hitValue;
                holdClassThisContext.selectedAges.delete(ev.target.dataItem.dataContext["ageRange"]);
                slice.setState("default");
                label.setState("aliasDefault")
            } else {
                holdClassThisContext.total = holdClassThisContext.total + hitValue;
                holdClassThisContext.selectedAges.add(ev.target.dataItem.dataContext["ageRange"]);
                slice.setState("active");
                label.setState("aliasActive")
            }
            holdClassThisContext.totalLabel.text = holdClassThisContext.total.toString();
            holdClassThisContext._lineChartWidget.updateDataRequest();
        }); // end event hit

        // this.series.slices.template.events.on("over", function (ev) {
        //     let slice = ev.target;
        //     let label = slice._dataItem._label;
        // });

        // this.series.slices.template.events.on("out", function (ev) {
        //     let slice = ev.target;
        //     let label = slice._dataItem._label;
        // });//end slice out

        ///////////////////////// Pie Chart (slice) Label Events ////////////////
        //Propogate hit event on a pieseries label to the parent slice
        this.series.labels.template.events.on("hit", function (ev) {
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("hit");
        });
        // this.series.labels.template.events.on("over", function (ev) {
        //     let parentSlice = ev.target._dataItem._slice;
        // });
        // this.series.labels.template.events.on("out", function (ev) {
        //     let label = ev.target;
        //     let parentSlice = ev.target._dataItem._slice;
        // });

    } //end setEvents

} // end class pieChart


// Export
export { pieChartWidget };
