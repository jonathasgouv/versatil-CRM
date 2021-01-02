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
var dbcashier = new loki('cashier' + activeuserid + '.vs');
var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
var rawdatacashier = fs.readFileSync('cashier' + activeuserid + '.vs');
var fs = require('fs');
var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
fs.unlinkSync('edit.txt');
db.loadJSON(rawdata);
dbcashier.loadJSON(rawdatacashier);
var pagamentos = db.getCollection('pagamentos');
var cashier = dbcashier.getCollection('cash');
var moment = require('moment');
var newedit = true;

function isEmpty() {
	if (
		document.getElementById('nome').value == '' ||
		document.getElementById('pricepayment').value == '' ||
		document.getElementById('data').value == '' ||
		document.getElementById('parcelas').value == ''
	) {
		return true;
	} else {
		return false;
	}
}

pagamento = pagamentos.findOne({ id: pesquisa });
caixa = cashier.findOne({ id: 'moneyvalue' });

nome = document.getElementById('nome');
price = document.getElementById('pricepayment');
description = document.getElementById('description');
parcelas = document.getElementById('parcelas');
pago = document.getElementById('pago');

nome.value = pagamento.nome;
price.value = pagamento.price;
data.value = pagamento.datepayment;
description.value = pagamento.description;
parcelas.value = 1;
if (pagamento.payed == true) {
	pago.checked = true;
	newedit = false;
}

valoratual = parseFloat(caixa.money);

salvar = document.getElementById('salvar');
salvar.addEventListener('click', function() {
	if (isEmpty() == false && moment(document.getElementById('data').value, 'DD-MM-YYYY').isValid() == true) {
		resultado = valoratual - parseFloat(price.value);
		pagamento.nome = nome.value;
		pagamento.price = price.value;
		pagamento.description = description.value;
		pagamento.payed = pago.checked;
		pagamento.datepayment = data.value;

		if (pago.checked == true && newedit == true) {
			caixa.money = resultado;
		}

		db.saveDatabase();
		dbcashier.saveDatabase();
		fs.access('database' + activeuserid + '.vs~', fs.F_OK, (err) => {
			if (err) {
			} else {
				fs.rename('database' + activeuserid + '.vs~', 'database' + activeuserid + '.vs', function(err) {
					if (err) console.log('ERROR: ' + err);
				});
			}
		});
		fs.access('cashier' + activeuserid + '.vs~', fs.F_OK, (err) => {
			if (err) {
			} else {
				fs.rename('cashier' + activeuserid + '.vs~', 'cashier' + activeuserid + '.vs~', function(err) {
					if (err) console.log('ERROR: ' + err);
				});
			}
		});
		alert('Salvo com sucesso');
		window = remote.getCurrentWindow();
		window.close();
	} else {
		alert('Preencha as informações necessárias!');
	}
});
