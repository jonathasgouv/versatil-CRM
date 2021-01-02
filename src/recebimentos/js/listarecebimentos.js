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
sort = false;

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
	secondwin.loadFile('src/recebimentos/editar/editarrecebimento.html');
	secondwin.show();
	secondwin.webContents.openDevTools();
}

function editar(recebimento) {
	//alert(client.nome)
	//ipc.send('clientedit', 'ok')
	fs.writeFile('edit.txt', recebimento.id, function(err) {
		if (err) return console.log(err);
	});
	fs.access('jan.txt', fs.F_OK, (err) => {
		if (err) {
			fs.writeFile('jan.txt', recebimento.id, function(err) {
				if (err) return console.log(err);
			});
			janela();
		}
	});
}

function editarr(recebimento) {
	fs.writeFile('edit.txt', recebimento.id, function(err) {
		if (err) return console.log(err);
	});
}

function isReceived(recebimento) {
	if (recebimento.received == true) {
		alert(recebimento.nome + ' RECEBIDO');
		document.getElementById('linha').style.backgroundColor = 'green';
	} else {
		document.getElementById('linha').style.backgroundColor = 'green';
	}
}

db.loadJSON(rawdata);
window.vue = require('vue');
// db.loadJSON()
var recebimentos = db.getCollection('recebimentos');
recebimentosdados = recebimentos.data;
console.log(db);

vm = new Vue({
	el      : '#form',
	data    : {
		recebimentos : []
	},
	mounted : function() {
		this.recebimentos = recebimentos.data;
		console.log(this.recebimentos);
	}
});

nomelabel = document.getElementById('nomelabel');
pricelabel = document.getElementById('pricelabel');
descriptionlabel = document.getElementById('descriptionlabel');
datelabel = document.getElementById('datelabel');

nomelabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.recebimentos = recebimentosdados.sort((a, b) =>
			a.nome.localeCompare(b.nome, undefined, { sensitivity: 'base' })
		);
	} else {
		sort = false;
		vm.recebimentos = recebimentosdados
			.sort((a, b) => a.nome.localeCompare(b.nome, undefined, { sensitivity: 'base' }))
			.reverse();
	}
});

descriptionlabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.recebimentos = recebimentosdados.sort((a, b) =>
			a.description.localeCompare(b.description, undefined, { sensitivity: 'base' })
		);
	} else {
		sort = false;
		vm.recebimentos = recebimentosdados
			.sort((a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }))
			.reverse();
	}
});

pricelabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.recebimentos = recebimentos.chain().find({ Id: { $ne: null } }).simplesort('price').data();
	} else {
		sort = false;
		vm.recebimentos = recebimentos.chain().find({ Id: { $ne: null } }).simplesort('price').data().reverse();
	}
});
