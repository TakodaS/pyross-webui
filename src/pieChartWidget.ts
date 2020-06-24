import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";

import { dm } from "./index";
import { utils } from "./index";
import { valueToRelative } from "@amcharts/amcharts4/.internal/core/utils/Utils";

//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class pieChartWidget  {
    private name: string;
    //private selectedCounties: Set<number>;
    private selectedAges: Set<string>;
    private pieChart: am4charts.PieChart;
    private series: am4charts.PieSeries;
    private label: am4core.Label = new am4core.Label();
    private total: number = 0;

    constructor(name: string, selectedAges: Set<string>) {
        this.name = name;
        this.selectedAges = selectedAges;
        holdClassThisContext = this;
        this.initPieChart();
        this.setEvents();
    };

    //////////////////////////////Public Interface////////////////////////////////////////
    // 
    //
    getPieChart(){
        return this.pieChart;
    };

    //
    // Getters
    get selectedCounties(): Set<number> {
        return this.selectedCounties;
    }
    //
    get selectedAges():Set<string> {
        return this.selectedAges;
    };

    // Setters
    set selectedCounties(value: Set<string>) {
        this.selectedCounties = value;
    }
    //
    set selectedAges(value: Set<string>) {
        this.selectedAges = value;
    }
    //
   
    //
    //////////////////////////////////////////////////////////////////////////////////////



    ///////////////////// Private Interface...not to be used by consumer

    initPieChart(): void {
        this.pieChart = am4core.create(this.name, am4charts.PieChart);
        this.pieChart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        this.pieChart.seriesContainer.zIndex = -1;
        this.pieChart.width = am4core.percent(20);
        this.pieChart.height = am4core.percent(100);
        this.pieChart.y = am4core.percent(-30);
        this.series = this.pieChart.series.push(new am4charts.PieSeries());
        this.series.dataFields.value = "value";
        //series.dataFields.radiusValue = "value";
        this.series.dataFields.category = "ageRange";
        this.series.slices.template.cornerRadius = 6;
        this.series.colors.step = 3;
        this.pieChart.innerRadius = am4core.percent(5);

        this.series.hiddenState.properties.endAngle = -90;

        this.series.labels.template.text = "{ageRange}";
        this.series.slices.template.tooltipText = "{value}";

        let as1 = this.series.slices.template.states.getKey("active");
        as1.properties.shiftRadius = 0.4;
        as1.properties.strokeWidth = 2;
        as1.properties.strokeOpacity = 1;
        as1.properties.fillOpacity = 1;

        // Put a thick border around each Slice
        this.series.slices.template.stroke = am4core.color("#4a2abb");
        this.series.slices.template.strokeWidth = 1;
        this.series.slices.template.strokeOpacity = 0.2;
        this.series.slices.template.fillOpacity = 1;
        // series.labels.template.disabled = true;
        // series.ticks.template.disabled = true;

        //curved labels
        this.series.alignLabels = false;
        this.series.labels.template.bent = true;
        this.series.labels.template.radius = -10;
        this.series.labels.template.padding(0, 0, 0, 0);
        this.series.labels.template.fill = am4core.color("#000");
        this.series.ticks.template.disabled = true;

        //rotated labels
        // series.ticks.template.disabled = true;
        // series.alignLabels = false;
        // series.labels.template.text = "{ageRange}";
        // series.labels.template.radius = am4core.percent(-40);
        // series.labels.template.fill = am4core.color("black");
        // series.labels.template.relativeRotation = 90;

        //Fonts
        this.series.labels.template.fontSize = 10;
        this.series.labels.template.fontFamily = "Times";
        this.series.labels.template.fontWeight = "bold";

        //pieChart.legend = new am4charts.Legend();

        //Label: total of selected slices

        //label = new am4core.Label();
        this.label.parent = this.series;
        //var total = totalValue();
        //this.total = 0;
        this.label.text = this.total.toString();
        this.label.align = "center";
        this.label.isMeasured = false;
        //label.zIndex = 10;
        //label.text = "0";
        this.label.horizontalCenter = "middle";
        this.label.verticalCenter = "middle";
        //label.x = pieChart.x;
        //label.y = pieChart.y;
        this.label.fontSize = 15;
        this.label.fontFamily = "Times";
        this.label.fontWeight = "bold";
    } // end initPieChart

    setEvents(): void {
        this.series.slices.template.events.on("hit", function (ev) {
            let data = ev.target.dataItem.dataContext;
            let hitValue = data.value;
            if (!ev.target.isActive) {
                holdClassThisContext.total = holdClassThisContext.total - hitValue;
                holdClassThisContext.selectedAges.add(ev.target.dataItem.dataContext["ageRange"]);
            } else {
                holdClassThisContext.total = holdClassThisContext.total + hitValue;
                holdClassThisContext.selectedAges.delete(ev.target.dataItem.dataContext["ageRange"]);
            }
            holdClassThisContext.label.text = holdClassThisContext.total;
        }); // end event hit

        //Propogate hover and hit events on a pieseries label to the underlying slice
        this.series.labels.template.events.on("hit", function (ev) {
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("hit");
        });
    } //end setEvents

} // end class pieChart


// Export
export { pieChartWidget };
