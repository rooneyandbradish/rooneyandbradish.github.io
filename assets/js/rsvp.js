console.clear(); // <-- keep the console clean on refresh

/* global angular */
(function() {
    'use strict';

    var app = angular.module('weddingApp', ['formly', 'formlyBootstrap']);


    app.controller('RSVPCtrl', function($window, $http, $scope, $anchorScroll, $timeout) {
        var rsvp = this;
        window.rsvp = $scope
        $scope.r = rsvp;
        rsvp.show = false;
        // function assignment
        rsvp.onSubmit = onSubmit;

        // variable assignment
        rsvp.author = {
            name: 'Rich Bradish'
        };

        rsvp.model = {};
        rsvp.options = {};
        rsvp.fields = [];

        console.log($window.location.search)
        var inviteRegex = /\?g=([a-z0-9]+)/;
        if (angular.isDefined($window.location.search) && inviteRegex.test($window.location.search)){
            try {
                var inviteId = inviteRegex.exec($window.location.search)[1];
                $http.get('https://4a2wvla6l6.execute-api.eu-west-1.amazonaws.com/prod/rsvpHandler?inviteId=' + inviteId)
                    .then(
                        function(success) {
                            if (angular.isDefined(success.data) && angular.isDefined(success.data.Items[0])) {
                                rsvp.show = true;
                                rsvp.model = success.data.Items[0].model
                                rsvp.inviteId = inviteId
                                console.log(JSON.stringify(rsvp.model));
                                $timeout(()=>{$anchorScroll("rsvp")},750)
                                rsvp.fields = [
                                    {
                                        className: 'row',
                                        template: '<div><h2>Hi, {{model.name0}}{{model.name1?" & " + model.name1:""}}</h2>{{model.submitted?"Thanks for responding - you can update your response if you like":"Please us know if you can come!"}}</div>'
                                    },
                                    {
                                        className: 'section-label',
                                        template: '<hr /><div><strong>Friday</strong></div>'
                                    },
                                    {
                                        className: 'row',
                                        fieldGroup: [{
                                                className: 'col-xs-6 col-sm-4',
                                                type: 'checkbox',
                                                key: 'fridayDinner',
                                                templateOptions: {
                                                    label: 'Dinner'
                                                }
                                            },
                                            {
                                                className: 'col-xs-6 col-sm-4',
                                                type: 'checkbox',
                                                key: 'fridayBed',
                                                templateOptions: {
                                                    label: 'Bed + Breakfast at YHA'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        className: 'section-label',
                                        template: '<hr /><div><strong>Saturday</strong> (the day of the wedding)</div>'
                                    },
                                    {
                                        className: 'row',
                                        fieldGroup: [{
                                                className: 'col-xs-6 col-sm-4',
                                                type: 'checkbox',
                                                key: 'saturdayCeremony',
                                                templateOptions: {
                                                    label: 'Ceremony + Reception'
                                                }
                                            },
                                            {
                                                className: 'col-xs-6 col-sm-4',
                                                type: 'checkbox',
                                                key: 'saturdayBed',
                                                templateOptions: {
                                                    label: 'Bed + Breakfast at YHA'
                                                }
                                            },
                                        ]
                                    },
                                    {
                                      className:"section-label",
                                      hideExpression: "!model.saturdayCeremony && !model.fridayDinner",
                                      template: "<hr /><div></div>"
                                    },
                                    {
                                        className: 'row',
                                        fieldGroup: [
                                          {
                                                className: 'col-xs-12 col-sm-6',
                                                type: 'checkbox',
                                                key: 'dietaryRequirements',
                                                hideExpression: "!model.saturdayCeremony && !model.fridayDinner",
                                                templateOptions:{
                                                  "label": "Add Dietary Requirements"
                                                }
                                            },
                                          {
                                                className: 'col-xs-12 col-sm-6',
                                                type: 'input',
                                                key: 'dietaryRequirements0',
                                                hideExpression: "!model.saturdayCeremony || !model.dietaryRequirements",
                                                expressionProperties: {
                                                    "templateOptions.label": "model.name1?model.name0:''"
                                                }
                                            },
                                            {
                                                className: 'col-xs-12 col-sm-6',
                                                type: 'input',
                                                key: 'dietaryRequirements1',
                                                hideExpression: "!model.saturdayCeremony || !model.name1 || !model.dietaryRequirements",
                                                expressionProperties: {
                                                    "templateOptions.label": "model.name1"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        className: 'section-label',
                                        template: '<hr /><div><strong>Travel</strong></div>',
                                    },
                                    {
                                        className: 'row',
                                        fieldGroup: [{
                                                className: 'col-xs-12',
                                                type: 'radio',
                                                key: 'travelArrangements',
                                                templateOptions :{
                                                  options:[
                                                    {
                                                      "name":"Car",
                                                      "value":"car"
                                                    },
                                                    {
                                                      "name":"Public Transport",
                                                      "value":"publicTransport"
                                                    }
                                                  ]
                                                }
                                            }
                                        ]
                                    }
                                ];
                            }
                        },
                        function(failure) {
                            rsvp.show = false;
                        }
                    )
            } catch (e) {
                console.log(e)
                rsvp.show = false;
            }
        }



        // function definition
        function onSubmit(data) {
            console.log(data)
            var postBody = {
                model: data,
                inviteId: rsvp.inviteId,
            }
            postBody.model.submitted = true;
            $http.post('https://4a2wvla6l6.execute-api.eu-west-1.amazonaws.com/prod/rsvpHandler', JSON.stringify(postBody))
                .then(
                    function(success) {
                        $scope.submitMessage = "Thanks so much!"
                        console.log($scope);
                    },
                    function(failure) {
                        $scope.submitMessage = "It's all gone horribly wrong - could you just email me the below?"
                        $scope.errorMessage = data
                    }
                )
        }
    });


})();
