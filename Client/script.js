$(function(){
    var predictbtn=$('#predictbtn');
    var resultbox=$('#resultbox');

    predictbtn.click(function(){

        predictbtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
        predictbtn.attr('disabled','disabled');
        
        resultbox.css('display','none');

        //call server API
        setTimeout(function()
        {
         
            var valueSpn=$('#resultbox > span');

            predictbtn.html('Predict');
            predictbtn.removeAttr('disabled');
            
            resultbox.css('display','block');
            
            valueSpn.html('between 3 and 4');

        },4000)
    });
})