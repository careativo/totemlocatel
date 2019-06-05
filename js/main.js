$(document).ready(function(){
    $('.slider-banner #slider-4').slick({
        slidesToShow: 4
    });
    
    $('.slider-productos').slick({
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        boolean: true,
        autoplay: true,
        autoplaySpeed: 4000
    });

  $('.slider-marcas').slick({
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    boolean: true,
    autoplay: true
  });
  $('.doble').slick({
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    boolean: true,
    asNavFor: true
  });
    
});

$(document).ready(function(){
    // This button will increment the value
    $('.qtyplus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('input[name='+fieldName+']').val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
    });
    // This button will decrement the value till 0
    $(".qtyminus").click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[name='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            $('input[name='+fieldName+']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[name='+fieldName+']').val(0);
        }
    });
});

$('#fotos-producto').carousel({
  interval: 20000
})

$('.carousel').carousel({
  interval: 20000
})


$(document).ready(function(){

    $('#btn-descripcion').click(function(){
        $('.info-descripcion').show();
        $('.info-caracteristicas').hide();
        $('.info-soporte').hide();
        $('.info-resenas').hide();
        $('#btn-descripcion').addClass('active');
        $('#btn-caracteristicas, #btn-soporte, #btn-resenas').removeClass('active');
    });
    $('#btn-caracteristicas').click(function(){
        $('.info-caracteristicas').show();
        $('.info-descripcion').hide();
        $('.info-soporte').hide();
        $('.info-resenas').hide();
        $('#btn-caracteristicas').addClass('active');
        $('#btn-descripcion, #btn-soporte, #btn-resenas').removeClass('active');
    });
    $('#btn-soporte').click(function(){
        $('.info-soporte').show();
        $('.info-caracteristicas').hide();
        $('.info-descripcion').hide();
        $('.info-resenas').hide();
        $('#btn-soporte').addClass('active');
        $('#btn-caracteristicas, #btn-descripcion, #btn-resenas').removeClass('active');
    });
    $('#btn-resenas').click(function(){
        $('.info-resenas').show();
        $('.info-descripcion').hide();
        $('.info-soporte').hide();
        $('.info-descripcion').hide();
        $('#btn-resenas').addClass('active');
        $('#btn-caracteristicas, #btn-soporte, #btn-descripcion').removeClass('active');
    });
    $('#btn-envio').click(function(){
        $('#opciones-envio').show();
    });
});


$(document).ready(function(){

    $('.btn-ecom').click(function(){
        $('.popover-carrito').show();
    });

    $('#btn-continuar').click(function(){
        $('#datos-continuar').show();
    });
});

$(document).ready(function(){

    $('#op-envio-1').click(function(){
        $('#op-envio-1').addClass('active');
        $('#op-envio-2, #op-envio-3').removeClass('active');
    });
    $('#op-envio-2').click(function(){
        $('#op-envio-2').addClass('active');
        $('#op-envio-1, #op-envio-3').removeClass('active');
    });
    $('#op-envio-3').click(function(){
        $('#op-envio-3').addClass('active');
        $('#op-envio-1, #op-envio-2').removeClass('active');
    });
});









