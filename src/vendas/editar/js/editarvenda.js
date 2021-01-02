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
var vendas = db.getCollection('vendas');

function mail() {
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

venda = vendas.findOne({ id: pesquisa });
produto = document.getElementById('produto');
cliente = document.getElementById('cliente');
quantidade = document.getElementById('quant');

produto.value = venda.produto;
cliente.value = venda.cliente;
quantidade.value = venda.quantidade;

salvar = document.getElementById('salvar');
salvar.addEventListener('click', function() {
	var produtos = db.getCollection('produtos');

	pesquisaa = document.getElementById('produto').value;
	product = produtos.findOne({ nome: pesquisaa });

	venda.cliente = cliente.value;
	venda.price = product.price;
	venda.quantidade = quantidade.value;
	venda.produto = produto.value;

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
