const loki = require('lokijs');
const fs = require('fs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });

var moment = require('moment');
const datepicker = require('js-datepicker');
const picker = datepicker('#data', {
	customMonths       : [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro'
	],
	customDays         : [
		'Dom',
		'Seg',
		'Ter',
		'Qua',
		'Qui',
		'Sex',
		'Sab'
	],
	overlayButton      : 'Confirmar',
	overlayPlaceholder : 'Digite um ano',
	minDate            : new Date(Date.now()),
	position           : 'bl',
	formatter          : (input, date, instance) => {
		const value = date.toLocaleDateString();
		input.value = value; // => '1/1/2099'
	}
});

picker.calendarContainer.style.setProperty('font-size', '0.73rem');

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
	var entries = db.getCollection('recebimentos');
	if (entries === null) {
		entries = db.addCollection('recebimentos');
	} else {
	}
}

function limpar() {
	document.getElementById('nome').value = '';
	document.getElementById('pricereceivement').value = '';
	document.getElementById('data').value = '';
	document.getElementById('parcelas').value = '';
	document.getElementById('description').value = '';
}

function isEmpty() {
	if (
		document.getElementById('nome').value == '' ||
		document.getElementById('pricereceivement').value == '' ||
		document.getElementById('data').value == '' ||
		document.getElementById('parcelas').value == ''
	) {
		return true;
	} else {
		return false;
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
	document.getElementById('salvar').addEventListener('click', function(e) {
		e.preventDefault();

		valid = document.getElementById('data').value.split('/');
		valid = valid[0] + '-' + valid[1] + '-' + valid[2];
		parcelas = document.getElementById('parcelas').value;

		if (isEmpty() == false && moment(document.getElementById('data').value, 'DD-MM-YYYY').isValid() == true) {
			if (document.getElementById('parcelas') == 1) {
				var recebimentos = db.getCollection('recebimentos');
				let data = {
					nome            : document.getElementById('nome').value,
					price           : document.getElementById('pricereceivement').value,
					datereceivement : document.getElementById('data').value,
					description     : document.getElementById('description').value,
					notification    : 1,
					received        : false,
					id              : Date.now().toString()
				};
				recebimentos.insert(data);
				db.saveDatabase();
				alert('Salvo com sucesso');
				limpar();
			} else {
				currentdate = moment(document.getElementById('data').value, 'DD-MM-YYYY');
				lastmonth = 0;
				day = parseInt(valid.split('-')[0]);
				var recebimentos = db.getCollection('recebimentos');
				for (var i = 0; i < parseInt(parcelas); i++) {
					currentnewdate = moment(currentdate).add(i, 'M');
					currentnewdate = currentnewdate.format('DD-MM-YYYY');
					currentnewdate = currentnewdate.toString().split('-');
					currentnewdate = currentnewdate[0] + '/' + currentnewdate[1] + '/' + currentnewdate[2];
					let data = {
						nome            :
							document.getElementById('nome').value + ' | Parcela ' + (i + 1) + '/' + parcelas,
						price           : document.getElementById('pricereceivement').value,
						datereceivement : currentnewdate,
						description     : document.getElementById('description').value,
						notification    : 1,
						received        : false,
						id              : Math.random().toString(36).substr(2, 9)
					};
					recebimentos.insert(data);
					db.saveDatabase();
				}
				alert('Salvo com sucesso');
				limpar();
			}
		} else {
			alert('Preencha as informações necessárias!');
		}
	});
});
