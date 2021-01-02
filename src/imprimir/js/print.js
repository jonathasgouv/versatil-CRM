var fs = require('fs');
var loki = require('lokijs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });
var db = new loki('database' + activeuserid + '.vs');
var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
fs.unlinkSync('edit.txt');
db.loadJSON(rawdata);
var clientes = db.getCollection('clientes');

var elementHTML = document.getElementsByTagName('body');

cliente = clientes.findOne({ id: pesquisa });
nome = document.getElementById('nome');
subtitulo = document.getElementById('subtitulo');
cidade = document.getElementById('cidade');
bairro = document.getElementById('bairro');
rua = document.getElementById('rua');
numero = document.getElementById('numero');
uf = document.getElementById('uf');
obs = document.getElementById('obs');
validade = document.getElementById('validade');
sexo = document.getElementById('sexo');

cpf = cliente.cpf;
telefone = cliente.telefone;
validade = cliente.validade;

subtitulo.innerHTML = cliente.cpf + ' | ' + cliente.telefone + ' | ' + cliente.validade;

nome.innerHTML = cliente.nome;
cep.value = cliente.cep;
cidade.value = cliente.cidade;
bairro.value = cliente.bairro;
rua.value = cliente.rua;
numero.value = cliente.numero;
uf.value = cliente.uf;
obs.value = cliente.obs;
validade.value = cliente.validade;
dependentes.value = cliente.dependentes;

rowss = cliente.dependentes;

function splitLines(t) {
	return t.split(/\r\n|\r|\n/);
}

res = splitLines(rowss);
final = res.length;

if (final > 5) {
	dependentes.rows = final;
}
