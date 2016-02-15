$(function(){

'use strict';

// test is our object

var test = [
  {
    title: 'What is HTML?',
    points: 1,
      answers: [{
      answer: 'Hypertext Markup Language',
      right: true
    },
    {
      answer: 'Objective Programming Language',
      right: false
    },
    {
      answer: 'How To Make Landingpage',
      right: false
    }
  ]},
  {
    title: 'What is CSS?',
    points: 1,
    answers: [{
      answer: 'Censor Sold Solar System',
      right: false
    },
    {
      answer: 'Central Sugar Station',
      right: false
    },
    {
      answer: 'Cascading Style Sheets',
      right: true
    }]
  },
  {
    title: 'What is JavaScript?',
    points: 1,
    answers: [{
      answer: 'Analog of Java with more functions',
      right: false
    },
    {
      answer: 'High-level interpreted programming language',
      right: true
    },
    {
      answer: 'Language of Javas in Star Wars',
      right: false
    }]
  }
];


// sending object to local storage

var preparedTest = JSON.stringify( test );
var localTest = localStorage.setItem( "test", preparedTest );

// and retrieving it

var recievedTest = localStorage.getItem( "test" );
var actualTest = JSON.parse( recievedTest );

// preparing template

var $html = $( '#template' ).html();

var tmpl = _.template( $html );

var content = tmpl({
  data: actualTest
});

// inserting template into DOM

var $form = $( '#test' );
$form.prepend( content );

// test check section

var i, j;
var $inputs = $('input:checkbox');

$inputs.on( 'click', function() {

  $(this).parent().siblings().children().each(function(){

    if ( $(this).attr('disabled') ) {

      $(this).attr('disabled', false);

    } else {

      $(this).attr('disabled', true);
    }
  });
});

var checkResults = function(e) {

  e.preventDefault();
  var rightAnswers = [];

  var getRightAnswers = function() {

    for ( i = 0; i < actualTest.length; i++ ) {

      var testAnswers = actualTest[i].answers;

      for (j = 0; j < testAnswers.length; j++) {

        var currentAnswer = actualTest[i].answers[j].right;
        rightAnswers.push(currentAnswer);

      }
    }
  };

  var givenAnswers = [];

  var getGivenAnswers = function() {


    $inputs.each(function () {

      if ( $(this).prop('checked') ) {

        givenAnswers.push(true);

      } else {

        givenAnswers.push(false);

      }
    });
  };

  var answered = 0;

  var check = function () {

    for (var i = 0; i < rightAnswers.length; i++) {

      if ( rightAnswers[i] === true ) {

        if ( rightAnswers[i] === givenAnswers[i] ) {
          answered++;
        }

      }
    }
  };

  var questionsQuantity = 0;

  var sumQuestions = function () {
    for (var i = 0; i < actualTest.length; i++) {
      questionsQuantity++;
    }

  };

  var passed = 0;
  var testOK= false;

  var testPassed = function () {
    passed = answered /questionsQuantity;
    if ( passed > 0.65 ) {
      testOK = true;
    }
  };

  getRightAnswers();
  console.log('rightAnswers= ', rightAnswers);

  getGivenAnswers();
  console.log('givenAnswers= ', givenAnswers);

  check();
  console.log('answered= ', answered);

  sumQuestions();

  testPassed();
  console.log('passed= ', passed);

  console.log('testOK= ', testOK);


// building modal with test results

  var modal;
  var $body = $( 'body' );

  if ( testOK ){

    modal = ('<div class="mymodal"><div class="mymodal-inner"><h1 class="text-center">You passed the test!</h1><h1 class="text-center">Right is '+
     answered +', from '+ questionsQuantity +'</h1><a class="center-block btn btn-primary" id="exit">Exit</a></div></div>');

  } else {

    modal = ('<div class="mymodal"><div class="mymodal-inner"><h1 class="text-center">You didn\'t pass the test!</h1><h1 class="text-center">Right is '+
     answered +', from '+ questionsQuantity +'</h1><a class="center-block btn btn-primary" id="exit">Exit</a></div></div>');

  }


  $body.append(modal);

  var $exit = $( '#exit' );

  var reset = function() {

    $( 'input:checkbox' ).prop( 'checked', false ).prop( 'disabled', false );
    var $modal = $( '.mymodal' );
    $modal.remove();

    return false;
  };

  $exit.on( 'click', reset );

};

var $checkResults = $( '#check-results' );
$checkResults.on( 'click', checkResults );

});

