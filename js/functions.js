var t;
var ventana, horatienda;
window.onload=resetTimer;
document.onkeypress=resetTimer;
document.onclick=resetTimer;
var morePosts, //controlamos si hay posts
scroll = null;//evitamos que el evento scroll se disparé múltiples veces

/*document.onmousemove=resetTimer;*/
function logout()
{
	
	console.log('Recargar página');
	location.href='/?logout=1'; 
}
function resetTimer()
{
    //console.log(location.pathname);
    console.log("ingresa resetTimer");
    $('.popover-carrito').hide();
    clearTimeout(t);
    if(location.pathname == "/pago"){
        t = setTimeout(logout,660000) //11 minutos de inactividad, tiempo en ms por mercadolibre
    }else if(location.pathname == "/confirmacionpago"){
        t = setTimeout(logout,60000) //1 minutos de inactividad, tiempo en ms al finalizar la compra
    }else{
        t = setTimeout(logout,300000) //5 minutos de inactividad, tiempo en ms
    }
    
}


window.addEventListener('blur',function(){  
            window.setTimeout(function () {  
          if (document.activeElement instanceof HTMLIFrameElement) {
            console.log("iframe click");
			resetTimer();
          }
             }, 0);
  }); 


function setHeader(data){
    $.ajaxSetup({
        headers: {
           'X-CSRF-TOKEN': data
         }
     });
}
setHeader($('meta[name="csrf-token"]').attr('content'));

//esperar para realizar llamado
var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

$(document).ready(function(){
   /* $( "a.btn-car" )
  .mouseenter(function() {
    var ajaxurl = "/popup-cart";
    //ajaxurl = ajaxurl.replace(':productoid', id);
    $.ajax({
        type:'GET',
        url:ajaxurl,
        cache: false,
        success:function(data){
            $('.popover-carrito').html(data);
            $('.popover-carrito').show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if(jqXHR.status==419){//if you get 419 error which meantoken expired
               refreshToken(function(){ //refresh the token
                   runAjax();//send ajax again
               });
            }
        }
    });
  })
  .mouseleave(function() {
    $('.popover-carrito').hide();
  });*/
  // This button will increment the value
  $( "body" ).on( "click", "a.btn-car", function() {
    // Stop acting like a button
    event.preventDefault();
    var ajaxurl = "/popup-cart";
    //ajaxurl = ajaxurl.replace(':productoid', id);
    $.ajax({
        type:'GET',
        url:ajaxurl,
        cache: false,
        success:function(data){
            $('.popover-carrito').html(data);
            $('.popover-carrito').show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if(jqXHR.status==419){//if you get 419 error which meantoken expired
               refreshToken(function(){ //refresh the token
                   runAjax();//send ajax again
               });
            }
        }
    });
  });

    // This button will increment the value
    $( "body" ).on( "click", ".qtyplus", function() {
        // Stop acting like a button
        event.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[id='+fieldName+']').val());
        var stock = parseInt($('input[id='+fieldName+']').data('cantidad'));
       
        // If is not undefined
        if (!isNaN(currentVal) && currentVal < stock) {
            // Increment
            $('input[id='+fieldName+']').val(currentVal + 1);
        } else if (!isNaN(currentVal)) {
            // Increment
            $('input[id='+fieldName+']').val(stock);
        } else {
            // Otherwise put a 0 there
            $('input[id='+fieldName+']').val(1);
        }
        if($('#boton-'+fieldName).length){
            //$('#boton-'+fieldName).show();
            delay(function(){
                actualizarcarrito(fieldName);
            }, 500 );
        }
    });
    // This button will decrement the value till 0
    $( "body" ).on( "click", ".qtyminus", function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[id='+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 1) {
            // Decrement one
            $('input[id='+fieldName+']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[id='+fieldName+']').val(1);
        }
        if($('#boton-'+fieldName).length){
            if (currentVal ==1){
                $('input[id='+fieldName+']').val(0);
                var id = $('#boton-'+fieldName).data('id'); //id producto
                delay(function(){
                    quitarproducto(id);
                }, 500 );
            }else{
                delay(function(){
                    actualizarcarrito(fieldName);
                }, 500 );
            }
            
        }
    });

    $("#search").on('change', function(e) { // everytime keyup event
        //$('#spinner').show();
        e.preventDefault();
        var input = $(this).val();// We take the input value
        //var $search = $('#search');
        delay(function(){
            //console.log(input);
            if(input.length > 2){
                var ajaxurl = "/autocomplete/:texto";
                ajaxurl = ajaxurl.replace(':texto', input);
                //console.log(ajaxurl);
                $.ajax({
                    url: ajaxurl,
                    type: "GET",
                    cache: false,
                    success: function(data){
                        $data = $(data); // the HTML content that controller has produced
                        //console.log($data);
                        $('.resultadobusqueda').html($data);
                        //$('#item-container').hide().html($data).fadeIn();
                    }
                });
            }else{
                $('.resultadobusqueda').html('');
            }
        }, 1000 );
        
    });


    $( "body" ).on( "click", ".botoncarrito", function(e) {
        e.preventDefault();
        var id =  $(this).data('id'); //id producto
        var linkText =  $(this).data('linktext'); //link producto
        var route =  $(this).data('route'); //link producto
        var cantidad = parseInt($('input[id=product-quantity-'+id+']').val()); //cantidad producto
        var ajaxurl = "/add-to-cart";
        //ajaxurl = ajaxurl.replace(':productoid', id);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            data:{idproducto:id, producto:linkText, cantidad:cantidad, route:route},
            cache: false,
            success:function(data){
                $('.cart-quantity').html(data.totalQty);
                if(data.actualizarcarrito == 1){
                    $("#seccioncarrito").html(data.content);
                    $("#Novedades").hide();
                }
                $("#modals").removeClass('modal-tiendas').html(data.modal);
                $("#modals").modal();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                   refreshToken(function(){ //refresh the token
                       runAjax();//send ajax again
                   });
                }
            }
        });
    });

    $( "body" ).on( "click", ".botonvitrina", function(e) {
        e.preventDefault();
        var id =  $(this).data('id'); //id producto
        var linkText =  $(this).data('linktext'); //link producto
        var route =  $(this).data('route'); //link producto
        var cantidad = parseInt($('input[id=product-quantity-'+id+']').val()); //cantidad producto
        var ajaxurl = "/add-to-cart";
        //ajaxurl = ajaxurl.replace(':productoid', id);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            data:{idproducto:id, producto:linkText, cantidad:cantidad, route:route},
            cache: false,
            success:function(data){
                $('.cart-quantity').html(data.totalQty);
                if(data.actualizarcarrito == 1){
                    $("#seccioncarrito").html(data.content);
                    $("#Novedades").hide();
                }
                $("#addproducto-"+id).show();
                setTimeout(function() {
                    $("#addproducto-"+id).hide();
                }, 5000);
                /*$("#modals").removeClass('modal-tiendas').html(data.modal);
                $("#modals").modal();*/

            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                   refreshToken(function(){ //refresh the token
                       runAjax();//send ajax again
                   });
                }
            }
        });
    });

    $( "body" ).on( "click", ".carritocombo", function(e) {
        e.preventDefault();
        var ids =  $(this).data('id'); //ids productos
        var idssplit = ids.split(","),i;
        var modal = "";
        for (i = 0; i < idssplit.length; i++) {
            var id =  idssplit[i];
            var linkText =  $('#'+id).data('linktext'); //link producto
            var route =  $('#'+id).data('route'); //link producto
            var cantidad = 1; //cantidad producto
            var ajaxurl = "/add-to-cart";
            
            //ajaxurl = ajaxurl.replace(':productoid', id);
            $.ajax({
                type:'POST',
                url:ajaxurl,
                data:{idproducto:id, producto:linkText, cantidad:cantidad, route:route},
                cache: false,
                success:function(data){
                    $('.cart-quantity').html(data.totalQty);
                    if(data.actualizarcarrito == 1){
                        $("#seccioncarrito").html(data.content);
                        $("#Novedades").hide();
                    }
                    modal = data.modal;
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status==419){//if you get 419 error which meantoken expired
                       refreshToken(function(){ //refresh the token
                           runAjax();//send ajax again
                       });
                    }
                }
            });
            if(idssplit.length-1 === i) {
                setTimeout(function(){
                    $("#carrito-combo").modal();
                }, 1000);
                
            }
        }

    });

    $( "body" ).on( "click", ".imagenzoom", function(e) {
        e.preventDefault();
        var img =  $(this).attr('src'); //obtener ruta imagen
        $('#imgzoom').attr('src',img); //asignar ruta imagen
        
        $("#modal-zoom").modal();
    });

    $( "body" ).on( "change", "#ordenar", function(e) {
        e.preventDefault();
        var option = $(this).val(); //obtener opcion seleccionada
        var search = $("#seccion").data("nombre");
        $(location).attr('href', $("#formordenar").data('url') + "/" + option + "/" + search)
    });

    /*$( "body" ).on( "change", "#pagina", function(e) {
        e.preventDefault();
        var option = $('#ordenar').val(); //obtener opcion seleccionada
        var page = $(this).val(); //obtener opcion seleccionada
        $(location).attr('href', $("#formordenar").data('url') + "/" + option + "/" + page)
    });*/

    /****inicio funciones pago */

    $( "body" ).on( "click", "#pago-datafono", function(e) {
        e.preventDefault();
        var ajaxurl = "/pago-datafono";

        loadingmetodopago();
            
            //ajaxurl = ajaxurl.replace(':productoid', id);
        var estado = $("#modalpago").data('estado');
        if(estado ==0){
            $.ajax({
                type:'POST',
                url:ajaxurl,
                cache: false,
                success:function(data){
                    $('#titulopago').html("Pago con Datafono");
                    $('#msgpago').html(data.mensaje);

                    if(data.route == ''){
                        $('#botonpago').hide();
                        $('#cambiarpago').show();
                    }else{
                        $('#botonpago').attr('href',data.route);
                        $('#botonpago').html(data.boton);
                        $('#botonpago').show();
                        $('#cambiarpago').hide();
                        delay(function(){
                            window.location.href = data.route;
                         }, 50000);
                    }
                    //console.log(data);
                    $("#modalpago").removeClass('pago-qr');
                    $("#modalpago").modal({backdrop:'static'});
                    if(data.timer > 0){
                        $("#modalpago").data('estado',1)
                        onBtnRecordClicked();
                        var ajaxurlv = "/validar-datafono";
                        $("#modalpago").data('ajaxurlv',ajaxurlv)
                        delay(function(){
                            validarpago(ajaxurlv);
                        }, data.timer );
                    }
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status==419){//if you get 419 error which meantoken expired
                        refreshToken(function(){ //refresh the token
                            runAjax();//send ajax again
                        });
                    }
                }
            });
        }else{
            console.log("No realiza proceso de datafono"+estado);
            $("#modalpago").modal({backdrop:'static'});
        }

    });

    $( "body" ).on( "click", "#pago-mercadopagoqr", function(e) {
        e.preventDefault();
        var ajaxurl = "/pago-mercadopagoqr";

        loadingmetodopago();
            
            //ajaxurl = ajaxurl.replace(':productoid', id);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            cache: false,
            success:function(data){
                $('#titulopago').html("Mercadopago QR");
                $('#msgpago').html(data.mensaje);

                if(data.route == ''){
                    $('#botonpago').hide();
                    $('#cambiarpago').show();
                }else{
                    $('#botonpago').attr('href',data.route);
                    $('#botonpago').html(data.boton);
                    $('#botonpago').show();
                    $('#cambiarpago').hide();
                    delay(function(){
                        window.location.href = data.route;
                     }, 50000);
                }
                //console.log(data.resultado);
                $("#modalpago").addClass('pago-qr');
                $("#modalpago").modal({backdrop:'static'});
                if(data.timer > 0){
                    var ajaxurlv = "/validar-mercadopago";
                    $("#modalpago").data('ajaxurlv',ajaxurlv)
                    delay(function(){
                        validarpago(ajaxurlv);
                    }, data.timer );
                }
                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                    refreshToken(function(){ //refresh the token
                        runAjax();//send ajax again
                    });
                }
            }
        });

    });

    $( "body" ).on( "click", "#boton-contraentrega", function(e) {
        e.preventDefault();
        var ajaxurl = "/pago-contraentrega";
        
        loadingmetodopago();
            //ajaxurl = ajaxurl.replace(':productoid', id);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            cache: false,
            success:function(data){
                $('#titulopago').html("Pago Contra Entrega");
                $('#msgpago').html(data.mensaje);
                if(data.route == ''){
                    $('#botonpago').hide();
                    $('#cambiarpago').show();
                }else{
                    $('#botonpago').attr('href',data.route);
                    $('#botonpago').html(data.boton);
                    $('#botonpago').show();
                    $('#cambiarpago').hide();
                    delay(function(){
                        window.location.href = data.route;
                     }, 50000);
                }

                //console.log(data);
                $("#modalpago").removeClass('pago-qr');
                $("#pago-contraentrega").modal('hide');
                $("#modalpago").modal({backdrop:'static'});
                /*if(data.timer > 0){
                    delay(function(){
                        validarpago();
                    }, data.timer );
                }*/
                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                    refreshToken(function(){ //refresh the token
                        runAjax();//send ajax again
                    });
                }
            }
        });

    });

    $( "body" ).on( "click", "#pago-mercadopagolink", function(e) {
        e.preventDefault();
        $('#titulopago').html("Mercadopago Link");
        $('#imgpago').attr('src','https://secure.mlstatic.com/components/resources/newmp/desktop/css/assets/nwmp-desktop-logo-mercadopago@2x.png');
        $('#textopago').html('Este método de pago no se encuentra disponible en este momento.');
            $('#botonpago').hide();
            $('#cambiarpago').show();
        //console.log(data.resultado);
        $("#modalpago").modal({backdrop:'static'});

        /*var ajaxurl = "/pago-mercadopagoqr";
            
            //ajaxurl = ajaxurl.replace(':productoid', id);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            cache: false,
            success:function(data){
                $('#titulopago').html("Mercadopago QR");
                $('#imgpago').attr('src',data.imagen);
                $('#textopago').html(data.mensaje);
                if(data.route == ''){
                    $('#botonpago').hide();
                    $('#cambiarpago').show();
                }else{
                    $('#botonpago').attr('href',data.route);
                    $('#botonpago').html(data.boton);
                    $('#botonpago').show();
                    $('#cambiarpago').hide();
                }
                //console.log(data.resultado);
                $("#modalpago").modal({backdrop:'static'});

                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                    refreshToken(function(){ //refresh the token
                        runAjax();//send ajax again
                    });
                }
            }
        });*/

    });

    $( "body" ).on( "click", "#cambiarpago", function(e) {
        e.preventDefault();
        /*var ajaxurlv = "/validar-datafono";
        delay(function(){
            validarpago(ajaxurlv,1);
        }, 2 );*/
        delay(function(){
            $("#modalpago").data('estado',0)
            ajaxurl = $("#modalpago").data('ajaxurlv');
            
            console.log('Cancela proceso');
            if(ajaxurl == "/validar-datafono"){
                onBtnStopClicked();
            }
        }, 2 );
    });

    /****fin funciones pago */

    $( "body" ).on( "click", ".eliminar", function(e) {
        e.preventDefault();
        var id =  $(this).data('id'); //id producto
        console.log("eliminar"+id);
        quitarproducto(id);
    });
    

    $( "#seccioncarrito" ).on( "click", ".actualizar", function(e) {
        e.preventDefault();
        var id =  $(this).data('id'); //id producto
        var linkText =  $(this).data('linktext'); //link producto
        var route =  $(this).data('route'); //link producto
        var cantidad = parseInt($('input[id=update-'+id+']').val()); //cantidad producto
        var ajaxurl = "/update-cart";
        //ajaxurl = ajaxurl.replace(':productoid', id);
        //alert(id+" "+linkText+" "+route+" "+cantidad);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            data:{idproducto:id, producto:linkText, cantidad:cantidad, route:route},
            cache: false,
            success:function(data){
                $('.cart-quantity').html(data.totalQty);
                if(data.actualizarcarrito == 1){
                    $("#seccioncarrito").html(data.content);
                }
                $("#modals").removeClass('modal-tiendas').html(data.modal);
                $("#modals").modal();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                   refreshToken(function(){ //refresh the token
                       runAjax();//send ajax again
                   });
                }
            }
        });
    });

    //$( "select.sustituir" ).change( event=> {
    $( "body" ).on( "change", "select.sustituir", function(event) { 
        event.preventDefault();
        var id =  `${event.target.dataset.id}`; //id producto
        var value = `${event.target.value}`;

        var ajaxurl = "/update-opcreplace";

        console.log("valor -> " + value + " id -> " + id);

        $.ajax({
            type:'POST',
            url:ajaxurl,
            data:{idproducto:id, idopcion:value},
            cache: false,
            success:function(data){
                console.log(data);
 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                   refreshToken(function(){ //refresh the token
                       runAjax();//send ajax again
                   });
                }
            }
        });
    });

    $( "#pais" ).change( event=> {
        event.preventDefault();
        $("#departamento").empty();
        $("#departamento").append("<option value=''>Cargando, por favor espere</option>");
        $.get(`/departamentos/${event.target.value}`,function(response, categoria){
            //console.log(response);
            $("#departamento").empty();
            $("#departamento").append("<option value=''>Seleccione un Departamento</option>");
            $("#ciudad").empty();
            $("#ciudad").append("<option value=''>Seleccione una Ciudad</option>");
            response.forEach(element => {
                //console.log(element.nombre);
                $("#departamento").append("<option value='"+element.codigodane+"'>"+element.nombre+"</option>");
            });
        });
    });
    
    $( "#departamento" ).change( event=> {
        event.preventDefault();
        $("#ciudad").empty();
        $("#ciudad").append("<option value=''>Cargando, por favor espere</option>");
        $.get(`/ciudades/${event.target.value}`,function(response, categoria){
            //console.log(response);
            $("#ciudad").empty();
            $("#ciudad").append("<option value=''>Seleccione una Ciudad</option>");
            response.forEach(element => {
                //console.log(element.nombre);
                $("#ciudad").append("<option value='"+element.codigodane+"'>"+element.nombre+"</option>");
            });
        });
    });

    $( "#ciudad" ).change( event=> {
        event.preventDefault();
        var val = $("#departamento option:selected").val();
        //$("#tienda").empty();
        //$("#tienda").append("<option value=''>Cargando, por favor espere</option>");
        $.get(`/estimarprecio/${val}/${event.target.value}`,function(response, categoria){
            console.log(`/estimarprecio/${val}/${event.target.value}`);
            $('#venvio').html(response.minprecio);
            $('#labelvalorenvio').html('Se actualizó el valor de envío');
            //$('#op-envio-1').removeClass('active');
            //$('#op-envio-2').removeClass('active');
            //$('.radiohide').prop('checked', false);
            if(response.retirarentienda == 1){
                $('#op-envio-2').show();
                /*$("#tienda").empty();
                $("#tienda").append("<option value=''>Seleccione una Tienda</option>");
                response.tiendas.forEach(element => {
                    //console.log(element);
                    $("#tienda").append("<option value='"+element.id+"'>"+element.name+"</option>");
                });*/
            }else{
                //$('#op-envio-2').hide();
                $('#labelvalorenvio').html('');
            }
            
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

    /*$('#op-envio-1').click(function(){
        $('#op-envio-1').addClass('active');
        $('#op-envio-2').removeClass('active');
        $('#op-envio-3').removeClass('active');
        $('#rbdomiciliob').prop('checked', true);
        $('#tipoentrega-error').hide();
        $('section.tiendas').hide();
        $('.opcbog').removeClass('hide');
        $('.paso2').show();
        $( "section.pasoapaso li:nth-child(2)" ).removeClass('active');
        $( "section.pasoapaso li:nth-child(3)" ).addClass('active');
    });*/
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

    $( "body" ).on( "click", "#imprimir", function(e) {
        e.preventDefault();
        
        ventana = window.open('', 'PRINT', 'height=1920,width=1080');

        ventana.document.write('<html><head><title>'+$(this).data('pedido')+'</title>');
        ventana.document.write('<link rel="stylesheet" href="../css/boleto.css">'); //Cargamos otra hoja, no la normal
        ventana.document.write('</head><body >');
        ventana.document.write($('div#boleto').html());
        ventana.document.write('</body></html>');
        ventana.document.close();
        ventana.focus();
        ventana.onload = function() {
          ventana.print();
          ventana.close();
        };
        //window.print();
        /*var restorepage = $('body').html();
        var printcontent = $('div#boleto').clone();
        $('body').empty().html(printcontent);
        $('div#boleto').show();
		window.print();
        $('body').html(restorepage);
        $('div#boleto').hide();*/
        
        //return true;
    });

    $( "body" ).on( "click", ".linkmenu", function(e) {
        $('div#loader').css('visibility', 'visible');
        console.log("click menu");
    });

    $( "body" ).on( "click", ".mapatiendas", function(e) {
        e.preventDefault();
        /*modal = '<div class="modal-dialog" role="document">';
        modal+= '<div class="modal-content">';
        modal+= '<div class="modal-header">';
        modal+= '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        modal+= '</div>';
        modal+= '<div class="modal-body">';
        modal+= '<iframe src="http://app.locatelcolombia.com/sqa_kiosko/tiendastotem.php" width="100%"></iframe>';
        modal+= '</div>';
        modal+= '</div>';
        modal+= '</div>';*/
        var ajaxurl = "/modal-tiendas";
        //ajaxurl = ajaxurl.replace(':productoid', id);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            cache: false,
            success:function(data){
                /*$('.popover-carrito').html(data);
                $('.popover-carrito').show();*/
                $("#modals").removeClass('modal-tiendas').addClass('modal-tiendas').html(data);
                $("#modals").modal();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                refreshToken(function(){ //refresh the token
                    runAjax();//send ajax again
                });
                }
            }
        });
    });

    $('.validanumericos').keypress(function(e) {
        if(isNaN(this.value + String.fromCharCode(e.charCode))) 
         return false;
      })
      .on("cut copy paste",function(e){
        e.preventDefault();
      });

    //actuamos en en evento del scroll
    $('.no-carrousel').on('scroll',function() 
    {
        //si hay más posts
        if(morePosts !== false)
        {
            $(".before").html("<img src='/imgs/preloader.gif' />");
            //si scroll es distinto de null
            if (scroll) 
            {
                clearTimeout(scroll); //limpiamos la petición anterior de scroll
            }
            
            //si el scroll ha llegado al final lanzamos la función loadMore()
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) 
            {
                scroll = setTimeout(function() 
                {
                    scroll = null;  //lanzamos de nuevo el scroll
                    
                    loadMore();
                    
                }, 1000);
            }
        }
    })

    $( "#tienda" ).on( "change", function(e) {
        e.preventDefault();
        var optionSelected = $("option:selected", this);
        //console.log("cambio tienda "+optionSelected.data('instructions'));
        //$("#labelinstrucciones").html(optionSelected.data('instructions')); //id producto
        var idtienda = optionSelected.data('idvtex');
        $.post(`/detalletienda/${idtienda}`,function(response, categoria){
            //console.log(response);
            horatienda = response;
            $("#fecharetiro").empty();
            $("#fecharetiro").append("<option value=''>Seleccione fecha retiro</option>");
            $("#horaretiro").empty();
            $("#horaretiro").append("<option value=''>Seleccione hora retiro</option>");
            Object.keys(response).forEach(function (key) {
                //console.log(response[key]);
                $("#fecharetiro").append("<option value='"+response[key]['val']+"' data-id='"+key+"'>"+response[key]['dia']+"</option>");
            });
        });
    });

    $( "#fecharetiro" ).on( "change", function(e) {
        e.preventDefault();
        var optionSelected = $("option:selected", this);
        var horas = horatienda[optionSelected.data('id')]['horas'];
        //console.log("cambio fecha retiro "+horas);
        $("#horaretiro").empty();
        $("#horaretiro").append("<option value=''>Seleccione hora retiro</option>");
        Object.keys(horas).forEach(function (key) {
            //console.log('lista horas'+horas[key]);
            $("#horaretiro").append("<option value='"+key+"'>"+horas[key]+"</option>");
        });
    });

    $( "body" ).on( "click", "#botoncorreo", function(e) {
        e.preventDefault();
        if($("#pasov").val() == 1){
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(re.test($("#correousuario").val())){
                //console.log("correo valido");
                
                var ajaxurl = "/validarusuario";
                //ajaxurl = ajaxurl.replace(':productoid', id);
                $.ajax({
                    type:'POST',
                    url:ajaxurl,
                    data:{correo:$("#correousuario").val()},
                    cache: false,
                    success:function(data){
                        console.log(data);
                        if(data.validar == 1){
                            $(".emailv").addClass("hide");
                            $(".codv").removeClass("hide");
                            $("#correoerror").html("");
                            $("#pasov").val(2)
                        }else{
                            $("#correoerror").html("No se encontró informacion con el correo ingresado");
                        }
                        //$("#modals").removeClass('modal-tiendas').addClass('modal-tiendas').html(data);
                        //$("#modals").modal();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(jqXHR.status==419){//if you get 419 error which meantoken expired
                        refreshToken(function(){ //refresh the token
                            runAjax();//send ajax again
                        });
                        }
                    }
                });
            }else{
                $("#correoerror").html("Debe ingresar un correo válido");
            }
        }else{
            var re = /^([0-9]){4,4}$/;
            if(re.test($("#valcodigo").val())){
                $("#correoerror").html("");
                //console.log("Ingresar codigo");
                var ajaxurl = "/validarcodigo";
                //ajaxurl = ajaxurl.replace(':productoid', id);
                $.ajax({
                    type:'POST',
                    url:ajaxurl,
                    data:{codigo:$("#valcodigo").val()},
                    cache: false,
                    success:function(data){
                        console.log(data);
                        if(data.validar == 1){
                            $("#correo-ingreso-retiro").modal('hide');
                            $("#nombre").val(data.firstName);
                            $("#apellidos").val(data.lastName);
                            $("#documento").val(data.document);
                            $("#celular").val(data.homePhone);
                            $("#correo").val(data.email);
                            /*$(".emailv").addClass("hide");
                            $(".codv").removeClass("hide");
                            $("#correoerror").html("");
                            $("#pasov").val(2)*/
                        }else{
                            if(data.cont == 4){
                                $("#correo-ingreso-retiro").modal('hide');
                            }else if(data.cont == 3){
                                $("#correoerror").html("El codigo ingresado no es correcto. Queda un intento.");
                            }else{
                                $("#correoerror").html("El codigo ingresado no es correcto");
                            }
                            
                        }
                        //$("#modals").removeClass('modal-tiendas').addClass('modal-tiendas').html(data);
                        //$("#modals").modal();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(jqXHR.status==419){//if you get 419 error which meantoken expired
                        refreshToken(function(){ //refresh the token
                            runAjax();//send ajax again
                        });
                        }
                    }
                });
            }else{
                $("#correoerror").html("Debe ingresar un código válido");
            }
        }
        /*modal = '<div class="modal-dialog" role="document">';
        modal+= '<div class="modal-content">';
        modal+= '<div class="modal-header">';
        modal+= '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        modal+= '</div>';
        modal+= '<div class="modal-body">';
        modal+= '<iframe src="http://app.locatelcolombia.com/sqa_kiosko/tiendastotem.php" width="100%"></iframe>';
        modal+= '</div>';
        modal+= '</div>';
        modal+= '</div>';*/
       /* var ajaxurl = "/modal-tiendas";
        //ajaxurl = ajaxurl.replace(':productoid', id);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            cache: false,
            success:function(data){
                $("#modals").removeClass('modal-tiendas').addClass('modal-tiendas').html(data);
                $("#modals").modal();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                refreshToken(function(){ //refresh the token
                    runAjax();//send ajax again
                });
                }
            }
        });*/
    });

    

    
});

function quitarproducto(id){
    var ajaxurl = "/del-to-cart";
    //ajaxurl = ajaxurl.replace(':productoid', id);
    $.ajax({
        type:'POST',
        url:ajaxurl,
        data:{idproducto:id},
        cache: false,
        success:function(data){
            //alert(data.success);
            $("#seccioncarrito").html(data.content);
            $('.cart-quantity').html(data.totalQty);
            if(data.totalQty == 0){
                $("#Novedades").show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if(jqXHR.status==419){//if you get 419 error which meantoken expired
                refreshToken(function(){ //refresh the token
                    runAjax();//send ajax again
                });
            }
        }
    });
}

//creamos una función para llamarla en el evento del scroll
function loadMore()
{
    var pagina = $('#pagina').val(),
     option = $('#ordenar').val(),
     search = $("#seccion").data("nombre"),
     url = $("#formordenar").data('url') + "/" + option + "/" + search,
        getLastId, 
        html = "";
        console.log('Leer nuevos registros' + pagina + url);
    
    if (pagina) 
    {
        //$('div#loader').show();
        $('div#loader').css('visibility', 'visible');
        $.ajax({
            type: "POST",
            url: url,
            data: `pagina=${pagina}`,//la última id
            success: function(data) 
            {
                //console.log(data);
                /*$(".before").html("");*/
                if(data.response == true)
                {              	
                   $("div.no-carrousel").append(data.productos);
                   morePosts = true;
                   $('#pagina').val(data.pagina);
                }
                else
                {
                    //ya no hay más posts que mostrar
                    morePosts = false;
                }
                //$('div#loader').hide();
                $('div#loader').css('visibility', 'hidden');
            
            },
            error: function()
            {
                //TODO controlar los errores
                //$('div#loader').hide();
                $('div#loader').css('visibility', 'hidden');
            }
        });
    }
}

function loadingmetodopago(){
    $('#titulopago').html("Cargando...");
    $('#msgpago').html("<b>Por favor espere...</b>");
    $('#botonpago').hide();
    $('#cambiarpago').hide();
    $("#modalpago").modal({backdrop:'static'});
}

function validarpago(ajaxurl, opc = 0){
    $.ajax({
        type:'POST',
        url:ajaxurl,
        cache: false,
        success:function(data){
            $('#msgpago').html(data.mensaje);
            if(data.route == ''){
                $('#botonpago').hide();
                $('#cambiarpago').show();
            }else{
                if(ajaxurl == "/validar-datafono"){
                    onBtnStopClicked();
                }
                $('#botonpago').attr('href',data.route);
                $('#botonpago').html(data.boton);
                $('#botonpago').show();
                $('#cambiarpago').hide();
                delay(function(){
                    window.location.href = data.route;
                 }, 50000);
            }
            console.log(data.resultado);
            $("#modalpago").modal();

            if(data.timer > 0){
                delay(function(){
                    validarpago(ajaxurl);
                }, data.timer );
            }else{
                if(ajaxurl == "/validar-datafono"){
                    onBtnStopClicked();
                }
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if(jqXHR.status==419){//if you get 419 error which meantoken expired
                refreshToken(function(){ //refresh the token
                    runAjax();//send ajax again
                });
            }
        }
    });
}

function actualizarcarrito(idproducto){
    if($('#boton-'+idproducto).length){
        var id = $('#boton-'+idproducto).data('id'); //id producto
        var linkText =  $('#boton-'+idproducto).data('linktext'); //link producto
        var route =  $('#boton-'+idproducto).data('route'); //link producto
        var cantidad = parseInt($('input[id=update-'+id+']').val()); //cantidad producto
        var ajaxurl = "/update-cart";
        //ajaxurl = ajaxurl.replace(':productoid', id);
        //alert(id+" "+linkText+" "+route+" "+cantidad);
        $.ajax({
            type:'POST',
            url:ajaxurl,
            data:{idproducto:id, producto:linkText, cantidad:cantidad, route:route},
            cache: false,
            success:function(data){
                $('.cart-quantity').html(data.totalQty);
                if(data.actualizarcarrito == 1){
                    $("#seccioncarrito").html(data.content);
                }
                /*$("#modals").removeClass('modal-tiendas').html(data.modal);
                $("#modals").modal();*/
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==419){//if you get 419 error which meantoken expired
                refreshToken(function(){ //refresh the token
                    runAjax();//send ajax again
                });
                }
            }
        });
    }
}

function refreshToken(callback){
    $.get('/refresh-csrf').done(function(data){
       setHeader(data);
        callback(true);
     });
}

function runAjax(){
    modal = '<div class="modal-dialog" role="document">';
    modal+= '    <div class="modal-content">';
    modal+= '    <div class="modal-header">';
    modal+= '        <h2 class="modal-title" id="myModalLabel">La sesión ha expirado</h2>';
    modal+= '   </div>';
        
    modal+= '   <div class="modal-footer">';
    modal+= '        <a id="botonpago" type="button" class="btn-white" href="'+$('a.navbar-brand').attr('href')+'" >Intentar de nuevo</a>';
    modal+= '    </div>';
    modal+= '    </div>';
    modal+= '</div>';

    $("#modals").html(modal);
    $("#modals").modal({backdrop:'static'});
}
