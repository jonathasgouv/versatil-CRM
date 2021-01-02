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
db.loadJSON(rawdata);
var clientes = db.getCollection('clientes');
var vendas = db.getCollection('vendas');
var recebimentos = db.getCollection('recebimentos');
var pagamentos = db.getCollection('pagamentos');

anteriores = document.getElementById('anteriores');
per = document.getElementById('per');
const mergeDedupe = (arr) => {
	return [
		...new Set([].concat(...arr))
	];
};

function removeOptions(selectElement) {
	var i,
		L = selectElement.options.length - 1;
	for (i = L; i >= 1; i--) {
		selectElement.remove(i);
	}
}

function isInArray(value, array) {
	return array.indexOf(value) > -1;
}

edit = clientes.data;

function graphtype() {
	selectionclass = document.getElementById('classselector');
	removeOptions(document.getElementById('yearselector'));
	if (selectionclass.value == 'clientes') {
		document.getElementById('showornot').style.visibility = 'hidden';
		per.style.visibility = 'hidden';
		yearlygraphgeneral(clientes);
	} else if (selectionclass.value == 'recebimentos') {
		document.getElementById('textsorn').innerText = 'Mostrar recebidos';
		document.getElementById('showornot').style.visibility = 'visible';
		per.style.visibility = 'visible';
		yearlygraphgeneral(recebimentos, true, 'recebimentos');
	} else if (selectionclass.value == 'pagamentos') {
		document.getElementById('textsorn').innerText = 'Mostrar pagos';
		document.getElementById('showornot').style.visibility = 'visible';
		per.style.visibility = 'visible';
		yearlygraphgeneral(pagamentos, true, 'pagamentos');
	} else if (selectionclass.value == 'rvsp') {
		document.getElementById('textsorn').innerText = 'Mostrar pagos e recebidos';
		document.getElementById('showornot').style.visibility = 'visible';
		per.style.visibility = 'visible';
		yearlygraphversus(pagamentos, recebimentos);
	}
}

var loop = edit.length;

function yearlygraphversus(data1, data2) {
	deleteCanvas();
	removeOptions(document.getElementById('yearselector'));
	years = mergeDedupe([
		getdataother(data1, 'pagamentos')[0],
		getdataother(data2, 'recebimentos')[0]
	]);
	for (var i = 0; i < years.length; i++) {
		currentyear = years[i];
		var option = document.createElement('option');
		option.text = currentyear;
		var select = document.getElementById('yearselector');
		select.appendChild(option);
	}
	ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
		type    : 'bar',
		data    : {
			datasets : [
				{
					label           : 'Pagamentos',
					backgroundColor : 'rgb(241, 45, 45)',
					fill            : false,
					borderColor     : 'rgb(165, 5, 5)',
					data            : getdataother(data1, 'pagamentos')[1],
					type            : 'line'
				},
				{
					label           : 'Recebimentos',
					backgroundColor : 'rgb(3, 187, 28)',
					fill            : false,
					borderColor     : 'rgb(39, 136, 1)',
					data            : getdataother(data2, 'recebimentos')[1],

					// Changes this dataset to become a line
					type            : 'line'
				}
			],
			labels   : mergeDedupe([
				getdataother(data1, 'pagamentos')[0],
				getdataother(data2, 'recebimentos')[0]
			])
		},
		options : {
			scales   : {
				yAxes : [
					{
						ticks : {
							beginAtZero : true,
							callback    : function(value, index, values) {
								return 'R$ ' + number_format(value);
							}
						}
					}
				]
			},
			tooltips : {
				callbacks : {
					label : function(tooltipItem, chart) {
						var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
						return datasetLabel + ': R$ ' + number_format(tooltipItem.yLabel, 2);
					}
				}
			}
		}
	});
}

function getyears(dados) {
	years = [];
	if (anteriores.checked == false) {
		try {
			for (var i = 0; i < dados.length; i++) {
				item = dados[i];
				year = parseInt(item.validade.split('/')[2]);
				if (isInArray(year, years) == false && year >= new Date().getFullYear()) {
					years.push(year);
				}
			}
			return years.sort();
		} catch (error) {
			if (per.checked == false) {
				try {
					for (var i = 0; i < dados.length; i++) {
						item = dados[i];
						year = parseInt(item.datepayment.split('/')[2]);
						if (
							isInArray(year, years) == false &&
							year >= new Date().getFullYear() &&
							item.payed == false
						) {
							years.push(year);
						}
					}
					return years.sort();
				} catch (error) {
					for (var i = 0; i < dados.length; i++) {
						item = dados[i];
						year = parseInt(item.datereceivement.split('/')[2]);
						if (
							isInArray(year, years) == false &&
							year >= new Date().getFullYear() &&
							item.received == false
						) {
							years.push(year);
						}
					}
					return years.sort();
				}
			} else {
				try {
					for (var i = 0; i < dados.length; i++) {
						item = dados[i];
						year = parseInt(item.datepayment.split('/')[2]);
						if (isInArray(year, years) == false && year >= new Date().getFullYear()) {
							years.push(year);
						}
					}
					return years.sort();
				} catch (error) {
					for (var i = 0; i < dados.length; i++) {
						item = dados[i];
						year = parseInt(item.datereceivement.split('/')[2]);
						if (isInArray(year, years) == false && year >= new Date().getFullYear()) {
							years.push(year);
						}
					}
					return years.sort();
				}
			}
		}
	} else {
		if (per.checked == false) {
			try {
				for (var i = 0; i < dados.length; i++) {
					item = dados[i];
					year = parseInt(item.validade.split('/')[2]);
					if (isInArray(year, years) == false) {
						years.push(year);
					}
				}
				return years.sort();
			} catch (error) {
				try {
					for (var i = 0; i < dados.length; i++) {
						item = dados[i];
						year = parseInt(item.datepayment.split('/')[2]);
						if (isInArray(year, years) == false && item.payed == false) {
							years.push(year);
						}
					}
					return years.sort();
				} catch (error) {
					for (var i = 0; i < dados.length; i++) {
						item = dados[i];
						year = parseInt(item.datereceivement.split('/')[2]);
						if (isInArray(year, years) == false && item.received == false) {
							years.push(year);
						}
					}
					return years.sort();
				}
			}
		} else {
			try {
				for (var i = 0; i < dados.length; i++) {
					item = dados[i];
					year = parseInt(item.validade.split('/')[2]);
					if (isInArray(year, years) == false) {
						years.push(year);
					}
				}
				return years.sort();
			} catch (error) {
				try {
					for (var i = 0; i < dados.length; i++) {
						item = dados[i];
						year = parseInt(item.datepayment.split('/')[2]);
						if (isInArray(year, years) == false) {
							years.push(year);
						}
					}
					return years.sort();
				} catch (error) {
					for (var i = 0; i < dados.length; i++) {
						item = dados[i];
						year = parseInt(item.datereceivement.split('/')[2]);
						if (isInArray(year, years) == false) {
							years.push(year);
						}
					}
					return years.sort();
				}
			}
		}
	}
}

function appendyears(date) {
	years = getyears(date);
	for (var i = 0; i < years.length; i++) {
		currentyear = years[i];
		var option = document.createElement('option');
		option.text = currentyear;
		var select = document.getElementById('yearselector');
		select.appendChild(option);
	}
}

function getdataother(dados, classs) {
	counterbyyears = [];
	years = getyears(dados.data);
	item = dados.data;

	if (per.checked == false) {
		if (classs == 'recebimentos') {
			for (var i = 0; i < years.length; i++) {
				currentyear = years[i];
				c = 0;
				for (var j = 0; j < item.length; j++) {
					dados = item[j];
					if (parseInt(dados.datereceivement.split('/')[2]) == currentyear && dados.received == false) {
						c += parseFloat(dados.price);
					}
				}
				counterbyyears.push(c);
			}
		} else if (classs == 'pagamentos') {
			for (var i = 0; i < years.length; i++) {
				currentyear = years[i];
				c = 0;
				for (var j = 0; j < item.length; j++) {
					dados = item[j];
					if (parseInt(dados.datepayment.split('/')[2]) == currentyear && dados.payed == false) {
						c += parseFloat(dados.price);
					}
				}
				counterbyyears.push(c);
			}
		}
	} else {
		if (classs == 'recebimentos') {
			for (var i = 0; i < years.length; i++) {
				currentyear = years[i];
				c = 0;
				for (var j = 0; j < item.length; j++) {
					dados = item[j];
					if (parseInt(dados.datereceivement.split('/')[2]) == currentyear) {
						c += parseFloat(dados.price);
					}
				}
				counterbyyears.push(c);
			}
		} else if (classs == 'pagamentos') {
			for (var i = 0; i < years.length; i++) {
				currentyear = years[i];
				c = 0;
				for (var j = 0; j < item.length; j++) {
					dados = item[j];
					if (parseInt(dados.datepayment.split('/')[2]) == currentyear) {
						c += parseFloat(dados.price);
					}
				}
				counterbyyears.push(c);
			}
		}
	}

	return [
		years,
		counterbyyears
	];
}

function getdata(dados) {
	counterbyyears = [];
	years = getyears(dados.data);
	item = dados.data;
	for (var i = 0; i < years.length; i++) {
		currentyear = years[i];
		c = 0;
		for (var j = 0; j < item.length; j++) {
			dados = item[j];
			if (parseInt(dados.validade.split('/')[2]) == currentyear) {
				c++;
			}
		}

		counterbyyears.push(c);
	}

	return [
		years,
		counterbyyears
	];
}

function yearlygraphgeneral(yearlydata, modifier, classs) {
	if (modifier != true) {
		deleteCanvas();
		removeOptions(document.getElementById('yearselector'));
		appendyears(yearlydata.data);
		ctx = document.getElementById('myChart').getContext('2d');
		var chart = new Chart(ctx, {
			// The type of chart we want to create
			type    : 'bar',

			// The data for our dataset
			data    : {
				labels   : getdata(yearlydata)[0],
				datasets : [
					{
						label           : 'Recebimentos por ano',
						backgroundColor : 'rgb(255, 99, 132)',
						fill            : false,
						borderColor     : 'rgb(255, 99, 132)',
						data            : getdata(yearlydata)[1]
					}
				]
			},

			// Configuration options go here
			options : {
				scales : {
					yAxes : [
						{
							scaleLabel : {
								display     : true,
								labelString : 'Número de clientes'
							}
						}
					]
				}
			}
		});
	} else {
		deleteCanvas();
		removeOptions(document.getElementById('yearselector'));
		appendyears(yearlydata.data);
		if (selectionclass.value == 'pagamentos') {
			nomelabel = 'Pagamentos';
		} else {
			nomelabel = 'Recebimentos';
		}
		ctx = document.getElementById('myChart').getContext('2d');
		var chart = new Chart(ctx, {
			// The type of chart we want to create
			type    : 'bar',

			// The data for our dataset
			data    : {
				labels   : getdataother(yearlydata, classs)[0],
				datasets : [
					{
						label           : nomelabel + ' por ano',
						backgroundColor : 'rgb(255, 99, 132)',
						fill            : false,
						borderColor     : 'rgb(255, 99, 132)',
						data            : getdataother(yearlydata, classs)[1]
					}
				]
			},

			// Configuration options go here
			options : {
				scales   : {
					yAxes : [
						{
							ticks : {
								beginAtZero : true,
								callback    : function(value, index, values) {
									return 'R$ ' + number_format(value);
								}
							}
						}
					]
				},
				tooltips : {
					callbacks : {
						label : function(tooltipItem, chart) {
							var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
							return datasetLabel + ': R$ ' + number_format(tooltipItem.yLabel, 2);
						}
					}
				}
			}
		});
	}
}

function yearlygraph() {
	appendyears(edit);
	ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
		// The type of chart we want to create
		type    : 'bar',

		// The data for our dataset
		data    : {
			labels   : getdata(clientes)[0],
			datasets : [
				{
					label           : 'Renovações por ano',
					backgroundColor : 'rgb(255, 99, 132)',
					fill            : false,
					borderColor     : 'rgb(255, 99, 132)',
					data            : getdata(clientes)[1]
				}
			]
		},

		// Configuration options go here
		options : {
			scales : {
				yAxes : [
					{
						scaleLabel : {
							display     : true,
							labelString : 'Número de clientes'
						}
					}
				]
			}
		}
	});
}

yearlygraph();

var randomColorGenerator = function() {
	return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
};

function number_format(number, decimals, dec_point, thousands_sep) {
	// *     example: number_format(1234.56, 2, ',', ' ');
	// *     return: '1 234,56'
	number = (number + '').replace('.', '').replace(' ', '');
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = typeof thousands_sep === 'undefined' ? '.' : thousands_sep,
		dec = typeof dec_point === 'undefined' ? ',' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {
			var k = Math.pow(10, prec);
			return '' + Math.round(n * k) / k;
		};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split(',');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

function deleteCanvas() {
	canvas = document.getElementById('myChart');
	canvas.parentNode.removeChild(canvas);
	var mycanvas = document.createElement('canvas');
	mycanvas.id = 'myChart';
	document.body.appendChild(mycanvas);
}

function graph() {
	deleteCanvas();
	selectionclass = document.getElementById('classselector');
	ctx = document.getElementById('myChart').getContext('2d');
	selection = document.getElementById('yearselector').value;
	if (selection == 'Anual') {
		if (selectionclass.value == 'clientes') {
			yearlygraphgeneral(clientes);
		} else if (selectionclass.value == 'recebimentos') {
			yearlygraphgeneral(recebimentos, true, 'recebimentos');
		} else if (selectionclass.value == 'pagamentos') {
			yearlygraphgeneral(pagamentos, true, 'pagamentos');
		} else if (selectionclass.value == 'rvsp') {
			yearlygraphversus(pagamentos, recebimentos);
		}
	} else {
		let [
			jan,
			feb,
			march,
			april,
			may,
			june,
			july,
			aug,
			sept,
			oct,
			nov,
			dec
		] = Array(12).fill(0);

		if (selectionclass.value == 'clientes') {
			function getTotal(clientedata) {
				total = [];
				for (var i = 0; i < loop; i++) {
					cliente = clientedata[i];
					year = parseInt(cliente.validade.split('/')[2]);
					if (year == parseInt(selection)) {
						total.push(cliente.validade);
					}
				}
				return total;
			}

			function getY(clientedatayear) {
				let [
					jan,
					feb,
					march,
					april,
					may,
					june,
					july,
					aug,
					sept,
					oct,
					nov,
					dec
				] = Array(12).fill(0);
				for (var j = 0; j < clientedatayear.length; j++) {
					month = parseInt(clientedatayear[j].split('/')[1]);
					if (month == 1) {
						jan++;
					} else if (month == 2) {
						feb++;
					} else if (month == 3) {
						march++;
					} else if (month == 4) {
						april++;
					} else if (month == 5) {
						may++;
					} else if (month == 6) {
						june++;
					} else if (month == 7) {
						july++;
					} else if (month == 8) {
						aug++;
					} else if (month == 9) {
						sept++;
					} else if (month == 10) {
						oct++;
					} else if (month == 11) {
						nov++;
					} else if (month == 12) {
						dec++;
					}
				}
				return [
					jan,
					feb,
					march,
					april,
					may,
					june,
					july,
					aug,
					sept,
					oct,
					nov,
					dec
				];
			}

			var ctx = document.getElementById('myChart').getContext('2d');
			var chart = new Chart(ctx, {
				// The type of chart we want to create
				type    : 'bar',

				// The data for our dataset
				data    : {
					labels   : [
						'Jan',
						'Fev',
						'Mar',
						'Abr',
						'Mai',
						'Jun',
						'Jul',
						'Ago',
						'Set',
						'Out',
						'Nov',
						'Dez'
					],
					datasets : [
						{
							label           : 'Renovações em ' + selection,
							backgroundColor : randomColorGenerator(),
							fill            : false,
							borderColor     : 'rgb(255, 99, 132)',
							data            : getY(getTotal(edit))
						}
					]
				},

				// Configuration options go here
				options : {
					scales : {
						yAxes : [
							{
								scaleLabel : {
									display     : true,
									labelString : 'Número de clientes'
								}
							}
						]
					}
				}
			});
		} else if (selectionclass.value == 'recebimentos') {
			function getTotal(clientedata) {
				total = [];
				if (per.checked == false) {
					for (var i = 0; i < clientedata.length; i++) {
						cliente = clientedata[i];
						yeard = cliente.datereceivement;
						year = parseInt(yeard.split('/')[2]);
						if (year == parseInt(selection) && cliente.received == false) {
							total.push([
								cliente.datereceivement,
								cliente
							]);
						}
					}
					return total;
				} else {
					for (var i = 0; i < clientedata.length; i++) {
						cliente = clientedata[i];
						yeard = cliente.datereceivement;
						year = parseInt(yeard.split('/')[2]);
						if (year == parseInt(selection)) {
							total.push([
								cliente.datereceivement,
								cliente
							]);
						}
					}
					return total;
				}
			}

			function getY(clientedatayear) {
				let [
					jan,
					feb,
					march,
					april,
					may,
					june,
					july,
					aug,
					sept,
					oct,
					nov,
					dec
				] = Array(12).fill(0);
				for (var j = 0; j < clientedatayear.length; j++) {
					month = parseInt(clientedatayear[j][0].split('/')[1]);
					if (month == 1) {
						jan += parseFloat(clientedatayear[j][1].price);
					} else if (month == 2) {
						feb += parseFloat(clientedatayear[j][1].price);
					} else if (month == 3) {
						march += parseFloat(clientedatayear[j][1].price);
					} else if (month == 4) {
						april += parseFloat(clientedatayear[j][1].price);
					} else if (month == 5) {
						may += parseFloat(clientedatayear[j][1].price);
					} else if (month == 6) {
						june += parseFloat(clientedatayear[j][1].price);
					} else if (month == 7) {
						july += parseFloat(clientedatayear[j][1].price);
					} else if (month == 8) {
						aug += parseFloat(clientedatayear[j][1].price);
					} else if (month == 9) {
						sept += parseFloat(clientedatayear[j][1].price);
					} else if (month == 10) {
						oct += parseFloat(clientedatayear[j][1].price);
					} else if (month == 11) {
						nov += parseFloat(clientedatayear[j][1].price);
					} else if (month == 12) {
						dec += parseFloat(clientedatayear[j][1].price);
					}
				}
				return [
					jan,
					feb,
					march,
					april,
					may,
					june,
					july,
					aug,
					sept,
					oct,
					nov,
					dec
				];
			}

			var ctx = document.getElementById('myChart').getContext('2d');
			var chart = new Chart(ctx, {
				// The type of chart we want to create
				type    : 'bar',

				// The data for our dataset
				data    : {
					labels   : [
						'Jan',
						'Fev',
						'Mar',
						'Abr',
						'Mai',
						'Jun',
						'Jul',
						'Ago',
						'Set',
						'Out',
						'Nov',
						'Dez'
					],
					datasets : [
						{
							label           : 'Recebimentos em ' + selection,
							backgroundColor : randomColorGenerator(),
							fill            : false,
							borderColor     : 'rgb(255, 99, 132)',
							data            : getY(getTotal(recebimentos.data))
						}
					]
				},

				// Configuration options go here
				options : {
					scales   : {
						yAxes : [
							{
								ticks : {
									beginAtZero : true,
									callback    : function(value, index, values) {
										return 'R$ ' + number_format(value);
									}
								}
							}
						]
					},
					tooltips : {
						callbacks : {
							label : function(tooltipItem, chart) {
								var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
								return datasetLabel + ': R$ ' + number_format(tooltipItem.yLabel, 2);
							}
						}
					}
				}
			});
		} else if (selectionclass.value == 'pagamentos') {
			function getTotal(clientedata) {
				total = [];
				if (per.checked == false) {
					for (var i = 0; i < clientedata.length; i++) {
						cliente = clientedata[i];
						yeard = cliente.datepayment;
						year = parseInt(yeard.split('/')[2]);
						if (year == parseInt(selection) && cliente.payed == false) {
							total.push([
								cliente.datepayment,
								cliente
							]);
						}
					}
					return total;
				} else {
					for (var i = 0; i < clientedata.length; i++) {
						cliente = clientedata[i];
						yeard = cliente.datepayment;
						year = parseInt(yeard.split('/')[2]);
						if (year == parseInt(selection)) {
							total.push([
								cliente.datepayment,
								cliente
							]);
						}
					}
					return total;
				}
			}

			function getY(clientedatayear) {
				let [
					jan,
					feb,
					march,
					april,
					may,
					june,
					july,
					aug,
					sept,
					oct,
					nov,
					dec
				] = Array(12).fill(0);
				for (var j = 0; j < clientedatayear.length; j++) {
					month = parseInt(clientedatayear[j][0].split('/')[1]);
					if (month == 1) {
						jan += parseFloat(clientedatayear[j][1].price);
					} else if (month == 2) {
						feb += parseFloat(clientedatayear[j][1].price);
					} else if (month == 3) {
						march += parseFloat(clientedatayear[j][1].price);
					} else if (month == 4) {
						april += parseFloat(clientedatayear[j][1].price);
					} else if (month == 5) {
						may += parseFloat(clientedatayear[j][1].price);
					} else if (month == 6) {
						june += parseFloat(clientedatayear[j][1].price);
					} else if (month == 7) {
						july += parseFloat(clientedatayear[j][1].price);
					} else if (month == 8) {
						aug += parseFloat(clientedatayear[j][1].price);
					} else if (month == 9) {
						sept += parseFloat(clientedatayear[j][1].price);
					} else if (month == 10) {
						oct += parseFloat(clientedatayear[j][1].price);
					} else if (month == 11) {
						nov += parseFloat(clientedatayear[j][1].price);
					} else if (month == 12) {
						dec += parseFloat(clientedatayear[j][1].price);
					}
				}
				return [
					jan,
					feb,
					march,
					april,
					may,
					june,
					july,
					aug,
					sept,
					oct,
					nov,
					dec
				];
			}

			var ctx = document.getElementById('myChart').getContext('2d');
			var chart = new Chart(ctx, {
				// The type of chart we want to create
				type    : 'bar',

				// The data for our dataset
				data    : {
					labels   : [
						'Jan',
						'Fev',
						'Mar',
						'Abr',
						'Mai',
						'Jun',
						'Jul',
						'Ago',
						'Set',
						'Out',
						'Nov',
						'Dez'
					],
					datasets : [
						{
							label           : 'Recebimentos em ' + selection,
							backgroundColor : randomColorGenerator(),
							fill            : false,
							borderColor     : 'rgb(255, 99, 132)',
							data            : getY(getTotal(pagamentos.data))
						}
					]
				},

				// Configuration options go here
				options : {
					scales   : {
						yAxes : [
							{
								ticks : {
									beginAtZero : true,
									callback    : function(value, index, values) {
										return 'R$ ' + number_format(value);
									}
								}
							}
						]
					},
					tooltips : {
						callbacks : {
							label : function(tooltipItem, chart) {
								var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
								return datasetLabel + ': R$ ' + number_format(tooltipItem.yLabel, 2);
							}
						}
					}
				}
			});
		} else if (selectionclass.value == 'rvsp') {
			graphversus();
		}
	}
}

function graphversus() {
	function getTotalP(clientedata) {
		total = [];
		if (per.checked == false) {
			for (var i = 0; i < clientedata.length; i++) {
				cliente = clientedata[i];
				yeard = cliente.datepayment;
				year = parseInt(yeard.split('/')[2]);
				if (year == parseInt(selection) && cliente.payed == false) {
					total.push([
						cliente.datepayment,
						cliente
					]);
				}
			}
			return total;
		} else {
			for (var i = 0; i < clientedata.length; i++) {
				cliente = clientedata[i];
				yeard = cliente.datepayment;
				year = parseInt(yeard.split('/')[2]);
				if (year == parseInt(selection)) {
					total.push([
						cliente.datepayment,
						cliente
					]);
				}
			}
			return total;
		}
	}

	function getYP(clientedatayear) {
		let [
			jan,
			feb,
			march,
			april,
			may,
			june,
			july,
			aug,
			sept,
			oct,
			nov,
			dec
		] = Array(12).fill(0);
		for (var j = 0; j < clientedatayear.length; j++) {
			month = parseInt(clientedatayear[j][0].split('/')[1]);
			if (month == 1) {
				jan += parseFloat(clientedatayear[j][1].price);
			} else if (month == 2) {
				feb += parseFloat(clientedatayear[j][1].price);
			} else if (month == 3) {
				march += parseFloat(clientedatayear[j][1].price);
			} else if (month == 4) {
				april += parseFloat(clientedatayear[j][1].price);
			} else if (month == 5) {
				may += parseFloat(clientedatayear[j][1].price);
			} else if (month == 6) {
				june += parseFloat(clientedatayear[j][1].price);
			} else if (month == 7) {
				july += parseFloat(clientedatayear[j][1].price);
			} else if (month == 8) {
				aug += parseFloat(clientedatayear[j][1].price);
			} else if (month == 9) {
				sept += parseFloat(clientedatayear[j][1].price);
			} else if (month == 10) {
				oct += parseFloat(clientedatayear[j][1].price);
			} else if (month == 11) {
				nov += parseFloat(clientedatayear[j][1].price);
			} else if (month == 12) {
				dec += parseFloat(clientedatayear[j][1].price);
			}
		}
		return [
			jan,
			feb,
			march,
			april,
			may,
			june,
			july,
			aug,
			sept,
			oct,
			nov,
			dec
		];
	}

	function getTotalR(clientedata) {
		total = [];
		if (per.checked == false) {
			for (var i = 0; i < clientedata.length; i++) {
				cliente = clientedata[i];
				yeard = cliente.datereceivement;
				year = parseInt(yeard.split('/')[2]);
				if (year == parseInt(selection) && cliente.received == false) {
					total.push([
						cliente.datereceivement,
						cliente
					]);
				}
			}
			return total;
		} else {
			for (var i = 0; i < clientedata.length; i++) {
				cliente = clientedata[i];
				yeard = cliente.datereceivement;
				year = parseInt(yeard.split('/')[2]);
				if (year == parseInt(selection)) {
					total.push([
						cliente.datereceivement,
						cliente
					]);
				}
			}
			return total;
		}
	}

	function getYR(clientedatayear) {
		let [
			jan,
			feb,
			march,
			april,
			may,
			june,
			july,
			aug,
			sept,
			oct,
			nov,
			dec
		] = Array(12).fill(0);
		for (var j = 0; j < clientedatayear.length; j++) {
			month = parseInt(clientedatayear[j][0].split('/')[1]);
			if (month == 1) {
				jan += parseFloat(clientedatayear[j][1].price);
			} else if (month == 2) {
				feb += parseFloat(clientedatayear[j][1].price);
			} else if (month == 3) {
				march += parseFloat(clientedatayear[j][1].price);
			} else if (month == 4) {
				april += parseFloat(clientedatayear[j][1].price);
			} else if (month == 5) {
				may += parseFloat(clientedatayear[j][1].price);
			} else if (month == 6) {
				june += parseFloat(clientedatayear[j][1].price);
			} else if (month == 7) {
				july += parseFloat(clientedatayear[j][1].price);
			} else if (month == 8) {
				aug += parseFloat(clientedatayear[j][1].price);
			} else if (month == 9) {
				sept += parseFloat(clientedatayear[j][1].price);
			} else if (month == 10) {
				oct += parseFloat(clientedatayear[j][1].price);
			} else if (month == 11) {
				nov += parseFloat(clientedatayear[j][1].price);
			} else if (month == 12) {
				dec += parseFloat(clientedatayear[j][1].price);
			}
		}
		return [
			jan,
			feb,
			march,
			april,
			may,
			june,
			july,
			aug,
			sept,
			oct,
			nov,
			dec
		];
	}
	ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
		type    : 'bar',
		data    : {
			datasets : [
				{
					label           : 'Pagamentos',
					backgroundColor : 'rgb(241, 45, 45)',
					fill            : false,
					borderColor     : 'rgb(165, 5, 5)',
					data            : getYP(getTotalP(pagamentos.data)),
					type            : 'line'
				},
				{
					label           : 'Recebimentos',
					backgroundColor : 'rgb(3, 187, 28)',
					fill            : false,
					borderColor     : 'rgb(39, 136, 1)',
					data            : getYR(getTotalR(recebimentos.data)),

					// Changes this dataset to become a line
					type            : 'line'
				}
			],
			labels   : [
				'Jan',
				'Fev',
				'Mar',
				'Abr',
				'Mai',
				'Jun',
				'Jul',
				'Ago',
				'Set',
				'Out',
				'Nov',
				'Dez'
			]
		},
		options : {
			scales   : {
				yAxes : [
					{
						ticks : {
							beginAtZero : true,
							callback    : function(value, index, values) {
								return 'R$ ' + number_format(value);
							}
						}
					}
				]
			},
			tooltips : {
				callbacks : {
					label : function(tooltipItem, chart) {
						var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
						return datasetLabel + ': R$ ' + number_format(tooltipItem.yLabel, 2);
					}
				}
			}
		}
	});
}
