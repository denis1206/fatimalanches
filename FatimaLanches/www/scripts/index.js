// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    var host;
    //host = "https://stormy-ravine-22148.herokuapp.com/";
    host = "http://localhost:7541/minhaapi/";
    
    function onDeviceReady() {

        var lista = null;

        $('body').on('click', '.edtComanda', function (e) {
            e.preventDefault();

            $('#idComanda').text($(this).attr('id'));

            $('#numeroMesa').text($(this).attr('mesa'));

            $('#cadastrarPedido').hide();

            $('#atualizarPedido').show().css('display', 'inline-block');

            $.ajax({
                type: "GET",
                url: host + "getItemcomanda.php?idcomanda="+$(this).attr('id'),
                dataType: "json",
                crossDomain: true,
                cache: false,
                success: function (result) {
                    lista = '';

                    $.each(result, function (i, field) {
                        lista += "<li id=" + field.idproduto + "><a href=''>" + field.descricaoproduto + "</a><a href='#' data-icon='delete' id='rmv_" + field.idproduto + "' class='rmvProduto'></a></li>";
                    });

                    $('#comandaListview').html(lista);
                    $('#comandaListview').listview().listview('refresh');
                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            });
            
            $.mobile.changePage("#listaProdutos", { transition: "slideup", changeHash: false });

            $.mobile.changePage("#log", { transition: "slidedown", changeHash: false });

            //$('#comandaListview').find('li').each(function () {
            //    id = parseInt($(this).attr('id').replace("prod_", ""));

            //    $.ajax({
            //        type: "POST",
            //        url: host + "insertItemComanda.php?idcomanda=" + $('#idComanda').text() + "&idproduto=" + id + "&datalancamento=" + moment().format('YYYY-MM-DD') + "&horalancamento=" + moment().format('HH:mm:ss') + "&numeromesa=" + $('#numeroMesa').text(),
            //        success: function (result) {
            //        },
            //        error: function (e) {
            //            console.log('Error: ' + e.message);
            //        }
            //    });

            //    $.mobile.changePage("#paginaPrincipal", { transition: "slideup", changeHash: false });
            //});


        });

        $('body').on('click', '.adcProduto', function (e) {
            e.preventDefault();

            var itemcomanda = null, idproduto = $(this).attr('id'), produto = $(this).text();

            $('#comandaListview').hide();

            $.ajax({
                type: "GET",
                url: host + "getUltimoItemComanda.php",
                dataType: "json",
                crossDomain: true,
                cache: false,
                success: function (result) {
                    $.each(result, function (i, field) {
                        itemcomanda = field.iditemcomanda;
                    });
                    
                },
                error: function () {

                }
            });
            
            $.ajax({
                type: "GET",
                url: host + "getCaracteristicaProduto.php?idproduto=" + $(this).attr('id'),
                dataType: "json",
                crossDomain: true,
                cache: false,
                success: function (result) {
                    itemcomanda++;
                    lista = '';
                    lista = "<div data-role='collapsible' data-collapsed='false' data-inset='false' id='teste' itemcomanda='" + itemcomanda + "' idproduto='"+idproduto+"'>";
                    lista += "<h1>" + produto + "</h1>";
                    $.each(result, function (i, field) {
                        //lista += "<li>";
                        lista += "<div idprodutocaracteristica='"+field.id+"'>";
                        lista += "<select id='select" + i + "' data-role='flipswitch' class='flipswitch'>";
                        lista += "<option value='com' selected>COM</option>";
                        lista += "<option value='sem'>SEM</option>";
                        lista += "</select>";
                        lista += "<span id='ingrediente" + i + "'>" + field.descricaocaracteristica + "</span>";
                        lista += "</div>";
                        //lista += "</li>";
                    });
                    lista += "</div>";
                    lista += "<div data-role='collapsible' data-inset='false'>";
                    lista += "<h1>Adicional</h1>";
                    lista += "</div>";
                    $("#any").html(lista).enhanceWithin();
                    //$('#comandaListview').listview().listview('refresh');

                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            });

            $.mobile.changePage("#log", { transition: "slidedown", changeHash: false });

            //var id = $(this).attr('id');

            //lista = "<li id=" + id + "><a href=''>" + $(this).text() + "</a><a href='#' data-icon='delete' id='rmv_" + id + "' class='rmvProduto'>Purchase album</a></li>";


            //$('#comandaListview').append(lista);
            //$('#comandaListview').listview().listview('refresh');

            //if ($('#comandaListview li').length != 0){
            //    $('.badge').show().html($('#comandaListview li').length);
            //}

            //$('#msg p').html('Item ' + $(this).text() + ' adicionado a comanda!');
            //$("#msg").popup().popup("open");

            //setTimeout(function () {
            //    $("#msg").popup("close");
            //}, 1000);
        });

        $('#adicionarProduto').on('click', function (e) {
            e.preventDefault();

            $('#any').find('.ui-collapsible-content div').each(function (index) {
                if ($('#select' + index + ' option:selected').text() == "SEM")
                    console.log('ID Produto Caracteristica: ' + $("[idprodutocaracteristica]").attr('idprodutocaracteristica'), 'Descrição ' + $('#select' + index + ' option:selected').text() + ' ' + $('#ingrediente' + index).text().toUpperCase(), 'ID Comanda ' + $('#idComanda').text(), 'ID Produto: ' + $("[idproduto]").attr('idproduto') + ' Item Comanda: ' + $("[itemcomanda]").attr('itemcomanda'));
            });
            
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

                            if ($('#comandaListview li').length != 0) {
                                $('.badge').show().html($('#comandaListview li').length);
                            } else {
                                $('.badge').hide();
                                $.mobile.sdCurrentDialog.close();
                            }
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

        $('#criarPedido').on('click', function () {
            $('#atualizarPedido').hide();

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
                        url: host + "getUltimaComanda.php",
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
                            });

                            console.log('Criou e limpou!');

                            $('#cadastrarPedido').show().css('display', 'inline-block');

                            $('#comandaListview').html('');

                            $('.badge').hide().html('');
                        }
                    });

                    setTimeout(function () {
                        $.mobile.sdCurrentDialog.close();
                    }, 2000);
                }
            }


        });

        $('#cadastrarPedido').on('click', function (e) {
            var id = null;

            e.preventDefault();

            if ($('#comandaListview li').length != 0) {
                $.ajax({
                    type: "POST",
                    url: host + "insertComanda.php",
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
                        url: host + "insertItemComanda.php?idcomanda=" + $('#idComanda').text() + "&idproduto=" + id + "&datalancamento=" + moment().format('YYYY-MM-DD') + "&horalancamento=" + moment().format('HH:mm:ss') + "&numeromesa=" + $('#numeroMesa').text(),
                        success: function (result) {
                        },
                        error: function (e) {
                            console.log('Error: ' + e.message);
                        }
                    });
                });

                $('#comandaListview').html('');

                $('.badge').hide().html('');

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

                setTimeout(function () {
                    $.mobile.sdCurrentDialog.close();
                }, 2000);

                $('#comandaListview').find('li').each(function () {
                    $(this).remove();
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

            setTimeout(function () {
                $.mobile.sdCurrentDialog.close();
            }, 2000);
        });

        $('#atualizarPedido').on('click', function (e) {
            var id = null;

            e.preventDefault();

            if ($('#comandaListview li').length != 0) {
                $.ajax({
                    type: "POST",
                    url: host + "deleteItemComanda.php?idcomanda="+$('#idComanda').text(),
                    success: function (result) {
                    },
                    error: function (e) {
                        console.log('Error: ' + e.message);
                    }
                });

                $('#comandaListview').find('li').each(function () {
                    id = parseInt($(this).attr('id').replace("prod_", ""));

                    $.ajax({
                        type: "POST",
                        url: host + "insertItemComanda.php?idcomanda=" + $('#idComanda').text() + "&idproduto=" + id + "&datalancamento=" + moment().format('YYYY-MM-DD') + "&horalancamento=" + moment().format('HH:mm:ss') + "&numeromesa=" + $('#numeroMesa').text(),
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

                    $('#comandaListview').html('', function () {
                        console.log('Limpou');
                    });

                    $('.badge').hide().html('');

                    setTimeout(function () {
                        $(document).trigger('simpledialog', { 'method': 'close' });
                    }, 2000);

                    
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
                });
            }

            setTimeout(function () {
                $.mobile.sdCurrentDialog.close();
            }, 2000);
        });
        
        function listaComandas(){
            $("#listaComandas").html('');
            
            $.ajax({
                type: "GET",
                url: host + "getComandas.php",
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
                            div = "<li id=" + field.idcomanda +" class='edtComanda' mesa="+ field.numeromesa +">";
                            div += "<a href='#'>";
                            div += "<img src='images/iconePedido.png' />";
                            div += "<h2>Comanda: " + field.idcomanda + "</h2>";
                            div += "<p>Mesa: " + field.numeromesa + "</p>";
                            div += "<p>Status: ";
                            (field.status) ? div += "Aberta" : div += "Fechada";
                            div += "</p>";
                            div += "</a>";
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

        function listaProdutoSetor() {
            $.ajax({
                type: "GET",
                url: host + "getProdutoSetor.php",
                dataType: "json",
                crossDomain: true,
                cache: false,
                success: function (result) {
                    if (result == "") {
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
                                collapse += "<ul data-role='listview' data-filter='true' data-sort='true' data-filter-placeholder='Pesquisa'>";
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

        listaComandas();

        listaProdutoSetor();


    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();