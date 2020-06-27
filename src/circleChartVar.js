am4core.useTheme(am4themes_animated);
//am4core.useTheme(am4themes_material);

var chart = am4core.create("chartdiv", am4charts.PieChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
chart.seriesContainer.zIndex = -1;

chart.data = [
  {
    ageRange: "71+",
    value: 260,
  },
  {
    ageRange: "56-70",
    value: 230,
  },
  {
    ageRange: "41-55",
    value: 200,
  },
  {
    ageRange: "21-40",
    value: 165,
  },
  {
    ageRange: "12-20",
    value: 139,
  },
  {
    ageRange: "4-11",
    value: 128,
  },
];

var series = chart.series.push(new am4charts.PieSeries());
series.dataFields.value = "value";
series.dataFields.radiusValue = "value";
series.dataFields.category = "ageRange";
series.slices.template.cornerRadius = 6;
series.colors.step = 3;

chart.innerRadius = am4core.percent(0);

series.hiddenState.properties.endAngle = -90;

series.labels.template.text = "{ageRange}";
series.slices.template.tooltipText = "{value}";

let as = series.slices.template.states.getKey("active");
as.properties.shiftRadius = 0.4;
as.properties.strokeWidth = 2;
as.properties.strokeOpacity = 1;
as.properties.fillOpacity = 1;

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

//chart.legend = new am4charts.Legend();

//Label: total of selected slices
var container = new am4core.Container();
container.parent = series;
container.horizontalCenter = "middle";
container.verticalCenter = "middle";
container.width = am4core.percent(1) / Math.sqrt(2);
container.fill = "white";
//container.zIndex = -1;

var label = new am4core.Label();
label.parent = container;
//var total = totalValue();
var total = 0;
label.text = total;

//label.text = "0";
label.horizontalCenter = "middle";
label.verticalCenter = "middle";
label.fontSize = 15;
label.fontFamily = "Times";
label.fontWeight = "bold";

// Add or subtract slices value from total value
series.slices.template.events.on("hit", function (ev) {
  let data = ev.target.dataItem.dataContext;
  let hitValue = data.value;
  if (!ev.target.isActive) {
    total = total - hitValue;
  } else {
    total = total + hitValue;
  }
  label.text = total;
}); // end event hit

//Find total of all slices   {values.value.sum}
// function totalValue() {
//   tVal = 0;
//   let arr = series.dataProvider._data;
//   for (i = 0; i < arr.length; i++) {
//     tVal = tVal + arr[i].value;
//   }
//   return tVal;
// }

///////////////////////////////////
//Propogate hover and hit events on a label to the underlying slice
series.labels.template.events.on("over", function (ev) {
  let parentSlice = ev.target._dataItem._slice;
  parentSlice.isHover = true;
});

series.labels.template.events.on("hit", function (ev) {
  let parentSlice = ev.target._dataItem._slice;
  parentSlice.dispatchImmediately("hit");
});
///////////////////////////////
