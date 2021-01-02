const electron = require('electron');
const remote = electron.remote;
var fs = require('fs');
var loki = require('lokijs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });
var rawdata = fs.readFileSync('database' + activeuserid + '.vs');
var fs = require('fs');
var pesquisa = fs.readFileSync('edit.txt', 'utf8').toString();
fs.unlinkSync('edit.txt');

var db = new loki('database' + activeuserid + '.vs');

db.loadJSON(rawdata);
var clientes = db.getCollection('clientes');

cliente = clientes.findOne({ id: pesquisa });
nome = document.getElementById('nome');
cpf = document.getElementById('cpf');
telefone = document.getElementById('telefone');
cep = document.getElementById('cep');
cidade = document.getElementById('cidade');
bairro = document.getElementById('bairro');
rua = document.getElementById('rua');
numero = document.getElementById('numero');
uf = document.getElementById('uf');
obs = document.getElementById('obs');
validade = document.getElementById('validade');
sexo = document.getElementById('sexo');

nome.value = cliente.nome;
cpf.value = cliente.cpf;
telefone.value = cliente.telefone;
cep.value = cliente.cep;
cidade.value = cliente.cidade;
bairro.value = cliente.bairro;
rua.value = cliente.rua;
numero.value = cliente.numero;
uf.value = cliente.uf;
obs.value = cliente.obs;
validade.value = cliente.validade;
dependentes.value = cliente.dependentes;
sexo.value = cliente.sexo;

function limpa_formulário_cep() {
	//Limpa valores do formulário de cep.
	document.getElementById('rua').value = '';
	document.getElementById('bairro').value = '';
	document.getElementById('cidade').value = '';
	document.getElementById('uf').value = '';
}

function meu_callback(conteudo) {
	if (!('erro' in conteudo)) {
		//Atualiza os campos com os valores.
		document.getElementById('rua').value = conteudo.logradouro;
		document.getElementById('bairro').value = conteudo.bairro;
		document.getElementById('cidade').value = conteudo.localidade;
		document.getElementById('uf').value = conteudo.uf;
	} else {
		//end if.
		//CEP não Encontrado.
		limpa_formulário_cep();
		alert('CEP não encontrado.');
	}
}

function pesquisacep(valor) {
	//Nova variável "cep" somente com dígitos.
	var cep = valor.replace(/\D/g, '');

	//Verifica se campo cep possui valor informado.
	if (cep != '') {
		//Expressão regular para validar o CEP.
		var validacep = /^[0-9]{8}$/;

		//Valida o formato do CEP.
		if (validacep.test(cep)) {
			//Preenche os campos com "..." enquanto consulta webservice.
			document.getElementById('rua').value = '...';
			document.getElementById('bairro').value = '...';
			document.getElementById('cidade').value = '...';
			document.getElementById('uf').value = '...';

			//Cria um elemento javascript.
			var script = document.createElement('script');

			//Sincroniza com o callback.
			script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

			//Insere script no documento e carrega o conteúdo.
			document.body.appendChild(script);
		} else {
			//end if.
			//cep é inválido.
			limpa_formulário_cep();
			alert('Formato de CEP inválido.');
		}
	} else {
		//end if.
		//cep sem valor, limpa formulário.
		limpa_formulário_cep();
	}
}

salvar = document.getElementById('salvar');
salvar.addEventListener('click', function() {
	(cliente.nome = document.getElementById('nome').value),
		(cliente.cpf = document.getElementById('cpf').value),
		(cliente.telefone = document.getElementById('telefone').value),
		(cliente.validade = document.getElementById('validade').value),
		(cliente.cep = document.getElementById('cep').value),
		(cliente.cidade = document.getElementById('cidade').value),
		(cliente.uf = document.getElementById('uf').value),
		(cliente.bairro = document.getElementById('bairro').value),
		(cliente.rua = document.getElementById('rua').value),
		(cliente.numero = document.getElementById('numero').value),
		(cliente.obs = document.getElementById('obs').value),
		(cliente.dependentes = document.getElementById('dependentes').value),
		(cliente.sexo = document.getElementById('sexo').value),
		(cliente.notification = 1),
		clientes.update(cliente);
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
