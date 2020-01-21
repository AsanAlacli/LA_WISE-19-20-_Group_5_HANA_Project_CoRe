
function csvToObject(csv) {

  var lines = csv.split("\n");

  var result = [];

  var headers = lines[0].split(";");

  for (var i = 1; i < lines.length; i++) {

    var obj = {};
    var currentline = lines[i].split(";");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);

  }

  //return result; //JavaScript object
  return result; //JSON
}
$(function () {

  //read data from element of csv
  function analyzeData(datacsv){
  var rawDatas = datacsv;//csvToObject(datacsv);

  //prepare data

  var data = [];
  for (var i = 0; i < rawDatas.length; i++) {
    var rawData = rawDatas[i];
    var item = data.find(elm => elm.coursename == rawData.coursename)
    if (item == undefined) {
      item = { coursename: rawData.coursename, sumdifficulty: 0, sumgrade: 0, occr: 0 };
      data.push(item);
    }
    item.sumdifficulty += Number.parseFloat(rawData.difficulty);
    item.sumgrade += Number.parseFloat(rawData.grade);
    item.occr++;
  }
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    item.avgdifficulty = item.sumdifficulty / item.occr;
    item.avggrade = item.sumgrade / item.occr;
    item.number = item.avggrade
  }
  return data;
}
  //chart prepare
  var margin = { top: 80, right: 80, bottom: 80, left: 80 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y0 = d3.scale.linear().domain([0, 10]).range([height, 0]),
    y1 = d3.scale.linear().domain([0, 10]).range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  // create left yAxis
  var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left");
  // create right yAxighs
  var yAxisRight = d3.svg.axis().scale(y1).ticks(6).orient("right");



  var svg = d3.select(".container.main-content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 100)
    .append("g")
    .attr("class", "graph")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data.csv", function (error, datacsv) {
var data=analyzeData(datacsv);
    x.domain(data.map(function (d) { return d.coursename; }));
    y0.domain([0, d3.max(data, function (d) { return d.avgdifficulty; })]);
    //y1.domain([0, d3.max(data, function(d) { return d.avggrade; })]);
    var yScale = d3.scale.linear()
      .range([0, height])
      .domain([60, 0]);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height * (1)) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "y axis axisLeft")
      .attr("transform", "translate(0,0) ")
      .call(yAxisLeft)
      .append("text")
      .attr("y", 6)
      .attr("dy", "-2em")
      .style("text-anchor", "end")
      .style("text-anchor", "end")
      .text("Difficulty");

    svg.append("g")
      .attr("class", "y axis axisRight")
      .attr("transform", "translate(" + (width) + ",0)")
      .call(yAxisRight)
      .append("text")
      .attr("y", 6)
      .attr("dy", "-2em")
      .attr("dx", "2em")
      .style("text-anchor", "end")
      .text("Grade");

    bars = svg.selectAll(".bar").data(data).enter();

    bars.append("rect")
      .attr("class", "bar1")
      .attr("x", function (d) { return x(d.coursename); })
      .attr("width", x.rangeBand() / 2)
      .attr("y", function (d) { return y0(d.avgdifficulty); })
      .attr("height", function (d, i, j) { return height - y0(d.avgdifficulty); });

    bars.append("rect")
      .attr("class", "bar2")
      .attr("x", function (d) { return x(d.coursename) + x.rangeBand() / 2; })
      .attr("width", x.rangeBand() / 2)
      .attr("y", function (d) {
        return y1(d.number);
      })
      .attr("height", function (d, i, j) {
        return height - y1(d.number);
      });

  });

});
function type(d) {
d.difficulty = +d.difficulty;
return d;
 }