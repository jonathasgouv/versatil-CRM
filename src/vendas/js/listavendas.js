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
	secondwin.loadFile('src/vendas/editar/editarvenda.html');
	secondwin.show();
	secondwin.webContents.openDevTools();
}

function editar(produto) {
	//alert(client.nome)
	//ipc.send('clientedit', 'ok')
	fs.writeFile('edit.txt', produto.id, function(err) {
		if (err) return console.log(err);
	});
	fs.access('jan.txt', fs.F_OK, (err) => {
		if (err) {
			fs.writeFile('jan.txt', produto.id, function(err) {
				if (err) return console.log(err);
			});
			janela();
		}
	});
}

function editarr(produto) {
	fs.writeFile('edit.txt', produto.id, function(err) {
		if (err) return console.log(err);
	});
}

db.loadJSON(rawdata);
window.vue = require('vue');
// db.loadJSON()
var vendas = db.getCollection('vendas');
console.log(db);
new Vue({
	el      : '#form',
	data    : {
		vendas : []
	},
	mounted : function() {
		this.vendas = vendas.data;
		console.log(this.vendas);
	}
});
