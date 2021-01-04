const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const loki = require('lokijs');
const fs = require('fs');

loginbtn = document.getElementById('loginbtn');
btnmaximize = document.getElementById('maximize');
btnclose = document.getElementById('close');
btnminimize = document.getElementById('minimize');

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

function ValidateEmail(inputText) {
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (inputText.value.match(mailformat)) {
		return true;
	} else {
		alert('Endereço de email inválido!');
		return false;
	}
}

var db = new loki('users.vs', {
	autoload         : true,
	autoloadCallback : databaseInitialize,
	autosave         : true,
	autosaveInterval : 4000 // save every four seconds for our example
});

// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
	// on the first load of (non-existent database), we will have no collections so we can
	//   detect the absence of our collections and add (and configure) them now.
	var entries = db.getCollection('users');
	if (entries === null) {
		entries = db.addCollection('users');
	} else {
	}
}

function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(function() {
	document.getElementById('loginbtn').addEventListener('click', function(e) {
		if (ValidateEmail(document.getElementById('email')) == true) {
			e.preventDefault();
			if (document.getElementById('password').value == document.getElementById('passwordredo').value) {
				var db = new loki('users.vs');
				var rawdata = fs.readFileSync('users.vs');
				db.loadJSON(rawdata);
				var users = db.getCollection('users');

				let data = {
					username : document.getElementById('username').value,
					password : document.getElementById('password').value,
					email    : document.getElementById('email').value,
					id       : Date.now().toString()
				};
				users.insert(data);
				db.saveDatabase();
				alert('Salvo com sucesso');
				window.location = 'login.html';
			} else {
				alert('As senhas não combinam!');
			}
		}
	});
});
