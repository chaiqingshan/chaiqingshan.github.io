var isOpen = false;
$('#personal-center').on('click','',function(e){
    e.stopPropagation();
    if(isOpen){
        $('.personal').addClass('hide');
        $('#personal-center').css('background','');
        isOpen = false;
    }else{
        $('.personal').removeClass('hide');
        $('#personal-center').css('background','#03458e');
        isOpen = true;
    }
    $('.message').addClass('hide');
    $('#message-center').css('background','');
});
$('#message-center').on('click','',function(e){
    e.stopPropagation();
    if(isOpen){
        $('.message').removeClass('hide');
        $('#message-center').css('background','#03458e');
        isOpen = false;
    }else{
        $('.message').addClass('hide');
        $('#message-center').css('background','');
        isOpen = true;
    }
    $('.personal').addClass('hide');
    $('#personal-center').css('background','');
});
$('body').on('click','',function(e){
    $('.personal').addClass('hide');
    $('#personal-center').css('background','');
    $('.message').addClass('hide');
    $('#message-center').css('background','');
});