/* 导出excel */
$('#excel-export').on('click','',function(e){
    var searchWord = $('#search-word').val();
    var x;
    var categories = $('#input_type').html();
    switch(categories){
        case '刑事类':
            x = '0';
            break;
        case '治安类':
            x = '1';
            break;
        case '社情民意类':
            x = '2';
            break;
        case '纠纷求助类':
            x = '3';
            break;
        case '全部':
            x = '0,1,2,3';
            break;
        default:
            x = '';
            break;
    }
    var startDate = $('#from').val();
    var endDate = $('#to').val();
    var police = $('#input_place').html();
    var url = 'http://124.127.117.32:8887/iinbjservice/rep/downloadCaseExcel?searchWord=' + searchWord + '&categories=' + x + '&startDate='+ startDate +'&endDate=' + endDate + '&police=' + police + '&token=2050233';
    window.location = url;
});