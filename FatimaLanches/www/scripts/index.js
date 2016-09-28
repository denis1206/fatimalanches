// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    var host;
    //host = "http://192.168.0.13:7541";
    host = "http://localhost:7541";
    
    function onDeviceReady() {
        $("a[data-role=tab]").each(function () {
            var anchor = $(this);
            anchor.bind("click", function () {
                console.log(anchor.attr("href"));
                $.mobile.changePage(anchor.attr("href"), {
                    transition: "none",
                    changeHash: false
                });
            });
        });

        $("div[data-role=page]").bind("pagebeforeshow", function (e, data) {
            $.mobile.silentScroll(0);
            $.mobile.changePage.defaults.transition = 'slide';
        });
        
        $('#teste').on('click', function () {
            if ($('#number').val() == '') {
                $('#purchase p').html('Digite o número da mesa');
                $("#purchase").popup("open");
            } else {
                if ($('#number').val() <= 0 || $('#number').val() > 12) {
                    $('#purchase p').html('Digite um número entre 1 e 12');
                    $("#purchase").popup("open");
                }else{
                    $.ajax({
                        type: "POST",
                        url: host + "/minhaapi/insertComanda.php?mesa="+$("#number").val(),
                        success: function (result) {
                            listaComandas();
                            $('#purchase p').html('Comanda cadastrada com sucesso!');
                            $("#purchase").popup("open");
                        },
                        error: function (e) {
                            console.log('Error: ' + e.message);
                        }
                    });
                }
            }

            
        });

        function listaComandas(){
            $("#listaComandas").html('');
            
            $.ajax({
                type: "GET",
                url: host + "/minhaapi/getComandas.php",
                dataType: "json",
                crossDomain: true,
                cache: false,
                success: function (result) {
                    var div;
                    $.each(result, function (i, field) {
                        div = "<li>";
                        div += "<a href='#'>";
                        div += "<img src='images/iconePedido.png' />";
                        div += "<h2>Comanda: " + field.idnumber + "</h2>";
                        div += "<p>Mesa: " + field.mesa + "</p>";
                        div += "<p>Status: ";
                        (field.status) ? div += "Aberta" : div += "Fechada";
                        div += "</p>";
                        div += "</a>"
                        div += "</li>";
                        $("#listaComandas").append(div);
                    });
                    $('#listaComandas').listview().listview('refresh');
                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            });
        };

        listaComandas();
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();