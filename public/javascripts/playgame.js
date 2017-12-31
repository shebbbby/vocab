
function addClass(elements, myClass) {

  // if there are no elements, we're done
  if (!elements) { return; }

  // if we have a selector, get the chosen elements
  if (typeof(elements) === 'string') {
    elements = document.querySelectorAll(elements);
  }

  // if we have a single DOM element, make it an array to simplify behavior
  else if (elements.tagName) { elements=[elements]; }

  // add class to all chosen elements
  for (var i=0; i<elements.length; i++) {

    // if class is not already found
    if ( (' '+elements[i].className+' ').indexOf(' '+myClass+' ') < 0 ) {

      // add class
      elements[i].className += ' ' + myClass;
    }
  }
}

function _arrayRandom(len, min, max, unique) {
    var len = (len) ? len : 10,
            min = (min !== undefined) ? min : 1,
            max = (max !== undefined) ? max : 100,
            unique = (unique) ? unique : false,
            toReturn = [], tempObj = {}, i = 0;

    if(unique === true) {
        for(; i < len; i++) {
            var randomInt = Math.floor(Math.random() * ((max - min) + min));
            if(tempObj['key_'+ randomInt] === undefined) {
                tempObj['key_'+ randomInt] = randomInt;
                toReturn.push(randomInt);
            } else {
                i--;
            }
        }
    } else {
        for(; i < len; i++) {
            toReturn.push(Math.floor(Math.random() * ((max - min) + min)));
        }
    }

    return toReturn;
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

function createTrueOrFalseRepeatArrayToFixDoubleClickingError(){
	wordsThatHaveBeenTestedAndResultsArrayTrueOrFalseArray = [];
	for(var i = 1; i <= wordsThatHaveBeenTestedAndResultsArray.length-1;i++){
		var trueOrFalse = isEquivalent(wordsThatHaveBeenTestedAndResultsArray[i],wordsThatHaveBeenTestedAndResultsArray[i-1])
		wordsThatHaveBeenTestedAndResultsArrayTrueOrFalseArray.push(trueOrFalse);
	}
}
function forDeleteDuplicateObjectsUsingTrueFalseArray(){
	for(var i = wordsThatHaveBeenTestedAndResultsArrayTrueOrFalseArray.length-1; i >= 0; i--){
		if(wordsThatHaveBeenTestedAndResultsArrayTrueOrFalseArray[i]){
			wordsThatHaveBeenTestedAndResultsArray.splice(i+1,1);
			wordsThatHaveBeenTestedAndResultsArrayTrueOrFalseArray.splice(i,1);
		}
	}
}

function fillInQuizPreviousQuestionElement(indexNumber){
	if(document.querySelector('#submit').style.display === 'block'){
			document.querySelector('#quiz').style.display = 'block';
			document.querySelector('#quizPreviousQuestion').style.display = 'none';
			document.querySelector('#continueWithQuizId').style.display = 'none';
	}
	else if(indexNumber <= questionNumberTotal-1){
		if(wordsThatHaveBeenTestedInnerHTML[indexNumber]){
			document.querySelector('#quizPreviousQuestion').innerHTML = wordsThatHaveBeenTestedInnerHTML[indexNumber];
			document.querySelector('#quiz').style.display = 'none';
			document.querySelector('#quizPreviousQuestion').style.display = 'block';
			document.querySelector('#continueWithQuizId').style.display = 'block';
			currentAlreadyAnsweredQuestionThatUserIsViewing = indexNumber;
		}
		if(questionNumberTotal-1 === indexNumber){
			document.querySelector('#quiz').style.display = 'block';
			document.querySelector('#quizPreviousQuestion').style.display = 'none';
			document.querySelector('#continueWithQuizId').style.display = 'none';
		}
		currentAlreadyAnsweredQuestionThatUserIsViewing = indexNumber;
    makeCurrentQuestionThatIsBeingViewedColorBlue();
    fillInPreviousRoundNumberIcons();
    makeCurrentQuestionThatIsBeingViewedFromPreviousRoundColorBlue();
	}
}
function continueWithQuestions(){
	fillInQuizPreviousQuestionElement(questionNumberTotal-1);
}
function continueWithQuizFromSeeingResults(){
  document.querySelector('#progressThisRound').style.display = 'none';
  document.querySelector('#whatToHideWhenResultsAreBeingShown').style.display = 'block';
  document.querySelector('#previousRoundResults').style.display = 'none';
}
function fillInPreviousRoundNumberIcons(){
  if(currentAlreadyAnsweredQuestionThatUserIsViewing < 10 && roundNumber > 1){
    document.querySelector('#roundNumberDivPreviousResults').innerHTML = roundResultsIconsHTML[0];
    document.querySelector('#roundNumberDivPreviousResults').style.display = 'block';
    document.querySelector('#roundNumberDiv').style.display = 'none';
  }else if((roundNumber*10)>currentAlreadyAnsweredQuestionThatUserIsViewing && roundResultsIconsHTML[(currentAlreadyAnsweredQuestionThatUserIsViewing - (currentAlreadyAnsweredQuestionThatUserIsViewing%10))/10]){
    document.querySelector('#roundNumberDivPreviousResults').innerHTML = roundResultsIconsHTML[(currentAlreadyAnsweredQuestionThatUserIsViewing - (currentAlreadyAnsweredQuestionThatUserIsViewing%10))/10];
    document.querySelector('#roundNumberDivPreviousResults').style.display = 'block';
    document.querySelector('#roundNumberDiv').style.display = 'none';
  }
  else{
    document.querySelector('#roundNumberDivPreviousResults').style.display = 'none';
    document.querySelector('#roundNumberDiv').style.display = 'block';
  }
}

function updateRoundNumber(){
    document.querySelector('#roundResultsSpan').innerHTML = roundNumber;
    document.querySelector('#progressThisRound').style.display = 'block';
    document.querySelector('#whatToHideWhenResultsAreBeingShown').style.display = 'none';
    roundResultsInnerHtmlArray.push(document.querySelector('#progressThisRound').innerHTML);
		roundNumber ++;
    appendWordsThisRoundUnorderedList = '';
		document.querySelector('#roundNumberSpan').innerHTML = roundNumber;
		document.getElementById('question-number-1').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-1').onclick = function(){fillInQuizPreviousQuestionElement(0+((roundNumber-1)*10));}

		document.getElementById('question-number-2').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-2').onclick = function(){fillInQuizPreviousQuestionElement(1+((roundNumber-1)*10));}

		document.getElementById('question-number-3').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-3').onclick = function(){fillInQuizPreviousQuestionElement(2+((roundNumber-1)*10));}

		document.getElementById('question-number-4').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-4').onclick = function(){fillInQuizPreviousQuestionElement(3+((roundNumber-1)*10));}

		document.getElementById('question-number-5').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-5').onclick = function(){fillInQuizPreviousQuestionElement(4+((roundNumber-1)*10));}

		document.getElementById('question-number-6').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-6').onclick = function(){fillInQuizPreviousQuestionElement(5+((roundNumber-1)*10));}

		document.getElementById('question-number-7').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-7').onclick = function(){fillInQuizPreviousQuestionElement(6+((roundNumber-1)*10));}

		document.getElementById('question-number-8').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-8').onclick = function(){fillInQuizPreviousQuestionElement(7+((roundNumber-1)*10));}

		document.getElementById('question-number-9').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-9').onclick = function(){fillInQuizPreviousQuestionElement(8+((roundNumber-1)*10));}

		document.getElementById('question-number-10').classList.value = 'fa fa-circle-o';
		document.getElementById('question-number-10').onclick = function(){fillInQuizPreviousQuestionElement(9+((roundNumber-1)*10));}
	}

var currentAlreadyAnsweredQuestionThatUserIsViewingInRoundString;
  function makeCurrentQuestionThatIsBeingViewedColorBlue(){
    if(currentAlreadyAnsweredQuestionThatUserIsViewing+1 <= 10){
     currentAlreadyAnsweredQuestionThatUserIsViewingInRoundString = (currentAlreadyAnsweredQuestionThatUserIsViewing+1).toString();
   }else if((((currentAlreadyAnsweredQuestionThatUserIsViewing+1) % 10)) === 0){
     var number10 = 10;
     currentAlreadyAnsweredQuestionThatUserIsViewingInRoundString = number10.toString();
   }
   else{
     currentAlreadyAnsweredQuestionThatUserIsViewingInRoundString = (((currentAlreadyAnsweredQuestionThatUserIsViewing+1) % 10)).toString();
   }

   console.log('currentAlreadyAnsweredQuestionThatUserIsViewingInRoundString');
   console.log(currentAlreadyAnsweredQuestionThatUserIsViewingInRoundString);
    for(var i = 0; i <=10; i++){
      if(document.querySelectorAll('#listOfRoundResultsSpans > .fa-times')[i]){
        document.querySelectorAll('#listOfRoundResultsSpans > .fa-times')[i].style.color = 'red';
      }
    }
    for(var i = 0; i <=10; i++){
      if(document.querySelectorAll('#listOfRoundResultsSpans > .fa-check')[i]){
        document.querySelectorAll('#listOfRoundResultsSpans > .fa-check')[i].style.color = 'green';
      }
    }
    for(var i = 0; i <=10; i++){
      if(document.querySelectorAll('#listOfRoundResultsSpans > .fa-circle-o')[i]){
        document.querySelectorAll('#listOfRoundResultsSpans > .fa-circle-o')[i].style.color = 'black';
      }
    }
    document.querySelector('#question-number-'+questionNumberInRoundString).style.color = 'blue';
    document.querySelector('#question-number-'+currentAlreadyAnsweredQuestionThatUserIsViewingInRoundString).style.color = 'blue';
  }

  function makeCurrentQuestionThatIsBeingViewedFromPreviousRoundColorBlue(){
    if(document.querySelector('#roundNumberDivPreviousResults').style.display === 'block'){
      for(var i = 0; i <=10; i++){
        if(document.querySelectorAll('#roundNumberDivPreviousResults>#listOfRoundResultsSpans > .fa-times')[i]){
          document.querySelectorAll('#roundNumberDivPreviousResults>#listOfRoundResultsSpans > .fa-times')[i].style.color = 'red';
        }
      }
      for(var i = 0; i <=10; i++){
        if(document.querySelectorAll('#roundNumberDivPreviousResults>#listOfRoundResultsSpans > .fa-check')[i]){
          document.querySelectorAll('#roundNumberDivPreviousResults>#listOfRoundResultsSpans > .fa-check')[i].style.color = 'green';
        }
      }
      for(var i = 0; i <=10; i++){
        if(document.querySelectorAll('#roundNumberDivPreviousResults>#listOfRoundResultsSpans > .fa-circle-o')[i]){
          document.querySelectorAll('#roundNumberDivPreviousResults>#listOfRoundResultsSpans > .fa-circle-o')[i].style.color = 'black';
        }
      }
      document.querySelector('#roundNumberDivPreviousResults>#listOfRoundResultsSpans >#question-number-'+currentAlreadyAnsweredQuestionThatUserIsViewingInRoundString).style.color = 'blue';
    }
}


// Generate random number
function mathRandomNumber(number){
	var randomNumber = Math.floor(Math.random()*number);
	return randomNumber;
}
var questionFourSentencesNumbers = [];
var questionFourWords = [];
var questionFourPoints = [];
var currentPlayPoints = 0;
var redWrongAnswersArray = [];
var wrongAnswersLabelElementsArray = [];
var wrongAnswersLabelElementsArrayLabels = [];
var correctAnswerLabelElement;
var currentWordThatIsBeingTested;
var currentWordThatIsBeingTestedSentence;
var wordsThatHaveBeenTestedAndResultsArray = [];
var wordsThatHaveBeenTestedAndResultsArrayTrueOrFalseArray = [];
var wordsThatHaveBeenTestedInnerHTML = [];
var roundResultsIconsHTML = [];
var roundNumber = 1;
var questionNumberInRound = 1;
var questionNumberInRoundString = questionNumberInRound.toString();
var questionNumberTotal = 1;
var currentAlreadyAnsweredQuestionThatUserIsViewing;
var appendWordsThisRoundUnorderedList = '';
var roundResultsInnerHtmlArray = [];


function generateFourRandomSentences(){
	createTrueOrFalseRepeatArrayToFixDoubleClickingError();
	forDeleteDuplicateObjectsUsingTrueFalseArray();
	document.getElementById('quiz').style.display = 'block';
	// keydown has to start after quiz is block display
	startKeydownListenerPlayGame();
	document.getElementById('results').style.display = 'block';
	document.getElementById('roundNumberDiv').style.display = 'block';
	document.getElementById('first-body').style.display = 'none';
	document.getElementById('second-body').style.display = 'none';
	sentencesArray = [];
	myQuestions = [];
	questionFourSentencesNumbers = [];
	questionFourWords = [];
	questionFourPoints = [];
	redWrongAnswersArray = [];
	var currentWordThatIsBeingTestedCorrectOrIncorrectTester;
  // Generate an array with 4 random numbers
  questionFourSentencesNumbers = _arrayRandom(4, 0, finalPointsArray.length, true);
	for(var i = 0; i <= questionFourSentencesNumbers.length-1; i++){
			questionFourWords.push(finalPointsArray[questionFourSentencesNumbers[i]].word);
			questionFourPoints.push(finalPointsArray[questionFourSentencesNumbers[i]].number);
	}
	for(var i = 0; i <= questionFourSentencesNumbers.length-1; i++){
		getSentence(questionFourWords[i]);
	}
	var wordChosenRandomlyToBeAnswer = mathRandomNumber(questionFourWords.length);
	var randomAnswerLetter;
	if (wordChosenRandomlyToBeAnswer === 0) {
		randomAnswerLetter = 'a';
	} else if (wordChosenRandomlyToBeAnswer === 1) {
		randomAnswerLetter = 'b';
	} else if (wordChosenRandomlyToBeAnswer === 2) {
		randomAnswerLetter = 'c';
	} else {
		randomAnswerLetter = 'd';
	}

	setTimeout(function(){
		currentWordThatIsBeingTested = sentencesArray[wordChosenRandomlyToBeAnswer].word;
		currentWordThatIsBeingTestedSentence = sentencesArray[wordChosenRandomlyToBeAnswer].sentence;
		pushQuizQuestion(
			currentWordThatIsBeingTested,
			sentencesArray[0].sentence,
			sentencesArray[1].sentence,
			sentencesArray[2].sentence,
			sentencesArray[3].sentence,
			randomAnswerLetter
		);
		document.getElementById('submit').style.display = 'none';
		document.getElementById('submit').innerHTML = ' Next ';
		for(var i = 0; i <= questionFourSentencesNumbers.length - 1; i++){
			if(i !== wordChosenRandomlyToBeAnswer){
				redWrongAnswersArray.push(i);
			}
		}

		wrongAnswersLabelElementsArray = [];
		wrongAnswersLabelElementsArrayLabels = [];
		function selectWrongAnswer(elementNumber){
			currentWordThatIsBeingTestedCorrectOrIncorrectTester = false;

			wordsThatHaveBeenTestedAndResultsArray.push(
				{
					word: currentWordThatIsBeingTested,
					sentence: currentWordThatIsBeingTestedSentence,
					correctOrIncorrect: currentWordThatIsBeingTestedCorrectOrIncorrectTester
				}
			)
			document.getElementById('submit').style.display = 'none';
			document.getElementById('question-number-'+questionNumberInRoundString).classList.value = '';
			addClass('#question-number-'+questionNumberInRoundString,'fa fa-times');
			currentPlayPoints -= 100;
			// Create a line through wrong answer when you are incorrect
			wrongAnswersLabelElementsArrayLabels[elementNumber].style.textDecoration = 'line-through';
      wrongAnswersLabelElementsArrayLabels[elementNumber].style.color = 'red';


			// Make it so that you can reclick on wrong answer
			wrongAnswersLabelElementsArray[elementNumber].style.pointerEvents = 'none';
			wrongAnswersLabelElementsArrayLabels[elementNumber].style.pointerEvents = 'none';

			showPlayPoints();
		}
		for(var i = 0; i <= redWrongAnswersArray.length - 1; i++){
			wrongAnswersLabelElementsArray.push(document.querySelectorAll('input[type="radio"]')[redWrongAnswersArray[i]]);
			wrongAnswersLabelElementsArrayLabels.push(document.querySelectorAll('.answers > label')[redWrongAnswersArray[i]]);
			wrongAnswersLabelElementsArray[i].id = 'wrong-answer-'+i;
		}
		document.getElementById('wrong-answer-0').onclick = function(){selectWrongAnswer(0);}
		document.getElementById('wrong-answer-1').onclick = function(){selectWrongAnswer(1);}
		document.getElementById('wrong-answer-2').onclick = function(){selectWrongAnswer(2);}

		console.log('wrongAnswersLabelElementsArray');
		console.log(wrongAnswersLabelElementsArray);
		console.log('------------------------------');


		correctAnswerLabelElement = document.querySelectorAll('input[type="radio"]')[wordChosenRandomlyToBeAnswer];
		correctAnswerLabelElementLabelNotRadioButton = document.querySelectorAll('.answers > label')[wordChosenRandomlyToBeAnswer];

		correctAnswerLabelElement.id = 'correct-answer';
		correctAnswerLabelElement.onclick = function(){
			if(currentWordThatIsBeingTestedCorrectOrIncorrectTester !== false){
				currentWordThatIsBeingTestedCorrectOrIncorrectTester = true;
				wordsThatHaveBeenTestedAndResultsArray.push(
					{
						word: currentWordThatIsBeingTested,
						sentence: currentWordThatIsBeingTestedSentence,
						correctOrIncorrect: currentWordThatIsBeingTestedCorrectOrIncorrectTester
					}
				)
			}
      if(currentWordThatIsBeingTestedCorrectOrIncorrectTester){
        appendWordsThisRoundUnorderedList += '<li style="color:green" class="roundLi"><span class="roundLiWord">'+currentWordThatIsBeingTested+'</span>: <span class="roundLiSentence">'+currentWordThatIsBeingTestedSentence+'</span></li>'
        document.querySelector('#wordsThisRound').innerHTML = appendWordsThisRoundUnorderedList;
      }else{
        appendWordsThisRoundUnorderedList += '<li style="color:red" class="roundLi"><span class="roundLiWord">'+currentWordThatIsBeingTested+'</span>: <span class="roundLiSentence">'+currentWordThatIsBeingTestedSentence+'</span></li>'
        document.querySelector('#wordsThisRound').innerHTML = appendWordsThisRoundUnorderedList;
      }


			document.getElementById('submit').style.display = 'block';
			document.querySelector('.answers').style.color = 'green';
			correctAnswerLabelElement.style.pointerEvents = 'none';
			correctAnswerLabelElementLabelNotRadioButton.style.pointerEvents = 'none';


			if(document.getElementById('question-number-'+questionNumberInRoundString).classList.value !== ' fa fa-times'){
				document.getElementById('question-number-'+questionNumberInRoundString).classList.value = '';
				addClass('#question-number-'+questionNumberInRoundString,'fa fa-check');
			}

			currentPlayPoints += 100;
			showPlayPoints();
			for(var i = 0; i <= 2; i++){
				document.getElementById('wrong-answer-'+i ).style.textDecoration = 'line-through';
				// wrongAnswersLabelElementsArrayLabels[i].style.textDecoration = 'line-through';
        if(wrongAnswersLabelElementsArrayLabels[i].style.textDecoration !== 'line-through'){
          wrongAnswersLabelElementsArrayLabels[i].style.color = '#36588e';
        }
        else{
          wrongAnswersLabelElementsArrayLabels[i].style.color = 'red';
        }
				document.getElementById('wrong-answer-'+i).style.pointerEvents = 'none';
				wrongAnswersLabelElementsArrayLabels[i].style.pointerEvents = 'none';
			}
		}

		console.log('correctAnswerLabelElement');
		console.log(correctAnswerLabelElement);

		document.getElementById('submit').onclick = function(){
			// Save the html from the completed quiz questions
			wordsThatHaveBeenTestedInnerHTML.push(document.querySelector('#quiz').innerHTML.replace("id=\"correct-answer\"", "id=\"correct-answer\" checked=\"checked\""));
			generateFourRandomSentences();
			questionNumberInRound ++;
			if(questionNumberInRound > 10){
				questionNumberInRound = 1;
        roundResultsIconsHTML.push(document.querySelector('#roundNumberDiv').innerHTML);
				updateRoundNumber();
			}
			questionNumberTotal ++;

				currentAlreadyAnsweredQuestionThatUserIsViewing = questionNumberTotal-1;

			questionNumberInRoundString = questionNumberInRound.toString();
			document.getElementById('results').style.display = 'none';
      makeCurrentQuestionThatIsBeingViewedColorBlue();
      if(questionNumberInRound > 10){
      roundResultsIconsHTML.push(document.querySelector('#roundNumberDiv').innerHTML);
    }
	}

		document.getElementById('results').style.display = 'block';
		document.getElementById('results').style.fontWeight = 'bold';
		document.getElementById('results').innerHTML = currentPlayPoints + ' Points';
	},2000);
}

function showPlayPoints(){
	document.getElementById('results').innerHTML = currentPlayPoints + ' Points';
	if(currentPlayPoints > 0){
		document.getElementById('results').style.color = 'green';
	}
	if(currentPlayPoints < 0){
		document.getElementById('results').style.color = 'red';
	}
	if(currentPlayPoints === 0){
		document.getElementById('results').style.color = 'black';
	}
}




function keyDownListenerPlayGame(e) {
  switch (e.keyCode) {
    // When pressing left key, go to previous word.
    case 37:
      if(currentAlreadyAnsweredQuestionThatUserIsViewing % 10 === 0 && currentAlreadyAnsweredQuestionThatUserIsViewing !== 0 && document.querySelector('#previousRoundResults').style.display !== 'block'){
        document.querySelector('#previousRoundResults').innerHTML = roundResultsInnerHtmlArray[(currentAlreadyAnsweredQuestionThatUserIsViewing/10)-1];
        document.querySelector('#previousRoundResults').style.display = 'block';
        document.querySelector('#whatToHideWhenResultsAreBeingShown').style.display = 'none';
      }
      else if(document.querySelector('#previousRoundResults').style.display === 'block'){
        document.querySelector('#previousRoundResults').style.display = 'none';
        document.querySelector('#whatToHideWhenResultsAreBeingShown').style.display = 'block';
        fillInQuizPreviousQuestionElement(currentAlreadyAnsweredQuestionThatUserIsViewing-1);
      }
			else if(currentAlreadyAnsweredQuestionThatUserIsViewing !== 0 && document.querySelector('#submit').style.display !== 'block' ){
				fillInQuizPreviousQuestionElement(currentAlreadyAnsweredQuestionThatUserIsViewing-1)
			}
      e.preventDefault();
      break;
      // When pressing right key, go to next word.
    case 39:
    if(document.querySelector('#progressThisRound').style.display === 'block'){
        document.querySelector('#continueWithQuizFromSeeingResults').click();
    }
    else if(document.querySelector('#previousRoundResults').style.display === 'block'){
      document.querySelector('#previousRoundResults').style.display = 'none';
      document.querySelector('#whatToHideWhenResultsAreBeingShown').style.display = 'block';
    }
		else if(document.querySelector('#submit').style.display === 'block'){
			document.querySelector('#submit').click();
		}
		else if(currentAlreadyAnsweredQuestionThatUserIsViewing !== questionNumberTotal.length-1){
			fillInQuizPreviousQuestionElement(currentAlreadyAnsweredQuestionThatUserIsViewing+1);
		}
      e.preventDefault();
      break;
    case 49:
			if(document.querySelectorAll('#quiz > .answers > label')[0].style.textDecoration !== 'line-through' && document.querySelector('.answers').style.color !== 'green'){
      document.querySelectorAll('#quiz > .answers > label')[0].click();
		}
      e.preventDefault();
      break;
    case 50:
		if(document.querySelectorAll('#quiz > .answers > label')[1].style.textDecoration !== 'line-through' && document.querySelector('.answers').style.color !== 'green'){
			document.querySelectorAll('#quiz > .answers > label')[1].click();
		}
      e.preventDefault();
      break;
    case 51:
		if(document.querySelectorAll('#quiz > .answers > label')[2].style.textDecoration !== 'line-through' && document.querySelector('.answers').style.color !== 'green'){
			document.querySelectorAll('#quiz > .answers > label')[2].click();
		}
      e.preventDefault();
      break;
    case 52:
		if(document.querySelectorAll('#quiz > .answers > label')[3].style.textDecoration !== 'line-through' && document.querySelector('.answers').style.color !== 'green'){
			document.querySelectorAll('#quiz > .answers > label')[3].click();
		}
      e.preventDefault();
      break;
  }
}
function startKeydownListenerPlayGame(){
	// on if the quiz is displayed will this be possible
	if(document.querySelector('#quiz').style.display === 'block'){
		 document.addEventListener('keydown', keyDownListenerPlayGame, false);
	}
}
function stopKeydownListenerPlayGame(){
  document.removeEventListener("keydown", keyDownListenerPlayGame, false);
}
