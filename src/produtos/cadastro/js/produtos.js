const loki = require('lokijs');
const fs = require('fs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });

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
	var entries = db.getCollection('produtos');
	if (entries === null) {
		entries = db.addCollection('produtos');
	} else {
	}
}

function limpar() {
	document.getElementById('nome').value = '';
	document.getElementById('price').value = '';
	document.getElementById('description').value = '';
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
		var produtos = db.getCollection('produtos');
		let data = {
			nome        : document.getElementById('nome').value,
			price       : document.getElementById('price').value,
			description : document.getElementById('description').value,
			id          : Date.now().toString()
		};
		produtos.insert(data);
		db.saveDatabase();
		alert('Salvo com sucesso');
		limpar();
	});
});
