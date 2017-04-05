console.clear();

/* global angular */
(function() {
    'use strict';

    var app = angular.module('weddingApp', ['formly', 'formlyBootstrap']);


    app.controller('RSVPCtrl', function($window, $http, $scope, $anchorScroll, $timeout) {
        var rsvp = this;
        $scope.r = rsvp;
        rsvp.show = false;

        rsvp.onSubmit = onSubmit;

        rsvp.author = {
            name: 'Rich Bradish'
        };

        rsvp.model = {};
        rsvp.options = {};
        rsvp.fields = [];

        var wordsRegex = /\?rsvp=([a-z]+-[a-z]+)/;
        if (angular.isDefined($window.location.search) && wordsRegex.test($window.location.search)){
            try {
                var wordsId = wordsRegex.exec($window.location.search)[1];
                $http.get('https://4a2wvla6l6.execute-api.eu-west-1.amazonaws.com/prod/rsvpHandler?wordsId=' + wordsId)
                    .then(
                        function(success) {
                            if (angular.isDefined(success.data) && angular.isDefined(success.data.Items[0])) {
                                rsvp.show = true;
                                var data = success.data.Items[0]
                                rsvp.model = data.model;
                                if(data.names){
                                    rsvp.model.name0 = data.names.name0;
                                    rsvp.model.name1 = data.names.name1;
                                }
                                rsvp.inviteId = data.inviteId;
                                console.log(JSON.stringify(rsvp.model));
                                rsvp.fields = [
                                    {
                                        className: 'row',
                                        template: '<div><h2>Hi, {{model.name0}}{{model.name1?" & " + model.name1:""}}</h2>{{model.submitted?"Thanks for responding - you can update your response if you like":"Please let us know if you can come!"}}</div>'
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
                                                className: 'col-xs-12',
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
                                                hideExpression: "(!model.saturdayCeremony && !model.fridayDinner) || !model.dietaryRequirements",
                                                expressionProperties: {
                                                    "templateOptions.label": "model.name1?model.name0:''"
                                                }
                                            },
                                            {
                                                className: 'col-xs-12 col-sm-6',
                                                type: 'input',
                                                key: 'dietaryRequirements1',
                                                hideExpression: "(!model.saturdayCeremony && !model.fridayDinner) || !model.name1 || !model.dietaryRequirements",
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
                                $timeout(()=>{$anchorScroll("rsvp")},750)
                            } else {
                                createSnackBar();
                                showSnackBar("I couldn't find an invite for<br>" + wordsId)
                           }
                        },
                        function(failure) {
                            rsvp.show = false;
                            createSnackBar();
                            showSnackBar("Something went wrong trying to look up<br>" + wordsId)
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
                        $scope.submitSuccess = true
                        console.log($scope);
                    },
                    function(failure) {
                        $scope.submitSuccess = false
                        $scope.errorMessage = data
                    }
                )
        }
    });


})();
