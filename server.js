const http = require('http');
const url = require('url');
const S = require('string');
var mime = require('mime-types');
const fs = require('fs');
const WebSocket = require('ws');


const server = http.createServer((request, response)=>{
	var  diretorio = __dirname;
	var q = url.parse(request.url, true);
	q.pathname = (q.pathname=="/")?"/chat.html":q.pathname;
	var arquivo = S(q.pathname).splitLeft('/');
	var tipoArquivo = mime.lookup(arquivo[arquivo.length-1]);
	fs.readFile(diretorio+q.pathname, (erro, html)=>{
		if(erro){
			response.writeHeader(404, {'Content-Type':'text/html'});
			response.write("Pagina invalida!");
			response.end();
		}else{
			response.writeHeader(200, {'Content-Type':tipoArquivo});
			response.write(html);
			response.end();
		}
	});
});

server.listen(80);


const wsServer = new WebSocket.Server({server:server});
var users = [];
var colors = ["green", "yellow", "blue", "purple", "pink", "lime", "amber", "orange"];
wsServer.on('connection', (ws)=>{
	var user = {nome:"", cor:colors[Math.floor(Math.random()*colors.length)]};
	users.push(ws);
	ws.on('message', (message)=>{
		console.log('received: %s', message);
		var json = JSON.parse(message);
		if(json.type=="set-name"){
			user.nome = json.message;
			ws.send(JSON.stringify({type:'show-message', message:'Seja Bem Vindo ' + user.nome + '!',
			sender:'Servidor', color:user.cor, side:'right'}));
			users.forEach((each)=>{
				if(each!=ws){
					each.send(JSON.stringify({type:'show-message', message:user.nome + ' entrou no chat!',
					sender:'Sevidor', color:user.cor, side:'right'}));
				}
			});
		}else if(json.type=="set-message"){
			users.forEach((each)=>{
				var side;
				if(each!=ws){
					side = 'right';
				}else{
					side = 'left';
				}
				each.send(JSON.stringify({type:'show-message', message:json.message, sender: user.nome,
				color:user.cor, side:side}));
			});
		}
	});
	ws.send(JSON.stringify({type:'show-message', message:
	'Envie seu nome!', sender:'Servidor', color:'red', side:'right'}));
});