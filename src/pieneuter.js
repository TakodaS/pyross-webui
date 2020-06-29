/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Themes
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dataviz);

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.PieChart);
chart.innerRadius = am4core.percent(30);

// Add data
chart.data = [ {
  "country": "Lithuania",
  "litres": 501.9
}, {
  "country": "Czech Republic",
  "litres": 301.9
}, {
  "country": "Ireland",
  "litres": 201.1
}, {
  "country": "Germany",
  "litres": 165.8
}, {
  "country": "Australia",
  "litres": 139.9
}, {
  "country": "Austria",
  "litres": 128.3
}, {
  "country": "UK",
  "litres": 99
}, {
  "country": "Belgium",
  "litres": 60
}, {
  "country": "The Netherlands",
  "litres": 50
} ];

// Add and configure Series
var pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "litres";
pieSeries.dataFields.category = "country";
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeWidth = 2;
pieSeries.slices.template.strokeOpacity = 1;

// This creates initial animation
pieSeries.hiddenState.properties.opacity = 1;
pieSeries.hiddenState.properties.endAngle = -90;
pieSeries.hiddenState.properties.startAngle = -90;

var slice = pieSeries.slices.template;
slice.states.getKey("hover").properties.scale = 1;
slice.states.getKey("active").properties.shiftRadius = 0;


 pieSeries.slices.template.events.on("hit", function (ev) {
            //holdClassThisContext._hitFlag = true;
            //NB  Active flag has changed on the hit event (before this code is reached)
            let slice = ev.target;
            let label = slice._dataItem._label;
            let data = slice.dataItem.dataContext;
            let hitValue = data.value;
     if (!slice.isActive) {
         console.log("in hit, slice NOT active");
                // holdClassThisContext.total = holdClassThisContext.total - hitValue;
                // holdClassThisContext.selectedAges.add(ev.target.dataItem.dataContext["ageRange"]);
                // slice.setState("aliasDefault");
                // label.setState("aliasDefault");
     } else {
         console.log("in hit, slice active");
                // holdClassThisContext.total = holdClassThisContext.total + hitValue;
                // holdClassThisContext.selectedAges.delete(ev.target.dataItem.dataContext["ageRange"]);
                // slice.setState("aliasActive");
                // label.setState("aliasActive");
            }
            //holdClassThisContext.totalLabel.text = holdClassThisContext.total.toString();
            // holdClassThisContext._lineChartWidget.updateDataRequest();
        }); // end event hit

        pieSeries.slices.template.events.on("over", function (ev) {
            let slice = ev.target;
            let label = slice._dataItem._label;
            console.log("in slice OVER");
            slice.setState("aliasHover");
            label.setState("aliasHover");
        });

        pieSeries.slices.template.events.on("out", function (ev) {
            let slice = ev.target;
            let label = slice._dataItem._label;
            console.log("in slice out");
            // if (slice.isActive) {
            //     slice.setState("aliasActive");
            //     label.setState("aliasActive");
            // } else {
            //     slice.setState("aliasDefault");
            //     label.setState("aliasDefault");
            // }
        });

        // ///////////////////////// Pie Chart (slice) Label Events ////////////////
        // //Propogate hover and hit events on a pieSeries label to the parent slice
        pieSeries.labels.template.events.on("hit", function (ev) {
            console.log("in label hit");
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("hit");
        });
        pieSeries.labels.template.events.on("over", function (ev) {
            console.log("in label over");
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("over");
        });
pieSeries.labels.template.events.on("out", function (ev) {
            console.log("in label out");
            let parentSlice = ev.target._dataItem._slice;
            parentSlice.dispatchImmediately("out");
        });
        