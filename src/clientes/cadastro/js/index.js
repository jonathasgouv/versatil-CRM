const fs = require('fs');
const loki = require('lokijs');
var dbusers = new loki('users.vs');
var rawdatausers = fs.readFileSync('users.vs');
dbusers.loadJSON(rawdatausers);
activeuserid = dbusers.getCollection('activeusers').findOne({ name: 'activeuser' }).id;
user = dbusers.getCollection('users').findOne({ id: activeuserid });
const electron = require('electron');
const remote = electron.remote;
const datepicker = require('js-datepicker');
const picker = datepicker('#validade', {
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
	var entries = db.getCollection('clientes');
	if (entries === null) {
		entries = db.addCollection('clientes');
	} else {
	}
}

function limpar() {
	document.getElementById('nome').value = '';
	document.getElementById('cpf').value = '';
	document.getElementById('telefone').value = '';
	document.getElementById('validade').value = '';
	document.getElementById('cidade').value = '';
	document.getElementById('uf').value = '';
	document.getElementById('bairro').value = '';
	document.getElementById('rua').value = '';
	document.getElementById('numero').value = '';
	document.getElementById('obs').value = '';
	document.getElementById('dependentes').value = '';
	document.getElementById('cep').value = '';
	document.getElementById('sexo').value = '';
}

function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
		limpar();
	}
}

ready(function() {
	document.getElementById('salvar').addEventListener('click', function(e) {
		e.preventDefault();

		str = document.getElementById('validade').value;
		str = str.toString();
		var clientes = db.getCollection('clientes');
		let data = {
			nome        : document.getElementById('nome').value,
			cpf         : document.getElementById('cpf').value,
			telefone    : document.getElementById('telefone').value,
			validade    : document.getElementById('validade').value,
			cep         : document.getElementById('cep').value,
			cidade      : document.getElementById('cidade').value,
			uf          : document.getElementById('uf').value,
			bairro      : document.getElementById('bairro').value,
			rua         : document.getElementById('rua').value,
			numero      : document.getElementById('numero').value,
			obs         : document.getElementById('obs').value,
			dependentes : document.getElementById('dependentes').value,
			sexo        : document.getElementById('sexo'),
			id          : Date.now().toString()
		};
		clientes.insert(data);
		db.saveDatabase();
		alert('Salvo com sucesso');
		limpar();
	});
});
