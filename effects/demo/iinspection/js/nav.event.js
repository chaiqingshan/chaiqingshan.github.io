//导航栏账号和消息提示
$('#User-btn').mouseover(function() {
    $('#userMsg').show();
    $('.top-angle2').show();
}).mouseout(function() {
    $('#userMsg').hide();
    $('.top-angle2').hide();
});

$('#Msg-btn').mouseover(function() {
    $('#Msg-content').show();
    $('.top-angle3').show();
}).mouseout(function() {
    $('#Msg-content').hide();
    $('.top-angle3').hide();
});
//搜索框搜索
var caseorpeople=0;
$('#people-choose-btn').click(function() {
    /* $('#case-choose-btn').removeClass('underLine');
     $(this).addClass('underLine');*/
    $('#case-choosed').hide();
    $('#people-choosed').show();
    caseorpeople=1;
    $('#case-choosed span').removeClass('purple');
    console.log(caseorpeople);
});
$('#case-choose-btn').click(function() {
    /*   $('#people-choose-btn').removeClass('underLine');
     $(this).addClass('underLine');*/
    $('#people-choosed').hide();
    $('#case-choosed').show();
    caseorpeople=0;
    $('#people-choosed span').removeClass('purple');
    console.log(caseorpeople);
});
//输入框下拉出现选择框
$('#search-input').focus(function(event) {
    var leftwidth=$('#search-input').offset().left+15;
    console.log(leftwidth);
    $('#search-content').css('left',leftwidth);
    $('#search-content').css('display', 'block');
});
$('#search-input').click(function(event) {
    $('#search-content').css('display', 'block');
    //阻止事件冒泡
    event.stopPropagation();
});

$('#nav').click(function(event) {
    $('#search-content').css('display', 'none');
});
$('#main').click(function(event) {
    $('#search-content').css('display', 'none');
});
