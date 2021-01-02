const electron = require('electron');
const remote = electron.remote;
var fs = require('fs');
var loki = require('lokijs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });
var db = new loki('cashier' + activeuserid + '.vs');
var rawdata = fs.readFileSync('cashier' + activeuserid + '.vs');
var fs = require('fs');
var pesquisa = 'moneyvalue';
db.loadJSON(rawdata);
var produtos = db.getCollection('cash');

valor = document.getElementById('value');

caixa = produtos.findOne({ id: pesquisa });

valoratual = parseInt(caixa.money);

adicionar = document.getElementById('adicionar');
adicionar.addEventListener('click', function() {
	caixa.money = valoratual + parseInt(valor.value);

	db.saveDatabase();
	fs.access('cashier' + activeuserid + '.vs', fs.F_OK, (err) => {
		if (err) {
		} else {
			fs.rename('cashier' + activeuserid + '.vs', 'cashier' + activeuserid + '.vs', function(err) {
				if (err) console.log('ERROR: ' + err);
			});
		}
	});

	alert('Salvo com sucesso');
	window = remote.getCurrentWindow();
	window.close();
});

retirar = document.getElementById('retirar');
retirar.addEventListener('click', function() {
	caixa.money = valoratual - parseInt(valor.value);

	db.saveDatabase();
	fs.access('cashier' + activeuserid + '.vs~', fs.F_OK, (err) => {
		if (err) {
		} else {
			fs.rename('cashier' + activeuserid + '.vs~', 'cashier' + activeuserid + '.vs', function(err) {
				if (err) console.log('ERROR: ' + err);
			});
		}
	});

	alert('Salvo com sucesso');
	window = remote.getCurrentWindow();
	window.close();
});
