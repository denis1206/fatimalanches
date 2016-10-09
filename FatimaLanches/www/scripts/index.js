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
        //(function ($) {

        //    // Before handling a page change...
        //    $(document).bind("pagebeforechange", function (e, data) {
        //        // If the new page is not being loaded by URL, bail
        //        if (typeof data.toPage !== "string") {
        //            return;
        //        }

        //        // If the new page has a corresponding navbar link, activate its content div
        //        var url = $.mobile.path.parseUrl(data.toPage);
        //        var $a = $("div[data-role='navbar'] a[href='" + url.hash + "']");
        //        if ($a.length) {
        //            // Suppress normal page change handling since we're handling it here for this case
        //            e.preventDefault();
        //        }
        //            // If the new page has a navbar, activate the content div for its active item
        //        else {
        //            $a = $(url.hash + " div[data-role='navbar']").find("a.ui-btn-active");

        //            // Allow normal page change handling to continue in this case so the new page finishes rendering
        //        }

        //        // Show the content div to be activated and hide other content divs for this page
        //        var $content = $($a.attr("href"));
        //        $content.siblings().hide();
        //        $content.show();
        //    });

        //})(jQuery);
        
        $('#teste').on('click', function () {
            if ($('#number').val() == '') {
                $('<div>').simpledialog2({
                    mode: 'button',
                    headerText: 'Atenção',
                    headerClose: true,
                    buttonPrompt: 'Digite o número da mesa',
                    buttons: {
                        'OK': {
                            click: function () {
                            },
                        }
                    },
                });
            } else {
                //if (!$('#number').val().match(/^\d+$/)) { console.log('Não é um número!'); } else { console.log('É um número!'); }
                if ($('#number').val() <= 0 || $('#number').val() > 12) {

                    $('<div>').simpledialog2({
                        mode: 'button',
                        headerText: 'Atenção',
                        headerClose: true,
                        buttonPrompt: 'Digite um número entre 1 e 12',
                        buttons: {
                            'OK': {
                                click: function () {
                                },
                            }
                        },
                    })
                } else {
                    

                    $.ajax({
                        type: "GET",
                        url: host + "/minhaapi/getUltimaComanda.php",
                        dataType: "json",
                        crossDomain: true,
                        cache: false,
                        success: function (result) {
                            $('#numeroMesa').text($("#number").val());
                            $('#idComanda').text(result[0].idcomanda + 1);

                            $.mobile.changePage("#listaProdutos", { transition: "slideup", changeHash: false });
                            $('<div>').simpledialog2({
                                mode: 'button',
                                headerText: 'Atenção',
                                headerClose: true,
                                buttonPrompt: 'Comanda cadastrada com sucesso!',
                                buttons: {
                                    'OK': {
                                        click: function () {
                                        },
                                    }
                                }
                            })
                        }
                    });
                }
            }

            
        });

        var lista = "";

        $('body').on('click', '.adcProduto', function (e) {
            e.preventDefault();

            var id = $(this).attr('id');

            lista = "<li id=" + id + "><a href=''>" + $(this).text() + "</a><a href='#' data-icon='delete' id='rmv_" + id + "' class='rmvProduto'>Purchase album</a></li>";

            $('#comandaListview').append(lista);
            $('#comandaListview').listview().listview('refresh');

            $('#msg p').html('Item adicionado a comanda!');
            $("#msg").popup().popup("open");

            setTimeout(function () {
                $("#msg").popup("close");
            }, 2000);
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
                            collapse += "<li data-icon='plus'><a href='#' id='prod_" + result[i].idproduto + "' class='adcProduto'>" + result[i].descricaoproduto + "</a></li>";
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

        $('#cadastrarPedido').on('click', function (e) {
            var id = null;

            e.preventDefault();

            if ($('#comandaListview li').length != 0) {
                $.ajax({
                        type: "POST",
                        url: host + "/minhaapi/insertComanda.php",
                        success: function (result) {
                            //$.mobile.changePage("#listaProdutos", { transition: "slideup", changeHash: false });
                            //$('<div>').simpledialog2({
                            //    mode: 'button',
                            //    headerText: 'Ateñção',
                            //    headerClose: true,
                            //    buttonPrompt: 'Comanda cadastrada com sucesso!',
                            //    buttons: {
                            //        'OK': {
                            //            click: function () {
                            //            },
                            //        }
                            //    }
                            //})
                            listaComandas();
                        },
                        error: function (e) {
                            console.log('Error: ' + e.message);
                        }
                    });

                $('#comandaListview').find('li').each(function () {
                    id = parseInt($(this).attr('id').replace("prod_", ""));

                    $.ajax({
                        type: "POST",
                        url: host + "/minhaapi/insertItemComanda.php?idcomanda=" + $('#idComanda').text() + "&idproduto=" + id + "&datalancamento=" + moment().format('YYYY-MM-DD') + "&horalancamento=" + moment().format('HH:mm:ss') + "&numeromesa=" + $('#numeroMesa').text(),
                        success: function (result) {
                        },
                        error: function (e) {
                            console.log('Error: ' + e.message);
                        }
                    });

                    $.mobile.changePage("#paginaPrincipal", { transition: "slideup", changeHash: false });
                    $('<div>').simpledialog2({
                        mode: 'button',
                        headerText: 'Sucesso',
                        headerClose: true,
                        buttonPrompt: 'Pedido cadastrado com sucesso!',
                        buttons: {
                            'OK': {
                                click: function () {
                                },
                            }
                        }
                    });

                    $('#comandaListview').find('li').each(function () {
                        $(this).remove();
                    });
                });
            } else {
                $('<div>').simpledialog2({
                    mode: 'button',
                    headerText: 'Atenção',
                    headerClose: true,
                    buttonPrompt: 'A comanda está vazia, adicione um produto!',
                    buttons: {
                        'OK': {
                            click: function () {
                            },
                        }
                    },
                })
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
                    if (result == "") {
                        var div = '<p>Nenhum registro encontrado</p>';
                        $('#comandasAbertas .ui-content').append(div);
                    } else {
                        var div;
                        $.each(result, function (i, field) {
                            div = "<li>";
                            div += "<a href='#'>";
                            div += "<img src='images/iconePedido.png' />";
                            div += "<h2>Comanda: " + field.idcomanda + "</h2>";
                            div += "<p>Mesa: " + field.numeromesa + "</p>";
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