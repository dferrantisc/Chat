$(document).ready(()=>{
	var cor = "";
	var nome = "";
	var conectado = false;
	
	$("#enviar").click(()=>{
		var mensagem = $("#mensagem").val();
		if(mensagem!=""&&conectado){
			if(nome==""){
				connection.send(JSON.stringify({type:"set-name", message:mensagem}));
				nome=mensagem;
			}else{
				connection.send(JSON.stringify({type:"set-message", message:mensagem}));
			}
			$("#mensagem").val("");
		}
	});
	window.Websocket = window.Websocket || window.MozWebSocket;
	var locate = $(location).attr('href');
	var connection = new WebSocket('ws://'+locate.split("/")[2]+':80');

	connection.onerror = function (error){
		console.log(error);
	};
	
	connection.onopen = function(){
		conectado = true;
	};
	
	connection.onmessage = function (message){
		var dados = JSON.parse(message.data);
		if(dados.type=="show-message"){
			mensagens(dados.sender, dados.message, dados.color, dados.side);
			$("#chat").scrollTop($("#chat")[0].scrollHeight);
		}
	};
	
	var mensagens = (nome, mensagem, cor, lado)=>{
		var linha = '<div class="row" style="margin-'+lado+':1-px;">';
		if(lado=='right'){
			linha += '<div class = "col s2">'+
			'<a class="btn-floating btn-small waves-effect waves-light '+
			cor+' lighten-4"></a>'+'</div>'+
			'<div class="col s10 '+cor+' lighten-4 z-depth-2" style="min-height: 30px;">'+
			nome+' diz:<br>'+mensagem+'</div>';
		}else{
			linha += '<div class = "col s10 '+
			cor+' lighten-4 z-depth-2" style="min-height: 30px;">'+
			nome+' diz:<br>'+mensagem+'</div>'+'<div class="col s2">'+
			'<a class="btn-floating btn-small waveseffect waves-light '+
			cor+' lighten-4"></a>'+'</div>';
		}
		linha += '</div>';
		$("#chat").append(linha);
	};
});