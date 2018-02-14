var baseurl = 'http://124.127.117.32:8887/iinbjservice';
var police_station = {};
var police_html = '';
//加载全部派出所信息
function get_policeStation(token){
	$.ajax({
        type: "post",
        url: baseurl + '/map/loadPoliceStations',
        data: JSON.stringify({
            "params": {
                "token": token
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            police_station = res.detail.police_stations;
            police_html = '';
            for(var i=0;i<police_station.length;i++){
            	police_html += '<tr><td>' + police_station[i] + '</td></tr>';
            }
            $("#dropdown_place").append(police_html); 
        },
        error: function() {
            alert("获取数据失败");
        }
    });
}
$('#police_station_drop').click(function(e){
    var token = '2050233';
    $("#dropdown_place").empty();
    get_policeStation(token);
});