
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

var doNotHideFlashcard = false;

function continueWithQuizFromSeeingResults(){
  document.querySelector('#progressThisRound').style.display = 'none';
  if(!doNotHideFlashcard){
    document.querySelector('.flashcard').style.display = 'none';
  }
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
    var countOfQuizQuestionsCorrectThisRound = 0;
    var countOfTotalQuizQuestionsThisRound = 0;

    for (var i = (roundNumber - 1) * 10; i < wordsThatHaveBeenTestedAndResultsArray.length; i++) {
      countOfTotalQuizQuestionsThisRound ++
      if(wordsThatHaveBeenTestedAndResultsArray[i].correctOrIncorrect){
        countOfQuizQuestionsCorrectThisRound ++;
      }
    }

    // var numberOfGreen = 0;
    // var numberOfRed = 0;
    // for (var i = 0; i < 11; i++) {
    //   if (document.querySelectorAll('#wordsThisRound > .roundLiWord')[i].style.color === 'green') {
    //     numberOfGreen ++;
    //   }else{
    //     numberOfGreen ++;
    //   }
    // }
    // console.log(numberOfGreen);
    // console.log(numberOfRed);

    document.querySelector('#words-correct-this-round').innerHTML = countOfQuizQuestionsCorrectThisRound;
    document.querySelector('#total-words-this-round').innerHTML = countOfTotalQuizQuestionsThisRound;

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
var currentWordThatIsBeingTestedSentenceExampleUnderlinedWord;
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

var actualQuestionsArray = [];

var emptyFinalPointsArray = false;


function generateFourRandomSentences(customizedListActivator, customizedArray, deactiveHideFlashcard){
	createTrueOrFalseRepeatArrayToFixDoubleClickingError();
	forDeleteDuplicateObjectsUsingTrueFalseArray();
	document.getElementById('quiz').style.display = 'block';
	// keydown has to start after quiz is block display
	startKeydownListenerPlayGame();
  spliceAllWordsAbove100Percent();
  sortFinalPointsArray();
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

  if(deactiveHideFlashcard){
    doNotHideFlashcard = true;
  }

  // Generate an array with 4 random numbers


  // If you want to play the question generator game with a specialized list
  if(customizedListActivator){

    // This block is to see which words have been tested before and their current points before the finalPointsArray is emptied---------------
    var newPointsObjectArray = [];
    for (var i = 0; i < finalPointsArray.length; i++) {
      for (var y = 0; y < customizedArray.length; y++) {
        if(customizedArray[y] === finalPointsArray[i].word){
          newPointsObjectArray.push(finalPointsArray[i]);
        }
      }
    }
    //---------------------------------------------------------------------------
    // If the final points array has not been emptied yet:
    if(!emptyFinalPointsArray){
      console.log(newPointsObjectArray);
      finalPointsArray = [];
      emptyFinalPointsArray = true;
      for (var i = 0; i < customizedArray.length; i++) {
        finalPointsArray.push(
          {
            word: customizedArray[i],
            number: 0
          }
        );
      }
      // This loop will replace all words with 0 points with their correct score...
      for (var i = 0; i < newPointsObjectArray.length; i++) {
        for (var y = 0; y < finalPointsArray.length; y++) {
          if(finalPointsArray[y].word === newPointsObjectArray[i].word){
            // Replace the finalPointsArray[y] with the object that accounts for historical score
            finalPointsArray[y] = newPointsObjectArray[i];
          }
        }
      }
    }
    questionFourSentencesNumbers = _arrayRandom(4, 0, finalPointsArray.length, true);

    for(var i = 0; i <= questionFourSentencesNumbers.length-1; i++){
        questionFourWords.push(finalPointsArray[questionFourSentencesNumbers[i]].word);
        questionFourPoints.push(finalPointsArray[questionFourSentencesNumbers[i]].number);
    }
  }

// If you want to play the question generator game with all words in finalPointsArray
  else{
    for(var i = 0; i <= questionFourSentencesNumbers.length-1; i++){
        questionFourWords.push(finalPointsArray[questionFourSentencesNumbers[i]].word);
        questionFourPoints.push(finalPointsArray[questionFourSentencesNumbers[i]].number);
    }
  }



	for(var i = 0; i <= questionFourSentencesNumbers.length-1; i++){
    // Will make 4 sentences in sentencesArray
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
    console.log('<><<><<><><><>>><><><><><><>');
    console.log(sentencesArray[wordChosenRandomlyToBeAnswer].word);
		currentWordThatIsBeingTestedSentence = sentencesArray[wordChosenRandomlyToBeAnswer].sentence;
    currentWordThatIsBeingTestedSentenceExample = sentencesArray[wordChosenRandomlyToBeAnswer].sentenceExample;
    currentWordThatIsBeingTestedSentenceExampleUnderlinedWord = sentencesArray[wordChosenRandomlyToBeAnswer].sentenceExampleUnderlinedWord;
    currentWordThatIsBeingTestedHowItWasUsedInSentence = sentencesArray[wordChosenRandomlyToBeAnswer].wordHowItWasUsedInSentence;

    synonymsInDatabaseArrayWord1 = [];
  if(sentencesArray[0].synonyms){
    for (var i = 0; i < sentencesArray[0].synonyms.length; i++) {
      if ($.inArray(sentencesArray[0].synonyms[i], databaseArray) !== -1 && sentencesArray[0].synonyms[i] !== sentencesArray[0].word){
        synonymsInDatabaseArrayWord1.push(sentencesArray[0].synonyms[i]);
      }
    }
    if(synonymsInDatabaseArrayWord1.length < 1){
      synonymsInDatabaseArrayWord1 = sentencesArray[0].synonyms
    }
  }
    synonymsInDatabaseArrayWord2 = [];
  if(sentencesArray[1].synonyms){
    for (var i = 0; i < sentencesArray[1].synonyms.length; i++) {
      if ($.inArray(sentencesArray[1].synonyms[i], databaseArray) !== -1 && sentencesArray[1].synonyms[i] !== sentencesArray[1].word){
        synonymsInDatabaseArrayWord2.push(sentencesArray[1].synonyms[i]);
      }
    }
    if(synonymsInDatabaseArrayWord2.length < 1){
      synonymsInDatabaseArrayWord2 = sentencesArray[1].synonyms
    }
  }
    synonymsInDatabaseArrayWord3 = [];
  if(sentencesArray[2].synonyms){
    for (var i = 0; i < sentencesArray[2].synonyms.length; i++) {
      if ($.inArray(sentencesArray[2].synonyms[i], databaseArray) !== -1 && sentencesArray[2].synonyms[i] !== sentencesArray[2].word){
        synonymsInDatabaseArrayWord3.push(sentencesArray[2].synonyms[i]);
      }
    }
    if(synonymsInDatabaseArrayWord3.length < 1){
      synonymsInDatabaseArrayWord3 = sentencesArray[2].synonyms
    }
  }
    synonymsInDatabaseArrayWord4 = [];
  if(sentencesArray[3].synonyms){
    for (var i = 0; i < sentencesArray[3].synonyms.length; i++) {
      if ($.inArray(sentencesArray[3].synonyms[i], databaseArray) !== -1 && sentencesArray[3].synonyms[i] !== sentencesArray[3].word){
        synonymsInDatabaseArrayWord4.push(sentencesArray[3].synonyms[i]);
      }
    }
    if(synonymsInDatabaseArrayWord4.length < 1){
      synonymsInDatabaseArrayWord4 = sentencesArray[3].synonyms
    }
  }

    var randomSynonymWord1 = synonymsInDatabaseArrayWord1[mathRandomNumber(synonymsInDatabaseArrayWord1.length)]
    var randomSynonymWord2 = synonymsInDatabaseArrayWord2[mathRandomNumber(synonymsInDatabaseArrayWord2.length)]
    var randomSynonymWord3 = synonymsInDatabaseArrayWord3[mathRandomNumber(synonymsInDatabaseArrayWord3.length)]
    var randomSynonymWord4 = synonymsInDatabaseArrayWord4[mathRandomNumber(synonymsInDatabaseArrayWord4.length)]


    antonymsInDatabaseArrayWord1 = [];
    if(sentencesArray[0].antonyms){
    for (var i = 0; i < sentencesArray[0].antonyms.length; i++) {
      if ($.inArray(sentencesArray[0].antonyms[i], databaseArray) !== -1 && sentencesArray[0].antonyms[i] !== sentencesArray[0].word){
        antonymsInDatabaseArrayWord1.push(sentencesArray[0].antonyms[i]);
      }
    }

    if(antonymsInDatabaseArrayWord1.length < 1){
      antonymsInDatabaseArrayWord1 = sentencesArray[0].antonyms
    }
  }

    antonymsInDatabaseArrayWord2 = [];
    if(sentencesArray[1].antonyms){
    for (var i = 0; i < sentencesArray[1].antonyms.length; i++) {
      if ($.inArray(sentencesArray[1].antonyms[i], databaseArray) !== -1 && sentencesArray[1].antonyms[i] !== sentencesArray[1].word){
        antonymsInDatabaseArrayWord2.push(sentencesArray[1].antonyms[i]);
      }
    }
    if(antonymsInDatabaseArrayWord2.length < 1){
      antonymsInDatabaseArrayWord2 = sentencesArray[1].antonyms
    }
  }

    antonymsInDatabaseArrayWord3 = [];
    if(sentencesArray[2].antonyms){
    for (var i = 0; i < sentencesArray[2].antonyms.length; i++) {
      if ($.inArray(sentencesArray[2].antonyms[i], databaseArray) !== -1 && sentencesArray[2].antonyms[i] !== sentencesArray[2].word){
        antonymsInDatabaseArrayWord3.push(sentencesArray[2].antonyms[i]);
      }
    }
    if(antonymsInDatabaseArrayWord3.length < 1){
      antonymsInDatabaseArrayWord3 = sentencesArray[2].antonyms
    }
  }

    antonymsInDatabaseArrayWord4 = [];
    if(sentencesArray[3].antonyms){
    for (var i = 0; i < sentencesArray[3].antonyms.length; i++) {
      if ($.inArray(sentencesArray[3].antonyms[i], databaseArray) !== -1 && sentencesArray[3].antonyms[i] !== sentencesArray[3].word){
        antonymsInDatabaseArrayWord4.push(sentencesArray[3].antonyms[i]);
      }
    }
    if(antonymsInDatabaseArrayWord4.length < 1){
      antonymsInDatabaseArrayWord4 = sentencesArray[3].antonyms
    }
  }

    var randomAntonymWord1 = antonymsInDatabaseArrayWord1[mathRandomNumber(antonymsInDatabaseArrayWord1.length)]
    var randomAntonymWord2 = antonymsInDatabaseArrayWord2[mathRandomNumber(antonymsInDatabaseArrayWord2.length)]
    var randomAntonymWord3 = antonymsInDatabaseArrayWord3[mathRandomNumber(antonymsInDatabaseArrayWord3.length)]
    var randomAntonymWord4 = antonymsInDatabaseArrayWord4[mathRandomNumber(antonymsInDatabaseArrayWord4.length)]
    // Either 0,1,2
    var questionType = mathRandomNumber(5);

var currentWordThatIsBeingTestedSentenceExampleUnderlinedWordLength = currentWordThatIsBeingTestedSentenceExampleUnderlinedWord.length;
var lastCharacterOfCurrentWordThatIsBeingTestedSentenceExampleUnderlinedWordLength = currentWordThatIsBeingTestedSentenceExampleUnderlinedWord.charAt(currentWordThatIsBeingTestedSentenceExampleUnderlinedWordLength - 1);
var periodAfterUnderlinedSentence;
if(lastCharacterOfCurrentWordThatIsBeingTestedSentenceExampleUnderlinedWordLength !== '?' || lastCharacterOfCurrentWordThatIsBeingTestedSentenceExampleUnderlinedWordLength !== '!'){
  periodAfterUnderlinedSentence = '.';
}else{
  periodAfterUnderlinedSentence = '';
}


    if(questionType === 0){
		pushQuizQuestion(
			currentWordThatIsBeingTested + ' means:',
			sentencesArray[0].sentence,
			sentencesArray[1].sentence,
			sentencesArray[2].sentence,
			sentencesArray[3].sentence,
			randomAnswerLetter
		);
  }else if(questionType === 1){
    pushQuizQuestion(
      capitalizeFirstLetter(currentWordThatIsBeingTestedSentenceExampleUnderlinedWord) + periodAfterUnderlinedSentence,
      sentencesArray[0].wordHowItWasUsedInSentence,
			sentencesArray[1].wordHowItWasUsedInSentence,
			sentencesArray[2].wordHowItWasUsedInSentence,
			sentencesArray[3].wordHowItWasUsedInSentence,
      randomAnswerLetter
    );
  }else if(questionType === 2 && randomSynonymWord1 && randomSynonymWord2 && randomSynonymWord3 && randomSynonymWord4){
    pushQuizQuestion(
      currentWordThatIsBeingTested + ' means:',
      randomSynonymWord1,
      randomSynonymWord2,
      randomSynonymWord3,
      randomSynonymWord4,
      randomAnswerLetter
    );
  }
    else if(questionType === 2 && !(randomSynonymWord1 && randomSynonymWord2 && randomSynonymWord3 && randomSynonymWord4)){
      pushQuizQuestion(
        currentWordThatIsBeingTested + ' means:',
        sentencesArray[0].sentence,
        sentencesArray[1].sentence,
        sentencesArray[2].sentence,
        sentencesArray[3].sentence,
        randomAnswerLetter
      );
    }
  else if(questionType === 3 && randomSynonymWord1 && randomSynonymWord2 && randomSynonymWord3 && randomSynonymWord4){
    pushQuizQuestion(
      capitalizeFirstLetter(currentWordThatIsBeingTestedSentenceExample) + periodAfterUnderlinedSentence +'<br><br> In this sentence, <strong>"'+ sentencesArray[wordChosenRandomlyToBeAnswer].wordHowItWasUsedInSentence +'"</strong> means:',
      randomSynonymWord1,
      randomSynonymWord2,
      randomSynonymWord3,
      randomSynonymWord4,
      randomAnswerLetter
    );
  }
    else if(questionType === 3 && !(randomSynonymWord1 && randomSynonymWord2 && randomSynonymWord3 && randomSynonymWord4)){
      pushQuizQuestion(
        currentWordThatIsBeingTested + ' means:',
        sentencesArray[0].sentence,
        sentencesArray[1].sentence,
        sentencesArray[2].sentence,
        sentencesArray[3].sentence,
        randomAnswerLetter
      );
    }
  else if(questionType === 4 && randomAntonymWord1 && randomAntonymWord2 && randomAntonymWord3 && randomAntonymWord4){
    pushQuizQuestion(
      'The opposite of ' + currentWordThatIsBeingTested + ' is:',
      randomAntonymWord1,
      randomAntonymWord2,
      randomAntonymWord3,
      randomAntonymWord4,
      randomAnswerLetter
    );
  }else if(questionType === 4 && !(randomAntonymWord1 && randomAntonymWord2 && randomAntonymWord3 && randomAntonymWord4)){
    pushQuizQuestion(
      currentWordThatIsBeingTested + ' means:',
      sentencesArray[0].sentence,
      sentencesArray[1].sentence,
      sentencesArray[2].sentence,
      sentencesArray[3].sentence,
      randomAnswerLetter
    );
  }
  if(!deactiveHideFlashcard){
    lookupWord(currentWordThatIsBeingTested,false,sentencesArray[wordChosenRandomlyToBeAnswer].randomSentenceNumber);
    document.querySelector('.flashcard').style.display = 'none';
  }
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
      showPercentageCompleted();
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
      // var currentWordThatIsBeingTestedPoints;  Cengiz doesnt like this
      var currentWordThatIsBeingTestedPoints;
      var currentWordThatIsBeingTestedPointsIndex;
      for (var i = 0; i < finalPointsArray.length; i++) {
        if(finalPointsArray[i].word === currentWordThatIsBeingTested){
          currentWordThatIsBeingTestedPointsIndex = i;
        }
      }
      // If word is not found in finalPointsArray
      if(!currentWordThatIsBeingTestedPointsIndex){
        finalPointsArray.push(
          {
            word:currentWordThatIsBeingTested,
            number: 0
          }
        )
        // Do the same for loop again
        for (var i = 0; i < finalPointsArray.length; i++) {
          if(finalPointsArray[i].word === currentWordThatIsBeingTested){
            currentWordThatIsBeingTestedPointsIndex = i;
          }
        }
      }

      if(currentWordThatIsBeingTestedCorrectOrIncorrectTester){
        finalPointsArray[currentWordThatIsBeingTestedPointsIndex].number ++;
        currentWordThatIsBeingTestedPoints = finalPointsArray[currentWordThatIsBeingTestedPointsIndex].number * 20;
        appendWordsThisRoundUnorderedList += '<li style="color:green" class="roundLi"><span style="cursor:pointer;" class="roundLiWord" onclick="lookupWord(`'+currentWordThatIsBeingTested+'`,false)">'+currentWordThatIsBeingTestedPoints+ '% ' +currentWordThatIsBeingTested+'</span>: <span class="roundLiSentence">'+currentWordThatIsBeingTestedSentence+'</span></li>'
        document.querySelector('#wordsThisRound').innerHTML = appendWordsThisRoundUnorderedList;
      }else{
        finalPointsArray[currentWordThatIsBeingTestedPointsIndex].number --;
        currentWordThatIsBeingTestedPoints = finalPointsArray[currentWordThatIsBeingTestedPointsIndex].number * 20;
        appendWordsThisRoundUnorderedList += '<li style="color:red" class="roundLi"><span style="cursor:pointer;" class="roundLiWord" onclick="lookupWord(`'+currentWordThatIsBeingTested+'`,false)">'+currentWordThatIsBeingTestedPoints+ '% ' +currentWordThatIsBeingTested+'</span>: <span class="roundLiSentence">'+currentWordThatIsBeingTestedSentence+'</span></li>'
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
      showPercentageCompleted();
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
      // lookupWord(currentWordThatIsBeingTested,false,sentencesArray[wordChosenRandomlyToBeAnswer].randomSentenceNumber);
      document.querySelector('.flashcard').style.display = 'block';
      stopKeydownListener();
      startKeydownListenerPlayGame();
      realignFlashcard();
		}

		console.log('correctAnswerLabelElement');
		console.log(correctAnswerLabelElement);

		document.getElementById('submit').onclick = function(){
			// Save the html from the completed quiz questions
			wordsThatHaveBeenTestedInnerHTML.push(document.querySelector('#quiz').innerHTML.replace("id=\"correct-answer\"", "id=\"correct-answer\" checked=\"checked\""));
      if(customizedListActivator && deactiveHideFlashcard){
        generateFourRandomSentences(true, customizedArray, true);
      }
      else if(customizedListActivator){
        generateFourRandomSentences(true, customizedArray);
      }else{
        generateFourRandomSentences();
      }
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
    if(!deactiveHideFlashcard){
      document.querySelector('.flashcard').style.display = 'none';
    }

	}

		document.getElementById('results').style.display = 'block';
    // document.getElementById('playCurrentQuestionAudio').style.display = 'block';
    // document.getElementById('playCurrentQuestionAudio').onclick = function(){
    //   responsiveVoice.speak(currentWordThatIsBeingTested);
    // }
		document.getElementById('results').style.fontWeight = 'bold';
		document.getElementById('results').innerHTML = currentPlayPoints + ' Points';

    showPercentageCompleted();
    scrollToQuiz();
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


function showPercentageCompleted(){
  var totalPointsFinalPointsArray = 0;
  for(var i = 0; i <= finalPointsArray.length-1; i++){
    totalPointsFinalPointsArray += finalPointsArray[i].number
  }
  var pointsNeededToLearnAllWordsInFinalPointsArray = 0
  for(var i = 0; i <= finalPointsArray.length-1; i++){
    pointsNeededToLearnAllWordsInFinalPointsArray += 5
  }
  var percentageCompletedInFinalPointsArray = ((totalPointsFinalPointsArray / pointsNeededToLearnAllWordsInFinalPointsArray) * 100).toFixed(2);
  document.getElementById('percentageCompleted').innerHTML = percentageCompletedInFinalPointsArray + '% Completed';
  document.getElementById('percentageCompleted').style.fontWeight = 'bold';
  if (percentageCompletedInFinalPointsArray > 0) {
    document.getElementById('percentageCompleted').style.color = 'green';
  }else {
    document.getElementById('percentageCompleted').style.color = 'red';
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
    case 38:
      e.preventDefault();
      break;
    case 40:
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

function playGameFromPreviousQuizLists(customizedListActivator, previousListArray){
  document.querySelector('#favicon').href = "/images/vocab.png";
  document.querySelector('#titleNextToFavicon').innerHTML = "Play Vocab Game!";
  document.querySelector('#hangman-body').style.display = 'none';
  document.querySelector('#hangman-game').style.display = 'none';
  document.querySelector('#synonym-clusters-body').style.display = 'none';
  document.querySelector('#synonym-clusters-game').style.display = 'none';
  document.querySelector('#quiz').style.display = 'none';
  document.querySelector('#results').style.display = 'none';
  document.querySelector('#roundNumberDiv').style.display = 'none';
  document.querySelector('#first-body').style.display = 'none';
  document.querySelector('#second-body').style.display = 'none';
  document.querySelector('#percentageCompleted').style.display = 'block';

  // In case finalPointsArray was already set to some other array, set it back to original finalPointsArray
  finalPointsArray = supplementalFinalPointsArray;
  emptyFinalPointsArray = false;
  generateFourRandomSentences(customizedListActivator, previousListArray);
  document.querySelector('#expandPreviousLists').click();
}

function playGameFromNextToAddWordButton(){
  playGameFromPreviousQuizLists(true, wordsArray);
  // The next line clicks the expandPreviousLists button again so that it doesnt show.
  document.querySelector('#expandPreviousLists').click();
}

function playGameFromDuringAutoLearn(){
  generateFourRandomSentences(true,wordsArray,true);
  document.querySelector('.flashcard').style.display = 'block';
  document.querySelector('#colorLabelInforation').style.display = 'none';
}


var finalPointsArrayOnlyWords = [];
for (var i = 0; i < finalPointsArray.length; i++) {
  finalPointsArrayOnlyWords.push(finalPointsArray[i].word);
}

function generateNewFinalPointsArrayOnlyWords(){
  finalPointsArrayOnlyWords = [];
  for (var i = 0; i < finalPointsArray.length; i++) {
    finalPointsArrayOnlyWords.push(finalPointsArray[i].word);
  }
}

function playGameFromCurrentFinalPointsArray(){
  generateNewFinalPointsArrayOnlyWords();
  playGameFromPreviousQuizLists(true, finalPointsArrayOnlyWords);
}

function playGameAllWords(){
  playGameFromPreviousQuizLists(true, finalPointsArrayOnlyWords);
  // The next line clicks the expandPreviousLists button again so that it doesnt show.
  document.querySelector('#expandPreviousLists').click();
}

var supplementalFinalPointsArray = finalPointsArray;





// CODE THAT HAS TO DO WITH ADDING WORDS TO finalPointsArray---------------------------------------

function addSingleWordToFinalPointsArray(word){
  for (var i = 0; i < finalPointsArray.length; i++) {
    if (word === finalPointsArray[i].word) {
      console.log(word + ' is already in finalPointsArray!');
      return;
    }
  }
  for (var i = 0; i < supplementalFinalPointsArray.length; i++) {
    if (word === supplementalFinalPointsArray[i].word) {
      finalPointsArray.push(supplementalFinalPointsArray[i]);
      console.log('Added ' + word + ' to finalPointsArray from supplementalFinalPointsArray');
      return;
    }
  }
  for (var i = 0; i < databaseArray.length; i++) {
    if (word === databaseArray[i]) {
      finalPointsArray.push({
        word: word,
        number: 0
      });
      console.log('Added ' + word + ' to finalPointsArray from databaseArray');
      return;
    }
  }
}

function addMultipleRandomWordsToFinalPointsArray(number){
  limiter(number);
  var theRandomDatabaseArray = _arrayRandom(number, 0, databaseArray.length, true);
  for (var i = 0; i < theRandomDatabaseArray.length; i++) {
    addSingleWordToFinalPointsArray(databaseArray[theRandomDatabaseArray[i]]);
  }
}

function addSingleWordToFinalPointsArrayInputVersion() {
    addSingleWordToFinalPointsArray(document.querySelector('#specificWordForPlayGame-input').value);
}

// --------------------------------------------------------------------




var copyTextareaBtn = document.querySelector('.js-textareacopybtn');

copyTextareaBtn.addEventListener('click', function(event) {

  var stringOfCurrentWords = '';
  var lengthOfCurrentLearningList = document.querySelectorAll('.wordInCurrentLearningList').length;
  if (lengthOfCurrentLearningList > 0) {
    for (var i = 0; i < lengthOfCurrentLearningList; i++) {
      stringOfCurrentWords += document.querySelectorAll('.wordInCurrentLearningList')[i].innerHTML
    }
  }else {
    console.log('No Words In Current Learning List!');
    stringOfCurrentWords = ' ';
  }

  document.querySelector('.js-copytextarea').value = stringOfCurrentWords;
  var copyTextarea = document.querySelector('.js-copytextarea');
  copyTextarea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
});
