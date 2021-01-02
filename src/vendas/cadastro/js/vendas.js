const loki = require('lokijs');
const fs = require('fs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });

function mail() {
	var db = new loki('database' + activeuserid + '.vs');
	var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
	db.loadJSON(rawdata);
	var clientes = db.getCollection('clientes');
	var produtos = db.getCollection('produtos');
	clientedata = clientes.data;
	productdata = produtos.data;

	for (let i = 0; i < clientedata.length; i++) {
		let obj = clientedata[i];
		var option = document.createElement('option');
		option.text = obj.validade;
		option.value = obj.nome;
		var select = document.getElementById('clientes');
		select.appendChild(option);
	}

	for (let i = 0; i < productdata.length; i++) {
		let obj = productdata[i];
		var option = document.createElement('option');
		option.text = 'R$ ' + obj.price;
		option.value = obj.nome;
		var select = document.getElementById('produtos');
		select.appendChild(option);
	}
}

mail();

var db = new loki('database' + activeuserid + '.vs', {
	autoload         : true,
	autoloadCallback : databaseInitialize,
	autosave         : true,
	autosaveInterval : 4000 // save every four seconds for our example
});

// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
	// on the first load of (non-existent database), we will have no collections so we can
	//   detect the absence of our collections and add (and configure) them now.
	var entries = db.getCollection('vendas');
	if (entries === null) {
		entries = db.addCollection('vendas');
	} else {
	}
}

function limpar() {
	document.getElementById('produto').value = '';
	document.getElementById('quant').value = '';
	document.getElementById('cliente').value = '';
}

function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(function() {
	document.getElementById('salvar').addEventListener('click', function(e) {
		e.preventDefault();
		var db = new loki('database' + activeuserid + '.vs');
		var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
		db.loadJSON(rawdata);
		var vendas = db.getCollection('vendas');
		var produtos = db.getCollection('produtos');

		pesquisa = document.getElementById('produto').value;
		product = produtos.findOne({ nome: pesquisa });

		let data = {
			produto    : document.getElementById('produto').value,
			quantidade : document.getElementById('quant').value,
			cliente    : document.getElementById('cliente').value,
			price      : product.price,
			id         : Date.now().toString()
		};
		vendas.insert(data);
		db.saveDatabase();
		alert('Salvo com sucesso');
		limpar();
	});
});
