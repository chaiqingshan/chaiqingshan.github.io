$('#download_reporter').on('click','',function(e){
    var inputs = $('#div li').children('input');
    var reportid;
    for(var i=0;i<inputs.length;i++){
        if(inputs[i].checked == true){
            reportid = $(inputs[i]).parent().attr('reportid');
        }
    }
    var url = 'http://124.127.117.32:8887/iinbjservice/rep/downloadReportDoc?reportId=' + reportid;
    window.location = url;
});