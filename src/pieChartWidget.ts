import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";

import { dm } from "./index";
import { utils } from "./index";


class pieChartWidget  {
    private name: string;
    private selectedCounties: Set<number>;
    private pieChart: am4charts.pieChart;
    private selectedAges: Set;
    private label: am4core.Label = new am4core.Label();
    private total: number = 0;

    constructor(name: string, selectedCounties: Set<number>) {
        this.name = name;
        this.selectedCounties = selectedCounties;
        this.getThisContext();
        this.initPieChart();
        this.setEvents();
    }

    //////////////////////////////Public Interface////////////////////////////////////////
    // 
    //
    getPieChart(){
        return this.pieChart;
    }
    get bar(): boolean {
        return this._bar;
    }
    set bar(value: boolean) {
        this._bar = value;
    }

    //
    // Getters
    get selectedCounties(): Set<number> {
        return this.selectedCounties;
    }
    //
    get selectedAges():Set<string> {
        return this.selectedAges;
    }

}
    // Setters
    set this.selectedCounties(value: Set<string>): Set {
        this.sele
    }
    //
    set selectedAges(): Set {
        return selectedAges;
    }
    //
   
    //
    //////////////////////////////////////////////////////////////////////////////////////



    ///////////////////// Private Interface...not to be used by consumer

    initPieChart(): void {
        this.pieChart = am4core.create(this.name, am4charts.PieChart);
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

        //label = new am4core.Label();
        label.parent = series;
        //var total = totalValue();
        //this.total = 0;
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
    } // end initPieChart

    setEvents(): void {
        series.slices.template.events.on("hit", function (ev) {
            let data = ev.target.dataItem.dataContext;
            let hitValue = data.value;
            if (!ev.target.isActive) {
                this.total = this.total - hitValue;
                this.selectedAges.add(ev.target.dataItem.dataContext["ageRange"]);
            } else {
                this.total = this.total + hitValue;
                this.selectedAges.delete(ev.target.dataItem.dataContext["ageRange"]);
            }
            label.text = total;
        }); // end event hit

        //Propogate hover and hit events on a pieseries label to the underlying slice
        series.labels.template.events.on("hit", function (ev) {
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("hit");
        });
    } //end setEvents

} // end class pieChart


// Export
export { pieChart };
