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
                            $('#purchase p').html('Comanda cadastrada com sucesso!');
                            $("#purchase").popup("open");
                            listaComandas();
                        },
                        error: function (e) {
                            console.log('Error: ' + e.message);
                        }
                    });
                }
            }

            
        });

        var lista = "";

        $('body').on('click', '.adcProduto', function (e) {
            e.preventDefault();

            var id = $(this).attr('id');

            lista = "<li><a href='#'>" + $(this).text() + "</a><a href='#' data-icon='delete' id='rmv_" + id + "' class='rmvProduto'>Purchase album</a></li>";

            $('#comandaListview').append(lista);
            $('#comandaListview').listview().listview('refresh');
        });

        $('body').on('click', '.rmvProduto', function (e) {
            e.preventDefault();

            var id = $(this).attr('id');

            $('<div>').simpledialog2({
                mode: 'button',
                headerText: 'Confirmação',
                headerClose: true,
                buttonPrompt: 'Deseja excluir o item ' +  $(this).prev().text() + ' da comanda?',
                buttons: {
                    'Sim': {
                        click: function () {
                            $('#' + id).parent().remove();
                            $('#comandaListview').listview().listview('refresh');
                        },
                        icon: "delete",
                        theme: "c"
                    },
                    'Não': {
                        click: function () {
                        },
                    }
                }
            })
        });

        function listaProdutoSetor() {
            $.ajax({
                type: "GET",
                url: host + "/minhaapi/getProdutoSetor.php",
                dataType: "json",
                crossDomain: true,
                cache: false,
                success: function (result) {
                    if (result == ""){
                        var collapse = '<p>Nenhum registro encontrado</p>';
                        $('#contentProdutos').append(collapse);

                    } else {
                        var categoria = null;
                        var collapse = "";
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].nome != categoria) {
                                if (i != 0) {
                                    collapse += "</ul>"
                                    collapse += "</div>";
                                }
                                categoria = result[i].nome;
                                collapse += "<div data-role='collapsible' data-iconpos='right' data-theme='b'>";
                                collapse += "<h3>" + categoria + "</h3>";
                                collapse += "<ul data-role='listview' data-filter='true' data-filter-placeholder='Pesquisa'>";
                            }
                            collapse += "<li data-icon='plus'><a href='#' id='" + result[i].idproduto + "' class='adcProduto'>" + result[i].descricaoproduto + "</a></li>";
                        }
                        $('#contentProdutos').append(collapse);
                    }
                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            });
        }

        listaProdutoSetor();

        function listaComandas(){
            $("#listaComandas").html('');
            
            $.ajax({
                type: "GET",
                url: host + "/minhaapi/getComandas.php",
                dataType: "json",
                crossDomain: true,
                cache: false,
                success: function (result) {
                    if (result == "") {
                        var div = '<p>Nenhum registro encontrado</p>';
                        $('#comandasAbertas .ui-content').append(div);
                    } else {
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
                    }
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