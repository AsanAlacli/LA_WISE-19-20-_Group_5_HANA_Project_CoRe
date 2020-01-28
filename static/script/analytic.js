

$(function () {
  participateorder=['25%','50%','75%','100%'];
  function iP(t)
  {
    return participateorder.findIndex(a=>a==t)

  }
  hourorder=['1-2','2-5','5-10','10 and more'];
  function iH(t)
  {
    return hourorder.findIndex(a=>a==t)

  }
  function prepareData(json) {


    var datachart1 = [];
    var catData1 = [];

    json.chart1.forEach(item => {
      var lo=item.val.sort((a,b)=>iP(a.key)>iP(b.key)?1:(iP(a.key)==iP(b.key))?0:-1)
      let list=lo.map(x=>x.val)
      list.unshift(item.key);
      datachart1.push(list);
      catData1=lo.map(x=>x.key)
    });
    
    var datachart2 = [];
    var catData2 = [];
    json.chart2.forEach(item => {
      var lo=item.val.sort((a,b)=>iH(a.key)>iH(b.key)?1:(iH(a.key)==iH(b.key))?0:-1)
      let list=lo.map(x=>x.val)
      list.unshift(item.key);
      datachart2.push(list);
      catData2=lo.map(x=>x.key)
    })


    return {datachart1,datachart2,catData1,catData2};
  }
  $.getJSON('/analyze_participate_and_hours', {},function (externaldata) {
    let {datachart1,datachart2,catData1,catData2}=prepareData(externaldata);
    var chart1 = c3.generate({
      bindto: ".container.main-content.chart1 > div",
      data: {
        columns: datachart1,
        type: 'bar'
      },
      bar: {
        width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
      },
      axis: {
        x: {
          label: 'participate',
          tick: {
            fit: false
          },
          type: 'category',
          categories: catData1
        },
        y: {
          label: 'Mean of grade'
        }
      }
    });
    var chart2 = c3.generate({
      bindto: ".container.main-content.chart2 > div",
      data: {
        columns: datachart2,
        type: 'bar'
      },
      bar: {
        width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
      },
      axis: {
        x: {
          label: 'hours',
          tick: {
            fit: false
          },
          type: 'category',
          categories: catData2
        },
        y: {
          label: 'Mean of grade'
        }
      }
    });
  });
});
