const electron = require('electron');
const remote = electron.remote;
var fs = require('fs');
var loki = require('lokijs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });
var db = new loki('database' + activeuserid + '.vs');
var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
var fs = require('fs');
var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
fs.unlinkSync('edit.txt');
db.loadJSON(rawdata);
var produtos = db.getCollection('produtos');

produto = produtos.findOne({ id: pesquisa });
nome = document.getElementById('nome');
price = document.getElementById('price');
description = document.getElementById('description');

nome.value = produto.nome;
price.value = produto.price;
description.value = produto.description;

salvar = document.getElementById('salvar');
salvar.addEventListener('click', function() {
	produto.nome = nome.value;
	produto.price = price.value;
	produto.description = description.value;

	db.saveDatabase();
	fs.access('database' + activeuserid + '.vs~', fs.F_OK, (err) => {
		if (err) {
		} else {
			fs.rename('database' + activeuserid + '.vs~', 'database' + activeuserid + '.vs', function(err) {
				if (err) console.log('ERROR: ' + err);
			});
		}
	});

	alert('Salvo com sucesso');
	window = remote.getCurrentWindow();
	window.close();
});
