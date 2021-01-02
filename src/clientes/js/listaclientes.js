const electron = require('electron');
const path = require('path');
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
	secondwin.loadFile('src/clientes/editar/editar.html');
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

db.loadJSON(rawdata);

window.vue = require('vue');
// db.loadJSON()
var clientes = db.getCollection('clientes');

clientesdados = clientes.data;

console.log(db);
vm = new Vue({
	el      : '#form',
	data    : {
		clientes : []
	},
	mounted : function() {
		this.clientes = clientesdados;
		console.log(this.clientes);
	}
});

nomelabel = document.getElementById('nomelabel');
validadelabel = document.getElementById('validadelabel');
cidadelabel = document.getElementById('cidadelabel');
bairrolabel = document.getElementById('bairrolabel');
rualabel = document.getElementById('rualabel');
obslabel = document.getElementById('obslabel');

function custom_sort(a, b) {
	split1 = a.validade.split('/');
	split2 = b.validade.split('/');
	date1 = split1[2] + '/' + split1[1] + '/' + split1[0];
	date2 = split2[2] + '/' + split2[1] + '/' + split2[0];
	return new Date(date1).getTime() - new Date(date2).getTime();
}

nomelabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.clientes = clientesdados.sort((a, b) => a.nome.localeCompare(b.nome, undefined, { sensitivity: 'base' }));
	} else {
		sort = false;
		vm.clientes = clientesdados
			.sort((a, b) => a.nome.localeCompare(b.nome, undefined, { sensitivity: 'base' }))
			.reverse();
	}
});

validadelabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.clientes = clientesdados.sort(custom_sort);
	} else {
		sort = false;
		vm.clientes = clientesdados.sort(custom_sort).reverse();
	}
});

cidadelabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.clientes = clientesdados.sort((a, b) =>
			a.cidade.localeCompare(b.cidade, undefined, { sensitivity: 'base' })
		);
	} else {
		sort = false;
		vm.clientes = clientesdados
			.sort((a, b) => a.cidade.localeCompare(b.cidade, undefined, { sensitivity: 'base' }))
			.reverse();
	}
});

bairrolabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.clientes = clientesdados.sort((a, b) =>
			a.bairro.localeCompare(b.bairro, undefined, { sensitivity: 'base' })
		);
	} else {
		sort = false;
		vm.clientes = clientesdados
			.sort((a, b) => a.bairro.localeCompare(b.bairro, undefined, { sensitivity: 'base' }))
			.reverse();
	}
});

rualabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.clientes = clientesdados.sort((a, b) => a.rua.localeCompare(b.rua, undefined, { sensitivity: 'base' }));
	} else {
		sort = false;
		vm.clientes = clientesdados
			.sort((a, b) => a.rua.localeCompare(b.rua, undefined, { sensitivity: 'base' }))
			.reverse();
	}
});

obslabel.addEventListener('click', function() {
	if (sort == false) {
		sort = true;
		vm.clientes = clientesdados.sort((a, b) => a.obs.localeCompare(b.obs, undefined, { sensitivity: 'base' }));
	} else {
		sort = false;
		vm.clientes = clientesdados
			.sort((a, b) => a.obs.localeCompare(b.obs, undefined, { sensitivity: 'base' }))
			.reverse();
	}
});
