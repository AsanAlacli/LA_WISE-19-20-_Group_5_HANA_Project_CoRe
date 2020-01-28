
function analyzeData(datacsv, filterFieldStudy) {
  

  return datacsv
}
function showchart(data) {
  $(".container.main-content svg").remove();
  //chart prepare
  var margin = { top: 80, right: 80, bottom: 80, left: 80 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var result = {};

  result.chart = c3.generate({
    bindto: ".container.main-content",
    data: {
      xs: {
        grade: 'age',
      },
      // iris data from R
      columns: [data.data, data.data_x],
      type: 'scatter'
    },
    axis: {
      x: {
        label: 'Age',
        tick: {
          fit: false
        }
      },
      y: {
        label: 'Grade'
      }
    }
  });

  return result;
}
$(function () {
  
  var chartResult ;
  $.getJSON('/analyze_scatter_x?searchValue=', function (jsonData) {

    var data = analyzeData(jsonData);
    chartResult = showchart(data);
  });
  $("#drpAge").change((e) => {

    $.getJSON('/analyze_scatter_x?searchValue=' + $(e.target).val(), function (jsonData) {

      var data = analyzeData(jsonData);
      chartResult.chart.load({
        columns: [data.data, data.data_x]

      })
    });
  }).change();
});
