console.clear(); // <-- keep the console clean on refresh

/* global angular */
(function() {
  'use strict';

  var app = angular.module('weddingApp', ['formly', 'formlyBootstrap']);
  

  app.controller('RSVPCtrl', ['$location', function($location) {
    var rsvp = this;
    rsvp.show = false;
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
    
	
    if(angular.isDefined($location.search().g)){
	try {				
		rsvp.names = $location.search().g;
		console.log(rsvp.names);
		rsvp.show = true;
	} catch(e){
		rsvp.show = false;
		console.log("JSON parse failed for " + $location.search().g);
	}
    }

    rsvp.fields = [
      {
        className: 'row',
	template: '<div><strong>{{rsvp.names[0]}}{{rsvp.names[1]? " & " + rsvp.names[1]:""}}</strong></div>'
      },
      {
        className: 'section-label',
        template: '<hr /><div><strong>Friday</strong></div>'
      },
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-3',
            type: 'checkbox',
            key: 'fridayDinner',
            templateOptions: {
              label: 'Dinner'
            }
          },
          {
            className: 'col-xs-3',
            type: 'input',
            key: 'cityName',
            templateOptions: {
              label: 'City'
            }
          },
          {
            className: 'col-xs-3',
            type: 'input',
            key: 'zip',
            templateOptions: {
              type: 'number',
              label: 'Zip',
              max: 99999,
              min: 0,
              pattern: '\\d{5}'
            }
          }
        ]
      },
      {
        template: '<hr />'
      },
      {
        type: 'input',
        key: 'otherInput',
        templateOptions: {
          label: 'Other Input'
        }
      },
      {
        type: 'checkbox',
        key: 'otherToo',
        templateOptions: {
          label: 'Other Checkbox'
        }
      }
    ];

    // function definition
    function onSubmit() {
      alert(JSON.stringify(rsvp.model), null, 2);
    }
  }]);

  
})();
