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





$( "#btn-list-down" ).click(function() {
  $( ".list-productos" ).scrollTop(500);
});

$( "#btn-list-up" ).click(function() {
    $( ".list-productos" ).scrollTop(0);
});

$(window).on('load',function(){
    $('#correo-ingreso').modal('show');
});


$(document).ready(function() {	
    function changeColor() {
        if ($('#medios-de-pago, #medios-de-envio').hasClass('active')) {
            $('#medios-de-pago, #medios-de-envio').removeClass('active');
            $('#banner-medios').addClass('active');
        }
    }
    setInterval(changeColor, 6000);
});



$('#op-envio-2').click(function(){
    $('#op-envio-2').addClass('active');
    $('#op-envio-1').removeClass('active');
    $('#op-envio-3').removeClass('active');
    $('#rbdomiciliof').prop('checked', true);
    $('#direccion').val('');
    $('#tipoentrega-error').hide();
    $('#bannerfooter').hide();
    $('section.tiendas').hide();
    $('.opctie').addClass('hide');
    $('.opcbog').removeClass('hide');
    $('.opcotr').removeClass('hide');
    $( "section.pasoapaso li:nth-child(2)" ).removeClass('active');
    $( "section.pasoapaso li:nth-child(3)" ).addClass('active');
    var dept = $("#departamento option:selected").val();
    var ciud = $("#ciudad option:selected").val();
    $.get(`/estimarprecio/${dept}/${ciud}`,function(response, categoria){
        $('#venvio').html(response.minprecio);
        $('#labelvalorenvio').html('Se actualizó el valor de envío');
        /*if(response.retirarentienda == 1){
            $('#op-envio-2').show();
            $("#tienda").empty();
            $("#tienda").append("<option value=''>Seleccione una Tienda</option>");
            response.tiendas.forEach(element => {
                //console.log(element);
                $("#tienda").append("<option value='"+element.id+"'>"+element.name+"</option>");
            });
        }else{
            //$('#op-envio-2').hide();
            $('#labelvalorenvio').html('');
        }*/
        
        delay(function(){
            $('#labelvalorenvio').html('');
        }, 25000 );
        /*$("#ciudad").empty();
        $("#ciudad").append("<option value=''>Seleccione una Ciudad</option>");
        response.forEach(element => {
            //console.log(element.nombre);
            $("#ciudad").append("<option value='"+element.codigodane+"'>"+element.nombre+"</option>");
        });*/
        /*$("#subcategoria").empty();
        for(i=0; i<response.length; i++){
        $("#subcategoria").append("<option value='"+response[i].id+"'>"+response[i].descripcion+"</option>")
        }*/
    });
});
$('#op-envio-3').click(function(){
    $('#op-envio-2').removeClass('active');
    $('#op-envio-1').removeClass('active');
    $('#op-envio-3').addClass('active');
    $('#rbtienda').prop('checked', true);
    $('#direccion').val('Retiro en tienda');
    $('#venvio').html("Gratis");
    $('#tipoentrega-error').hide();
    $('section.tiendas').hide();
    $('.opcbog').addClass('hide');
    $('.opcotr').addClass('hide');
    $('.opctie').removeClass('hide');
    $( "section.pasoapaso li:nth-child(2)" ).removeClass('active');
    $( "section.pasoapaso li:nth-child(3)" ).addClass('active');
});

