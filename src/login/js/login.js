const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
var fs = require('fs');
var loki = require('lokijs');
var db = new loki('users.vs');
var rawdata = fs.readFileSync('users.vs');
var fs = require('fs');
db.loadJSON(rawdata);
var users = db.getCollection('users');

login = document.getElementById('loginbtn');
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

login.addEventListener('click', function() {
	if (users.findOne({ username: document.getElementById('username').value }) != null) {
		user = users.findOne({ username: document.getElementById('username').value });
		if (user.password == document.getElementById('password').value) {
			var entries = db.getCollection('activeusers');
			if (entries == null) {
				entries = db.addCollection('activeusers');
				let data = {
					name : 'activeuser',
					id   : user.id
				};
				entries.insert(data);
				db.saveDatabase();
			} else {
				activeuser = db.getCollection('activeusers').findOne({ name: 'activeuser' });
				activeuser.id = user.id;
				db.saveDatabase();
				fs.access('users.vs~', fs.F_OK, (err) => {
					if (err) {
					} else {
						fs.rename('users.vs~', 'users.vs', function(err) {
							if (err) console.log('ERROR: ' + err);
						});
					}
				});
			}
			window.location = '../index.html';
		} else {
			alert('Senha incorreta!');
		}
	} else {
		alert('Usuário não encontrado!');
	}
});
