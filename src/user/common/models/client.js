'use strict';

module.exports = function(Client) {
  var names = ['name', 'lastname', 'botName'], i;
  for (i = 0; i < names.length; i++) {
    Client.validatesLengthOf(names[i], { min: 4, message: { min: names[i] + ' is too short' }});
    Client.validatesLengthOf(names[i], { max: 20, message: { max: names[i] + ' is too long' }});
  }

  var validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  Client.validatesFormatOf('botEmail', {with: validEmail, message: 'Must provide a valid email'});

};
