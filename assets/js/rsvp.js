console.clear(); // <-- keep the console clean on refresh

/* global angular */
(function() {
  'use strict';

  var app = angular.module('weddingApp', ['formly', 'formlyBootstrap']);
  

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
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-6',
            type: 'input',
            key: 'firstName',
            templateOptions: {
              label: 'First Name'
            }
          },
          {
            className: 'col-xs-6',
            type: 'input',
            key: 'lastName',
            templateOptions: {
              label: 'Last Name'
            },
            expressionProperties: {
              'templateOptions.disabled': '!model.firstName'
            }
          }
        ]
      },
      {
        className: 'section-label',
        template: '<hr /><div><strong>Friday</strong></div>'
      },
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-2',
            type: 'label',
            key: 's',
            templateOptions: {
              label: 'Street'
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
  });

  
})();
