console.clear(); // <-- keep the console clean on refresh

/* global angular */
(function() {
    'use strict';

    var app = angular.module('weddingApp', ['formly', 'formlyBootstrap']);


    app.controller('RSVPCtrl', ['$location', '$http', '$scope', function($location, $http, $scope) {
        var rsvp = this;
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


        if (angular.isDefined($location.search().g)) {
            try {
                var g = $location.search().g;
                console.log($location.search().g);
                $http.get('https://4a2wvla6l6.execute-api.eu-west-1.amazonaws.com/prod/rsvpHandler?inviteId=' + g)
                    .then(
                        function(success) {
                            rsvp.show = true;
                            if (angular.isDefined(success.data)) {
                                rsvp.model = success.data.Items[0].model
                                rsvp.inviteId = g
                                console.log(JSON.stringify(rsvp.model));
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
                                                className: 'col-xs-4',
                                                type: 'checkbox',
                                                key: 'fridayDinner',
                                                templateOptions: {
                                                    label: 'Dinner'
                                                }
                                            },
                                            {
                                                className: 'col-xs-4',
                                                type: 'checkbox',
                                                key: 'fridayBed',
                                                templateOptions: {
                                                    label: 'Bed'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        className: 'section-label',
                                        template: '<hr /><div><strong>Saturday</strong></div>'
                                    },
                                    {
                                        className: 'row',
                                        fieldGroup: [{
                                                className: 'col-xs-4',
                                                type: 'checkbox',
                                                key: 'saturdayCeremony',
                                                templateOptions: {
                                                    label: 'Ceremony'
                                                }
                                            },
                                            {
                                                className: 'col-xs-4',
                                                type: 'checkbox',
                                                key: 'saturdayBreakfast',
                                                templateOptions: {
                                                    label: 'Reception & Wedding Breakfast'
                                                }
                                            },
                                            {
                                                className: 'col-xs-4',
                                                type: 'checkbox',
                                                key: 'saturdayBed',
                                                templateOptions: {
                                                    label: 'Bed'
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        className: 'section-label',
                                        template: 'Dietary Requirements',
                                        hideExpression: "!model.saturdayBreakfast"
                                    },
                                    {
                                        className: 'row',
                                        fieldGroup: [{
                                                className: 'col-xs-6',
                                                type: 'input',
                                                key: 'dietaryRequirements1',
                                                hideExpression: "!model.saturdayBreakfast",
                                                expressionProperties: {
                                                    "templateOptions.label": "model.name1?model.name0:''"
                                                }
                                            },
                                            {
                                                className: 'col-xs-6',
                                                type: 'input',
                                                key: 'dietaryRequirements2',
                                                hideExpression: "!model.saturdayBreakfast || !model.name1",
                                                expressionProperties: {
                                                    "templateOptions.label": "model.name1"
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
                console.log("JSON parse failed for " + $location.search().g);
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
    }]);


})();