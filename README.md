# VersatilCRM - VCRM
** Version 1.0.0 **

VersatilCRM is a complete multi-user CRM that can be used to manage customers, sales, payments and receipts with different databases for each user. VersatilCRM uses all the data generated to create graphs that show a historical and future overview of the company's situation.

## Table of Contents
* [Getting Started](#getting-started)
* [Installing](#installing)
* [Built With](#built-with)
* [Author](#author)
* [License](#license)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installing
```bash
$ git clone https://github.com/jonathasgouv/versatil-CRM.git
$ cd versatil-CRM/
$ npm install
$ npm start
```
And that's it, your CRM is running.

## Overview
### User-based system
VersatilCRM supports different users at the same local machine, with tottaly separated databases.

### Customer base
You can store as much customers as you want, with all informations needed. If your customer has a contract with a expiration date you can store it too, and when the time is coming the app will notify you about it.

### Product base
You can store the products you sell and their prices.

### Sales register
You can register your sales, and if necessary, link it directly to one of the customers and one of the previously registered products.

### Record of receipts
You can record all receipts that you have to receive in the future and mark them as received when you are paid.

### Cashier
Every time you mark an amount as paid or received, that amount is added to or removed from the cashier. You can also click on the cashier and add or remove values ​​manually.

### Graphs
The program generates a series of graphs about your company's current, past and future situation. For example:

* Customer contract expiration graph
* Revenue graph
* Debt graph
* Comparative graph between income and debt

All charts can be viewed annually or month by month.

## Built With
* [Javascript](https://www.javascript.com/)
* [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML/HTML5)
* [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
* [Photon](http://photonkit.com/)
* [Node.js](https://nodejs.org/en/)
* [Electron.js](https://www.electronjs.org/)
* [Lokijs](https://github.com/techfort/LokiJS)
* [Vue.js](https://vuejs.org/)

## Author
* [Jônathas Gouveia](https://github.com/jonathasgouv/)

## License
This project is licensed under the  GPL-3.0 License - see the [LICENSE](https://github.com/jonathasgouv/versatil-CRM/blob/master/LICENSE) file for details
