/* global angular */
(function() {
    'use strict';

    var app = angular.module('weddingApp', ['formly', 'formlyBootstrap']);

    app.controller('RSVPCtrl', function($window, $http, $scope, $timeout, $anchorScroll) {
        var checkGuidance = function(){
           var diets = false
           var travel = false
           if(rsvp.model.saturdayCeremony){
               if(rsvp.model.dietaryRequirements){
                    if((!rsvp.model.name1 && !rsvp.model.dietaryRequirements0) ||
                       (rsvp.model.name1 && !rsvp.model.dietaryRequirements0 && !rsvp.model.dietaryRequirements1)){
                        diets = true
                    }
                }
                if(!rsvp.model.travelArrangements){
                    travel = true
                }
               rsvp.guidance = diets ? "Please fill in any dietary requirements" : ""
               rsvp.guidance += diets && travel ? " and " : ""
               rsvp.guidance += travel && !diets ? "Please fill in " : ""
               rsvp.guidance += travel ? "your travel arrangements" : ""
           }
        }
        var scrollToRSVP = function(){
            $timeout(function(){
                $anchorScroll("rsvp")
            },750)
        }
        var rsvp = this;
        var submitSwitch = function(on,fleek){
            rsvp.submitting = on;
            rsvp.submitMessage = fleek;
        }
        submitSwitch(false,"Submit");
        rsvp.show = false;
        rsvp.onSubmit = onSubmit;
        rsvp.author = {
            name: 'Rich Bradish'
        };
        rsvp.model = {};
        rsvp.options = {};
        rsvp.fields = [];

        var wordsRegex = /\?rsvp=([A-Za-z]+-[A-Za-z]+)/;
        if (angular.isDefined($window.location.search) && wordsRegex.test($window.location.search)){
            try {
                var wordsId = wordsRegex.exec($window.location.search)[1].toLowerCase();
                $http.get('https://4a2wvla6l6.execute-api.eu-west-1.amazonaws.com/prod/rsvpHandler?wordsId=' + wordsId)
                    .then(
                        function(success) {
                            if (angular.isDefined(success.data) && angular.isDefined(success.data.Items[0])) {
                                rsvp.show = true;
                                scrollToRSVP();
                                var data = success.data.Items[0]
                                rsvp.model = data.model;
                                if(data.names){
                                    rsvp.model.name0 = data.names.name0;
                                    rsvp.model.name1 = data.names.name1;
                                }
                                rsvp.inviteId = data.inviteId;
                                rsvp.fields = [
                                    {
                                        className: 'row',
                                        template: '<div><h2>Hi, {{model.name0}}{{model.name1? " & " + model.name1 : ""}}</h2>{{model.submitted?"Thanks for responding - you can update your response if you would like":"Please let us know if you can come"}}</div>'
                                    },
                                    {
                                        className: 'row',
                                        fieldGroup: [{
                                                className: 'col-xs-12',
                                                type: 'checkbox',
                                                key: 'saturdayCeremony',
                                                templateOptions: {
                                                    label: "Can you make it?"
                                                },
                                                expressionProperties: {
                                                    "templateOptions.label": function($viewValue, $modelValue, scope) {
                                                        return (scope.model.name1 ? "We" : "I") + "'ll be there!"
                                                    },
                                                    "templateOptions.guidance": function($viewValue, $modelValue, scope) {
                                                        return checkGuidance($viewValue,$modelValue,scope)
                                                    }  
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        className: 'section-label',
                                        hideExpression: '!model.saturdayCeremony',
                                        template: '<hr /><div><strong>Friday</strong> (curry & games)</div>'
                                    },
                                    {
                                        className: 'row',
                                        hideExpression: '!model.saturdayCeremony',
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
                                        hideExpression: '!model.saturdayCeremony',
                                        template: '<hr /><div><strong>Saturday</strong> (the day of the wedding)</div>'
                                    },
                                    {
                                        className: 'row',
                                        hideExpression: '!model.saturdayCeremony',
                                        fieldGroup: [{
                                                className: 'col-xs-6 col-sm-4',
                                                type: 'checkbox',
                                                key: 'saturdayCeremony',
                                                templateOptions: {
                                                    label: 'The wedding',
                                                },
                                                expressionProperties: {
                                                    "templateOptions.disabled": "true"
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
                                      hideExpression: "!model.saturdayCeremony",
                                      template: "<hr /><div></div>"
                                    },
                                    {
                                        className: 'row',
                                        fieldGroup: [
                                          {
                                                className: 'col-xs-12',
                                                type: 'checkbox',
                                                key: 'dietaryRequirements',
                                                hideExpression: "!model.saturdayCeremony",
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
                                                    "templateOptions.label": "model.name1?model.name0:''",
                                                    "templateOptions.required": "model.dietaryRequirements && (!model.name1 || !model.dietaryRequirements1) && model.saturdayCeremony",
                                                    "templateOptions.guidance": function($viewValue, $modelValue, scope) {
                                                        return checkGuidance($viewValue,$modelValue,scope)
                                                    }
                                                }
                                            },
                                            {
                                                className: 'col-xs-12 col-sm-6',
                                                type: 'input',
                                                key: 'dietaryRequirements1',
                                                hideExpression: "!model.saturdayCeremony || !model.name1 || !model.dietaryRequirements",
                                                expressionProperties: {
                                                    "templateOptions.label": "model.name1",
                                                    "templateOptions.required": "model.dietaryRequirements && model.name1 && model.saturdayCeremony && !model.dietaryRequirements0",
                                                    "templateOptions.guidance": function($viewValue, $modelValue, scope) {
                                                        return checkGuidance($viewValue,$modelValue,scope)
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        className: 'section-label',
                                        hideExpression: '!model.saturdayCeremony',
                                        template: '<hr /><div><strong>Travel<sup>*</sup></strong> (best guess)</div>',
                                    },
                                    {
                                        className: 'row',
                                        hideExpression: '!model.saturdayCeremony',
                                        fieldGroup: [{
                                                className: 'col-xs-12',
                                                type: 'radio',
                                                key: 'travelArrangements',
                                                expressionProperties:{
                                                    "templateOptions.required" : "true",
                                                    "templateOptions.guidance": function($viewValue, $modelValue, scope) {
                                                        return checkGuidance($viewValue,$modelValue,scope)
                                                    }
                                                },
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
                rsvp.show = false;
                console.log(e)
            }
        }
        
        
        function onSubmit(data) {
            submitSwitch(true,"Sendy send send");
            for(var i in data){
                console.log(i)
                if(data[i]===""){delete data[i]}
            }
            var postBody = {
                model: data,
                inviteId: rsvp.inviteId,
            }
            postBody.model.submitted = true;
            $http.post('https://4a2wvla6l6.execute-api.eu-west-1.amazonaws.com/prod/rsvpHandler', JSON.stringify(postBody))
                .then(
                    function(success) {
                        submitSwitch(false,"Re-submit");
                        //calculate when they ought to get here:
                        var forFridayDinner = "01/12/2017 07:30 PM";
                        var forFridayBed = "01/12/2017 10:00 PM";
                        var forSaturdayCeremony = "02/12/2017 01:00 PM";
                        //when is it all over
                        var afterTheCeremony = "03/12/2017 02:00 AM"
                        var theMorningAfter = "03/12/2017 12:00 PM"
                        
                        $scope.startDateTimeString = forSaturdayCeremony
                        if(rsvp.model.fridayDinner){
                            $scope.startDateTimeString = forFridayDinner
                        } else if (rsvp.model.fridayBed){
                            $scope.startDateTimeSTring = forFridayBed
                        }
                        $scope.endDateTimeString = afterTheCeremony
                        if(rsvp.model.saturdayBed){
                            $scope.endDateTimeString = theMorningAfter
                        }
                        
                        $scope.isComing = data.saturdayCeremony
                        $scope.submitSuccess = true
                    },
                    function(failure) {
                        submitSwitch(false,"Try again");
                        $scope.submitSuccess = false
                        $scope.errorMessage = data
                    }
                )
        }
    });


})();
