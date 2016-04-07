var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var app = express();

var template = (name, description) => `Taco of the Month is ${name}. The ingredients are ${description}`;
 
app.get('/torchys', (req, res) => {
  request('http://torchystacos.com/menu/', (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var $totm = $('#taco-of-the-month').find('.single-menu-item').not('#empty');
      var name = $totm.find('h1').text();
      var description = $totm.find('p').text().toLowerCase();
      var tacoSpecial = template(name, description);

      res.send({
        tacoSpecial,
        timestamp: new Date(),
        restaurant: 'Torchys'
      });

    } else {
      res.send(error || response.statusCode);
    }
  });
});

app.get('/tacodeli', (req, res) => {
  request('http://www.tacodeli.com/menus/dailyspecials-taco-specials-austin/', (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var name = $('.entry-content').find('h3').text().trim();
      var description = $('.entry-content').find('h3').next('p').text().trim();
      var tacoSpecial = template(name, description);

      res.send({
        tacoSpecial,
        timestamp: new Date(),
        restaurant: 'Tacodeli'
      });

    } else {
      res.send(error || response.statusCode);
    }
  });
});
 
var server = app.listen(process.env.PORT || 5000, function(){
  console.log('server is running at %s', server.address().port);
});