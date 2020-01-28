
function analyzeData(datacsv, filterFieldStudy) {
  var rawDatas = datacsv;//csvToObject(datacsv);

  //prepare data

  var data = ["participate"];
  var data_x = ["grade"];
  rawDatas.forEach(function (d) {
    // ... Alter und Einkommen in echte Zahlen (integer) umwandeln
    if (filterFieldStudy == "All" || d.studyprogram == filterFieldStudy) {
      data.push(parseInt(d.participate));
      data_x.push(parseInt(d.grade));
    }
  });

  //data = data.sort((a, b) => a.participate > b.participate ? 1 : (a.participate < b.participate ? -1 : 0))

  return {
    data, data_x
  };
}
function showchart(filterFieldStudy) {
  $(".container.main-content svg").remove();
  //chart prepare
  var margin = { top: 80, right: 80, bottom: 80, left: 80 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    var result = {};
    
  d3.csv("data.csv").then(function (datacsv) {
    result.rawDatas=datacsv;
    var data = analyzeData(datacsv, filterFieldStudy);
    result.chart = c3.generate({
      bindto: ".container.main-content",
      data: {
        xs: {
          grade: 'participate',
        },
        // iris data from R
        columns: [data.data, data.data_x],
        type: 'scatter'
      },
      axis: {
        x: {
          label: 'Participate',
          tick: {
            fit: false
          }
        },
        y: {
          label: 'Grade'
        }
      }
    });
  });
  return result;
}
$(function () {

  var chartResult=showchart("All");
  $("#drpAge").change((e) => {
    var data = analyzeData(chartResult.rawDatas, $(e.target).val());
    chartResult.chart.load({
      columns: [data.data, data.data_x]
      
  })
  });

});
