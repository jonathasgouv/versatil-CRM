const electron = require('electron');
var fs = require('fs');
var loki = require('lokijs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });
var db = new loki('database' + activeuserid + '.vs');
var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
const BrowserWindow = electron.remote.BrowserWindow;
//const ipc = electron.ipcRenderer

function janela() {
	var secondwin = new BrowserWindow({
		width          : 800,
		height         : 600,
		frame          : true,
		alwaysOnTop    : true,
		webPreferences : {
			nodeIntegration : true
		}
	});
	secondwin.on('close', function() {
		secondwin = null;
		fs.unlinkSync('jan.txt');
	});
	secondwin.removeMenu();
	secondwin.loadFile('editar.html');
	secondwin.show();
	secondwin.webContents.openDevTools();
}

function editar(client) {
	//alert(client.nome)
	//ipc.send('clientedit', 'ok')
	fs.writeFile('edit.txt', client.id, function(err) {
		if (err) return console.log(err);
	});
	fs.access('jan.txt', fs.F_OK, (err) => {
		if (err) {
			fs.writeFile('jan.txt', client.id, function(err) {
				if (err) return console.log(err);
			});
			janela();
		}
	});
}

function editarr(client) {
	fs.writeFile('edit.txt', client.id, function(err) {
		if (err) return console.log(err);
	});
}

txt = document.getElementById('texto');

search = document.location.href.toString();

function getSecondPart(str) {
	return str.split('#')[1];
}
// use the function:

pesquisa = decodeURI(getSecondPart(search));

db.loadJSON(rawdata);
window.vue = require('vue');
// db.loadJSON()
var clientes = db.getCollection('clientes');
console.log(db);

var searchRegex = new RegExp(pesquisa, 'i');

new Vue({
	el      : '#form',
	data    : {
		clientes : []
	},
	mounted : function() {
		this.clientes = clientes.find({ nome: { $regex: searchRegex } });
		console.log(this.clientes);
	}
});
