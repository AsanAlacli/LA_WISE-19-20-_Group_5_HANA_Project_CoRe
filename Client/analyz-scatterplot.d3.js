
function analyzeData(datacsv, filterFieldStudy) {
  var rawDatas = datacsv;//csvToObject(datacsv);

  //prepare data

  var data = [];
  rawDatas.forEach(function (d) {
    // ... Alter und Einkommen in echte Zahlen (integer) umwandeln
    if (filterFieldStudy == "All" || d.studyprogram == filterFieldStudy) {
      d.participate = parseInt(d.participate);
      d.grade = parseInt(d.grade);
      data.push(d);
    }
  });
  // for (var i = 0; i < rawDatas.length; i++) {
  //   var rawData = rawDatas[i];
  //   if (filterFieldStudy == "All" || rawData.studyprogram == filterFieldStudy) {
  //     var item = data.find(elm => elm.participateAttending_Lectures == rawData.participateAttending_Lectures)
  //     if (item == undefined) {
  //       item = { participateAttending_Lectures: rawData.participateAttending_Lectures * 100, sumgrade: 0, occr: 0 };
  //       data.push(item);
  //     }
  //     item.sumgrade += Number.parseFloat(rawData.grade);
  //     item.occr++;
  //   }
  // }
  // for (var i = 0; i < data.length; i++) {
  //   var item = data[i];
  //   item.avggrade = item.sumgrade / item.occr;
  //   item.number = item.avggrade
  // }
  data = data.sort((a, b) => a.participate > b.participate ? 1 : (a.participate < b.participate ? -1 : 0))
  return data;
}
function showchart(filterFieldStudy) {
  $(".container.main-content svg").remove();
  //chart prepare
  var margin = { top: 80, right: 80, bottom: 80, left: 80 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


  d3.csv("data.csv", function (error, datacsv) {
    var data = analyzeData(datacsv, filterFieldStudy);
    // Niedrigstes und höchstes Alter herausfinden
    var xExtent = d3.extent([0,25,50,75,100]);
    // Niedrigstes und höchstes Einkommen herausfinden
    var yExtent = d3.extent(data, function (d) { return d.grade; });

    // Skala festlegen, welche das jeweilige Alter in einen
    // Wert auf dem x-Achse umrechnet
    var xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([0, width]);
    // Skala festlegen, welche das jeweilige Einkommen in einen
    // Wert auf dem y-Achse umrechnet
    var yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([height, 0]);

    // Wertebereich und Position der x-Achse festlegen
    var xAxis = d3.axisBottom(xScale);
    // Wertebereich und Position der y-Achse festlegen
    var yAxis = d3.axisLeft(yScale);

    var svg = d3.select(".container.main-content").append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    // Gruppe erstellen um alle Elemente nach rechts unten zu verschieben
    var group = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // x-Achse an Gruppe anhängen und nach unten verschieben
    group.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      // Achsenbeschriftung hinzufügen
      .append('text')
      .attr('x', width)
      .attr('y', -10)
      .attr('fill', 'white')
      .style('text-anchor', 'end')
      .text('Participate');

    // x-Achse an Gruppe anhängen
    group.append('g')
      .call(yAxis)
      // Achsenbeschriftung hinzufügen
      .append('text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'white')
      .style('text-anchor', 'end')
      .text('Grade');

    // Kreis für jedes Daten-Objekt erstellen und an Gruppe anhängen
    group.selectAll('circles')
      .data(data)
      .enter()
      .append('circle')
      // Position des jeweiligen Datenpunkts auf der x-Achse festlegen
      .attr('cx', function (d) { 
        return xScale(d.participate); 
      })
      // Position des jeweiligen Datenpunkts auf der y-Achse festlegen
      .attr('cy', function (d) { return yScale(d.grade); })
      .attr('r', 7.5)
      .attr('fill', 'dodgerblue');

  });
}
$(function () {

  $("#drpAge").change((e) => showchart($(e.target).val()))
  showchart("All");

});
