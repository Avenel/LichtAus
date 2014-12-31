/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var UI = require('ui');
var Vector2 = require('vector2');

var main = new UI.Card({
  title: 'Licht Aus!',
  icon: 'images/menu_icon.png',
  subtitle: 'Steuere das Licht!',
  body: 'Drücke Select.'
});

main.show();

main.on('click', 'select', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Couch',
        subtitle: 'Licht Aus'
      }, {
        title: 'Couch',
        subtitle: 'Licht An'
      }]
    }]
  });
  menu.on('select', function(e) {
    if (e.itemIndex == 0) {
      sendCommand("Licht Couch Aus");
    }
    if (e.itemIndex == 1) {
      sendCommand("Licht Couch An");
    }
  });
  menu.show();
});

var sendCommand = function(cmd) {
  // Show splash
  var splashCard = new UI.Card({
    title: "Bitte warten",
    body: "Sende Befehle..."
  });
  splashCard.show();

  // Download data
  var URL = 'http://192.168.2.21';
  var connection = new WebSocket('ws://192.168.2.21:54322');
  connection.onopen = function () {
    connection.send(cmd);
  };
  splashCard.hide();
};
