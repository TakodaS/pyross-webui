import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// Local imports
import { lineChartWidget } from "./lineChartWidget";
import { miniPieChart2 } from "./miniPieChart";

//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class pieChartWidget {
    private name: string;
    private _pieChartData: any;

    private _selectedAges: Set<string>;
    private _pieChart: am4charts.PieChart;
    private series: am4charts.PieSeries;
    private slicesTemplate: any;
    private _lineChartWidget: lineChartWidget;
    private totalLabel: am4core.Label = new am4core.Label();
    private total: number = 0;
    //private highlightStrokeColor: any = am4core.color("red");
    private _inactiveColor: any = am4core.color("#009900");
    private _activeColor: any = am4core.color("#ff3333");
    private _miniChart: miniPieChart;
    private countInsertedSlices: number = 0;
    private numberOfSlicesFromData: number;



    constructor(name: string, pieChartData: any, selectedAges: Set<string>) {
        this.name = name;
        this._pieChartData = pieChartData;
        this.numberOfSlicesFromData = this._pieChartData.length;
        this.selectedAges = selectedAges;
        holdClassThisContext = this;
        this.initPieChart();
        this.setEvents();
        //this.checkIfAllSlicesAreSameColor();
    };

    //////////////////////////////Public Interface////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////
    // 
    //
    public get pieChart(): am4charts.PieChart {
        return this._pieChart;
    }
    //
    public get pieChartData(): any {
        return this._pieChartData;
    }
    public set pieChartData(value: any) {
        this._pieChartData = value;
    }
    //
    public get selectedAges(): Set<string> {
        return this._selectedAges;
    }
    public set selectedAges(value: Set<string>) {
        this._selectedAges = value;
    }
    //
    public get inactiveColor(): any {
        return this._inactiveColor;
    }
    public set inactiveColor(value: any) {
        this._inactiveColor = value;
    }
    //
    public get activeColor(): any {
        return this._activeColor;
    }
    public set activeColor(value: any) {
        this._activeColor = value;
    }
    //
    public set lineChartWidget(value: lineChartWidget) {
        this._lineChartWidget = value;
    }
    //
    public set miniChart(value: miniPieChart) {
        this._miniChart = value;
    } l
    //
    //The folowing public methods are triggered from the MINI pie chart class

    //m = 0 is default, num = 1 is hover
    // public setAllSliceHover(num: number) {
    //     if (num === 0) {
    //         //console.log("BIG CHART in setAllSliceHover");
    //         this.series.slices.each(function (slice) {
    //             //the following works to get the ageRange value from each slice
    //             //console.log("BIG CHART slice", slice._dataItem.dataContext.ageRange);
    //             //slice.isHover = false;
    //             slice.setState("default");
    //         });
    //         this.totalLabel.text = "0"
    //     } else {
    //         this.series.slices.each(function (slice) {
    //             //slice.isHover = tru
    //             slice.setState("active");
    //         });
    //         this.totalLabel.text = "16"
    //     }
    // } // end setAllSliceHover

    public setAliasActiveOrInactive(num: any) {

        //This occurs on a hover (or out) of the MINI pie chart
        if (num === 0) {    //set all default
            this.series.slices.each(function (slice) {
                let label = slice._dataItem._label;

                //console.log("BIG CHART    in setAllSliceActiveOrInactive num=0 loop  ..... slice isActive?", slice.isActive);
                slice.setState("aliasInactive");
                label.setState("aliasInactive");

                //console.log("BIG CHART    in setAllSliceActiveOrInactive num=0 loop slice active");
            }
            this.totalLabel.text = "0";  
        } else if (num === 1) {   //set all active
            //console.log("BIG CHART    in setAllSliceActiveOrInactive num =1");
            this.series.slices.each(function (slice) {
                let label = slice._dataItem._label;
                //console.log("BIG CHART    in setAllSliceActiveOrInactive num=1 loop  ..... slice isActive?", slice.isActive);
                slice.setState("aliasActive");
                label.setState("aliasActive");
            })
            this.totalLabel.text = holdClassThisContext.numberOfSlicesFromData.toString();

        } else if (num === 2) {   //keep all the same
            //console.log("BIG CHART    in setAllSliceActiveOrInactive num =1");
            this.series.slices.each(function (slice) {
                let label = slice._dataItem._label;
                if (slice.isActive) {
                    slice.setState("aliasActive");
                    label.setState("aliasActive");
                } else if (!slice.isActive) {
                    slice.setState("aliasInactive");
                    label.setState("aliasInactive");
                } else {
                    console.log("WRONG COLOR");
                }
            })
                        holdClassThisContext.totalLabel.text = holdClassThisContext.total.toString();

        }
    }//end setAliasActiveOrInactive
    //
    //
    // This occurs from a click ("hit") on the MINI Pie Chart : num = 0 is default color, num = 1 is active color
    public BIGchartSetAllSliceActiveOrInactive(num: number) {
        //console.log("BIG CHART    in setAllSliceActiveOrInactive top set", num);
        if (num === 0) {
            this.series.slices.each(function (slice) {
                //console.log("BIG CHART    in setAllSliceActiveOrInactive num=0 loop  ..... slice isActive?", slice.isActive);
                if (slice.isActive) {
                    //console.log("BIG CHART    in setAllSliceActiveOrInactive num=0 loop slice active");
                    slice.dispatchImmediately("hit");

                }
            });

        } else if (num === 1) {
            //console.log("BIG CHART    in setAllSliceActiveOrInactive num =1");
            this.series.slices.each(function (slice) {
                //console.log("BIG CHART    in setAllSliceActiveOrInactive num=1 loop  ..... slice isActive?", slice.isActive);
                if (!slice.isActive) {
                    //console.log("BIG CHART    in setAllSliceActiveOrInactive  num=1 loop slice active");
                    slice.dispatchImmediately("hit");
                    // let label = slice._dataItem._label;
                    // label.setState("aliasInactive");
                }
            });
        }
    } // end setAllSliceActiveOrInactive
    //
    //

    //
    //////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////END Public Interface//////////////////////////////////////////////////////


    ///////////////////// Private Interface...not to be used by consumer

    private initPieChart(): void {

        enum AI { inactive, active, same, };
        this._pieChart = am4core.create(this.name, am4charts.PieChart);
        this._pieChart.data = this._pieChartData;

        //this._pieChart.seriesContainer.zIndex = -1;
        //this._pieChart.width = am4core.percent(20);
        //this._pieChart.height = am4core.percent(100);
        //this._pieChart.align = "center";
        //this._pieChart.valign;
        this._pieChart.radius = am4core.percent(55);
        this._pieChart.innerRadius = am4core.percent(0);
        this._pieChart.x = am4core.percent(5);



        // Add and configure Series
        this.series = this._pieChart.series.push(new am4charts.PieSeries());
        this.series.dataFields.value = "value";
        //this.series.dataFields.radiusValue = "value";
        this.series.dataFields.category = "ageRange";

        // This creates initial animation
        this._pieChart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        //this.series.hiddenState.properties.opacity = 0.5;
        this.series.hiddenState.properties.endAngle = -90;
        this.series.hiddenState.properties.startAngle = -90;


        this.slicesTemplate = this.series.slices.template
        this.slicesTemplate.cornerRadius = 6;
        //this.slicesTemplate.fillOpacity = 0.4;
        this.slicesTemplate.fill = this._inactiveColor;
        this.slicesTemplate.strokeWidth = 1;
        this.slicesTemplate.stroke = am4core.color("white");
        //this.slicesTemplate.tooltipText = "{ageRange}:{value}";
        this.slicesTemplate.tooltipText = "";
        this.slicesTemplate.isActive = false;
        //Disable default hover and activeHover effects
        // this.slicesTemplate.states.getKey("hover").properties.scale = 1;
        // this.slicesTemplate.states.getKey("active").properties.shiftRadius = 0;
        this.slicesTemplate.applyOnClones = true;

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
        this.series.labels.template.fill = this._inactiveColor;



        // Override some state properties on slice and its label
        /////////////////////////FOR SLICES///////////////////////////////
        //For interactive use, hover and default and active and hoverAvtive will be used!!
        //For API use, aliasActive and aliasInactive are fine

        // this.slicesTemplate.states.create('default').properties.opacity = 0.1;
        // this.slicesTemplate.states.getKey('active').properties.opacity = 1;
        // this.slicesTemplate.states.getKey('hover').properties.opacity = 0.5;
        // this.slicesTemplate.states.create('hoverActive').properties.opacity = 0.7;

        //         let defaultState = this.slicesTemplate.states.create("default");
        //         defaultState.properties.fill = this._inactiveColor;
        //         defaultState.properties.shiftRadius = 0;
        //         defaultState.properties.scale = 1;
        //         defaultState.properties.fillOpacity = 1;
        //         // defaultState.properties.stroke = this.highlightStrokeColor;
        //         // defaultState.properties.strokeWidth = 3;

        let activeState = this.slicesTemplate.states.create("active");
        activeState.properties.fill = this._activeColor;
        //         activeState.properties.shiftRadius = 0;
        //         activeState.properties.scale = 1.05;
        //         activeState.properties.fillOpacity = 0.3;
        //         activeState.properties.stroke = this.highlightStrokeColor;
        //         activeState.properties.strokeWidth = 3;
        // // 
        let hoverState = this.slicesTemplate.states.create("hover");
        hoverState.properties.fill = this._activeColor;
        hoverState.properties.shiftRadius = 0.1;
        hoverState.properties.scale = 1.05;
        hoverState.properties.fillOpacity = 1;
        //         hoverState.properties.stroke = this.highlightStrokeColor;
        //         hoverState.properties.strokeWidth = 3;

        let hoverActiveState = this.slicesTemplate.states.create("hoverActive");
        hoverActiveState.properties.fill = this._inactiveColor;

        //         hoverActiveState.properties.shiftRadius = 0;
        //         hoverActiveState.properties.scale = 1.05;
        //         hoverActiveState.properties.fillOpacity = 0.3;
        //         hoverActiveState.properties.stroke = this.highlightStrokeColor;
        //         hoverActiveState.properties.strokeWidth = 3;

        // let hoveActiverState = this.slicesTemplate.states.create("hoverActive");
        // //hoveActiverState.properties.shiftRadius = 0;
        // hoveActiverState.properties.shiftRadius = 0.1;
        // hoveActiverState.properties.scale = 1.05;
        // hoveActiverState.properties.fillOpacity = 0.6;
        // //hoveActiverState.properties.fill = this._inactiveColor;



        // Create highlight state and set alternative fill color (alias for hover)
        // This is a duplicate of hover, but is needed because hover contains additional hidden logic
        //These are all custom states.
        // let highlightState = this.slicesTemplate.states.create("highlight");
        // highlightState.properties.fill = this._activeColor;
        // highlightState.properties.fillOpacity = 0.6;
        // // highlightState.properties.stroke = this.highlightStrokeColor;
        // // highlightState.properties.strokeWidth = 3;

        let aliasActiveState = this.slicesTemplate.states.create("aliasActive");
        aliasActiveState.properties.fill = this._activeColor;
        aliasActiveState.properties.fillOpacity = 1;
        //aliasActiveState.properties.stroke = am4core.color("white");
        //aliasActiveState.properties.strokeWidth = 1;
        aliasActiveState.properties.shiftRadius = 0.1;


        let aliasInactiveState = this.slicesTemplate.states.create("aliasInactive");
        aliasInactiveState.properties.fill = this._inactiveColor;
        aliasInactiveState.properties.fillOpacity = 1;
        aliasInactiveState.properties.stroke = am4core.color("white");
        aliasInactiveState.properties.strokeWidth = 1;
        aliasInactiveState.properties.shiftRadius = 0;


        /////////////////////////FOR LABELS///////////////////////////////
        let dsl = this.series.labels.template.states.create("aliasInactive");
        dsl.properties.fill = this._inactiveColor;

        let asl = this.series.labels.template.states.create("aliasActive");
        asl.properties.fill = this._activeColor;


        // Disable the active/default behaviours of pie chart
        //this.slicesTemplate.togglable = false;

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
        this.slicesTemplate.events.on("hit", function (ev) {
            //holdClassThisContext._hitFlag = true;
            //NB  Active flag has changed on the hit event (before this code is reached)
            let slice = ev.target;
            //console.log("BIG CHART    in slice HIT   active?", slice.isActive);
            let label = slice._dataItem._label;
            let data = slice.dataItem.dataContext;
            let hitValue = data.value;
            if (!slice.isActive) {
                //console.log("BIG CHART slice NOT active");
                holdClassThisContext.total = holdClassThisContext.total - hitValue;
                holdClassThisContext.selectedAges.delete(ev.target.dataItem.dataContext["ageRange"]);
                slice.setState("aliasInactive");
                label.setState("aliasInactive")
            } else if (slice.isActive) {
                //console.log("BIG CHART slice active");
                holdClassThisContext.total = holdClassThisContext.total + hitValue;
                holdClassThisContext.selectedAges.add(ev.target.dataItem.dataContext["ageRange"]);
                slice.setState("aliasActive");
                label.setState("aliasActive")
            } else {
                console.log("BIG CHART slice active  is undefined")
            }
            holdClassThisContext.totalLabel.text = holdClassThisContext.total.toString();
            holdClassThisContext.checkIfAllSlicesAreSameColor();
            holdClassThisContext._lineChartWidget.updateDataRequest();
        }); // end event hit

        this.slicesTemplate.events.on("over", function (ev) {
            //console.log("BIGCHART OVER");
            let slice = ev.target;
            let label = slice._dataItem._label;
            if (slice.isActive) {
                //slice.setState("aliasActive");
                label.setState("aliasInactive");
            } else {
                //slice.setState("aliasInactive");
                label.setState("aliasActive");
            }
        });

        this.slicesTemplate.events.on("out", function (ev) {
            let slice = ev.target;
            let label = slice._dataItem._label;
            if (slice.isActive) {
                slice.setState("aliasActive");
                label.setState("aliasActive");
            } else {
                slice.setState("aliasInactive");
                label.setState("aliasInactive");
            }
        });//end slice out

        // this._pieChart.events.onAll(function (ev) {
        //     console.log("event on BIG piechart", ev);
        // };
        

        //The following is a kludge to make sure that the slices template is populated before iterating over it
        this.series.slices.events.on("inserted", function (ev) {
            holdClassThisContext.countInsertedSlices++;
            //console.log("INSERTED happened ", holdClassThisContext.countInsertedSlices, ev);
            //holdClassThisContext.checkIfAllSlicesAreSameColor();
            if (holdClassThisContext.countInsertedSlices === holdClassThisContext.numberOfSlicesFromData) {
                holdClassThisContext.checkIfAllSlicesAreSameColor();
            }
        });


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


    private checkIfAllSlicesAreSameColor(): void {
        let allActive = true;
        let allInactive = true;

        //console.log("BIG CHART checkIfAllSlicesAreSameColor TOP");

        this.series.slices.each(function (slice) {
            //console.log("BIG CHART checkIfAllSoicesAreSameColor LOOP");

            if (slice.isActive) {
                //console.log("BIG CHART checkIfAllSoicesAreSameColor active slice");
                allInactive = false;
            } else if (!slice.isActive) {
                //console.log("BIG CHART checkIfAllSoicesAreSameColor inactive slice");
                allActive = false;
            } else {   //There is an undefined state!
                console.log("BIG CHART checkIfAllSoicesAreSameColor undefined state");
            }
        })

        if (allInactive) {
            this._miniChart.setMiniChartActiveInactive(0);
        }
        if (allActive) {
            this._miniChart.setMiniChartActiveInactive(1);
        }
    }) //end checkIfAllSlicesAreSameColor




} // end class pieChart


// Export
export { pieChartWidget };
