const electron = require('electron');
const { Notification } = require('electron');
const remote = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const Darkmode = require('darkmode-js');
var loki = require('lokijs');
var fs = require('fs');
var nodemailer = require('nodemailer');
var path = require('path');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });

darkmode = new Darkmode({
	bottom           : '64px', // default: '32px'
	right            : 'unset', // default: '32px'
	left             : '32px', // default: 'unset'
	time             : '0.5s', // default: '0.3s'
	mixColor         : '#e5e5e5', // default: '#fff'
	backgroundColor  : '#e5e5e5', // default: '#fff'
	buttonColorDark  : '#100f2c', // default: '#100f2c'
	buttonColorLight : '#fff', // default: '#fff'
	saveInCookies    : false, // default: true,
	label            : '🌓', // default: ''
	autoMatchOsTheme : true // default: true
});

darkmode.showWidget();

function sleepFor(sleepDuration) {
	var now = new Date().getTime();
	while (new Date().getTime() < now + sleepDuration) {
		/* do nothing */
	}
}

function callNotification(cliente) {
	let iconAddress = path.join(__dirname, '/icon.png');
	let texto = 'Atenção! O contrato de ' + cliente.nome + ' expira em ' + cliente.validade + '.';
	const notif = {
		title : 'Contrato acabando',
		body  : texto,
		icon  : iconAddress
	};
	new electron.remote.Notification(notif).show();
}

function mailer(cliente, tempo) {
	var transporter = nodemailer.createTransport({
		service : 'gmail',
		auth    : {
			user : '',
			pass : ''
		}
	});

	var mailOptions = {
		from    : '',
		to      : '',
		subject : 'Atenção! Contrato de ' + cliente.nome + ' expirando.',
		text    :
			'O contrato de ' +
			cliente.nome +
			' expira em ' +
			tempo +
			' dias. Confira mais informações no eu ERM. \nNome: ' +
			cliente.nome +
			'\nValidade: ' +
			cliente.validade +
			'\nTelefone: ' +
			cliente.telefone
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

fs.access('database' + activeuserid + '.vs', fs.F_OK, (err) => {
	if (err) {
		fs.writeFile('database' + activeuserid + '.vs', '', function(err) {
			if (err) return console.log(err);
		});
		aw;
	}
	var db = new loki('database' + activeuserid + '.vs');
	var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
	db.loadJSON(rawdata);
	var entries = db.getCollection('clientes');
	if (entries === null) {
		entries = db.addCollection('clientes');
		db.saveDatabase();
		var dbcaixa = new loki('database' + activeuserid + '.vs');
		var rawdatacaixa = fs.readFileSync('database' + activeuserid + '.vs');
		dbcaixa.loadJSON(rawdatacaixa);
	}

	var entries = db.getCollection('produtos');
	if (entries === null) {
		entries = db.addCollection('produtos');
		db.saveDatabase();
		var dbcaixa = new loki('database' + activeuserid + '.vs');
		var rawdatacaixa = fs.readFileSync('database' + activeuserid + '.vs');
		dbcaixa.loadJSON(rawdatacaixa);
	}

	var entries = db.getCollection('recebimentos');
	if (entries === null) {
		entries = db.addCollection('recebimentos');
		db.saveDatabase();
		var dbcaixa = new loki('database' + activeuserid + '.vs');
		var rawdatacaixa = fs.readFileSync('database' + activeuserid + '.vs');
		dbcaixa.loadJSON(rawdatacaixa);
	}

	var entries = db.getCollection('vendas');
	if (entries === null) {
		entries = db.addCollection('vendas');
		db.saveDatabase();
		var dbcaixa = new loki('database' + activeuserid + '.vs');
		var rawdatacaixa = fs.readFileSync('database' + activeuserid + '.vs');
		dbcaixa.loadJSON(rawdatacaixa);
	}

	var entries = db.getCollection('pagamentos');
	if (entries === null) {
		entries = db.addCollection('pagamentos');
		db.saveDatabase();
		var dbcaixa = new loki('database' + activeuserid + '.vs');
		var rawdatacaixa = fs.readFileSync('database' + activeuserid + '.vs');
		dbcaixa.loadJSON(rawdatacaixa);
	}
});

fs.access('cashier' + activeuserid + '.vs', fs.F_OK, (err) => {
	if (err) {
		fs.writeFile('cashier' + activeuserid + '.vs', '', function(err) {
			if (err) return console.log(err);
		});
	}
	var dbcaixa = new loki('cashier' + activeuserid + '.vs');
	var rawdatacaixa = fs.readFileSync('cashier' + activeuserid + '.vs');
	dbcaixa.loadJSON(rawdatacaixa);
	var entries = dbcaixa.getCollection('cash');
	if (entries === null) {
		entries = dbcaixa.addCollection('cash');
		let data = {
			money : '',
			id    : 'moneyvalue'
		};
		entries.insert(data);
		dbcaixa.saveDatabase();
		var dbcaixa = new loki('cashier' + activeuserid + '.vs');
		var rawdatacaixa = fs.readFileSync('cashier' + activeuserid + '.vs');
		dbcaixa.loadJSON(rawdatacaixa);
	}
});

var jan = false;
var printJS = require('print-js');

fs.access('jan.txt', fs.F_OK, (err) => {
	if (err) {
	}
	fs.unlinkSync('jan.txt');
});

fs.access('edit.txt', fs.F_OK, (err) => {
	if (err) {
	}
	fs.unlinkSync('edit.txt');
});

function janela(url, width, height) {
	if (width != null && height != null) {
		if (jan == false) {
			jan = true;
			fs.writeFile('jan.txt', '', function(err) {
				if (err) return console.log(err);
			});
			var secondwin = new BrowserWindow({
				width          : width,
				height         : height,
				frame          : true,
				alwaysOnTop    : true,
				webPreferences : {
					nodeIntegration : true,
					webviewTag      : true
				}
			});
			secondwin.on('close', function() {
				secondwin = null;
				jan = false;
				fs.unlinkSync('jan.txt');
			});
			secondwin.removeMenu();
			secondwin.loadFile(url);
			secondwin.show();
			secondwin.webContents.openDevTools();
		}
	} else {
		if (jan == false) {
			jan = true;
			fs.writeFile('jan.txt', '', function(err) {
				if (err) return console.log(err);
			});
			var secondwin = new BrowserWindow({
				width          : 800,
				height         : 600,
				frame          : true,
				alwaysOnTop    : true,
				webPreferences : {
					nodeIntegration : true,
					webviewTag      : true
				}
			});
			secondwin.on('close', function() {
				secondwin = null;
				jan = false;
				fs.unlinkSync('jan.txt');
			});
			secondwin.removeMenu();
			secondwin.loadFile(url);
			secondwin.show();
			secondwin.webContents.openDevTools();
		}
	}
}

view = document.getElementById('centerview');
pesquisa = document.getElementById('pesquisa');

incio = document.getElementById('inicio');
cadastro = document.getElementById('cadastro');
produtos = document.getElementById('produtos');
vendas = document.getElementById('vendas');
recebimentos = document.getElementById('recebimentos');
pagamentos = document.getElementById('pagamentos');
graficos = document.getElementById('graficos');

btnmaximize = document.getElementById('maximize');
btnclose = document.getElementById('close');
btnminimize = document.getElementById('minimize');
btnedit = document.getElementById('editar');
btndelete = document.getElementById('deletar');
btnnovo = document.getElementById('novo');
btnpesquisa = document.getElementById('search');
btnpŕint = document.getElementById('print');
btncaixa = document.getElementById('caixa');
btnlogout = document.getElementById('logout');

btncaixa.addEventListener('click', function() {
	janela('src/caixa/caixa.html', 500, 150);
});

str = document.location.href;
str = str.replace('index.html', '');

btnedit.addEventListener('click', function() {
	currentview = view.src.replace(str, '');
	if (currentview == 'clientes/lista-clientes.html' || currentview.includes('pesquisa.html') == true) {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				fs.access('edit.txt', fs.F_OK, (err) => {
					if (err) {
					} else {
						janela('src/clientes/editar/editar.html');
					}
				});
			}
		});
	} else if (currentview == 'produtos/produtos.html') {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				fs.access('edit.txt', fs.F_OK, (err) => {
					if (err) {
					} else {
						janela('src/produtos/editar/editarproduto.html');
					}
				});
			}
		});
	} else if (currentview == 'vendas/vendas.html') {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				fs.access('edit.txt', fs.F_OK, (err) => {
					if (err) {
					} else {
						janela('src/vendas/editar/editarvenda.html');
					}
				});
			}
		});
	} else if (currentview == 'pagamentos/pagamentos.html') {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				fs.access('edit.txt', fs.F_OK, (err) => {
					if (err) {
					} else {
						janela('src/pagamentos/editar/editarpagamento.html');
					}
				});
			}
		});
	} else if (currentview == 'recebimentos/recebimentos.html') {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				fs.access('edit.txt', fs.F_OK, (err) => {
					if (err) {
					} else {
						janela('src/recebimentos/editar/editarrecebimento.html');
					}
				});
			}
		});
	}
});

btnnovo.addEventListener('click', function() {
	currentview = view.src.replace(str, '');
	if (currentview == 'clientes/lista-clientes.html' || currentview.includes('pesquisa.html') == true) {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				janela('src/clientes/cadastro/cadastro-clientes.html');
			}
		});
	} else if (currentview == 'produtos/produtos.html') {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				janela('src/produtos/cadastro/cadastro-produtos.html');
			}
		});
	} else if (currentview == 'vendas/vendas.html') {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				janela('src/vendas/cadastro/cadastro-vendas.html');
			}
		});
	} else if (currentview == 'pagamentos/pagamentos.html') {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				janela('src/pagamentos/cadastro/cadastro-pagamentos.html');
			}
		});
	} else if (currentview == 'recebimentos/recebimentos.html') {
		fs.access('jan.txt', fs.F_OK, (err) => {
			if (err) {
				janela('src/recebimentos/cadastro/cadastro-recebimentos.html');
			}
		});
	}
});

btndelete.addEventListener('click', function() {
	currentview = view.src.replace(str, '');
	if (currentview == 'clientes/lista-clientes.html' || currentview.includes('pesquisa.html') == true) {
		fs.access('edit.txt', fs.F_OK, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			var confirmar = confirm('Tem certeza que deseja deletar esse cadastro?');
			if (confirmar == true) {
				var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
				fs.unlinkSync('edit.txt');
				var db = new loki('database' + activeuserid + '.vs');
				var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
				db.loadJSON(rawdata);
				var clientes = db.getCollection('clientes');
				clientes.chain().find({ id: pesquisa }).remove();
				db.saveDatabase();
				location.reload();
			}
		});
	} else if (currentview == 'produtos/produtos.html') {
		fs.access('edit.txt', fs.F_OK, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			var confirmar = confirm('Tem certeza que deseja deletar esse cadastro?');
			if (confirmar == true) {
				var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
				fs.unlinkSync('edit.txt');
				var db = new loki('database' + activeuserid + '.vs');
				var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
				db.loadJSON(rawdata);
				var produtos = db.getCollection('produtos');
				produtos.chain().find({ id: pesquisa }).remove();
				db.saveDatabase();
				view.src = 'produtos/produtos.html';
			}
		});
	} else if (currentview == 'vendas/vendas.html') {
		fs.access('edit.txt', fs.F_OK, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			var confirmar = confirm('Tem certeza que deseja deletar esse cadastro?');
			if (confirmar == true) {
				var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
				fs.unlinkSync('edit.txt');
				var db = new loki('database' + activeuserid + '.vs');
				var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
				db.loadJSON(rawdata);
				var vendas = db.getCollection('vendas');
				vendas.chain().find({ id: pesquisa }).remove();
				db.saveDatabase();
				view.src = 'vendas/vendas.html';
			}
		});
	} else if (currentview == 'pagamentos/pagamentos.html') {
		fs.access('edit.txt', fs.F_OK, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			var confirmar = confirm('Tem certeza que deseja deletar esse cadastro?');
			if (confirmar == true) {
				var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
				fs.unlinkSync('edit.txt');
				var db = new loki('database' + activeuserid + '.vs');
				var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
				db.loadJSON(rawdata);
				var pagamentos = db.getCollection('pagamentos');
				pagamentos.chain().find({ id: pesquisa }).remove();
				db.saveDatabase();
				view.src = 'pagamentos/pagamentos.html';
			}
		});
	} else if (currentview == 'recebimentos/recebimentos.html') {
		fs.access('edit.txt', fs.F_OK, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			var confirmar = confirm('Tem certeza que deseja deletar esse cadastro?');
			if (confirmar == true) {
				var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
				fs.unlinkSync('edit.txt');
				var db = new loki('database' + activeuserid + '.vs');
				var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
				db.loadJSON(rawdata);
				var recebimentos = db.getCollection('recebimentos');
				recebimentos.chain().find({ id: pesquisa }).remove();
				db.saveDatabase();
				view.src = 'recebimentos/recebimentos.html';
			}
		});
	}
});

btnpŕint.addEventListener('click', function() {
	if (jan == false) {
		jan = true;
		fs.writeFile('jan.txt', '', function(err) {
			if (err) return console.log(err);
		});
		var secondwin = new BrowserWindow({
			width          : 800,
			height         : 600,
			frame          : true,
			alwaysOnTop    : true,
			show           : false,
			webPreferences : {
				nodeIntegration : true
			}
		});
		secondwin.on('close', function() {
			secondwin = null;
			jan = false;
			fs.unlinkSync('jan.txt');
		});
		secondwin.removeMenu();
		secondwin.loadFile('src/imprimir/print.html');
		secondwin.hide();
		secondwin.webContents.on('did-finish-load', () => {
			// Use default printing options
			secondwin.webContents
				.printToPDF({})
				.then((data) => {
					fs.writeFile('src/print.pdf', data, (error) => {
						if (error) throw error;
						pathh = str.replace('file:///', '');
						printJS({ printable: pathh + 'print.pdf', type: 'pdf', showModal: false });
						secondwin.close();
					});
				})
				.catch((error) => {
					console.log(error);
				});
		});
	}
});

btnmaximize.addEventListener('click', function() {
	var window = remote.getCurrentWindow();
	if (window.isMaximized() == true) {
		window.unmaximize();
	} else {
		window.maximize();
	}
});

btnclose.addEventListener('click', function() {
	var window = remote.getCurrentWindow();
	window.close();
});

btnminimize.addEventListener('click', function() {
	var window = remote.getCurrentWindow();
	window.minimize();
});

btnpesquisa.addEventListener('click', function() {
	pesquisa.style.visibility = 'visible';
	pesquisa.focus();
});

categorias = [
	inicio,
	cadastro,
	produtos,
	vendas,
	recebimentos,
	pagamentos,
	graficos
];

function resetar() {
	inicio.className = 'nav-group-item';
	cadastro.className = 'nav-group-item';
	produtos.className = 'nav-group-item';
	vendas.className = 'nav-group-item';
	recebimentos.className = 'nav-group-item';
	pagamentos.className = 'nav-group-item';
	graficos.className = 'nav-group-item';
}

inicio.addEventListener('click', function() {
	view.src = 'clientes/lista-clientes.html';
	resetar();
	incio.className = 'nav-group-item active';
});

cadastro.addEventListener('click', function() {
	view.src = 'cadastro.html';
	resetar();
	cadastro.className = 'nav-group-item active';
});

vendas.addEventListener('click', function() {
	view.src = 'vendas/vendas.html';
	resetar();
	vendas.className = 'nav-group-item active';
});

produtos.addEventListener('click', function() {
	view.src = 'produtos/produtos.html';
	resetar();
	produtos.className = 'nav-group-item active';
});

pagamentos.addEventListener('click', function() {
	view.src = 'pagamentos/pagamentos.html';
	resetar();
	pagamentos.className = 'nav-group-item active';
});

recebimentos.addEventListener('click', function() {
	view.src = 'recebimentos/recebimentos.html';
	resetar();
	recebimentos.className = 'nav-group-item active';
});

graficos.addEventListener('click', function() {
	view.src = 'graficos/graficos.html';
	resetar();
	graficos.className = 'nav-group-item active';
});

pesquisa.addEventListener('blur', function() {
	pesquisa.style.visibility = 'hidden';
});

function pesquisar() {
	var evt = new CustomEvent('keyup');
	evt.which = 13;
	evt.keyCode = 13;
	pesquisa.dispatchEvent(evt);
	view.src = 'clientes/pesquisa/pesquisa.html#' + pesquisa.value;
}

function mail() {
	var db = new loki('database.db');
	var rawdata = fs.readFileSync('database.db');
	db.loadJSON(rawdata);
	var clientes = db.getCollection('clientes');
	teste = clientes.data;

	for (let i = 0; i < teste.length; i++) {
		let obj = teste[i];
		validade = obj.validade;
		let id = obj.id;
		res = validade.split('/');
		validade = res[2] + '-' + res[1] + '-' + res[0];

		// To set two dates to two variables
		var date1 = new Date();
		var date2 = new Date(validade);

		// To calculate the time difference of two dates
		var Difference_In_Time = date2.getTime() - date1.getTime();

		// To calculate the no. of days between two dates
		var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

		//To display the final no. of days (result)
		if (Difference_In_Days < 90) {
			//callNotification(obj);
			//mailer(obj, Difference_In_Days.toFixed(0))
		}
	}
}

// Create our number formatter.
var formatter = new Intl.NumberFormat('pt-BR', {
	style    : 'currency',
	currency : 'BRL'
});

async function caixa() {
	var dbcaixa = new loki('cashier' + activeuserid + '.vs');
	var rawdatacaixa = fs.readFileSync('cashier' + activeuserid + '.vs');
	dbcaixa.loadJSON(rawdatacaixa);
	var entries = dbcaixa.getCollection('cash');
	var pesquisa = 'moneyvalue';
	caixa = entries.findOne({ id: pesquisa });
	document.getElementById('caixavalor').innerText = formatter.format(caixa.money);
}

document.addEventListener(
	'DOMContentLoaded',
	function() {
		mail();
		setInterval(caixa, 100);
	},
	false
);
