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
    private _hitFlag: boolean = false;   //If a slice is clicked on or ("hit")
    private _lineChartWidget: lineChartWidget;
    private totalLabel: am4core.Label = new am4core.Label();
    private total: number = 0;
    //private highlightStrokeColor: any = am4core.color("black");

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
    public get hitFlag(): boolean {
        let bool: boolean = this._hitFlag;
        this._hitFlag = !this._hitFlag;
        return bool;
    }
    public set hitFlag(value: boolean) {
        this._hitFlag = value;
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
        this._pieChart.radius = am4core.percent(90);
        this._pieChart.innerRadius = am4core.percent(0);
        //this._pieChart.y = am4core.percent(-30);

        this.series = this._pieChart.series.push(new am4charts.PieSeries());
        this.series.dataFields.value = "value";
        this.series.dataFields.radiusValue = "value";
        this.series.dataFields.category = "ageRange";
        this.series.colors.step = 1;
        this.series.hiddenState.properties.endAngle = -90;

        this.series.slices.template.cornerRadius = 6;
        this.series.slices.template.fillOpacity = 0.5;
        this.series.slices.template.tooltipText = "{value}";

        //rotated labels
        this.series.ticks.template.disabled = true;
        this.series.alignLabels = false;
        this.series.labels.template.text = "{ageRange}";
        this.series.labels.template.radius = am4core.percent(0);
        this.series.labels.template.fill = am4core.color("black");
        this.series.labels.template.relativeRotation = 90;
        //Fonts
        this.series.labels.template.fontSize = 20;
        this.series.labels.template.fontFamily = "Times";
        this.series.labels.template.fontWeight = "bold";

        
        

        // Override some hover state properties
        let hs = this.series.slices.template.states.getKey("hover");
        hs.properties.scale = 1.2;
        hs.properties.fillOpacity = 0.5;
        hs.properties.stroke = this.highlightStrokeColor;
        hs.properties.strokeWidth = 3;


        let aliasActiveState = this.series.slices.template.states.create("aliasActive");
        aliasActiveState.properties.fill = this.activeColor;
        aliasActiveState.properties.fillOpacity = 1;
        aliasActiveState.properties.stroke = am4core.color("red");
        aliasActiveState.properties.strokeWidth = 4;
        aliasActiveState.properties.shiftRadius = 0.4;
        aliasActiveState.properties.strokeOpacity = 1;

        
        let aliasInactiveState = this.series.slices.template.states.create("aliasInactive");
        //aliasInactiveState.properties.fill = this.inactiveColor;
        aliasInactiveState.properties.fillOpacity = 0.5;
        aliasInactiveState.properties.stroke = am4core.color("white");
        aliasInactiveState.properties.strokeWidth = 1;

        // let as1 = this.series.slices.template.states.getKey("active");
        // as1.properties.shiftRadius = 0.4;
        // as1.properties.strokeWidth = 2;
        // as1.properties.strokeOpacity = 1;
        // as1.properties.fillOpacity = 1;

        // Custom states 
            // var disabledState = series.slices.template.states.create("disabled");
            // disabledState.properties.fill = am4core.color("#000");
            // disabledState.properties.fillOpacity = 0.1;
            // disabledState.properties.shiftRadius = 0;
            // disabledState.properties.scale = 1;
            // disabledState.properties.hoverable = false;
            // disabledState.properties.clickable = false;




        // Put a thick border around each Slice
        // this.series.slices.template.stroke = am4core.color("#4a2abb");
        // this.series.slices.template.strokeWidth = 3;
        // this.series.slices.template.strokeOpacity = 1;
        // this.series.slices.template.fillOpacity = 1;
        // this.series.labels.template.disabled = false;
        // this.series.ticks.template.disabled = false;

        //curved labels
        // this.series.alignLabels = false;
        // this.series.labels.template.bent = true;
        // this.series.labels.template.radius = -10;
        // this.series.labels.template.padding(0, 0, 0, 0);
        // this.series.labels.template.fill = am4core.color("#000");

        //_pieChart.legend = new am4charts.Legend();

        ////////// COLORS
        this.series.colors.list = [
            am4core.color("#A3C1AD"),  //Cambridge Blue!
            am4core.color("#002147"),  //Oxford Blue
            am4core.color("#AC8E35"),  //Dark Goldenrod
            am4core.color("#7D544F"),  //Tuscan Red
            am4core.color("#615019"),  //Field Drab
            am4core.color("#555555"),  //Davy's Grey
        ];
        ////////////

        //Label: total of selected slices
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


        //label = new am4core.Label();
        // this.label.parent = this.series;
        // //var total = totalValue();
        // //this.total = 0;
        // this.label.text = this.total.toString();
        // this.label.align = "center";
        // this.label.isMeasured = false;
        // //label.zIndex = 10;
        // //label.text = "0";
        // this.label.horizontalCenter = "middle";
        // this.label.verticalCenter = "middle";
        // //label.x = _pieChart.x;
        // //label.y = _pieChart.y;
        // this.label.fontSize = 15;
        // this.label.fontFamily = "Times";
        // this.label.fontWeight = "bold";

        


    } // end initPieChart

    setEvents(): void {
        ///////////////////////// Pie Chart Slice Events ////////////////
        this.series.slices.template.events.on("hit", function (ev) {
            //holdClassThisContext._hitFlag = true;
            //NB  Active flag has changed on the hit event (before this code is reached)
            let slice = ev.target;
            let data = slice.dataItem.dataContext;
            let hitValue = data.value;
            console.log("hit slice is active", slice.isActive);
            if (!slice.isActive) {
                holdClassThisContext.total = holdClassThisContext.total - hitValue;
                holdClassThisContext.selectedAges.add(ev.target.dataItem.dataContext["ageRange"]);
                //slice.setState("aliasInactive");
            } else {
                holdClassThisContext.total = holdClassThisContext.total + hitValue;
                holdClassThisContext.selectedAges.delete(ev.target.dataItem.dataContext["ageRange"]);
                //slice.setState("aliasActive");
            }
            holdClassThisContext.totalLabel.text = holdClassThisContext.total.toString();
            // holdClassThisContext._lineChartWidget.updateDataRequest();
        }); // end event hit

        // this.series.slices.template.events.on("over", function (ev) {
        //     let slice = ev.target;
        //     slice.setState("highlight");
        //     });

        // this.series.slices.template.events.on("out", function (ev) {
        //     let slice = ev.target;
        //     if (slice.isActive) {
        //         slice.setState("aliasActive");
        //     } else {
        //         slice.setState("aliasInactive");
        //     }
        // };

        ///////////////////////// Pie Chart (slice) Label Events ////////////////
        //Propogate hover and hit events on a pieseries label to the underlying slice
        this.series.labels.template.events.on("over", function (ev) {
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("over");
            //parentSlice.isHover = true;
        });
        this.series.labels.template.events.on("out", function (ev) {
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("out");
            //parentSlice.isHover = false;
        });
        this.series.labels.template.events.on("hit", function (ev) {
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("hit");
        });
    } //end setEvents

} // end class pieChart


// Export
export { pieChartWidget };
