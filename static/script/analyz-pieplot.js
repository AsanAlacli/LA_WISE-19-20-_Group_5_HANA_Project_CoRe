
function prepareData(json) {



  //data = data.sort((a, b) => a.participate > b.participate ? 1 : (a.participate < b.participate ? -1 : 0))

  return json.chart.map(item=>[item.key, item.val]);
}
function showchart(fieldName) {



  $.getJSON('/analyze_freq?fieldName='+fieldName, function (jsonData) {
    
    var data = prepareData(jsonData);
    $(".container.main-content svg").remove();
    var chart = c3.generate({
      bindto: ".container.main-content > div",
      data: {
        // iris data from R
        columns: data,
        type: 'pie',
  
      }
    });
   
  });

}
$(function () {
    
  
   showchart("age");
  $("#fieldName").change((e) => {
    $('.container.main-content h2 span').html($("option:selected",'#fieldName').html())
    showchart( $(e.target).val());
    
  });

});
