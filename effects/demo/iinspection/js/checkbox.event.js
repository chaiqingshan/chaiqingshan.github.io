var all_input = document.getElementsByClassName("check");
var all_check = document.getElementsByClassName("all_input check");
var all_list = document.getElementsByClassName("list-group-item");
var control = document.getElementById("control");
for(var i=0;i<all_input.length;i++){
    all_input[i].onclick = function(){
        control.className = "show";
        if(this.className === "all_input check"){

            if($(".all_input check").prop("checked",true)){
                $("#div li").children(".pull-right").removeClass("hide");
                $("#div li").children(".pull-right").addClass("show"); 
            }

            for(var j=0;j<all_input.length;j++){
                all_input[j].checked = this.checked;
            } 
        }
        if(this.checked == false){
            control.className = "hide";
            for(var s=0;s<all_input.length;s++){
                if(all_input[s].checked){
                    control.className = "show";
                }
            }
            for(var k=0;k<all_check.length;k++){
                all_check[k].checked = false;
            }
        }
        bgcolor();
    }
}

var bgcolor = function(){
    for(var i=4;i<all_list.length;i++){
        if(all_list[i].getElementsByTagName("input")[0].checked){
            $("#list"+(i-4)).css("background","rgba(246,250,255,0.9)");
            $("#list"+(i-4)).css("color","#111111");    
        }else{
            $("#list"+(i-4)).css("background","");
            $("#list"+(i-4)).css("color","");
        }
    }
}
$('#div').on('mouseover','li',function(e) {
    $(this).children(".pull-right").removeClass("hide");
});
$('#div').on('mouseout','li',function(e) {
    if(($(this).children("input")[0].checked) == false){
        $(this).children(".pull-right").removeClass("show");
        $(this).children(".pull-right").addClass("hide");  
    }
});
$(function() {
    $( "#from" ).datepicker();
});
$(function() {
    $( "#to" ).datepicker();
});
$(".arrow-down").click(function(){
    $(this).datepicker();
});
//复选框
$("#div").on("click","input",function(e){
    bgcolor();
    control.className = "show";
    if(this.checked == false){
        control.className = "hide";
        for(var s=0;s<all_input.length;s++){
            if(all_input[s].checked){
                control.className = "show";
            }
        }
        for(var k=0;k<all_check.length;k++){
            all_check[k].checked = false;
        }
    }
});