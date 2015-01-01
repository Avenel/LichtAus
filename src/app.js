/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var UI = require('ui');
var Vector2 = require('vector2');
var lights = [];

// Get Sensors
function getMenuItems() {
  var lightItems = new Array();
  var connection = new WebSocket('ws://192.168.2.21:54322');
  connection.onopen = function () {
    console.log("send request...")
    connection.send('dict'); // Send the message 'Ping' to the server
  };
  
  connection.onmessage = function(evt) {
    var parsedString = evt.data.replace(/\'/g, "\"");
    var data = JSON.parse(parsedString);
    console.log(data);
  
    var name;
    for (name in data) {
      if (data.hasOwnProperty(name)) {
        lights.push(name);
      }
    }
  
    for (var i=0; i<lights.length; i++) {
      var item;
      console.log("light: " + lights[i] + ", " + data[lights[i]]);
      if (data[lights[i]] == "1") {
        item = {
          title: lights[i],
          subtitle: "Licht Aus"
        };
      }
      if (data[lights[i]] == "0") {
        item = {
          title: lights[i],
          subtitle: "Licht An"
        };
      }
      lightItems.push(item);
    }
  
    console.log(lightItems);
    var menu =  createMenu(lightItems);
    menu.show();
  };
};
  
var main = new UI.Card({
  title: 'Licht Aus!',
  icon: 'images/menu_icon.png',
  subtitle: 'Steuere das Licht!',
  body: 'Drücke Select.'
});

main.on('click', 'select', function(e) {
  getMenuItems();
});

main.show();
  
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
    connection.close();
    getMenuItems();
  };
  
  connection.onopen = function () {
    connection.send(cmd)
  };
  
};

function createMenu(items) {
  var menu = new UI.Menu({
    sections: [{
      items: items
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
  return menu;
}