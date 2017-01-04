console.clear(); // <-- keep the console clean on refresh

/* global angular */
(function() {
  'use strict';

  var app = angular.module('weddingApp', ['formly', 'formlyBootstrap'], function config() {
  });
  

  app.controller('RSVPCtrl', function RSVPCtrl(formlyVersion) {
    var rsvp = this;
    // function assignment
    rsvp.onSubmit = onSubmit;

    // variable assignment
    rsvp.author = {
      name: 'Rich Bradish'
    };

    rsvp.model = {
      onFriday : false,
      onSaturday : false
    };
    rsvp.options = {
    };
    
    rsvp.fields = [
	{
		className: 'section-label',
		template:  '<hr/><div><strong>Your {{name}}</strong></div>',
		fieldGroup: [
			className: 'col-xs-6',
			type: 'input',
			key: 'guestOne'
		]
	}
    ];

    // function definition
    function onSubmit() {
      alert(JSON.stringify(rsvp.model), null, 2);
    }
  });

  
})();
