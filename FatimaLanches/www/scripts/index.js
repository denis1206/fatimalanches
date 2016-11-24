// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    var host;
    host = "https://stormy-ravine-22148.herokuapp.com/";
    //host = "http://localhost:7541/minhaapi/";

    function onDeviceReady() {

        var idproduto, idprodutocaracteristica, nomeproduto, descricao, idcomanda, iditemcomanda, lista, precoproduto, idsetor = null, valortotal = 0;

        function insertItemComanda(idcomanda, idproduto, datalancamento, horalancamento, descricao, numeromesa, precoduto) {
            $.ajax({
                type: "POST",
                asyc: false,
                url: host + "insertItemComanda.php?idcomanda=" + idcomanda + "&idproduto=" + idproduto + "&datalancamento=" + datalancamento + "&horalancamento=" + horalancamento + "&observacao=" + descricao + "&numeromesa=" + numeromesa + "&precoitem=" + precoproduto,
                success: function (result) {
                    console.log('inseriu!');
                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            });
        }

        $('body').on('click', '.edtComanda', function (e) {
            e.preventDefault();

            $('#idComanda').text($(this).attr('id'));

            $('#numeroMesa').text($(this).attr('mesa'));

            $('#cadastrarPedido, #adicionarProduto').hide();

            $('#verExtrato').attr('editar', 'true');

            $('#valorcomanda, #confirmarEntrega').show();

            $('#atualizarPedido, #confirmarEntrega').show().css('display', 'inline-block');

            var valor = 0;
            
            $.ajax({
                type: "GET",
                url: host + "getItemComanda.php?idcomanda=" + $(this).attr('id'),
                dataType: "json",
                async: false,
                crossDomain: true,
                cache: false,
                success: function (result) {
                    lista = '';

                    $.each(result, function (i, field) {
                        lista += "<li id=" + field.idproduto + " nomeproduto='" + field.descricaoproduto + "' iditemcomanda='" + field.iditemcomanda + "' descricao='" + field.observacao + "' idproduto='" + field.idproduto + "' idprodutocaracteristica='" + field.idprodutocaracteristica + "' precoitem='" + field.valortotalitem + "'>";
                        lista += "<a href=''>";
                        lista += "<h2>" + field.descricaoproduto + "</h2>";
                        if (field.observacao != null || field.observacao != 'undefined'){
                            lista += "<p>" + field.observacao + "</p>";
                        }
                        lista += "<p class='precoItem'>R$: " + field.valortotalitem.slice(0,4) + "</p>";
                        lista += "</a>";
                        lista += "<a href='#' data-icon='delete' id='rmv_" + field.idproduto + "' class='rmvProduto'></a>";
                        lista += "</li>";
                        valor += parseFloat(field.valortotalitem.slice(0,5));
                    });

                    $('#valortotal').text(valor);

                    $('#comandaListview').html(lista);
                    $('#comandaListview').listview().listview('refresh');
                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            });
            
            if ($('#comandaListview li').length != 0) {
                $('.badge').show().html($('#comandaListview li').length);
            }

            $.mobile.changePage("#listaProdutos", { transition: "slideup", changeHash: false });

            $.mobile.changePage("#log", { transition: "slidedown", changeHash: false });
        });
        
        $('body').on('click', '.adcProduto', function (e) {
            e.preventDefault();
           
            idproduto = $(this).attr('id'), nomeproduto = $(this).text(), idsetor = $(this).attr('idsetor'), precoproduto = parseFloat($(this).attr('valorproduto'));

            $('#comandaListview, #atualizarPedido, #cadastrarPedido, #valorcomanda, #confirmarEntrega').hide();
            $("#any").show();
            $('#adicionarProduto').css('display', 'inline-block')
            
            console.log(host + "getCaracteristicaProduto.php?idproduto=" + $(this).attr('id'));
            $.ajax({
                type: "GET",
                url: host + "getCaracteristicaProduto.php?idproduto=" + $(this).attr('id'),
                dataType: "json",
                crossDomain: true,
                asyc: false,
                cache: false,
                success: function (result) {
                    lista = '';
                    lista = "<div data-role='collapsible' data-collapsed='false' data-inset='false' id='divPadrao' idproduto='" + idproduto + "'>";
                    lista += "<h1>" + nomeproduto + "</h1>";
                    $.each(result, function (i, field) {
                        lista += "<div>";
                        lista += "<select id='select" + i + "' data-role='flipswitch' class='flipswitch'>";
                        lista += "<option value='com' selected>COM</option>";
                        lista += "<option value='sem'>SEM</option>";
                        lista += "</select>";
                        lista += "<span id='ingrediente" + i + "'>" + field.descricaocaracteristica + "</span>";
                        lista += "</div>";
                    });
                    lista += "</div>";
                    lista += "<div data-role='collapsible' data-inset='false' id='divAdicional'>";
                    lista += "<h1>Adicional</h1>";
                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            }).done(function () {
                console.log(host + "getAdicional.php?idsetor=" + idsetor);
                $.ajax({
                    type: "GET",
                    async: false,
                    url: host + "getAdicional.php?idsetor=" + idsetor,
                    success: function (result) {
                        $.each(JSON.parse(result), function (i, field) {
                            lista += "<div>";
                            lista += "<select id='adicional" + i + "' data-role='flipswitch' class='flipswitch adicional'>";
                            lista += "<option value='com'>COM</option>";
                            lista += "<option value='sem' selected>SEM</option>";
                            lista += "</select>";
                            lista += "<span id='ingredienteAdicional" + i + "' valoradicional='" + field.valorvenda1 + "'>" + field.descricaoproduto + "</span>";
                            lista += "</div>";
                        });
                        lista += "</div>";
                        $("#any").html(lista).enhanceWithin();
                    },
                    error: function (e) {
                        console.log('Error: ' + e.message);
                    }
                });
            });

            $.mobile.changePage("#log", { transition: "slidedown", changeHash: false });
        });

        $("#confirmarEntrega").on('click', function () {
            $.ajax({
                type: "POST",
                url: host + "confirmaEntrega.php?idcomanda=" + $('#idComanda').text() + "&horaconfirmacao=" + moment().format('HH:mm:ss'),
                async: false,
                success: function (result) {
                    relatorioTempo();
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
                buttonPrompt: 'Pedido confirmado às ' + moment().format('HH:mm:ss') + '!',
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
        });

        $("#verExtrato").on('click', function () {
            if ($(this).attr('editar') == 'true') {
                $('#comandaListview, #atualizarPedido, #confirmarEntrega').show();
                $('#cadastrarPedido, #adicionarProduto, #any').hide();

            }
            else {
                $('#comandaListview, #cadastrarPedido').show();
                $('#cadastrarPedido').css('display', 'inline-block');
                $("#any, #atualizarPedido, #adicionarProduto, #confirmarEntrega").hide();
            }

            $('#valorcomanda').show();

            $.mobile.changePage("#log", { transition: "slidedown", changeHash: false });
        });

        $('#adicionarProduto').on('click', function (e) {
            e.preventDefault();

            var totaladicional, precoadicional, descricao = '';
            totaladicional = 0;

            if($('#valortotal').text() != ''){
                valortotal = parseFloat($('#valortotal').text());
            } else {
                valortotal = 0;
            }
            
            parseFloat(totaladicional);
            parseFloat(valortotal);

            $('#any').find('#divPadrao div').each(function (index) {
                if ($('#select' + index + ' option:selected').text() == "SEM")
                    descricao += 'SEM ' + $('#ingrediente' + index).text().toUpperCase() + ' ';
            });

            $('#any').find('#divAdicional div').each(function (index) {
                if ($('#adicional' + index + ' option:selected').text() == "COM"){
                    descricao += $('#ingredienteAdicional' + index).text().toUpperCase() + ' ';
                    precoadicional = parseFloat($('#ingredienteAdicional' + index).attr('valoradicional'));
                    totaladicional += precoadicional;
                }
            });
            
            totaladicional += precoproduto;
            totaladicional = totaladicional.toFixed(2);

            idcomanda = $('#idComanda').text();

            lista = "<li id=" + idproduto + " nomeproduto='" + nomeproduto + "'descricao='" + descricao + "' idcomanda='" + idcomanda + "' idproduto='" + idproduto + "' iditemcomanda='" + iditemcomanda + "'precoitem = '" + totaladicional + "'>";
            lista += "<a href=''>";
            lista += "<h2>" + nomeproduto + "</h2>";
            lista += "<p>" + descricao + "</p>";
            lista += "<p class='precoItem'>R$ " + totaladicional + "</p>";
            lista += "</a>";
            lista += "<a href='#' data-icon='delete' id='rmv_" + idproduto + "' class='rmvProduto'></a>";
            lista += "</li>";

            $('#comandaListview').append(lista);
            $('#comandaListview').listview().listview('refresh');

            if ($('#comandaListview li').length != 0) {
                $('.badge').show().html($('#comandaListview li').length);
            }

            $('#confirmarEntrega').hide();

            console.log(totaladicional, valortotal);
            valortotal = valortotal + parseFloat(totaladicional);
            $('#valortotal').text(valortotal);

            $.mobile.changePage('#listaProdutos', { 'role': 'page' });

            $('#msg p').html('Item ' + nomeproduto + ' adicionado a comanda!');
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
                buttonPrompt: 'Deseja excluir o item ' + $(this).parent().attr('nomeproduto') + ' da comanda?',
                buttons: {
                    'Sim': {
                        click: function () {
                            $('#' + id).parent().remove();
                            $('#comandaListview').listview().listview('refresh');

                            valortotal = 0;

                            $('#comandaListview').find('li').each(function (index) {
                                valortotal += parseFloat($(this).attr('precoitem'));
                                $('#valortotal').text(valortotal)
                            });


                            if ($('#comandaListview li').length != 0) {
                                $('.badge').show().html($('#comandaListview li').length);
                            } else {
                                $('#valortotal').text('');
                                $('.badge').hide();
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
            $('#atualizarPedido, #confirmarEntrega').hide();
            $('#verExtrato').attr('editar', 'false');

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
                        async: false,
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

                            $('#valortotal').text('');
                            
                            $('#cadastrarPedido').show().css('display', 'inline-block');

                            $('#comandaListview').html('');

                            $('.badge').hide().html('');

                            $("#number").val('').attr("placeholder", "Digite o número da mesa");

                            $("#valor").text('');
                        }
                    });

                    setTimeout(function () {
                        $.mobile.sdCurrentDialog.close();
                    }, 2000);
                }
            }


        });

        $('body').on('click', '#cadastrarPedido', function (e) {
            var id = null;

            e.preventDefault();

            if ($('#comandaListview li').length != 0) {
                $.ajax({
                    type: "POST",
                    url: host + "insertComanda.php?preco="+parseFloat($('#valortotal').text()),
                    async: false,
                    success: function (result) {
                        listaComandas();
                    },
                    error: function (e) {
                        console.log('Error: ' + e.message);
                    }
                });

                $('#comandaListview').find('li').each(function (index) {
                    descricao = '';
                    idprodutocaracteristica = $(this).attr('idprodutocaracteristica');
                    idproduto = $(this).attr('idproduto');
                    descricao = $(this).attr('descricao');
                    iditemcomanda = $(this).attr('iditemcomanda');
                    precoproduto = $(this).attr('precoitem');

                    descricao = encodeURI(descricao);

                    insertItemComanda(idcomanda, idproduto, moment().format('YYYY-MM-DD'), moment().format('HH:mm:ss'), descricao, $('#numeroMesa').text(), precoproduto);
                    
                    //$.ajax({
                    //    type: "POST",
                    //    url: host + "insertItemComanda.php?idcomanda=" + idcomanda + "&idproduto=" + idproduto + "&datalancamento=" + moment().format('YYYY-MM-DD') + "&horalancamento=" + moment().format('HH:mm:ss') + "&observacao=" + descricao + "&numeromesa=" + $('#numeroMesa').text() + "&precoitem=" + precoproduto,
                    //    async: false,
                    //    success: function (result) {
                    //        console.log(host + "insertItemComanda.php?idcomanda=" + idcomanda + "&idproduto=" + idproduto + "&datalancamento=" + moment().format('YYYY-MM-DD') + "&horalancamento=" + moment().format('HH:mm:ss') + "&observacao=" + descricao + "&numeromesa=" + $('#numeroMesa').text() + "&precoitem=" + precoproduto);
                    //    },
                    //    error: function (e) {
                    //        console.log('Error: ' + e.message);
                    //    }
                    //});
                });

                $('#comandaListview').html('');

                $('.badge').hide().html('');

                $.mobile.changePage("#paginaPrincipal", { transition: "slideup", changeHash: false });
                $('<div>').simpledialog2({
                    mode: 'button',
                    headerText: 'Sucesso',
                    headerClose: true,
                    buttonPrompt: 'Pedido cadastrado com sucesso! <br/> Valor Total: R$ ' + $('#valortotal').text(),
                    buttons: {
                        'OK': {
                            click: function () {
                            },
                        }
                    }
                });

                $('#valortotal').text('');

                setTimeout(function () {
                    $.mobile.sdCurrentDialog.close();
                }, 2000);

                $('#comandaListview').find('li').each(function () {
                    $(this).remove();
                });

                listaComandas();
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

        $('#btnTempo').on('click', function (e) {
            e.preventDefault();

            $.mobile.changePage("#relatorioTempo", { transition: "slideup", changeHash: false });

            relatorioTempo();
        });

        $('#btnTop10').on('click', function (e) {
            e.preventDefault();

            $.mobile.changePage("#relatorioTop10", { transition: "slideup", changeHash: false });

            relatorioTop10();
        });

        $('#atualizarPedido').on('click', function (e) {
            var id = null;

            e.preventDefault();

            if ($('#comandaListview li').length != 0) {
                $.ajax({
                    type: "POST",
                    asyc: false,
                    url: host + "deleteItemComanda.php?idcomanda=" + $('#idComanda').text(),
                    success: function (result) {
                    },
                    error: function (e) {
                        console.log('Error: ' + e.message);
                    }
                });

                $('#comandaListview').find('li').each(function (index) {
                    idcomanda = $('#idComanda').text();
                    idprodutocaracteristica = $(this).attr('idprodutocaracteristica');
                    idproduto = $(this).attr('idproduto');
                    descricao = $(this).attr('descricao');
                    precoproduto = $(this).attr('precoitem');

                    console.log(descricao);

                    insertItemComanda(idcomanda, idproduto, moment().format('YYYY-MM-DD'), moment().format('HH:mm:ss'), descricao, $('#numeroMesa').text(), precoproduto);
                                        
                    //$.ajax({
                    //    type: "POST",
                    //    asyc: false,
                    //    url: host + "insertItemComanda.php?idcomanda=" + idcomanda + "&idproduto=" + idproduto + "&datalancamento=" + moment().format('YYYY-MM-DD') + "&horalancamento=" + moment().format('HH:mm:ss') + "&observacao=" + descricao + "&numeromesa=" + $('#numeroMesa').text() + "&precoitem=" + precoproduto,
                    //    success: function (result) {
                    //        console.log('inseriu!',index);
                    //    },
                    //    error: function (e) {
                    //        console.log('Error: ' + e.message);
                    //    }
                    //});
                });

                $.ajax({
                    type: "POST",
                    asyc: false,
                    url: host + "edtComanda.php?idcomanda=" + $('#idComanda').text() + "&preco=" + $('#valortotal').text(),
                    success: function (result) {
                        console.log($('#valortotal').text());
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
                    buttonPrompt: 'Pedido ' + $('#idComanda').text() + ' atualizado com sucesso! <br/> Valor Total: R$ ' + $('#valortotal').text(),
                    buttons: {
                        'OK': {
                            click: function () {
                            },
                        }
                    }
                });

                listaComandas();

                $('#comandaListview').html('');

                $('.badge').hide().html('');

                setTimeout(function () {
                    $(document).trigger('simpledialog', { 'method': 'close' });
                }, 2000);
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

        function listaComandas() {
            $("#listaComandas").html('');

            $.ajax({
                type: "GET",
                url: host + "getComandas.php",
                dataType: "json",
                crossDomain: true,
                cache: false,
                asyc: false,
                success: function (result) {
                    if (result == "") {
                        var div = '<p>Nenhum registro encontrado</p>';
                        $('#comandasAbertas .ui-content').append(div);
                    } else {
                        var div = '';
                        $.each(result, function (i, field) {
                            div += "<li id=" + field.idcomanda + " class='edtComanda' mesa=" + field.numeromesa + ">";
                            div += "<a href='#'>";
                            div += "<img src='images/iconePedido.png' />";
                            div += "<h2>Comanda: " + field.idcomanda + "</h2>";
                            div += "<p><b>Mesa:</b> " + field.numeromesa;
                            div += " - <b>Status:</b> ";
                            (field.status) ? div += "Aberta" : div += "Fechada";
                            div += "</p>";
                            div += "<p><b>VALOR TOTAL: R$</b> ";
                            if (field.valorconsumacaoatual)
                                div += field.valorconsumacaoatual.slice(0,5);
                            div += "</p>";
                            div += "</a>";
                            div += "</li>";
                        });
                        $("#listaComandas").html(div);
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
                async: false,
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
                                collapse += "<ul data-role='listview' data-filter='true' data-sort='true' data-filter-placeholder='Pesquisa' class='produtos' id='" + i + "'>";
                            }
                            collapse += "<li data-icon='plus'><a href='#' id='" + result[i].idproduto + "' class='adcProduto' idsetor='" + result[i].idsetor + "' valorproduto='"+result[i].valorvenda1+"'>" + result[i].descricaoproduto + "</a></li>";
                        }
                        $('#contentProdutos').append(collapse);
                    }
                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            });
        }

        function relatorioTempo() {
            $("#listaTempo").html('');

            $.ajax({
                type: "GET",
                url: host + "getRelatorioTempo.php",
                dataType: "json",
                crossDomain: true,
                cache: false,
                asyc: false,
                success: function (result) {
                    if (result == "") {
                        var div = '<p>Nenhum registro encontrado</p>';
                        $('#listaTempo .ui-content').append(div);
                    } else {
                        var div = '';
                        $.each(result, function (i, field) {
                            div += "<li>";
                            div += "<a href='#'>";
                            div += "<h2>Comanda: " + field.idcomanda + "</h2>";
                            div += "<p><b>Pedido entregue em:</b> " + field.horas + "h:" + field.minutos + "min";
                            div += "</p>";
                            div += "</a>";
                            div += "</li>";
                        });
                        $("#listaTempo").html(div);
                        $('#listaTempo').listview().listview('refresh');
                    }
                },
                error: function (e) {
                    console.log('Error: ' + e.message);
                }
            });
        };

        function relatorioTop10() {
            var resultado = [];

            $.ajax({
                type: "GET",
                url: host + "getVendasProdutos.php",
                dataType: "json",
                crossDomain: true,
                asyc: false,
                cache: false,
                success: function (result) {
                    $.each(result, function (key, value) {
                        resultado.push({ label: value[0], y: parseInt(value[1]) });
                    });

                    var chart = new CanvasJS.Chart("relatorioConteudo",
                    {
                        exportEnabled: true,
                        exportFileName: "Teste...",
                        title: {
                            text: "Top 10 Produtos Mais Vendidos"
                        },
                        animationEnabled: true,
                        data: [{
                            type: "pie",
                            dataPoints: resultado,
                        }]
                    });
                    chart.render();
                },
                error: function () {

                }
            });

            console.log($("#relatorioTop10 div[data-role='header']").height());

            $('#relatorioConteudo').css('height', 'calc(100% - 50px)'); 
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
})();