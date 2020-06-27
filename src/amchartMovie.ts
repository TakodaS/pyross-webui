import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_amchartsdark from "@amcharts/amcharts4/themes/amchartsdark";

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_amchartsdark);

var colorSet = new am4core.ColorSet();

var piechart, slice, cityCircle, lineSeries, lineSeries20, lineSeries21, sfCircle, mapChart, connectingLine, plane, city, polygonSeries, continentSeries, initialPolygon, cityLabel, sfLabel, country, lineChart, valueAxis, pieSeries, mainContainer, headerLabel, footerLabel, nextButton, pictorialChart, pictorialSeries, slider, radarSeries, citySeries, lineChart2, lineChart2DateAxis;

var planePath = "M71,515.3l-33,72.5c-0.9,2.1,0.6,4.4,2.9,4.4l19.7,0c2.8,0,5.4-1,7.5-2.9l54.1-39.9c2.4-2.2,5.4-3.4,8.6-3.4 l103.9,0c1.8,0,3,1.8,2.3,3.5l-64.5,153.7c-0.7,1.6,0.5,3.3,2.2,3.3l40.5,0c2.9,0,5.7-1.3,7.5-3.6L338.4,554c3.9-5,9.9-8,16.2-8c24.2,0,85.5-0.1,109.1-0.2c21.4-0.1,41-6.3,59-17.8c4.2-2.6,7.9-6.1,11.2-9.8c2.6-2.9,3.8-5.7,3.7-8.5c0.1-2.8-1.1-5.5-3.7-8.5c-3.3-3.7-7-7.2-11.2-9.8c-18-11.5-37.6-17.7-59-17.8c-23.6-0.1-84.9-0.2-109.1-0.2c-6.4,0-12.3-2.9-16.2-8L222.6,316.6c-1.8-2.3-4.5-3.6-7.5-3.6l-40.5,0c-1.7,0-2.9,1.7-2.2,3.3L237,470c0.7,1.7-0.5,3.5-2.3,3.5l-103.9,0c-3.2,0-6.2-1.2-8.6-3.4l-54.1-39.9c-2.1-1.9-4.7-2.9-7.5-2.9l-19.7,0c-2.3,0-3.8,2.4-2.9,4.4l33,72.5C72.6,507.7,72.6,511.8,71,515.3z";

var countries = [
    { id: "KR", city: "Seoul", latitude: 37.55, longitude: 126.9833 },
    { id: "JP", city: "Tokyo", latitude: 35.6833, longitude: 139.75 },
    { id: "IT", city: "Rome", latitude: 41.9, longitude: 12.4833 },
    { id: "FR", city: "Paris", latitude: 48.8667, longitude: 2.3333 },
    { id: "DE", city: "Berlin", latitude: 52.5167, longitude: 13.4 },
    { id: "AU", city: "Sydney", latitude: -33.8688, longitude: 151.2093 },
    { id: "GB", city: "London", latitude: 51.5, longitude: -0.0833 }
];

setTimeout(init, 500);

function init() {
    // Main container of everything
    mainContainer = am4core.create("introchart", am4core.Container);
    mainContainer.width = am4core.percent(100);
    mainContainer.height = am4core.percent(100);
    mainContainer.preloader.disabled = true;

    // header label
    headerLabel = mainContainer.createChild(am4core.TextLink);
    headerLabel.fill = am4core.color("#ffffff");

    // when we hit title, we repeat animation
    headerLabel.events.on("hit", function () {
        repeat();
    });

    headerLabel.fontSize = 20;
    headerLabel.horizontalCenter = "middle";
    headerLabel.verticalCenter = "middle";
    headerLabel.x = am4core.percent(50);
    headerLabel.y = 70;
    headerLabel.showOnInit = true;
    headerLabel.zIndex = 1300;
    headerLabel.hiddenState.properties.dy = -150;
    headerLabel.hiddenState.transitionDuration = 700;
    headerLabel.defaultState.transitionDuration = 800;

    var triangle2 = new am4core.Triangle();
    triangle2.width = 8;
    triangle2.height = 10;
    triangle2.fill = am4core.color("#ffffff");
    triangle2.direction = "right";
    triangle2.valign = "middle";
    triangle2.align = "center";
    triangle2.dx = 1;

    nextButton = mainContainer.createChild(am4core.Button);
    nextButton.horizontalCenter = "middle";
    nextButton.verticalCenter = "middle";
    nextButton.padding(0, 0, 0, 0);
    nextButton.background.cornerRadius(25, 25, 25, 25);
    nextButton.y = headerLabel.y;
    nextButton.dy = 1;
    nextButton.height = 40;
    nextButton.width = 40;
    nextButton.horizontalCenter = "middle";
    nextButton.verticalCenter = "middle";
    nextButton.zIndex = 5000;
    nextButton.icon = triangle2;
    nextButton.hide(0);
    nextButton.events.on("hit", repeat);

    footerLabel = mainContainer.createChild(am4core.Label);
    footerLabel.x = am4core.percent(50);
    footerLabel.y = am4core.percent(90);
    footerLabel.fontSize = 16;
    footerLabel.fill = am4core.color("#ffffff");
    footerLabel.verticalCenter = "middle";
    footerLabel.horizontalCenter = "middle";
    footerLabel.fillOpacity = 0.5;
    footerLabel.fontSize = 12;
    footerLabel.hide(0);

    // area chart on initial screen (the one which bends around pie chart)
    lineChart = mainContainer.createChild(am4charts.XYChart);
    lineChart.padding(0, 0, 0, 0);

    var data = [];
    var date = new Date(2000, 0, 1, 0, 0, 0, 0);

    for (var i = 0; i < 7; i++) {
        var newDate = new Date(date.getTime());
        newDate.setDate(i + 1);
        data.push({ date: newDate, value: 32 });
    }

    lineChart.data = data;

    var dateAxis = lineChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.labels.template.disabled = true;
    dateAxis.renderer.inside = true;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.baseGrid.disabled = true;
    dateAxis.renderer.line.disabled = true;

    valueAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.renderer.inside = true;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.line.disabled = true;
    valueAxis.renderer.baseGrid.disabled = true;

    lineSeries = lineChart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.dateX = "date";
    lineSeries.dataFields.valueY = "value";
    lineSeries.sequencedInterpolation = true;
    lineSeries.strokeOpacity = 0;
    lineSeries.tensionX = 0.75;
    lineSeries.fill = am4core.color("#222a3f");
    lineSeries.fillOpacity = 1;
    lineSeries.hidden = true;
    lineSeries.events.on("inited", startEverything);
}

function startEverything() {
    headerLabel.hide(0);
    headerLabel.text =
        "[font-size: 12 opacity: 0.5]amCharts presents the movie: [/]Will it bend?";
    headerLabel.interactionsEnabled = false;
    headerLabel.show();

    lineChart.visible = true;
    lineSeries.defaultState.transitionDuration = 1000;
    lineSeries.hide(0);
    var animation = lineSeries.show();

    animation.events.on("animationended", function () {
        setTimeout(stage0, 500);
    });
}

// where pie chart is created and animated from bottom to top, also where area's chart values are animated to bend around pie.
function stage0() {
    if (!piechart) {
        piechart = mainContainer.createChild(am4charts.PieChart);
        piechart.zindex = 15;
        piechart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        piechart.width = 400;
        piechart.x = am4core.percent(50);
        piechart.horizontalCenter = "middle";
        piechart.hiddenState.properties.opacity = 0;
        piechart.defaultState.transitionDuration = 3500;
        piechart.defaultState.transitionEasing = am4core.ease.elasticOut;

        piechart.data = [
            { answer: "[bold]No[/b]", value: 400, fontColor: am4core.color("#222a3f") },
            { answer: "It's impossible!", value: 200, radius: 10 },
            { answer: "What does bend mean?", value: 40, disabled: true },
            { answer: "Yes, I use amCharts 4", value: 30, disabled: true }
        ];

        pieSeries = piechart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "answer";
        piechart.innerRadius = 75;
        piechart.radius = 150;
        // this makes initial animation
        pieSeries.hiddenState.properties.opacity = 0;
        pieSeries.slices.template.cornerRadius = 7;
        pieSeries.defaultState.transitionDuration = 2000;
        pieSeries.hiddenState.transitionEasing = am4core.ease.sinOut;
        pieSeries.labels.template.fillOpacity = 0.8;
        pieSeries.labels.template.text = "{category}";
        pieSeries.alignLabels = false;
        pieSeries.labels.template.radius = -53;
        pieSeries.labels.template.propertyFields.disabled = "disabled";
        pieSeries.labels.template.propertyFields.fill = "fontColor";
        pieSeries.labels.template.propertyFields.radius = "radius";
        pieSeries.ticks.template.disabled = true;
        //this makes initial animation from bottom
        pieSeries.hiddenState.properties.dy = 400;
        pieSeries.defaultState.transitionEasing = am4core.ease.elasticOut;
        pieSeries.defaultState.transitionDuration = 3500;
    }

    headerLabel.y = 70;
    piechart.hide(0);
    piechart.show();
    pieSeries.hide(0);
    var animation = pieSeries.show();
    animation.events.on("animationended", createMap);
    // change duration and easing
    lineSeries.interpolationDuration = 3000;
    lineSeries.interpolationEasing = am4core.ease.elasticOut;
    lineSeries.dataItems.getIndex(3).setValue("valueY", 80, 3500);
}

function stage1() {
    var series = piechart.series.getIndex(0);
    var firstDataItem = series.dataItems.getIndex(0);
    headerLabel.hide();

    setTimeout(function () {
        var animation;
        series.dataItems.each(function (dataItem) {
            if (dataItem.index != 1) {
                animation = dataItem.hide();
            }
            dataItem.label.hide();
        });
        animation.events.on("animationended", function () {
            var animation = series.dataItems
                .getIndex(1)
                .slice.animate({ property: "innerRadius", to: 0 }, 300);
            animation.events.on("animationended", function () {
                setTimeout(showMap, 50);
            });
        });
    }, 1000);
}

function createMap() {
    country = countries[Math.floor(Math.random() * countries.length)];

    var destinations = [
        {
            id: "US",
            city: "Silicon Valley, California",
            latitude: 37.7749,
            longitude: -122.4194
        }
    ];

    // countries very opposite SF will fly to other destinations
    if (country.longitude > 30 && country.longitude < 60) {
        destinations = [
            { id: "AU", city: "Sydney", latitude: -33.8688, longitude: 151.2093 },
            { id: "HK", city: "Hong Kong", latitude: 22.3964, longitude: 114.1095 },
            { id: "KR", city: "Seoul", latitude: 37.55, longitude: 126.983333 }
        ];
    }

    if (country.longitude >= 60 && country.longitude < 90) {
        destinations = [
            { id: "GB", city: "London", latitude: 51.5074, longitude: 0.1278 }
        ];
    }

    // close to SF countries will fly to london
    if (country.longitude < -50 && country.latitude > 0) {
        destinations = [
            { id: "GB", city: "London", latitude: 51.5074, longitude: 0.1278 }
        ];
    }

    var destination = destinations[Math.floor(Math.random() * destinations.length)];
    mapChart = mainContainer.createChild(am4maps.MapChart);
    mapChart.seriesContainer.draggable = false;
    mapChart.seriesContainer.resizable = false;
    mapChart.resizable = false;
    //mapChart.geodata = am4geodata_continentsHigh;
    mapChart.geodataSource.url = "//www.amcharts.com/lib/4/geodata/json/continentsHigh.json";
    mapChart.projection = new am4maps.projections.Mercator();
    mapChart.x = am4core.percent(50);
    mapChart.y = mainContainer.pixelHeight / 2;
    mapChart.horizontalCenter = "middle";
    mapChart.verticalCenter = "middle";
    mapChart.showOnInit = false;
    mapChart.hiddenState.properties.opacity = 1;
    mapChart.deltaLongitude = -11;
    mapChart.zIndex = 10;
    mapChart.mouseWheelBehavior = "none";

    // make it pacific centered
    if (country.longitude > 90) {
        mapChart.deltaLongitude = -160;
    }
    continentSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
    continentSeries.useGeodata = true;
    continentSeries.exclude = ["antarctica"];
    continentSeries.mapPolygons.template.fill = am4core.color("#222a3f");
    continentSeries.mapPolygons.template.stroke = am4core.color("#313950");
    continentSeries.mapPolygons.template.hiddenState.properties.visible = true;
    continentSeries.mapPolygons.template.hiddenState.properties.opacity = 1;
    continentSeries.hidden = true;

    polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    //polygonSeries.geodata = am4geodata_worldHigh;
    polygonSeries.geodataSource.url = "//www.amcharts.com/wp-content/uploads/assets/maps/worldCustomHigh.json";
    polygonSeries.include = ["US", country.id];
    polygonSeries.mapPolygons.template.fill = am4core.color("#222a3f");
    polygonSeries.mapPolygons.template.stroke = am4core.color("#313950");
    polygonSeries.mapPolygons.template.hiddenState.properties.visible = true;
    polygonSeries.mapPolygons.template.hiddenState.properties.opacity = 1;
    polygonSeries.showOnInit = true;
    polygonSeries.hiddenState.properties.opacity = 1;
    polygonSeries.hidden = true;

    var mapImageSeries = mapChart.series.push(new am4maps.MapImageSeries());
    city = mapImageSeries.mapImages.create();
    city.latitude = country.latitude;
    city.longitude = country.longitude;
    city.nonScaling = true;

    cityLabel = city.createChild(am4core.Label);
    cityLabel.text = country.city;
    cityLabel.verticalCenter = "middle";
    cityLabel.dx = 15;
    cityLabel.dy = -1;
    cityLabel.fontSize = 16;
    cityLabel.hiddenState.properties.dy = 100;
    cityLabel.hide(0);

    cityCircle = city.createChild(am4core.Circle);
    cityCircle.fill = colorSet.getIndex(0);
    cityCircle.stroke = cityCircle.fill;
    cityCircle.radius = 7;
    cityCircle.hiddenState.properties.radius = 0;
    cityCircle.defaultState.transitionEasing = am4core.ease.elasticOut;
    cityCircle.defaultState.transitionDuration = 2000;
    cityCircle.hide(0);

    var sfCity = mapImageSeries.mapImages.create();
    sfCity.latitude = destination.latitude;
    sfCity.longitude = destination.longitude;
    sfCity.nonScaling = true;

    sfLabel = sfCity.createChild(am4core.Label);
    sfLabel.text = destination.city;
    sfLabel.verticalCenter = "middle";
    sfLabel.dx = 22;
    sfLabel.dy = -1;
    sfLabel.hiddenState.properties.dy = 100;
    sfLabel.hide(0);
    sfLabel.fontSize = 18;

    sfCircle = sfCity.createChild(am4core.Circle);
    sfCircle = cityCircle.clone();
    sfCircle.parent = sfCity;
    sfCircle.radius = 12;
    sfCircle.hide(0);

    var mapLineSeries = mapChart.series.push(new am4maps.MapLineSeries());
    connectingLine = mapLineSeries.mapLines.create();
    connectingLine.imagesToConnect = [city, sfCity];
    connectingLine.line.strokeDasharray = "0.5,0.5";
    connectingLine.line.strokeOpacity = 0.4;
    connectingLine.hide(0);

    plane = connectingLine.arrow;
    var planeImage = plane.createChild(am4core.Sprite);
    planeImage.path = planePath;
    planeImage.horizontalCenter = "middle";
    planeImage.verticalCenter = "middle";
    plane.fill = colorSet.getIndex(0);
    plane.position = 0;
    plane.hide(0);

    plane.adapter.add("scale", function (scale, target) {
        return (0.08 - 0.1 * Math.abs(0.5 - target.position)) / mapChart.zoomLevel;
    });

    mapChart.events.on("inited", function () {
        setTimeout(stage1, 100);
    });
}

function showMap() {
    var polygon = polygonSeries.getPolygonById(country.id);
    if (!polygon) {
        polygonSeries.geodataSource.events.on("ended", function () {
            setTimeout(function () {
                preStage2(country);
            }, 100);
        });
    } else {
        preStage2(country);
    }
}

function preStage2(country) {
    initialPolygon = polygonSeries.getPolygonById(country.id);

    slice = piechart.series.getIndex(0).dataItems.getIndex(1).slice;

    var w = initialPolygon.polygon.bbox.width * mapChart.scaleRatio;
    var h = initialPolygon.polygon.bbox.height * mapChart.scaleRatio;

    initialPolygon.fill = slice.fill;

    mapChart.zoomToGeoPoint(
        { latitude: initialPolygon.latitude, longitude: initialPolygon.longitude },
        slice.radius * 2 / Math.max(w, h),
        true,
        0
    );

    continentSeries.visible = false;
    continentSeries.opacity = 0;

    polygonSeries.dataItems.each(function (dataItem) {
        dataItem.mapPolygon.visible = false;
        dataItem.mapPolygon.fillOpacity = 0;
    });

    setTimeout(stage2, 100);
}

function stage2() {
    polygonSeries.show(0);

    var polygonPoint = {
        x: initialPolygon.polygon.bbox.x + initialPolygon.polygon.bbox.width / 2,
        y: initialPolygon.polygon.bbox.y + initialPolygon.polygon.bbox.height / 2
    };
    var seriesPoint = am4core.utils.spritePointToSprite(
        polygonPoint,
        initialPolygon.polygon,
        polygonSeries
    );

    var geoPoint = mapChart.seriesPointToGeo(seriesPoint);
    mapChart.zoomToGeoPoint(geoPoint, mapChart.zoomLevel, true, 0);

    initialPolygon.polygon.morpher.morphToCircle(
        slice.radius / mapChart.zoomLevel / mapChart.scaleRatio,
        0
    );
    initialPolygon.visible = true;
    initialPolygon.fillOpacity = 1;
    initialPolygon.opacity = 1;
    initialPolygon.strokeOpacity = 0;
    initialPolygon.toFront();
    initialPolygon.tooltipText = "{title}";
    polygonSeries.opacity = 1;

    setTimeout(function () {
        piechart.visible = false;

        var animation = initialPolygon.polygon.morpher.morphBack(1500);
        animation.events.on("animationended", function () {
            pieSeries.dataItems.each(function (dataItem) {
                dataItem.show(0);
            });

            lineSeries.interpolationEasing = am4core.ease.cubicOut;
            lineSeries.hiddenState.transitionDuration = 700;

            var hideAnimation = lineSeries.hide();

            hideAnimation.events.on("animationended", function () {
                lineSeries.dataItems.getIndex(3).setValue("valueY", 31, 0);
                lineSeries.dataItems.getIndex(3).setWorkingValue("valueY", 0, 0);
                lineChart.visible = false;

                continentSeries.show();
                var destinationPolygon = polygonSeries.getPolygonById("US");
                destinationPolygon.defaultState.visible = true;
                destinationPolygon.defaultState.properties.opacity = 1;
                destinationPolygon.hide(0);
                destinationPolygon.show();
                setTimeout(stage3, 1000);
            });
        });
    }, 100);
}

function stage3() {
    cityCircle.hide(0);
    var animation = cityCircle.show(1500);

    cityLabel.hide(0);
    cityLabel.show(1000);

    animation.events.on("animationended", function () {
        var zoomAnim = mapChart.zoomToMapObject(city, 4, true, 500);
        zoomAnim.events.on("animationended", function () {
            stage5();
        });
    });
}

function stage5() {
    sfCircle.show();

    connectingLine.show();
    connectingLine.arrow.show();

    footerLabel.text = "[[Indiana Jones theme music playing]]";
    footerLabel.zIndex = 100;
    footerLabel.show();

    var showed = false;

    var animation = connectingLine.arrow.animate(
        { property: "position", from: 0, to: 1 },
        5000,
        am4core.ease.polyInOut3
    );
    animation.events.on("animationprogress", function (event) {
        var point = connectingLine.positionToPoint(event.progress);
        var geoPoint = mapChart.seriesPointToGeo(point);

        mapChart.zoomToGeoPoint(geoPoint, mapChart.zoomLevel, true, 0);
        mapChart.seriesContainer.validatePosition();

        if (event.progress > 0.9 && !showed) {
            cityLabel.hide(0);
            showed = true;
            sfLabel.hide(0);
            sfLabel.show(1000);
        }
    });

    animation.events.on("animationended", function (event) {
        setTimeout(stage6, 500);
    });
}

function stage6() {
    footerLabel.hide();
    connectingLine.hide();
    plane.parent = mapChart.seriesContainer;
    var currentScale = plane.scale;
    plane.adapter.remove("scale");
    plane.mapLine = undefined; // detaches from line to allow animations

    headerLabel.y = 70;

    sfLabel.hide();
    plane.animate(
        [
            { property: "rotation", to: 360 },
            { property: "scale", from: currentScale, to: 0.22 }
        ],
        1000,
        am4core.ease.quadOut
    );
    var animation = sfCircle.animate(
        [{ property: "radius", to: 1000 }, { property: "opacity", to: 0 }],
        1000
    );
    animation.events.on("animationended", stage7);
}



function stage7() {
    var point = am4core.utils.spritePointToSvg(
        { x: plane.pixelX, y: plane.pixelY },
        plane.parent
    );

    if (!pictorialChart) {
        pictorialChart = mainContainer.createChild(am4charts.SlicedChart);
        pictorialChart.zIndex = 30;
        pictorialChart.x = point.x;
        pictorialChart.y = point.y;
        pictorialChart.hidden = true;
        pictorialChart.fontSize = 14;

        pictorialChart.horizontalCenter = "middle";
        pictorialChart.verticalCenter = "middle";

        pictorialChart.data = [
            {
                name: "[bold]No[/]",
                fontColor: am4core.color("#222a3f"),
                value: 120
            },
            {
                name: "Hm... I don't think so.",
                value: 300
            },
            {
                name: "Yes, we are using amCharts",
                value: 100,
                disabled: true
            }
        ];

        pictorialSeries = pictorialChart.series.push(
            new am4charts.PictorialStackedSeries()
        );
        pictorialSeries.dataFields.value = "value";
        pictorialSeries.dataFields.category = "name";
        pictorialSeries.alignLabels = false;
        pictorialSeries.orientation = "horizontal";
        pictorialSeries.defaultState.transitionDuration = 1500;
        pictorialSeries.defaultState.transitionEasing = am4core.ease.sinOut;
        pictorialSeries.labels.template.rotation = 0;
        pictorialSeries.labels.template.text = "{category}";
        //pictorialSeries.sequencedInterpolation = false;
        pictorialSeries.labels.template.propertyFields.fill = "fontColor";
        pictorialSeries.labels.template.propertyFields.disabled = "disabled";
        pictorialSeries.slices.template.tooltipText = "{category}";
        pictorialSeries.ticks.template.locationX = 0.5;
        pictorialSeries.hidden = true;

        pictorialSeries.ticks.template.locationY = 0.5;
        pictorialSeries.maskSprite.path = planePath;
    }

    headerLabel.text = "Hey, can you bend it?";
    headerLabel.show();

    pictorialChart.seriesContainer.dx = 0;
    pictorialChart.paddingTop = 126;
    pictorialChart.paddingBottom = 126;

    setTimeout(function () {
        pictorialChart.show();
        pictorialSeries.hide(0);
        var animation = pictorialSeries.show();
        animation.events.on("animationended", function () {
            mapChart.hiddenState.properties.opacity = 0;
            plane.hide(0);
            headerLabel.hide();
            setTimeout(stage8, 1000);
        });
    }, 1600);
}

function stage8() {
    if (!lineChart2) {
        lineChart2 = mainContainer.createChild(am4charts.XYChart);
        lineChart2.padding(0, 0, 0, 0);
        lineChart2.zIndex = 20;

        var data2 = [];
        var date2 = new Date(2000, 0, 1, 0, 0, 0, 0);
        var count2 = 40;

        for (var i = 0; i < count2; i++) {
            var newDate = new Date(date2.getTime());
            newDate.setDate(i + 1);

            var cityValue = Math.abs(
                Math.round((Math.random() * 100 - i + 10) / 10) * 10
            );

            var value = 100;
            data2.push({
                date: newDate,
                value0: value,
                value1: -value,
                cityValue: cityValue
            });
        }

        lineChart2.data = data2;
        lineChart2.zoomOutButton.disabled = true;
        lineChart2.hidden = true;
        lineChart2.seriesContainer.zIndex = -1;

        lineChart2DateAxis = lineChart2.xAxes.push(new am4charts.DateAxis());
        lineChart2DateAxis.renderer.grid.template.location = 0;

        lineChart2DateAxis.renderer.labels.template.disabled = true;
        lineChart2DateAxis.rangeChangeEasing = am4core.ease.sinIn;
        lineChart2DateAxis.renderer.inside = true;
        lineChart2DateAxis.startLocation = 0.5;
        lineChart2DateAxis.endLocation = 0.5;
        lineChart2DateAxis.renderer.baseGrid.disabled = true;
        lineChart2DateAxis.renderer.line.disabled = true;
        lineChart2DateAxis.renderer.grid.template.strokeOpacity = 0.07;

        valueAxis = lineChart2.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.inside = true;
        valueAxis.min = -100;
        valueAxis.max = 100;
        valueAxis.strictMinMax = true;
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.line.disabled = true;
        valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.renderer.grid.template.strokeOpacity = 0.07;

        var cityValueAxis = lineChart2.yAxes.push(new am4charts.ValueAxis());
        cityValueAxis.tooltip.disabled = true;
        cityValueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.inside = true;
        cityValueAxis.max = 100;
        cityValueAxis.strictMinMax = true;
        cityValueAxis.renderer.line.disabled = true;
        cityValueAxis.renderer.baseGrid.disabled = true;
        cityValueAxis.renderer.grid.template.disabled = true;

        citySeries = lineChart2.series.push(new am4charts.ColumnSeries());
        citySeries.dataFields.dateX = "date";
        citySeries.dataFields.valueY = "cityValue";
        citySeries.columns.template.strokeOpacity = 0;
        citySeries.fill = am4core.color("#222a3f");
        citySeries.hidden = true;
        citySeries.yAxis = cityValueAxis;
        citySeries.columns.template.width = am4core.percent(100);
        citySeries.hidden = true;

        lineSeries20 = lineChart2.series.push(new am4charts.LineSeries());
        lineSeries20.dataFields.dateX = "date";
        lineSeries20.dataFields.valueY = "value0";
        lineSeries20.sequencedInterpolation = true;
        lineSeries20.defaultState.transitionDuration = 1300;
        lineSeries20.strokeOpacity = 0;
        lineSeries20.stroke = am4core.color("#313950");
        lineSeries20.tensionX = 0.75;
        lineSeries20.hidden = true;
        lineSeries20.hiddenState.properties.opacity = 0;

        lineSeries20.fill = am4core.color("#222a3f");
        lineSeries20.fillOpacity = 1;
        lineSeries21 = lineChart2.series.push(lineSeries20.clone());
        lineSeries21.dataFields.valueY = "value1";

        lineChart2DateAxis.rangeChangeDuration = 0;

        lineChart2.events.on("datavalidated", function () {
            lineChart2DateAxis.zoom({ start: 0, end: 0.5 }, true, true);
        });
    } else {
        lineChart2DateAxis.zoom({ start: 0, end: 0.5 }, true, true);
    }

    var anim = mapChart.seriesContainer.animate(
        [
            { property: "x", to: mapChart.seriesContainer.pixelX - 500 },
            { property: "opacity", to: 0 }
        ],
        2500,
        am4core.ease.polyIn3
    );
    anim.events.on("animationended", function () {
        mapChart.dispose();

        var animation = pictorialChart.seriesContainer.animate(
            { property: "dx", to: 2000, from: 0 },
            1500,
            am4core.ease.quadIn
        );

        lineChart2.show();
        lineSeries20.hide(0);
        lineSeries20.show();

        lineSeries21.hide(0);
        lineSeries21.show();
        animation.events.on("animationended", function () {
            setTimeout(stage9, 200);
        });
    });
}

var radarChart;

function stage9() {
    lineSeries20.animate({ property: "opacity", to: 0 }, 3000);
    lineSeries21.animate({ property: "opacity", to: 0 }, 3000);

    headerLabel.hide();

    lineChart2.background.fillOpacity = 0.2;
    var gradient = new am4core.LinearGradient();
    gradient.addColor(am4core.color("#222a3f"));
    gradient.addColor(colorSet.getIndex(1));
    gradient.rotation = -90;
    lineChart2.background.fill = gradient;

    lineChart2DateAxis.rangeChangeDuration = 15000;
    lineChart2DateAxis.rangeChangeEasing = am4core.ease.sinInOut;

    lineChart2DateAxis.zoom({ start: 0.5, end: 1 });

    stage10();
}

function stage10() {
    pictorialChart.paddingTop = 220;
    pictorialChart.paddingBottom = 220;
    citySeries.show(1200);

    pictorialSeries.dataItems.each(function (dataItem) {
        dataItem.label.hide(0);
    });

    footerLabel.text = "[[amCharts office, Vilnius, Lithuania]]";
    footerLabel.show();

    var animation = pictorialChart.seriesContainer.animate(
        { property: "dx", from: -2000, to: -100 },
        1000,
        am4core.ease.polyOut3
    );

    animation.events.on("animationended", function () {
        var animation = pictorialChart.seriesContainer.animate(
            { property: "dx", from: -100, to: 200 },
            10000,
            am4core.ease.sinInOut
        );
        setTimeout(stage11, 4000);
    });
}

function stage11() {
    pictorialChart.seriesContainer.animate(
        { property: "dx", to: 2000 },
        1000,
        am4core.ease.polyIn3
    );
    citySeries.sequencedInterpolation = true;
    citySeries.hide(1000);
    footerLabel.hide();
    var animation = pictorialChart.hide(2500);
    animation.events.on("animationended", function () {
        stage13();
    });

    lineChart2.hide(3000);
}

function stage13() {
    if (!radarChart) {
        radarChart = mainContainer.createChild(am4charts.RadarChart);

        radarChart.data = [
            { category: "So", value1: 10 },
            { category: "can", value1: 20 },
            { category: "your", value1: 30 },
            { category: "charts", value1: 40 },
            { category: "do", value1: 50 },
            { category: "this?", value1: 60 }
        ];

        radarChart.padding(10, 10, 10, 10);
        radarChart.zIndex = 40;
        radarChart.x = piechart.x;
        radarChart.width = 400;
        radarChart.horizontalCenter = "middle";
        radarChart.radius = am4core.percent(100);
        radarChart.zoomOutButton.disabled = true;
        radarChart.innerRadius = am4core.percent(40);
        radarChart.startAngle = 269.8;
        radarChart.endAngle = 270.2;

        var categoryAxis = radarChart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.labels.template.disabled = true;

        var valueAxis = radarChart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minGridDistance = 10;
        valueAxis.renderer.grid.template.strokeOpacity = 0.05;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.renderer.axisAngle = radarChart.startAngle;
        valueAxis.min = 0;
        valueAxis.max = 70;
        valueAxis.strictMinMax = true;

        radarSeries = radarChart.series.push(new am4charts.RadarColumnSeries());
        radarSeries.columns.template.width = am4core.percent(80);
        radarSeries.name = "Series 1";
        radarSeries.dataFields.categoryX = "category";
        radarSeries.columns.template.tooltipText = "{categoryX}";
        radarSeries.dataFields.valueY = "value1";
        radarSeries.columns.template.radarColumn.cornerRadius = 4;
        radarSeries.columns.template.radarColumn.innerCornerRadius = 0;
        radarSeries.columns.template.strokeOpacity = 0;
        radarSeries.defaultState.transitionDuration = 500;
        radarSeries.sequencedInterpolation = true;
        radarSeries.columns.template.adapter.add("fill", function (fill, target) {
            if (target.dataItem) {
                return colorSet.getIndex(5 - target.dataItem.index);
            }
        });

        slider = new am4core.Slider();
        slider.parent = radarChart.chartContainer;
        slider.visible = false;
        slider.isMeasured = false;
        slider.background.fillOpacity = 0.15;
        slider.y = 550;
        slider.marginLeft = 150;
        slider.marginRight = 150;
        slider.start = 0;
        slider.events.on("rangechanged", function () {
            var start = slider.start;
            radarChart.startAngle = 270 - start * 179.8 - 0.2;
            radarChart.endAngle = 270 + start * 179.8 + 0.2;
            valueAxis.renderer.axisAngle = radarChart.startAngle;
        });

        radarChart.events.on("ready", function () {
            stage135();
        });
    } else {
        slider.start = 1;
        radarChart.startAngle = 269;
        radarChart.endAngle = 271;
        radarChart.show();
        radarSeries.hide(0);
        radarSeries.show();
        radarChart.y = 0;
        stage135();
    }
}

function stage135() {
    headerLabel.y = 55;
    headerLabel.text = "Hey, amCharts, can you bend it?";
    var titleAnimation = headerLabel.show();
    titleAnimation.events.on("animationended", function () {
        setTimeout(function () {
            var animation = headerLabel.hide();
            animation.events.on("animationended", function () {
                setTimeout(stage14, 100);
            });
        }, 1500);
    });
}

function stage14() {
    headerLabel.visible = false;
    headerLabel.text = "[font-size: 12 opacity: 0.5]amCharts:[/] Hold my beer.";
    var animation = headerLabel.show();

    animation.events.on("animationended", function () {
        setTimeout(stage15, 1500);
    });
}

function stage15() {
    var animation = radarChart.animate(
        [{ property: "startAngle", to: 90 }, { property: "endAngle", to: 450 }],
        3500,
        am4core.ease.cubicIn
    );
    animation.events.on("animationprogress", function () {
        valueAxis.renderer.axisAngle = radarChart.startAngle;
    });
    animation.events.on("animationended", function () {
        stage16();
    });
}

function stage16() {
    slider.show();
    slider.start = 1;
    footerLabel.text = "Go ahead - try it yourself:";
    footerLabel.show();

    var animation = headerLabel.hide();

    animation.events.on("animationended", function () {
        headerLabel.text = "Watch it again";
        headerLabel.validate();
        headerLabel.show();

        nextButton.x = headerLabel.pixelX - headerLabel.bbox.width / 2 - 30;
        nextButton.y = headerLabel.pixelY;
        nextButton.show();
        headerLabel.interactionsEnabled = true;
    });
}

function repeat() {
    headerLabel.hide();
    footerLabel.hide();
    nextButton.hide();
    if (slider) {
        slider.hide();
    }
    if (radarChart) {
        radarSeries.hide();
        var animation = radarChart.hide();
        animation.events.on("animationended", function () {
            radarChart.visible = true;
            startEverything();
            radarChart.y = 800;
        });
    } else {
        startEverything();
    }
}