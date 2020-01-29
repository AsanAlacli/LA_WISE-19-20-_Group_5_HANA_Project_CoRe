$(function () {
    var predictbtn = $('#predictbtn');
    var resultbox = $('#resultbox');
    var form=$('form');
    form.submit(function (e) {
        e.preventDefault();
        predictbtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
        predictbtn.attr('disabled', 'disabled');

        resultbox.css('display', 'none');
        var object = {};
       
        for (var i in this) {
            var item=this[i]
            if(item && item.name && (item.type==='select-one' || item.type==='range'))
                object[item.name] = item.value
        };
        //call server API
        $.ajax({
            type: "POST",
            url: "/predict",
            data: JSON.stringify(object),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var valuelrSpn = $('#resultbox > span.lr');
                var valueknnSpn = $('#resultbox > span.knn');

                predictbtn.html('Predict');
                predictbtn.removeAttr('disabled');

                resultbox.css('display', 'block');

                valuelrSpn.html(data.resultlr);
                valueknnSpn.html(data.resultknn);
            },
            failure: function (errMsg) {

                alert(errMsg);

                predictbtn.html('Predict');
                predictbtn.removeAttr('disabled');


            }
        });
    });
})