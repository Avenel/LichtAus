/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var UI = require('ui');
var Vector2 = require('vector2');
var lights = ["Couch", "Ambilight", "Stehlar", "Stehlal"];
var lightItems = new Array();

for (var i=0; i<lights.length; i++) {
  var itemAus = {
    title: lights[i],
    subtitle: "Licht Aus"
  };
  var itemAn = {
    title: lights[i],
    subtitle: "Licht An"
  };
  
  lightItems[lightItems.length] = itemAus;
  lightItems[lightItems.length] = itemAn;
}


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
      items: lightItems
    }]
  });
  menu.on('select', function(e) {
    console.log("item selected");
    if (e.itemIndex >= 0 && e.itemIndex < 10) {
      var subsplit = e.item.subtitle.split(" ");
      var cmd = subsplit[0] + " " + 
          e.item.title + " " + 
          subsplit[1];
      console.log(cmd);
      sendCommand(cmd);
    } else {
      sendCommand("Licht Couch An");
    }
  });
  menu.show();
});
  
var sendCommand = function(cmd) {
  // Send command
  var connection = new WebSocket('ws://192.168.2.21:54322');
  
  connection.onmessage = function(evt) { 
    // Show splash
    console.log("msg received: " + evt.data);
    var splashCard = new UI.Card({
      title: "Antwort",
      body: evt.data
    });
    splashCard.show();
    connection.close();
  };
  
  connection.onopen = function () {
    connection.send(cmd)
  };
  
};