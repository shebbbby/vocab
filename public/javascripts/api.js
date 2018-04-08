
function checkIfOnlineOrOffline(){
	if(navigator.onLine){
		document.querySelector('#offlineIndicator').style.display = 'none';
	}else{
		document.querySelector('#offlineIndicator').style.display = 'block';
		$('html, body').stop(true,true).animate({
		scrollTop: $("#offlineIndicator").offset().top
	}, 2000)
	}
}

function updateCycleInformation() {
	var cycleDurationSeconds = ((Number(document.getElementById("numberOfWordsInLearningList").innerHTML)) * (cycleSpeed / 1000));
	var cycleDurationMinutes = cycleDurationSeconds / 60;
	document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Mins / ' + cycleDurationSeconds.toFixed(0) + ' Secs';
}

var copyOfDatabaseArray = databaseArray;

function displayCopyListButton(){
	if (wordsArray.length > 0) {
		document.getElementById("copyList").style.display = 'block';
	}else{
		document.getElementById("copyList").style.display = 'none';
	}
}

function addWord(word) {
	// Make sure wordsArray doesn't already have all words in database
	if (wordsArray.length !== databaseArray.length) {
		// if($.inArray(word, wordsArray) === -1){
		// If the plus sign button is 'style: block' AND word is NOT in learning list array, then add the word to learning list array
		if (document.getElementById("plus-" + word).style.display === 'block' && $.inArray(word, wordsArray) === -1) {
			console.log("Adding: " + word + ' to learning list!');
			console.log("----------------------------------------");
			wordsArray.push(word);
			turnCurrentLearningListSpanIntoClickableArray();
			document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
			document.getElementById("plus-" + word).style.display = 'none';
			document.getElementById("checkmark-" + word).style.display = 'block';
			displayCopyListButton(); if (wordsArray.length > 5) {
				document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'block';
				document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'block';
				document.getElementById("playGameFromNextToAddWordButton").style.display = 'block';
			}
			document.getElementById('word-search-error').style.display = 'none';
			document.getElementById('repeat-word-error').style.display = 'none';
			updateCycleInformation();
		} else {
			var randomWordNumber = Math.floor(Math.random() * databaseArray.length);
			console.log(word + ' is already in learning list!');
			addWord(databaseArray[randomWordNumber]);
		}
	} else {
		console.log('You dont have any more words that you can add!');
	}
}
// }
function cycleTime() {
	document.getElementById("cycleTime").innerHTML = document.getElementById("numberOfWordsInLearningList").innerHTML;
}

function removeWordFromStudyArray(word) {
	// Find where word exists in wordsArray
	var indexOfWord = wordsArray.indexOf(word);
	// Splice word from wordsArray
	wordsArray.splice(indexOfWord, 1);
	console.log('Removing ' + word + ' from learning list!');
	displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
		document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
		document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
	}
	turnCurrentLearningListSpanIntoClickableArray();
	document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
	document.querySelector("#plus-" + word).style.display = 'block';
	document.querySelector("#checkmark-" + word).style.display = 'none';
	updateCycleInformation();
}

function showSpeedInput() {
	document.querySelector("#speed-input").style.display = 'block';
	document.querySelector(".edit-speed-off").style.display = 'block';
	document.querySelector(".edit-speed-on").style.display = 'none';
}

function hideSpeedInput() {
	document.querySelector("#speed-input").style.display = 'none';
	document.querySelector(".edit-speed-off").style.display = 'none';
	document.querySelector(".edit-speed-on").style.display = 'block';
}

function showCustomInputs() {
	document.querySelector("#hidden-inputs").style.display = 'block';
}

var wordsArray = [];
var wordCount = 0;
cycleSpeed = 5000;
document.querySelector('#cycleSpeed').innerHTML = (cycleSpeed / 1000) + ' Seconds/Word';
document.getElementById("cycleTime").innerHTML = '0 Seconds';

function changeSpeed(input) {
	var x = document.querySelector("#speed-input").value;
	cycleSpeed = Number(x) * 1000;
	console.log(cycleSpeed / 1000 + ' Seconds Per Word');
	document.querySelector('#cycleSpeed').innerHTML = (cycleSpeed / 1000) + ' Seconds / Word';
	document.querySelector('#defaultSpeed').innerHTML = '';
	updateCycleInformation(); // document.getElementById("time").innerHTML = cycleSpeed;
	document.querySelector("#speed-input").value = '';
}

// This is only if you use the input to add something
function addWordUsingInput() {
	var x = document.getElementById("age").value;
	wordsArray.push(x);
	document.getElementById("age").value = '';
	turnCurrentLearningListSpanIntoClickableArray();
}


function cycleUpDefinition(){
  // if(randomNumber === countSens){
  //     thesaurus(currentFlashcardWord,0);
  // }else{
      thesaurus(currentFlashcardWord,randomNumber+1);
  // }
}
function cycleDownDefinition(){
  if(randomNumber === 1){
      thesaurus(currentFlashcardWord,0);
  }else{
      thesaurus(currentFlashcardWord,randomNumber-1);
  }
}

function resetWordCountIfZero(){
	if (wordCount === wordsArray.length) {
		console.log('Resetting the cycle to 0 and shuffling wordsArray!');
		wordsArray = shuffle(wordsArray);
		turnCurrentLearningListSpanIntoClickableArray();
		wordCount = 0;
	}
}

function cycleWordsArray(num) {
	if (num >= 0) {
		wordCount = num;
	}
// TESTING IF SHOULD SKIP WORD ----------------------------------------------
	// var theWordToBeDisplayed = wordsArray[wordCount];
	//
	// for (var i = 0; i < wordsThatAreToBeSkippedNextRound.length; i++) {
	// 	if(theWordToBeDisplayed === wordsThatAreToBeSkippedNextRound[i]){
	// 		console.log('Skipping to next word because "' + theWordToBeDisplayed + '" is in wordsThatAreToBeSkippedNextRound array!');
	// 		// theWordToBeDisplayed = wordsArray[wordCount+1];
	// 		wordCount++;
	// 		resetWordCountIfZero();
	// 		wordsThatAreToBeSkippedNextRound.splice(i,1);
	// 	}
	// }
	// for (var i = 0; i < wordsThatAreToBeSkippedEveryRound.length; i++) {
	// 	if(theWordToBeDisplayed === wordsThatAreToBeSkippedEveryRound[i]){
	// 		console.log('Skipping to next word because "' + theWordToBeDisplayed + '" is in wordsThatAreToBeSkippedEveryRound array!');
	// 		// theWordToBeDisplayed = wordsArray[wordCount+1];
	// 		wordCount++;
	// 		spliceFromArray(wordsArray,theWordToBeDisplayed);
	// 		resetWordCountIfZero();
	// 	}
	// }
	//  -------------------------------------------------------------------------
	thesaurus(wordsArray[wordCount]);
	wordCount++;
	resetWordCountIfZero();
	checkIfOnlineOrOffline();
}






// CODE THAT HAS TO WITH SKIPPING WORDS -------------------------------------------------------------------

var wordsThatAreToBeSkippedNextRound = [];
var wordsThatAreToBeSkippedEveryRound= [];

function addWordToWordsThatAreToBeSkippedNextRoundArray(word){
	wordsThatAreToBeSkippedNextRound.push(word);
}

function removeWordFromWordsThatAreToBeSkippedNextRoundArray(word){
	spliceFromArray(wordsThatAreToBeSkippedNextRound, word);
}

function skipWordIfWordIsInWordsThatAreToBeSkippedNextRoundArray(word){
	for (var i = 0; i < wordsThatAreToBeSkippedNextRound.length; i++) {
		if(word === wordsThatAreToBeSkippedNextRound[i]){
			console.log('Skipping/Going to next word because ' + word + ' is in wordsThatAreToBeSkippedNextRound array!');
			nextWord();
			wordsThatAreToBeSkippedNextRound.splice(i,1);
		}
	}
}

function skipWordIfWordIsInWordsThatAreToBeSkippedEveryRoundArray(word){
	for (var i = 0; i < wordsThatAreToBeSkippedEveryRound.length; i++) {
		if(word === wordsThatAreToBeSkippedEveryRound[i]){
			console.log('Skipping/Going to next word because ' + word + ' is in wordsThatAreToBeSkippedEveryRound array!');
			nextWord();
		}
	}
}


function addWordToWordsThatAreToBeSkippedEveryRoundArray(word){
	document.querySelector('#startSkippingWordButtonOnFlashcard').style.display = 'none';
	wordsThatAreToBeSkippedEveryRound.push(word);
	document.querySelector('.wordsThatAreBeingSkipped').style.display = 'block';
	// document.querySelector('#wordsBeingSkippedArray').innerHTML = wordsThatAreToBeSkippedEveryRound;
	removeWordClickableSpanInCurrentLearningList(word);
	getAllSentences();
	console.log('Adding '+word+' to wordsThatAreToBeSkippedEveryRound Array!!!');
	updateWordsBeingSkippedArrayInnerHtml();
}

// function addAllWordsBackToLearningListFromSkippedEveryRoundArray(){
// 	for (var i = 0; i < wordsThatAreToBeSkippedEveryRound.length; i++) {
// 		addWordToWordsThatAreToBeSkippedEveryRoundArray(wordsThatAreToBeSkippedEveryRound[i]);
// 	}
// }

function removeWordFromWordsThatAreToBeSkippedEveryRoundArray(word){
	spliceFromArray(wordsThatAreToBeSkippedEveryRound, word);
	if(wordsThatAreToBeSkippedEveryRound.length === 0){
		document.querySelector('.wordsThatAreBeingSkipped').style.display = 'none';
	}
}

function addWordToLearningListAndRemoveFromSkippingList(word){
	document.querySelector('#specificWord-input').value= word;
	document.querySelector('#addSpecificWordButton').click();
	removeWordFromWordsThatAreToBeSkippedEveryRoundArray(word);
	updateWordsBeingSkippedArrayInnerHtml();
}

function updateWordsBeingSkippedArrayInnerHtml(){
	var newInnerHTMLSpan = '';
	for (var i = 0; i < wordsThatAreToBeSkippedEveryRound.length; i++) {
		if(i === wordsThatAreToBeSkippedEveryRound.length - 1){
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInCurrentLearningList" id="'+wordsThatAreToBeSkippedEveryRound[i]+'-currentLearningList'+'" onclick="addWordToLearningListAndRemoveFromSkippingList(`'+wordsThatAreToBeSkippedEveryRound[i]+'`)">'+wordsThatAreToBeSkippedEveryRound[i]+'</span>';
		}else{
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInCurrentLearningList" id="'+wordsThatAreToBeSkippedEveryRound[i]+'-currentLearningList'+'" onclick="addWordToLearningListAndRemoveFromSkippingList(`'+wordsThatAreToBeSkippedEveryRound[i]+'`)">'+wordsThatAreToBeSkippedEveryRound[i]+',</span>';
		}
	}
	document.querySelector('#wordsBeingSkippedArray').innerHTML = newInnerHTMLSpan;
}

// -------------------------------------------------------------------







function previousWord() {
	if (wordCount >= 2) {
		cycleWordsArray(wordCount - 2)
	} else if (currentFlashcardWordIndexInStudyArray === 0) {
		cycleWordsArray(wordsArray.length - 1);
	} else {
		cycleWordsArray(wordsArray.length - 2);
	}
}

function nextWord() {
	cycleWordsArray(wordCount)
}

// Use this function to shuffle the wordsArray evey time it goes through cycle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


// Meant to allow you to remove word from learning array when cycle has already started.
function removeWordButton(word) {
	var indexOfWord = wordsArray.indexOf(word);
	for (var i = 0; i < sentencesArray.length; i++) {
		if (word === sentencesArray[i].word) {
			var indexOfWordSentence = i;
		}
	}
	sentencesArray.splice(indexOfWordSentence, 1);
	// If you are removing any word but the last word, skip to the next word
	if (currentFlashcardWordIndexInStudyArray !== wordsArray.length - 1) {
		console.log('Removing ' + word + ' from learning list!');
		wordsArray.splice(indexOfWord, 1);
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.querySelector("#plus-" + word).style.display = 'block';
		document.querySelector("#checkmark-" + word).style.display = 'none';
		// getAllSentences();
		updateCycleInformation();
		turnCurrentLearningListSpanIntoClickableArray();
		cycleWordsArray(currentFlashcardWordIndexInStudyArray);
	}
	// If you are removing the last word, skip to the first word in array.
	else if (currentFlashcardWordIndexInStudyArray === wordsArray.length - 1) {
		wordsArray.splice(indexOfWord, 1);
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.querySelector("#plus-" + word).style.display = 'block';
		document.querySelector("#checkmark-" + word).style.display = 'none';
		turnCurrentLearningListSpanIntoClickableArray();
		updateCycleInformation();
		cycleWordsArray(wordsArray[1]);
	}
	if (wordsArray.length === 0) {
		alert('You do not have any words left! Please select some words!');
		document.querySelector("body").style.display = 'none';
		location.reload();
	}
}

var cycleTimer = cycleSpeed;
var intervalCycle = function () {
	setInterval(function () {

		// Meant to add timer next to v.1 on word flashcard
		// var cycleTimerInterval = setInterval(function(){
		//   cycleTimer -= 1000;
		//   if(cycleTimer > -1000){
		//   document.getElementById('timer').innerHTML = ' ' + cycleTimer/1000;
		// }
		//   if(cycleTimer < 0){
		//     cycleTimer = cycleSpeed;
		//     clearInterval(cycleTimerInterval);
		//   }
		// }, 1000);

		cycleWordsArray();
	}, cycleSpeed);
}

// Starts cycling with wordsArray and cycleSpeed
function startCycle() {
	lookedUpWordNotCycle = false;
	if (wordsArray.length > 0) {
		getAllSentences();
		document.querySelector('.flashcard').style.display = 'block';
		document.getElementById('colorLabelInforation').style.display = 'block';
		// document.querySelector('#next-previous-buttons').style.display = 'block';
		document.querySelector('#display-words-list').style.display = 'block';
		document.querySelector('#begin-cycle-button').style.display = 'none';
		document.querySelector('#hideUponBegin').style.display = 'none';
		document.getElementById('begin-error').style.display = 'none';
		document.getElementById('second-body').style.display = 'none';
		document.getElementById('beginTheCycle').style.display = 'none';
		// document.querySelector('#theRowWithLearnAndDatabase').style.display = 'none';
		nextWord();
		intervalCycle();

		// Scroll to flashcard
		realignFlashcard();

	}
}
var hoveredOnFlashcard = false;
  $( ".flashcard" ).hover(
  function() {
    console.log('Hovered over flashcard, keydown listener activated');
    startKeydownListener();
    hoveredOnFlashcard = true;
  }, function() {
    console.log('Not Hovered over flashcard, keydown listener deactivated');
    stopKeydownListener();
    hoveredOnFlashcard = false;
  }
);
// This checks to see if mouse is on html page or not. Assists in flashcard keydown listeners
$( "html" ).hover(
function() {
  // If flashcard is displayed, and not hovered over flashcard, stop keydown listeners
  if(document.querySelector('.flashcard').style.display === 'block' && !hoveredOnFlashcard){
    stopKeydownListener();
  }
}, function() {
  // If flashcard is displayed, and you leave the page with mouse but dont yet click on anything, still allow and activate keydown listeners
  if(document.querySelector('.flashcard').style.display === 'block' ){
    startKeydownListener();
    console.log('You left the page, keydown listener activated');
  }
}
);
// }

function realignFlashcard(){
	// Scroll to flashcard
	$('html, body').stop(true,true).animate({
	scrollTop: $(".flashcard").offset().top + 23
}, 2000)
	$('body, html').scrollLeft(28);
}

function keyDownListener(e) {
  switch (e.keyCode) {
    // When pressing left key, go to previous word.
    case 37:
      document.querySelector('#previousWordButton').click();
      e.preventDefault();
      break;
      // When pressing space, play the word sound
    case 32:
      document.querySelector('#volumeUp').click();
      e.preventDefault();
      break;
      // When pressing right key, go to next word.
    case 39:
      document.querySelector('#nextWordButton').click();
      e.preventDefault();
      break;
      // When pressing "d", play the definition sound
    case 68:
      document.querySelector('#definitionBolded').click();
      e.preventDefault();
      break;
      // When pressing "s", play the sentence sound
    case 83:
      document.querySelector('#sentenceBolded').click();
      e.preventDefault();
      break;
    case 65:
      document.querySelector('#makeAutomaticPlayButtonTrue').click();
      e.preventDefault();
      break;
		case 82:
			realignFlashcard();
			e.preventDefault();
			break;
    case 49:
      document.querySelector('.synonym-1').click();
      e.preventDefault();
      break;
    case 50:
      document.querySelector('.synonym-2').click();
      e.preventDefault();
      break;
    case 51:
      document.querySelector('.synonym-3').click();
      e.preventDefault();
      break;
    case 52:
      document.querySelector('.synonym-4').click();
      e.preventDefault();
      break;
    case 53:
      document.querySelector('.synonym-5').click();
      e.preventDefault();
      break;
    case 54:
      document.querySelector('.synonym-6').click();
      e.preventDefault();
      break;
    case 55:
      document.querySelector('.synonym-7').click();
      e.preventDefault();
      break;
    case 56:
      document.querySelector('.synonym-8').click();
      e.preventDefault();
      break;
    case 57:
      document.querySelector('.synonym-9').click();
      e.preventDefault();
      break;
    case 48:
      document.querySelector('.synonym-10').click();
      e.preventDefault();
      break;
      // Remove word for learning list by pressing delete/backspace
    case 8:
      document.querySelector('#removeWordButton').click();
      e.preventDefault();
      break;
    case 38:
      cycleUpDefinition();
      e.preventDefault();
      break;
    case 40:
      cycleDownDefinition();
      e.preventDefault();
      break;
  }
}
function startKeydownListener(){
  document.addEventListener('keydown', keyDownListener, false);
}
function stopKeydownListener(){
  document.removeEventListener("keydown", keyDownListener, false);
}

// Starts cycling with wordsArray and cycleSpeed
function displayWordsList() {
	document.querySelector('#hideUponBegin').style.display = 'block';
	document.querySelector('#begin-cycle-button').style.display = 'block';
	document.querySelector('#begin-cycle-button').innerHTML = 'Continue';
	document.querySelector('#display-words-list').style.display = 'none';
}

var wordsNotFoundByApiArray = [];

// startCycle();
function inputFiller() {
	document.querySelector('#wordsInLearningList-input').value = wordsArray;
	var uploadWordsArray = document.querySelector('#age').value.split(",");
	console.log(uploadWordsArray);
	var newWord = uploadWordsArray[0].toLowerCase().replace(/\s/g, '');
	wordToWords();
	$.ajax({
		url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/' + newWord + '?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
		method: "GET",
		success: function (response) {
			// If database already has that word then display error message
			// Convert value to have no upper case or spaces
			if ($.inArray(newWord.toLowerCase().replace(/\s/g, ''), databaseArray) == -1) {
				if (document.querySelector('#word-input') != '' && response.querySelector('hw')) {
					document.querySelector('#word-input').value = response.querySelector('hw').innerHTML
				}
				if (document.querySelector('#definition-input') != '' && response.querySelector('mc')) {
					document.querySelector('#definition-input').value = response.querySelector('mc').innerHTML
				}
				if (document.querySelector('#speech-input') != '' && response.querySelector('fl')) {
					document.querySelector('#speech-input').value = response.querySelector('fl').innerHTML
				}
				if (document.querySelector('#sentence-input') != '' && response.querySelector('vi')) {
					document.querySelector('#sentence-input').value = response.querySelector('vi').innerHTML
				}
				if (document.querySelector('#synonyms-input') != '' && response.querySelector('syn')) {
					document.querySelector('#synonyms-input').value = response.querySelector('syn').innerHTML
				}
				if (document.querySelector('#relatedwords-input') != '' && response.querySelector('rel')) {
					document.querySelector('#relatedwords-input').value = response.querySelector('rel').innerHTML
				}
				if (document.querySelector('#antonyms-input') != '' && response.querySelector('ant')) {
					document.querySelector('#antonyms-input').value = response.querySelector('ant').innerHTML
				}
				if (response.querySelector('hw')) {
					document.getElementById('word-search-success').innerHTML = capitalizeFirstLetter(newWord) + ' was added!';
					document.getElementById('word-search-success').style.display = 'block';
					document.getElementById('word-search-error').style.display = 'none';
					document.getElementById('repeat-word-error').style.display = 'none';
					document.getElementById('begin-error').style.display = 'none';
					if (uploadWordsArray.length === 1) {
						document.getElementById('word-submitter').click();
					} else {
						document.getElementById('words-uploading').style.display = 'block';
						// Give wordToWords() time to finish all ajax requests before clicking and posting.
						setTimeout(function () {
							document.getElementById('word-submitter').click();
						}, 3000);
					}
				}
				if (!response.querySelector('hw')) {
					document.getElementById('word-search-error').innerHTML = 'Sorry, ' + capitalizeFirstLetter(newWord) + ' not Found';
					wordsNotFoundByApiArray.push(newWord);
					document.getElementById('word-search-error').style.display = 'block';
					document.getElementById('repeat-word-error').style.display = 'none';
				}
			} else {
				document.getElementById('repeat-word-error').innerHTML = 'You Already Have The Word: ' + capitalizeFirstLetter(newWord);
				document.getElementById('repeat-word-error').style.display = 'block';
				document.getElementById('word-search-error').style.display = 'none';
			}
		},
		error: function (err) {
			console.log(err);
		}
	})
}
// }

var wordsToAdd = [];

function downloadSynonymNewWords() {
	document.querySelector('#wordsInLearningList-input').value = wordsArray;
	document.querySelector('#words-input').value = '';
	for (var i = 0; i <= wordsToAdd.length - 1; i++) {
		// If the word is not already in database
		if ($.inArray(wordsToAdd[i].toLowerCase().replace(/\s/g, ''), databaseArray) !== -1) {
			wordsToAdd.splice(i, 1);
		}
	}
	document.querySelector('#word-input').value = wordsToAdd[0];
	for (var i = 1; i <= wordsToAdd.length - 1; i++) {
		if (i === wordsToAdd.length - 1) {
			document.querySelector('#words-input').value += wordsToAdd[i];
		} else {
			document.querySelector('#words-input').value += wordsToAdd[i] + ',';
		}
	}
	document.getElementById('word-submitter').click();
}



function submitQuiz() {
	// if(wordsToAdd.length > 0){
	setTimeout(function () {
		downloadSynonymNewWords();
	}, 1000);
	//
	// }
	// else{
	//   setTimeout(function(){ document.getElementById('word-submitter').click(); }, 3000);
	// }
}

function addWordEvenIfNotInDatabaseIfItPassedAjaxTest(word, arrayToAddWordInto) {
	var indexOfWord = arrayToAddWordInto.indexOf(word);
	$.ajax({
		url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/' + word + '?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
		method: "GET",
		success: function (response) {
			// If database already has that word then display error message
			// Convert value to have no upper case or spaces
			if (response.querySelector('hw')) {
				console.log(word + ' was successfully found and will be ADDED WORD TO BOTH arrayToAddWordInto and wordsToAdd');

				if ($.inArray(word.toLowerCase().replace(/\s/g, ''), wordsToAdd) === -1){
          wordsToAdd.push(word);
          document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
          document.getElementById("wordstoaddparagraph").style.display = 'block';
          document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
          document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
				}else{console.log(word + ' is already in the wordsToAdd Array!');}
				if ($.inArray(word.toLowerCase().replace(/\s/g, ''), arrayToAddWordInto) === -1){
          arrayToAddWordInto.push(word);
          turnCurrentLearningListSpanIntoClickableArray();

					// If you are using this code during synonym cluster game
					if(arrayToAddWordInto === synonymClusterArray){
						updateSynonymClusterNumberHtml();
					}

          document.getElementById("numberOfWordsInLearningList").innerHTML = arrayToAddWordInto.length;
          updateCycleInformation();
				}else{console.log(word + ' is already in the arrayToAddWordInto Array!');}
        return true;
		}else{
      console.log(word + ' was NOT successfully found');
			wordsNotFoundByApiArray.push(word);
    }
  },
		error: function (err) {
			console.log(err);
		}
	})
}

function addWordFromSynonyms(word) {
	// if($.inArray(word, wordsArray) === -1){
	// If the plus sign button is 'style: block' then add the word
	var indexOfWord = wordsArray.indexOf(word);
	var indexOfWordInWordsToAddArray = wordsToAdd.indexOf(word);

	if (document.getElementById("synonym-" + word).style.color === 'red') {
		wordsToAdd.push(word);
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("synonym-" + word).style.color = 'fuchsia';
		document.getElementById("wordstoaddparagraph").style.display = 'block';
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
	} else if (document.getElementById("synonym-" + word).style.color === 'fuchsia') {
		wordsArray.push(word);
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("synonym-" + word).style.color = 'blue';
		updateCycleInformation();
		getSentence(word);
	} else if ($.inArray(word, wordsArray) === -1 && document.getElementById("synonym-" + word).style.color === 'green') {
		console.log($.inArray(word, wordsArray));
		getSentence(word);
		wordsArray.push(word);
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("synonym-" + word).style.color = 'blue';
		updateCycleInformation();
		if ($.inArray(word, databaseArray) !== -1) {
			document.getElementById("plus-" + word).style.display = 'none';
			document.getElementById("checkmark-" + word).style.display = 'block';
		}
		if ($.inArray(word, databaseArray) === -1 && $.inArray(word, wordsToAdd) === -1) {
			wordsToAdd.push(word);
			document.getElementById("wordstoaddparagraph").style.display = 'block';
			document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
			document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
		}
	}
	// if color is blue and word is not in database:
	else if (document.getElementById("synonym-" + word).style.color === 'blue' && $.inArray(word, databaseArray) !== -1) {
		wordsArray.splice(indexOfWord, 1);
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		getAllSentences();
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("synonym-" + word).style.color = 'green';
		updateCycleInformation();
		document.getElementById("plus-" + word).style.display = 'block';
		document.getElementById("checkmark-" + word).style.display = 'none';
	} else if (document.getElementById("synonym-" + word).style.color === 'blue' && $.inArray(word, databaseArray) === -1) {
		wordsArray.splice(indexOfWord, 1);
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		getAllSentences();
		wordsToAdd.splice(indexOfWordInWordsToAddArray, 1);
		turnCurrentLearningListSpanIntoClickableArray();
		if (wordsToAdd.length === 0) {
			document.getElementById("wordstoaddparagraph").style.display = 'none';
		}
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("synonym-" + word).style.color = 'red';
		updateCycleInformation();
	}
}

function addWordFromAntonyms(word) {
	// if($.inArray(word, wordsArray) === -1){
	// If the plus sign button is 'style: block' then add the word
	var indexOfWord = wordsArray.indexOf(word);
	var indexOfWordInWordsToAddArray = wordsToAdd.indexOf(word);

	if (document.getElementById("antonym-" + word).style.color === 'red') {
		wordsToAdd.push(word);
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("antonym-" + word).style.color = 'fuchsia';
		document.getElementById("wordstoaddparagraph").style.display = 'block';
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
	} else if (document.getElementById("antonym-" + word).style.color === 'fuchsia') {
		wordsArray.push(word);
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("antonym-" + word).style.color = 'blue';
		updateCycleInformation();
		getSentence(word);
	} else if ($.inArray(word, wordsArray) === -1 && document.getElementById("antonym-" + word).style.color === 'green') {
		console.log($.inArray(word, wordsArray));
		getSentence(word);
		wordsArray.push(word);
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("antonym-" + word).style.color = 'blue';
		updateCycleInformation();
		if ($.inArray(word, databaseArray) !== -1) {
			document.getElementById("plus-" + word).style.display = 'none';
			document.getElementById("checkmark-" + word).style.display = 'block';
		}
		if ($.inArray(word, databaseArray) === -1 && $.inArray(word, wordsToAdd) === -1) {
			wordsToAdd.push(word);
			document.getElementById("wordstoaddparagraph").style.display = 'block';
			document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
			document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
		}
	}
	// if color is blue and word is not in database:
	else if (document.getElementById("antonym-" + word).style.color === 'blue' && $.inArray(word, databaseArray) !== -1) {
		wordsArray.splice(indexOfWord, 1);
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		getAllSentences();
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("antonym-" + word).style.color = 'green';
		updateCycleInformation();
		document.getElementById("plus-" + word).style.display = 'block';
		document.getElementById("checkmark-" + word).style.display = 'none';
	} else if (document.getElementById("antonym-" + word).style.color === 'blue' && $.inArray(word, databaseArray) === -1) {
		wordsArray.splice(indexOfWord, 1);
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		getAllSentences();
		wordsToAdd.splice(indexOfWordInWordsToAddArray, 1);
		turnCurrentLearningListSpanIntoClickableArray();
		if (wordsToAdd.length === 0) {
			document.getElementById("wordstoaddparagraph").style.display = 'none';
		}
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("antonym-" + word).style.color = 'red';
		updateCycleInformation();
	}
}
function addWordFromRelatedWords(word) {
	// if($.inArray(word, wordsArray) === -1){
	// If the plus sign button is 'style: block' then add the word
	var indexOfWord = wordsArray.indexOf(word);
	var indexOfWordInWordsToAddArray = wordsToAdd.indexOf(word);

	if (document.getElementById("relatedWord-" + word).style.color === 'red') {
		wordsToAdd.push(word);
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("relatedWord-" + word).style.color = 'fuchsia';
		document.getElementById("wordstoaddparagraph").style.display = 'block';
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
	} else if (document.getElementById("relatedWord-" + word).style.color === 'fuchsia') {
		wordsArray.push(word);
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("relatedWord-" + word).style.color = 'blue';
		updateCycleInformation();
		getSentence(word);
	} else if ($.inArray(word, wordsArray) === -1 && document.getElementById("relatedWord-" + word).style.color === 'green') {
		console.log($.inArray(word, wordsArray));
		getSentence(word);
		wordsArray.push(word);
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("relatedWord-" + word).style.color = 'blue';
		updateCycleInformation();
		if ($.inArray(word, databaseArray) !== -1) {
			document.getElementById("plus-" + word).style.display = 'none';
			document.getElementById("checkmark-" + word).style.display = 'block';
		}
		if ($.inArray(word, databaseArray) === -1 && $.inArray(word, wordsToAdd) === -1) {
			wordsToAdd.push(word);
			document.getElementById("wordstoaddparagraph").style.display = 'block';
			document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
			document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
		}
	}
	// if color is blue and word is not in database:
	else if (document.getElementById("relatedWord-" + word).style.color === 'blue' && $.inArray(word, databaseArray) !== -1) {
		wordsArray.splice(indexOfWord, 1);
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		getAllSentences();
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("relatedWord-" + word).style.color = 'green';
		updateCycleInformation();
		document.getElementById("plus-" + word).style.display = 'block';
		document.getElementById("checkmark-" + word).style.display = 'none';
	} else if (document.getElementById("relatedWord-" + word).style.color === 'blue' && $.inArray(word, databaseArray) === -1) {
		wordsArray.splice(indexOfWord, 1);
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		getAllSentences();
		wordsToAdd.splice(indexOfWordInWordsToAddArray, 1);
		turnCurrentLearningListSpanIntoClickableArray();
		if (wordsToAdd.length === 0) {
			document.getElementById("wordstoaddparagraph").style.display = 'none';
		}
		document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
		document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById("relatedWord-" + word).style.color = 'red';
		updateCycleInformation();
	}
}

var appendThis;
var currentFlashcardWord;
var currentFlashcardWordIndexInStudyArray;
var randomNumber;
var countSens;

function thesaurus(word,definitonNumber) {
	$.ajax({
		url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/' + word + '?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
		method: "GET",
		success: function (response) {
			if (response.querySelector('hw')) {
				currentFlashcardWord = response.querySelector('hw').innerHTML;
				currentFlashcardWordIndexInStudyArray = wordsArray.indexOf(currentFlashcardWord);
				console.log(response);
				console.log(currentFlashcardWord);
				console.log('Cycle to Word# ' + currentFlashcardWordIndexInStudyArray);
				automaticallyPlaySoundUponCycle();
				countSens = 0;
				for (var i = 0; i <= 20; i++) {
					if (response.getElementsByTagName('sens')[i]) {
						countSens++
					}
          else{
            break;
          }
				}
        console.log('countSens: ' + countSens);
      // This is the functionality for the cycleUpDefinition and cycleDownDefinition functions
        if(definitonNumber || definitonNumber === 0){
          randomNumber = definitonNumber;
          if(definitonNumber+1 > countSens){
            randomNumber = 0;
          }
          if(definitonNumber < 0){
            randomNumber = countSens-1;
          }
          if(definitonNumber === 0){
            randomNumber = 0;
          }
        }
        else{
          randomNumber = Math.floor(Math.random() * countSens);
        }

				// CODE THAT HAS TO DO WITH SYNONYMS--------------------------------------------------

			if(response.getElementsByTagName('syn')[randomNumber]){
        var synonyms = response.getElementsByTagName('syn')[randomNumber].innerHTML;
				var synonymsArray = synonyms.split(",");

				function isInArray(value, array) {
					return array.indexOf(value) > -1;
				}

				function addSynonymsHtml() {
					var synonymsHtml = '';
					var plusOner = 1;
					for (var i = 0; i <= synonymsArray.length - 1; i++) {
						var iString = (i + plusOner).toString();
						var comma = ', ';
						if (i === synonymsArray.length - 1) {
							comma = '';
						}
						var noSpacesWord = synonymsArray[i].replace(" ", "");
						if (noSpacesWord === response.querySelector('hw').innerHTML) {
							plusOner = 0;
							synonymsHtml += '';
						}
						// If a synonym has symbols incombatible with the api search, make it black.
						else if (noSpacesWord.includes("(") || noSpacesWord.includes(")") || noSpacesWord.includes("[") || noSpacesWord.includes("]")) {
							// noSpacesWord = noSpacesWord.replace(/(.*)/, '');
							synonymsHtml += '<span style="color: black; cursor: auto;">' + noSpacesWord + comma + '</span>';
						} else if (isInArray(noSpacesWord, wordsArray)) {
							// If word is in learning list, make it blue
							synonymsHtml += '<span class="synonym-' + iString + '" id="synonym-' + noSpacesWord + '" style="color: blue; cursor: pointer;" onclick="addWordFromSynonyms(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
						} else if (isInArray(noSpacesWord, databaseArray)) {
							// If word is in database, make it green
							synonymsHtml += '<span class="synonym-' + iString + '" id="synonym-' + noSpacesWord + '" style="color: green; cursor: pointer;" onclick="addWordFromSynonyms(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
						} else if (isInArray(noSpacesWord, wordsToAdd)) {
							// If word is in learning list, make it blue
							synonymsHtml += '<span class="synonym-' + iString + '" id="synonym-' + noSpacesWord + '" style="color: fuchsia; cursor: pointer;" onclick="addWordFromSynonyms(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
						} else {
							// If word is not in database, make it red
							synonymsHtml += '<span class="synonym-' + iString + '" id="synonym-' + noSpacesWord + '" style="color: red; cursor: pointer;"onclick="addWordFromSynonyms(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
						}
					}
					return synonymsHtml;
				}
				var synonymsHtml = addSynonymsHtml();
			}
				// -------------------------------------------------------------------------------------------------------------------

				// CODE THAT HAS TO DO WITH Antonyms--------------------------------------------------

				if(response.getElementsByTagName('ant')[randomNumber]){
					var antonyms = response.getElementsByTagName('ant')[randomNumber].innerHTML;
					var antonymsArray = antonyms.split(",");

					function isInArray(value, array) {
						return array.indexOf(value) > -1;
					}

					function addAntonymsHtml() {
						var antonymsHtml = '';
						var plusOner = 1;
						for (var i = 0; i <= antonymsArray.length - 1; i++) {
							var iString = (i + plusOner).toString();
							var comma = ', ';
							if (i === antonymsArray.length - 1) {
								comma = '';
							}
							var noSpacesWord = antonymsArray[i].replace(" ", "");
							if (noSpacesWord === response.querySelector('hw').innerHTML) {
								plusOner = 0;
								antonymsHtml += '';
							}
							// If a synonym has symbols incombatible with the api search, make it black.
							else if (noSpacesWord.includes("(") || noSpacesWord.includes(")") || noSpacesWord.includes("[") || noSpacesWord.includes("]")) {
								// noSpacesWord = noSpacesWord.replace(/(.*)/, '');
								antonymsHtml += '<span style="color: black; cursor: auto;">' + noSpacesWord + comma + '</span>';
							} else if (isInArray(noSpacesWord, wordsArray)) {
								// If word is in learning list, make it blue
								antonymsHtml += '<span class="antonym-' + iString + '" id="antonym-' + noSpacesWord + '" style="color: blue; cursor: pointer;" onclick="addWordFromAntonyms(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
							} else if (isInArray(noSpacesWord, databaseArray)) {
								// If word is in database, make it green
								antonymsHtml += '<span class="antonym-' + iString + '" id="antonym-' + noSpacesWord + '" style="color: green; cursor: pointer;" onclick="addWordFromAntonyms(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
							} else if (isInArray(noSpacesWord, wordsToAdd)) {
								// If word is in learning list, make it blue
								antonymsHtml += '<span class="antonym-' + iString + '" id="antonym-' + noSpacesWord + '" style="color: fuchsia; cursor: pointer;" onclick="addWordFromAntonyms(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
							} else {
								// If word is not in database, make it red
								antonymsHtml += '<span class="antonym-' + iString + '" id="antonym-' + noSpacesWord + '" style="color: red; cursor: pointer;"onclick="addWordFromAntonyms(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
							}
						}
						return antonymsHtml;
					}
					var antonymsHtml = addAntonymsHtml();
				}

				// -------------------------------------------------------------------------------------------------------------------
				// CODE THAT HAS TO DO WITH Related Words--------------------------------------------------

				if(response.getElementsByTagName('rel')[randomNumber]){
					var relatedWords = response.getElementsByTagName('rel')[randomNumber].innerHTML;
					var relatedWordsArray = relatedWords.split(",");

					function isInArray(value, array) {
						return array.indexOf(value) > -1;
					}

					function addRelatedWordsHtml() {
						var relatedWordsHtml = '';
						var plusOner = 1;
						for (var i = 0; i <= relatedWordsArray.length - 1; i++) {
							var iString = (i + plusOner).toString();
							var comma = ', ';
							if (i === relatedWordsArray.length - 1) {
								comma = '';
							}
							var noSpacesWord = relatedWordsArray[i].replace(" ", "");
							if (noSpacesWord === response.querySelector('hw').innerHTML) {
								plusOner = 0;
								relatedWordsHtml += '';
							}
							// If a synonym has symbols incombatible with the api search, make it black.
							else if (noSpacesWord.includes("(") || noSpacesWord.includes(")") || noSpacesWord.includes("[") || noSpacesWord.includes("]")|| noSpacesWord.includes(";")) {
								// noSpacesWord = noSpacesWord.replace(/(.*)/, '');
								relatedWordsHtml += '<span style="color: black; cursor: auto;">' + noSpacesWord + comma + '</span>';
							} else if (isInArray(noSpacesWord, wordsArray)) {
								// If word is in learning list, make it blue
								relatedWordsHtml += '<span class="relatedWord-' + iString + '" id="relatedWord-' + noSpacesWord + '" style="color: blue; cursor: pointer;" onclick="addWordFromRelatedWords(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
							} else if (isInArray(noSpacesWord, databaseArray)) {
								// If word is in database, make it green
								relatedWordsHtml += '<span class="relatedWord-' + iString + '" id="relatedWord-' + noSpacesWord + '" style="color: green; cursor: pointer;" onclick="addWordFromRelatedWords(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
							} else if (isInArray(noSpacesWord, wordsToAdd)) {
								// If word is in learning list, make it blue
								relatedWordsHtml += '<span class="relatedWord-' + iString + '" id="relatedWord-' + noSpacesWord + '" style="color: fuchsia; cursor: pointer;" onclick="addWordFromRelatedWords(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
							} else {
								// If word is not in database, make it red
								relatedWordsHtml += '<span class="relatedWord-' + iString + '" id="relatedWord-' + noSpacesWord + '" style="color: red; cursor: pointer;"onclick="addWordFromRelatedWords(' + "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
							}
						}
						return relatedWordsHtml;
					}
					var relatedWordsHtml = addRelatedWordsHtml();
				}

				// -------------------------------------------------------------------------------------------------------------------

				// CODE THAT HAS TO DO WITH THE SENTENCE----------------------------------------------------------------------------------
				var sentence = response.getElementsByTagName('vi')[randomNumber].innerHTML;
				var wordHowItWasUsedInSentence = sentence.match("<it>(.*)</it>")[1];
				var boldedWordSentence = sentence.replace("<it>", "<it id='theCurrentItWord' style='font-weight:bold; cursor:pointer;' onclick='responsiveVoice.speak(`" + wordHowItWasUsedInSentence + "`)'>");
				// -----------------------------------------------------------------------------------------------------------------------

				appendThis = `<li class="word">` + response.querySelector('hw').innerHTML +
        `<span> </span>
          <span style='font-size:12px; color: black;'> (` + response.querySelector('fl').innerHTML + `)</span>
          <span style="font-size:60%; cursor:pointer;" class="fa fa-volume-up" id="volumeUp" onclick="responsiveVoice.speak('` + response.querySelector('hw').innerHTML + `')"></span>
        `
				if(!lookedUpWordNotCycle){
					appendThis +=
						`<span style="font-size:60%; cursor:pointer;" id="makeAutomaticPlayButtonTrue" onclick="toggleAutomaticPlayButton()" class="toBeHiddenOnRegularSearch fa fa-play-circle"></span>
	          <span style="font-size:60%; cursor:pointer;" class="toBeHiddenOnRegularSearch fa fa-arrow-left" id="previousWordButton" onclick="previousWord()"></span>
	          <span style="font-size:60%; cursor:pointer;" class="toBeHiddenOnRegularSearch fa fa-arrow-right" id="nextWordButton" onclick="nextWord()"></span>
	          <span style="font-size:60%; cursor:pointer;" class="toBeHiddenOnRegularSearch fa fa-times" id="removeWordButton" onclick="removeWordButton(currentFlashcardWord)"></span>`
				}

        if(countSens > 1){
        appendThis += `<span style='font-size:12px; color: black;'> (V.` + (randomNumber + 1) + `) <span class="arrow-up" color: black;' onclick="cycleUpDefinition();"></span> <span class="arrow-down" color: black;' onclick="cycleDownDefinition();"></span></span>`
      }
        console.log('Random Definition number: ' + randomNumber);
				// appendThis += `<li> Version ` + (randomNumber+1) +':' + `</li>`
				if (response.getElementsByTagName('mc')[randomNumber]) {
					appendThis += `<li class="en_eg"> <strong id="definitionBolded" style="cursor:pointer;" onclick="responsiveVoice.speak('` + response.getElementsByTagName('mc')[randomNumber].innerHTML + `')">Definition: </strong><span id="defintion-html">` + response.getElementsByTagName('mc')[randomNumber].innerHTML + `</span></li>`
				}
				if (response.getElementsByTagName('vi')[randomNumber]) {
					appendThis += `<li class="en_eg"> <strong id="sentenceBolded" style="cursor:pointer;" onclick="responsiveVoice.speak('` + response.getElementsByTagName('vi')[randomNumber].innerHTML.replace("<it>", "").replace("</it>", "") + `')">Sentence: </strong><span id="sentence-html">` + boldedWordSentence + `</span></li>`
				}
				if (response.getElementsByTagName('syn')[randomNumber]) {
					appendThis += `<li class="en_eg"> <strong>Synonyms:</strong> ` + synonymsHtml + ` </li>`;
				}
				if (response.getElementsByTagName('ant')[randomNumber]) {
					appendThis += `<li class="en_eg antonymsClass"> <strong>Antonyms:</strong> ` + antonymsHtml + ` </li>`;
				}
				if (response.getElementsByTagName('rel')[randomNumber]) {
					appendThis += `<li class="en_eg relatedWordsClass"> <strong>Related Words:</strong> ` + relatedWordsHtml + ` </li>`;
				}
				appendThis +=
				`
				<li class="wordMemeClass" style="display:none;">
					<img id="word-meme" src="http://wordinfo.info/webroot/words/images/`+word+`.jpg">
				</li>
				<li class="wordMemeClass1" style="display:none;">
					<img id="word-meme" src="http://wordinfo.info/webroot/words/images/`+word+`-1.jpg">
				</li>
				<li class="wordMemeClass2" style="display:none;">
					<img id="word-meme" src="http://wordinfo.info/webroot/words/images/`+word+`-2.jpg">
				</li>
				<li class="wordMemeClass3" style="display:none;">
					<img id="word-meme" src="http://wordinfo.info/webroot/words/images/`+word+`-3.jpg">
				</li>
				<li class="wordMemeClass4" style="display:none;">
					<img id="word-meme" src="http://wordinfo.info/webroot/words/images/`+word+`-4.jpg">
				</li>
				<li class="wordMemeClass5" style="display:none;">
					<img id="word-meme" src="http://wordinfo.info/webroot/words/images/`+word+`-5.jpg">
				</li>
				`;
				if (response.getElementsByTagName('ant')[randomNumber]) {
					appendThis += '<li id="antonymButtonOnFlashcard" style="border:1px solid black;" class="btn btn-sm" onclick="displayAntonyms()">Antonyms</li>';
				}
				if (response.getElementsByTagName('rel')[randomNumber]) {
					appendThis += '<li id="relatedWordsButtonOnFlashcard" style="border:1px solid black;" class="btn btn-sm" onclick="displayRelatedWords()">Related Words</li>';
				}
					appendThis +=
					`
					<li id="displayWordMeme0" style="border:1px solid black;display:none;" class="btn btn-sm" onclick="displayWordMeme(0)">Meme0</li>
					<li id="displayWordMeme1" style="border:1px solid black;display:none;" class="btn btn-sm" onclick="displayWordMeme(1)">Meme</li>
					<li id="displayWordMeme2" style="border:1px solid black;display:none;" class="btn btn-sm" onclick="displayWordMeme(2)">Meme2</li>
					<li id="displayWordMeme3" style="border:1px solid black;display:none;" class="btn btn-sm" onclick="displayWordMeme(3)">Meme3</li>
					<li id="displayWordMeme4" style="border:1px solid black;display:none;" class="btn btn-sm" onclick="displayWordMeme(4)">Meme4</li>
					<li id="displayWordMeme5" style="border:1px solid black;display:none;" class="btn btn-sm" onclick="displayWordMeme(5)">Meme5</li>
					<li id="realignFlashcardButtonOnFlashcard" style="border:1px solid black;" class="btn btn-sm" onclick="realignFlashcard()">Re-Align</li>
					`
				displayCopyListButton();

				// If learning list has more than 5 words
				if (wordsArray.length > 5) {
					document.getElementById("playGameFromNextToAddWordButton").style.display = 'block';
					appendThis +=
					`
					<li id="takeQuizButtonOnFlashcard" style="border:1px solid black;" class="btn btn-sm" onclick="makeQuestions()">Take Quiz</li>
					<li id="playGameButtonOnFlashcard" style="border:1px solid black;" class="btn btn-sm" onclick="playGameFromDuringAutoLearn()">Play Game</li>
					<li id="startSkippingWordButtonOnFlashcard" style="border:1px solid black;" class="btn btn-sm" onclick="addWordToWordsThatAreToBeSkippedEveryRoundArray(currentFlashcardWord)">Start Skipping</li>
					`;
				}

				// IN 2 Seconds, make #displayWordMeme => display:block;
				setTimeout(function(){
					showWordMemeButtonIfImageDoesntExist(word);
				},2000);

				document.getElementById("wordslist").innerHTML = appendThis;
			} else {
				nextWord();
        // Sometimes it skips for seemingly no reason. Need to fix that bug.
        console.log('Skipped past ' + word + ' to the next word!!!!')
				// Remove word with extra symbols ex.'()'. This is rarely going to be used because this has been resolved when adding synonyms list in thesaurus();
        // The following function was somehow causing errors and deleting some words.
        // removeWordButton(word);
			}
		},
		error: function (err) {
			console.log(err);
		}
	})
}



function displayAntonyms(){
	document.querySelector('.antonymsClass').style.display = "block";
	document.querySelector('.antonymsClass').scrollIntoView();
	document.querySelector('#antonymButtonOnFlashcard').style.display = "none";
	$('body, html').scrollLeft(28);
}
function displayRelatedWords(){
	document.querySelector('.relatedWordsClass').style.display = "block";
	document.querySelector('.relatedWordsClass').scrollIntoView();
	document.querySelector('#relatedWordsButtonOnFlashcard').style.display = "none";
	$('body, html').scrollLeft(28);
}





// http://wordinfo.info/webroot/words/images/
function returnTrueIfWordMeme(word,num){
	var numString = num.toString();
	var obj = new Image();
	// ONLY LOOKS FOR FIRST IMAGE '-1'
	if(num === 0){
		obj.src = "http://wordinfo.info/webroot/words/images/"+word+".jpg";
	}else{
		obj.src = "http://wordinfo.info/webroot/words/images/"+word+"-"+numString+".jpg";
	}
	if(obj.complete){
		return true;
	}else{
		return false;
	}
}
// function returnHowManyMemesWordHas(word){
// 	var count = 0;
// 	for (var i = 1; i < 5; i++) {
// 		var obj = new Image();
// 		obj.src = "http://wordinfo.info/webroot/words/images/"+word+"-"+i+".jpg";
// 		if(obj.complete){
// 			count ++;
// 		}
// 	}
// 	setTimeout(function(){
// 		console.log(count);
// 	},4000)
// }
function hideWordMemeButtonIfImageDoesntExist(word){
	for (var i = 0; i < 6; i++) {
		if(!returnTrueIfWordMeme(word,i)){
			document.querySelector('#displayWordMeme'+i).style.display = 'none';
		}
	}
}
function showWordMemeButtonIfImageDoesntExist(word){
	for (var i = 0; i < 6; i++) {
		if(returnTrueIfWordMeme(word,i)){
			document.querySelector('#displayWordMeme'+i).style.display = 'block';
		}
	}

}
function displayWordMeme(num){
	if(num === 0){
		document.querySelector('.wordMemeClass').style.display = 'block';
		document.querySelector('#displayWordMeme0').style.display = 'none';
		document.querySelector('.wordMemeClass').scrollIntoView();
		$('body, html').scrollLeft(28);
	}else{
		var numString = num.toString();
		document.querySelector('.wordMemeClass'+numString).style.display = 'block';
		document.querySelector('.wordMemeClass'+numString).scrollIntoView();
		$('body, html').scrollLeft(28);
		document.querySelector('#displayWordMeme'+numString).style.display = 'none';
	}
}


var lookedUpWordNotCycle = false;
function lookupWord(theWord,hideDatabaseWordsActivater,definitonNumber){
	lookedUpWordNotCycle = true;
	if(!theWord){
		var word = document.getElementById('searchWord-input').value;
	}
	else{
		var word = theWord;
	}
  thesaurus(word,definitonNumber);
  document.querySelector('.flashcard').style.display = 'block';
  // Hide the buttons on the flashcard besides the play current word button.
  setTimeout(function(){
    $( ".toBeHiddenOnRegularSearch" ).hide();
  },1000);
	if(hideDatabaseWordsActivater){
		document.getElementById('listOfWordsIdButton').click();
	}
}
//
function getDefinition(word) {
	document.querySelector('.flashcard').style.display = 'block';
	$.ajax({
		url: 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml/' + word + '?key=633f95e2-e228-4685-993c-466be1bb78cf',
		method: "GET",
		success: function (response) {
			console.log(response);
			appendThis = `<li class="word">` + response.querySelector('ew').innerHTML + `<span style='font-size:12px; color: black;'> (` + response.querySelector('fl').innerHTML + `)</span>
    <span style='font-size:12px; color: black;'>(V.` + 1 + `)</li>`
			// appendThis += `<li> Version ` + (randomNumber+1) +':' + `</li>`
			if (response.getElementsByTagName('dt')[0]) {
				appendThis += `<li class="en_eg"><strong>Defintion: </strong>` + response.getElementsByTagName('dt')[0].innerHTML.replace(/<vi.*vi>/, '').replace(/:/g, ""); + `</li>`
			}
			if (response.getElementsByTagName('vi')[0]) {
				appendThis += `<li class="en_eg"> <strong>Sentence: </strong>` + response.getElementsByTagName('vi')[0].innerHTML.replace("<it>", "<it style='font-weight:bold;'>").replace(/<aq.*aq>/, '') + `</li>`
			}
			if (response.getElementsByTagName('syn')[0]) {
				appendThis += `<li class="en_eg"> <strong>Synonyms:</strong> ` + response.getElementsByTagName('syn')[0].innerHTML + `</li>`
			}
			document.getElementById("wordslist").innerHTML = appendThis;
		},
		error: function (err) {
			console.log(err);
		}
	});
}

var ajaxPassedTestArray = [];
var ajaxPassedTestArrayDefinitions = [];
var ajaxPassedTestArraySentences = [];
var ajaxPassedTestArraySpeeches = [];
var ajaxPassedTestArraySynonyms = [];
var ajaxPassedTestArrayAntonyms = [];
// Code that has to do with adding multiple words at a time.
function wordToWords() {
	wordsArray = document.querySelector('#age').value.split(',');
	document.querySelector('#word-input').value = wordsArray[0];
	wordsArray.splice(0, 1);
	for (var i = 0; i <= wordsArray.length - 1; i++) {
		ajaxTest(wordsArray[i].toLowerCase().replace(/\s/g, ''));
	}
}

function ajaxTest(word) {
	var indexOfWord = wordsArray.indexOf(word);
	$.ajax({
		url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/' + word + '?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
		method: "GET",
		success: function (response) {
			// If database already has that word then display error message
			// Convert value to have no upper case or spaces
			if ($.inArray(word.toLowerCase().replace(/\s/g, ''), databaseArray) === -1 && response.querySelector('hw')) {
				ajaxPassedTestArray.push(response.querySelector('hw').innerHTML);
				console.log(word + ' was successfully found');
				console.log(ajaxPassedTestArray);
				document.querySelector('#words-input').value = ajaxPassedTestArray;
				// Definitions
				if (response.querySelector('mc')) {
					ajaxPassedTestArrayDefinitions.push(response.querySelector('mc').innerHTML + '|');
					document.querySelector('#definitions-input').value = ajaxPassedTestArrayDefinitions;
				} else {
					ajaxPassedTestArrayDefinitions.push('Definition Not Found');
				}
				if (response.querySelector('vi')) {
					ajaxPassedTestArraySentences.push(response.querySelector('vi').innerHTML + '|');
					document.querySelector('#sentences-input').value = ajaxPassedTestArraySentences;
				} else {
					ajaxPassedTestArraySentences.push('Sentence Not Found');
				}
				if (response.querySelector('fl')) {
					ajaxPassedTestArraySpeeches.push(response.querySelector('fl').innerHTML + '|');
					document.querySelector('#speeches-input').value = ajaxPassedTestArraySpeeches;
				} else {
					ajaxPassedTestArraySpeeches.push('Speech Not Found');
				}
				if (response.querySelector('syn')) {
					ajaxPassedTestArraySynonyms.push(response.querySelector('syn').innerHTML + '||');
					document.querySelector('#synonyms-input').value = ajaxPassedTestArraySynonyms;
				} else {
					ajaxPassedTestArraySynonyms.push('Synonyms Not Found');
				}
				if (response.querySelector('ant')) {
					ajaxPassedTestArrayAntonyms.push(response.querySelector('ant').innerHTML + '||');
					document.querySelector('#antonyms-input').value = ajaxPassedTestArrayAntonyms;
				} else {
					ajaxPassedTestArrayAntonyms.push('Antonyms Not Found');
				}

			} else if ($.inArray(word.toLowerCase().replace(/\s/g, ''), databaseArray) !== -1) {
				// wordsArray.splice(indexOfWord,1);
				console.log(word + ' is already in database');
				// document.querySelector('#words-input').value = wordsArray;
			} else if (!response.querySelector('hw')) {
				// wordsArray.splice(indexOfWord,1);
				console.log(word + ' not found')
				// document.querySelector('#words-input').value = wordsArray;
			}
		},
		error: function (err) {
			console.log(err);
		}
	})
}

var wordsToRemoveArray = [];
// function removeWordsFromDatabase(){
//   for(var i = 0; i <= databaseArray.length - 1; i++){
//     console.log(databaseArray[i]);
//     document.querySelector('#remove-'+databaseArray[i]).style.display = 'none';
//     document.querySelector('#plus-'+databaseArray[i]).style.display = 'none';
//   }
// }

function clickSubmitButton() {
	document.querySelector('#word-submitter').click();
}

function addWordFromRemoveWordsArray(word) {
	if ($.inArray(word, wordsToRemoveArray) === -1) {
		wordsToRemoveArray.push(word);
		console.log('wordsToRemoveArray: ' + wordsToRemoveArray);
		document.querySelector('#wordsToBeDeleted-input').value = wordsToRemoveArray;
		document.querySelector('#wordsToDelete').innerHTML = wordsToRemoveArray;
		document.querySelector('#wordsToDeleteParagraph').style.display = 'block';
		document.querySelector('#minus-' + word).style.display = 'none';
	}
}

function displayMinusButtons() {
	if (document.querySelector('#plus-and-delete-buttons').style.display === 'block') {
		$("#plus-and-delete-buttons").hide();
		$(".delete-buttons").hide();
		$(".plus-buttons").hide();
		$(".minus-buttons").show();
	} else {
		$("#plus-and-delete-buttons").show();
		$(".delete-buttons").show();
		$(".plus-buttons").show();
		$(".minus-buttons").hide();
		wordsToRemoveArray = [];
		document.querySelector('#wordsToDelete').innerHTML = wordsToRemoveArray;
		document.querySelector('#wordsToDeleteParagraph').style.display = 'none';
	}
}

function viewQuizResults(number) {
	var numberString = number.toString()
	if (document.querySelector('.correct-' + numberString)) {
		if (document.querySelector('.correct-' + numberString).style.color !== 'green' || document.querySelector('.incorrect-' + numberString).style.color !== 'red') {
			// document.querySelector('#quizResultNumber').style.display = 'block';
			// document.querySelector('#selectAllIncorrect-').style.display = 'inline-block';
			$(".quizResultNumber-" + numberString).css('display', 'block');
			$(".correct-" + numberString).not(".widget-selected").css('color', 'green');
			$(".incorrect-" + numberString).not(".widget-selected").css('color', 'red');
		} else {
			$(".quizResultNumber-" + numberString).css('display', 'none');
			// document.querySelector('#quizResultNumber').style.display = 'none';
			// document.querySelector('#selectAllIncorrect-').style.display = 'none';
			$(".correct-" + numberString).not(".widget-selected").css('color', 'black');
			$(".incorrect-" + numberString).not(".widget-selected").css('color', 'black');
		}
	} else {
		if (document.querySelector('.incorrect-' + numberString).style.color !== 'red') {
			// document.querySelector('#quizResultNumber').style.display = 'block';
			// document.querySelector('#selectAllIncorrect-').style.display = 'inline-block';
			$(".quizResultNumber-" + numberString).css('display', 'block');
			$(".incorrect-" + numberString).not(".widget-selected").css('color', 'red');
		} else {
			$(".quizResultNumber-" + numberString).css('display', 'none');
			// document.querySelector('#quizResultNumber').style.display = 'none';
			// document.querySelector('#selectAllIncorrect-').style.display = 'none';
			$(".incorrect-" + numberString).not(".widget-selected").css('color', 'black');
		}

	}
}


var wordsCorrectArray = [];
var wordsIncorrectArray = [];
var definitionOfWords = [];

function generateQuiz() {
	(function () {
		function buildQuiz() {
			// we'll need a place to store the HTML output
			const output = [];

			// for each question...
			myQuestions.forEach((currentQuestion, questionNumber) => {
				// we'll want to store the list of answer choices
				const answers = [];

				// and for each available answer...
				for (letter in currentQuestion.answers) {
					// ...add an HTML radio button
					answers.push(
						`<label style="cursor:pointer;">
              <input type="radio" name="question${questionNumber}" value="${letter}">

              ${currentQuestion.answers[letter]}
            </label>`
					);
				}

				// add this question and its answers to the output
				output.push(
					`<div class="question"> ${currentQuestion.question} </div>
          <div class="answers"> ${answers.join("")} </div>`
				);
			});

			// finally combine our output list into one string of HTML and put it on the page
			quizContainer.innerHTML = output.join("");
		}

		function showResults() {
			// gather answer containers from our quiz
			const answerContainers = quizContainer.querySelectorAll(".answers");

			// keep track of user's answers
			var numCorrect = 0;
			var questionNum = 0;

			// for each question...
			myQuestions.forEach((currentQuestion, questionNumber) => {
				questionNum++;
				// find selected answer
				const answerContainer = answerContainers[questionNumber];
				const selector = `input[name=question${questionNumber}]:checked`;
				const userAnswer = (answerContainer.querySelector(selector) || {}).value;

				// if(currentQuestion.correctAnswer === 'a'){
				//   definitionOfWords.push(myQuestions[questionNum - 1].answers.a+'|');
				// }
				// else if(currentQuestion.correctAnswer === 'b'){
				//   definitionOfWords.push(myQuestions[questionNum - 1].answers.b+'|');
				// }
				// else if(currentQuestion.correctAnswer === 'c'){
				//   definitionOfWords.push(myQuestions[questionNum - 1].answers.c+'|');
				// }
				// else{
				//   definitionOfWords.push(myQuestions[questionNum - 1].answers.d+'|');
				// }
				//
				// document.querySelector('#definitionsCorrectAnswer-input').value = definitionOfWords;

				// if answer is correct
				if (userAnswer === currentQuestion.correctAnswer) {
					// add to the number of correct answers
					numCorrect++;
					wordsCorrectArray.push(myQuestions[questionNum - 1].question);
					document.querySelector('#wordsCorrectInQuiz-input').value = wordsCorrectArray;
					// color the answers green
					answerContainers[questionNumber].style.color = "lightgreen";

				} else {
					// if answer is wrong or blank
					// color the answers red
					wordsIncorrectArray.push(myQuestions[questionNum - 1].question);
					document.querySelector('#wordsIncorrectInQuiz-input').value = wordsIncorrectArray;
					answerContainers[questionNumber].style.color = "red";
				}
			});

			// show number of correct answers out of total
			resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
		}

		const quizContainer = document.getElementById("quiz");
		const resultsContainer = document.getElementById("results");
		const submitButton = document.getElementById("submit");

		// display quiz right away
		buildQuiz();
		document.querySelector('#submit').style.display = 'block';

		// on submit, show results
		submitButton.addEventListener("click", showResults);
	})();
}

var myQuestions = [];

function pushQuizQuestion(word, mc1, mc2, mc3, mc4, answer, correctAnswerString) {

	var newQuestion = {
		question: word,
		answers: {
			a: mc1,
			b: mc2,
			c: mc3,
			d: mc4
		},
		correctAnswer: answer,
	}
	newQuestion.word = word;

	myQuestions.push(newQuestion);
	generateQuiz();
}


var correctAnswersArray = [];

function pushQuizQuestionUsingInputs() {
	pushQuizQuestion(document.querySelector('#quizWord-input').value,
		document.querySelector('#mc1-input').value,
		document.querySelector('#mc2-input').value,
		document.querySelector('#mc3-input').value,
		document.querySelector('#mc4-input').value, 'c'
	)
}
var sentencesArray = [];

var definitionNumber;

function getSentence(word, activateCheckerOfGetAllSentences) {
	console.log(word);
	function checkIfGetAllSentencesHasFinished() {
		if (sentencesArray.length === wordsArray.length - 5 && wordsArray.length >= 6) {
			console.log('getAllSentences() has almost finished! You may begin generating questions!');
			setTimeout(function () {
				makeQuestions();
			}, 2000);
		}
	}
	var sentenceCount = 0;
	$.ajax({
		url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/' + word + '?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
		method: "GET",
		success: function (response) {
			for (var i = 0; i <= 5; i++) {
				if (response.getElementsByTagName('mc')[i]) {
					sentenceCount++;
				} else {
					break;
				}
			}
			// Select a random sentence
			var randomSentenceNumber = Math.floor(Math.random() * sentenceCount);
			definitionNumber = randomSentenceNumber;
			var randomSentence = response.getElementsByTagName('mc')[randomSentenceNumber].innerHTML;
			var randomSentenceExample = response.getElementsByTagName('vi')[randomSentenceNumber].innerHTML;
			var randomSentenceExampleUnderlinedWord = response.getElementsByTagName('vi')[randomSentenceNumber].innerHTML.replace(/<it.*it>/, '_____');
			var partOfSpeech = response.getElementsByTagName('fl').innerHTML;
			var wordHowItWasUsedInSentence = randomSentenceExample.match("<it>(.*)</it>")[1];

			if(response.getElementsByTagName('syn')[randomSentenceNumber]){
				var synonyms = response.getElementsByTagName('syn')[randomSentenceNumber].innerHTML;
				var synonymsArray = synonyms.split(",");
				var synonymsArrayWithoutSpaces = [];
				for (var i = 0; i < synonymsArray.length; i++) {
						if(synonymsArray[i] !== word){
						synonymsArrayWithoutSpaces.push(synonymsArray[i].replace(" ", "").replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, ""));
					}
				}
		}
		if(response.getElementsByTagName('ant')[randomSentenceNumber]){
			var antonyms = response.getElementsByTagName('ant')[randomSentenceNumber].innerHTML;
			var antonymsArray = antonyms.split(",");
			var antonymsArrayWithoutSpaces = [];
			for (var i = 0; i < antonymsArray.length; i++) {
				antonymsArrayWithoutSpaces.push(antonymsArray[i].replace(" ", "").replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, ""));
			}
		}
		if(response.getElementsByTagName('rel')[randomSentenceNumber]){
			var relatedWords = response.getElementsByTagName('rel')[randomSentenceNumber].innerHTML;
			var relatedWordsArray = relatedWords.split(",");
			var relatedWordsArrayWithoutSpaces = [];
			for (var i = 0; i < relatedWordsArray.length; i++) {
				relatedWordsArrayWithoutSpaces.push(relatedWordsArray[i].replace(" ", "").replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, ""));
			}
		}


			correctAnswersArray.push('((' + word + ')):' + randomSentence + '|');
			document.querySelector('#definitionsCorrectAnswer-input').value = correctAnswersArray;

			console.log('Word: ' + word);
			console.log('Number of Sentences: ' + sentenceCount);
			console.log('Random Sentence: ' + randomSentence);
			console.log('Random Sentence #: ' + randomSentenceNumber);
			console.log('Random Sentence Array: ' + correctAnswersArray);

			var wordForFlashcard = {
				word: word,
				sentence: randomSentence,
				sentenceExample: randomSentenceExample,
				sentenceExampleUnderlinedWord: randomSentenceExampleUnderlinedWord,
				synonyms: synonymsArrayWithoutSpaces,
				antonyms: antonymsArrayWithoutSpaces,
				relatedWords: relatedWordsArrayWithoutSpaces,
				partOfSpeech: partOfSpeech,
				wordHowItWasUsedInSentence: wordHowItWasUsedInSentence,
				randomSentenceNumber: randomSentenceNumber
			};
			sentencesArray.push(wordForFlashcard);
			if (activateCheckerOfGetAllSentences === true) {
				checkIfGetAllSentencesHasFinished();
			}
			console.log('sentencesArray:');
			console.log(sentencesArray);
		},
		error: function (err) {
			console.log(err);
		}
	})
}

function getAllSentences(activateCheckerOfGetAllSentences) {
	sentencesArray = [];
	// document.querySelector('#listOfWords').style.display = 'none';
	for (var i = 0; i <= wordsArray.length - 1; i++) {
		getSentence(wordsArray[i], activateCheckerOfGetAllSentences);
	}
}

function squash(arr){
    var tmp = [];
    for(var i = 0; i < arr.length; i++){
        if(tmp.indexOf(arr[i]) == -1){
        tmp.push(arr[i]);
        }
    }
    return tmp;
}


function removeDuplicatesInSentencesArray(){
	var sentencesArrayOnlyWords = [];
	var sentencesArrayRepeatIndexesArray = [];
	var duplicateWordsArrayInMakeQuestions = [];

// Make an array of only the words in the sentencesArray
	for (var i = 0; i < sentencesArray.length; i++) {
		sentencesArrayOnlyWords.push(sentencesArray[i].word);
	}
// Make an array that indexes each repeat word and creates array of duplicated words in sentencesArray
	for (var i = 0; i < sentencesArrayOnlyWords.length; i++) {
		for (var y = 0; y < sentencesArrayOnlyWords.length; y++) {
			if(i !== y && sentencesArrayOnlyWords[i] === sentencesArrayOnlyWords[y]){
				sentencesArrayRepeatIndexesArray.push(i);
				// Will create two of each duplicated word, which will then need to be squashed to only one of each duplicated word.
				duplicateWordsArrayInMakeQuestions.push(sentencesArrayOnlyWords[i]);
			}
		}
	}
	// Squash is used to remove duplicate strings in an array. E.X: squash(['a','a'] => ['a'])
	duplicateWordsArrayInMakeQuestions = squash(duplicateWordsArrayInMakeQuestions);

	for (var i = sentencesArrayRepeatIndexesArray.length - 1; i >= 0; i--) {
			sentencesArray.splice(sentencesArrayRepeatIndexesArray[i],1);
			sentencesArrayRepeatIndexesArray.splice(sentencesArrayRepeatIndexesArray[i],1);
	    sentencesArrayOnlyWords.splice(sentencesArrayRepeatIndexesArray[i],1);
	}

	for (var i = 0; i < duplicateWordsArrayInMakeQuestions.length; i++) {
		getSentence(duplicateWordsArrayInMakeQuestions[i]);
	}
	console.log('The Following words were duplicates and has to be reconciled: ' + duplicateWordsArrayInMakeQuestions);
}

function makeQuestions() {

// This function is to ensure that there are no duplicate questions or duplicate words being tested
	// removeDuplicatesInSentencesArray();

	myQuestions = [];
	// console.log(randomWordNumber);
	for (var i = 0; i <= sentencesArray.length - 1; i++) {
		// Either sentence or definition
		// var randomQuestionType = Math.floor(Math.random() * 2);
		// if(randomQuestionType === 0){
		var randomWordNumber = findRandomNumber();
		while (randomWordNumber === i) {
			randomWordNumber = findRandomNumber();
		}
		var randomWordNumber2 = findRandomNumber();
		while (randomWordNumber2 === i || randomWordNumber2 === randomWordNumber || randomWordNumber2 === randomWordNumber3 || randomWordNumber2 === randomWordNumber4) {
			randomWordNumber2 = findRandomNumber();
		}
		var randomWordNumber3 = findRandomNumber();
		while (randomWordNumber3 === i || randomWordNumber3 === randomWordNumber || randomWordNumber3 === randomWordNumber2 || randomWordNumber3 === randomWordNumber4) {
			randomWordNumber3 = findRandomNumber();
		}
		var randomWordNumber4 = findRandomNumber();
		while (randomWordNumber4 === i || randomWordNumber4 === randomWordNumber || randomWordNumber4 === randomWordNumber2 || randomWordNumber4 === randomWordNumber3) {
			randomWordNumber4 = findRandomNumber();
		}
		var randomAnswerNumber = Math.floor(Math.random() * 4);
		var randomAnswerLetter;

		if (randomAnswerNumber === 0) {
			randomAnswerLetter = 'a';
			randomWordNumber = i;
		} else if (randomAnswerNumber === 1) {
			randomAnswerLetter = 'b';
			randomWordNumber2 = i;
		} else if (randomAnswerNumber === 2) {
			randomAnswerLetter = 'c';
			randomWordNumber3 = i;
		} else {
			randomAnswerLetter = 'd';
			randomWordNumber4 = i;
		}
		pushQuizQuestion(
			sentencesArray[i].word,
			sentencesArray[randomWordNumber].sentence,
			sentencesArray[randomWordNumber2].sentence,
			sentencesArray[randomWordNumber3].sentence,
			sentencesArray[randomWordNumber4].sentence,
			randomAnswerLetter
		);
		// }
		// else{

		// }
	}
	document.querySelector('#quiz').style.display = 'block';
	document.querySelector('#results').style.display = 'block';
	// Scroll to top of quiz
	$('html, body').stop(true,true).animate({
    scrollTop: $("#quiz").offset().top - 10
}, 2000)
}

function generateQuizWithoutStartingCycle() {
	document.querySelector('#listOfWords').style.display = 'none';
	// document.querySelector('#theRowWithLearnAndDatabase').style.display = 'none';
	// The true is used to activateCheckerOfGetAllSentences. This will allow for the getAllSentences() to generateQuizWithoutStartingCycle
	// sentence and wait until the proper time to generate questions
	getAllSentences(true);
	document.querySelector('#quiz').style.display = 'block';
	document.querySelector('#results').style.display = 'block';

}


// Additional Functions
function findRandomNumber() {
	var randomNumber = Math.floor(Math.random() * sentencesArray.length);
	return randomNumber;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Remove Elements
// And then you can remove elements like this
// document.getElementById("my-element").remove();
Element.prototype.remove = function () {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
	for (var i = this.length - 1; i >= 0; i--) {
		if (this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}


//
// sentenceDefinitionArray = [];
// function getSentenceDefinition(word, activateCheckerOfGetAllSentences){
//   function checkIfGetAllSentencesHasFinished(){
//     if(sentencesArray.length === wordsArray.length - 5 && wordsArray.length >= 6){
//       console.log('getAllSentences() has almost finished! You may begin generating questions!');
//       setTimeout(function(){ makeQuestions(); }, 2000);
//     }
//   }
//   var randomWord = Math.floor(Math.random()* wordsArray.length );
//   $.ajax({
//     url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+word+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
//     method: "GET",
//     success: function (response) {
//     var sentenceDefinition = response.getElementsByTagName('vi')[0].innerHTML;
//     var wordFromSentenceDefinition = response.getElementsByTagName('it')[0].innerHTML;
//     var strippedDefinition = sentenceDefinition.replace(/<it.*it>/, '_____');
//     // console.log(sentenceDefinition.getElementsByTagName('it'));
//     // console.log(sentenceDefinition);
//     // console.log(wordFromSentenceDefinition);
//     // console.log(strippedDefinition);
//
//       var wordForFlashcard = {
//         fillInBlank: strippedDefinition,
//         correctWord: wordFromSentenceDefinition
//       };
//       sentenceDefinitionArray.push(wordForFlashcard);
//       // if(activateCheckerOfGetAllSentences === true){
//       //   checkIfGetAllSentencesHasFinished();
//       // }
//       console.log(sentenceDefinitionArray);
//     },
//     error: function (err) {
//       console.log(err);
//     }
//   })
// }
//
// function getAllSentenceDefinitions(activateCheckerOfGetAllSentences){
//   sentenceDefinitionArray = [];
//   document.querySelector('#listOfWords').style.display = 'none';
//   for(var i = 0; i <= wordsArray.length - 1; i++){
//     getSentenceDefinition(wordsArray[i], activateCheckerOfGetAllSentences);
//   }
// }
//
// function makeDefinitionQuestions(){
//
//   myQuestions = [];
//   // console.log(randomWordNumber);
//   for(var i = 0; i <= wordsArray.length - 1; i++){
//     // Either sentence or definition
//     // var randomQuestionType = Math.floor(Math.random() * 2);
//     // if(randomQuestionType === 0){
//     var randomWordNumber = findRandomNumber();
//     while(randomWordNumber === i){
//       randomWordNumber = findRandomNumber();
//     }
//     var randomWordNumber2 = findRandomNumber();
//     while(randomWordNumber2 === i || randomWordNumber2 === randomWordNumber|| randomWordNumber2 === randomWordNumber3 || randomWordNumber2 === randomWordNumber4){
//       randomWordNumber2 = findRandomNumber();
//     }
//     var randomWordNumber3 = findRandomNumber();
//     while(randomWordNumber3 === i || randomWordNumber3 === randomWordNumber|| randomWordNumber3 === randomWordNumber2 || randomWordNumber3 === randomWordNumber4){
//       randomWordNumber3 = findRandomNumber();
//     }
//     var randomWordNumber4 = findRandomNumber();
//     while(randomWordNumber4 === i || randomWordNumber4 === randomWordNumber|| randomWordNumber4 === randomWordNumber2 || randomWordNumber4 === randomWordNumber3){
//       randomWordNumber4 = findRandomNumber();
//     }
//     var randomAnswerNumber = Math.floor(Math.random() * 4);
//     var randomAnswerLetter;
//
//     if(randomAnswerNumber === 0){
//       randomAnswerLetter = 'a';
//       randomWordNumber = i;
//     }
//     else if(randomAnswerNumber === 1){
//       randomAnswerLetter = 'b';
//       randomWordNumber2 = i;
//     }
//     else if(randomAnswerNumber === 2){
//       randomAnswerLetter = 'c';
//       randomWordNumber3 = i;
//     }
//     else{
//       randomAnswerLetter = 'd';
//       randomWordNumber4 = i;
//     }
//     pushQuizQuestion(
//       sentenceDefinitionArray[i].fillInBlank,
//       sentenceDefinitionArray[randomWordNumber].correctWord,
//       sentenceDefinitionArray[randomWordNumber2].correctWord,
//       sentenceDefinitionArray[randomWordNumber3].correctWord,
//       sentenceDefinitionArray[randomWordNumber4].correctWord,
//       randomAnswerLetter
//     );
//   // }
//       // else{
//
//     // }
//   }
// }


function addWordFromPreviousLists(word) {
	// if($.inArray(word, wordsArray) === -1){
	// If the plus sign button is 'style: block' then add the word
	var indexOfWord = wordsArray.indexOf(word);
	var indexOfWordInWordsToAddArray = wordsToAdd.indexOf(word);

	if (document.getElementById(word + '-previous').style.color === 'black') {
		// getAllSentences();
		$('#' + word + '-previous').addClass('widget-selected');
		wordsArray.push(word);
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById(word + '-previous').style.color = 'black';
		document.getElementById(word + '-previous').style.color = 'blue';
		updateCycleInformation();
		if ($.inArray(word, databaseArray) !== -1) {
			document.getElementById("plus-" + word).style.display = 'none';
			document.getElementById("checkmark-" + word).style.display = 'block';
		}
		if ($.inArray(word, databaseArray) === -1 && $.inArray(word, wordsToAdd) === -1) {
			wordsToAdd.push(word);
			document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
			document.getElementById("wordstoaddparagraph").style.display = 'block';
			document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
			document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
		}
		displayCopyListButton();
		if (wordsArray.length >= 5) {
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'block';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'block';
			document.getElementById("playGameFromNextToAddWordButton").style.display = 'block';
		}
	}
	// if color is blue and word is not in database:
	else if (document.getElementById(word + '-previous').style.color === 'blue') {
		wordsArray.splice(indexOfWord, 1);
		$('#' + word + '-previous').removeClass('widget-selected');
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
		turnCurrentLearningListSpanIntoClickableArray();
		document.getElementById("numberOfWordsInLearningList").innerHTML = wordsArray.length;
		document.getElementById(word + '-previous').style.color = 'black';
		updateCycleInformation();
		document.getElementById("plus-" + word).style.display = 'block';
		document.getElementById("checkmark-" + word).style.display = 'none';
		displayCopyListButton(); if (wordsArray.length <= 5) { document.getElementById("playGameFromNextToAddWordButton").style.display = 'none';
			document.getElementById("takeQuizQuttonUnderLearningList").style.display = 'none';
			document.getElementById("playSynonymClusterGameFromNextToAddWordButton").style.display = 'none';
		}
	}
}

function selectAllFromPreviousLists(array) {
	for (var i = 0; i < array.length - 1; i++) {
		document.querySelector('#' + array[i] + '-previous').click();
	}
}

var automaticPlayButton = false;

function automaticallyPlaySoundUponCycle() {
	if (automaticPlayButton) {
		setTimeout(function () {
			var sentence = document.getElementById('sentence-html').innerHTML.replace(/<it.*it>/, document.getElementById('theCurrentItWord').innerHTML);
			responsiveVoice.speak(currentFlashcardWord + ', ' + document.getElementById('defintion-html').innerHTML + '. In a sentence: ' + sentence);
		}, 250);
	}
}

function toggleAutomaticPlayButton() {
	if (automaticPlayButton) {
		automaticPlayButton = false;
		console.log(automaticPlayButton);
		$('.fa-stop-circle').addClass('fa-play-circle').removeClass('fa-stop-circle');
		responsiveVoice.speech_timedout();
	} else {
		automaticPlayButton = true;
		console.log(automaticPlayButton);
		$('.fa-play-circle').addClass('fa-stop-circle ').removeClass('fa-play-circle');
	}
}

var voiceCommands = {
	totalPoints: function () {
		if (totalPoints > 0) {
			responsiveVoice.speak('You currently have ' + totalPoints + 'Points! Every time you submit a quiz, every correct answer submitted will add 20 points, while every incorrect answer will subtract 20 points!');
		} else if (totalPoints === 0) {
			responsiveVoice.speak('You currently have don\'t have any points! To begin gaining points, you must submit quizzes on words that you are learning. Every time you submit a quiz, every correct answer submitted will add 20 points, while every incorrect answer will subtract 20 points!');
		} else {
			responsiveVoice.speak('You currently have ' + totalPoints + 'Points! That is not very good! You should attempt more quizzes! Every time you submit a quiz, every correct answer submitted will add 20 points, while every incorrect answer will subtract 20 points!');
		}
	},
	currentLearningList: function () {
		if (wordsArray.length === 0) {
			responsiveVoice.speak('This is your current learning list. You currently do not have any words selected. You can select a random number of words on the "number of words input box"');
		} else if (wordsArray.length < 6) {
			responsiveVoice.speak('This is your current learning list. To take a quiz on these words, select the "Take a quiz button." To begin learning these words, select the begin button.');
		} else {
			responsiveVoice.speak('This is your current learning list. To begin learning these words, select the begin button.');
		}
	},
	currentLearningListNumber: function () {
		responsiveVoice.speak('You currently have ' + wordsArray.length + ' words in your current learning list!');
	},
	wordsToAdd: function () {
		responsiveVoice.speak('These are all words that you do not currently have in your database. To download these words, select the "Add Words To Database" button.');
	},
	cycleSpeed: function () {
		responsiveVoice.speak('The cycle speed is ' + cycleSpeed / 1000 + ' seconds! This means that each word will be shown for ' + cycleSpeed / 1000 + ' seconds before the next word is shown.');
	},
	cycleDuration: function () {
		var cycleDurationSeconds = ((Number(document.getElementById("numberOfWordsInLearningList").innerHTML)) * (cycleSpeed / 1000));
		var cycleDurationMinutes = cycleDurationSeconds / 60;
		if (cycleDurationSeconds) {
			responsiveVoice.speak('the cycle duration is 1.8 minutes, or in other words 100 seconds. This means that it will take 100 seconds to cycle through the entire learning list.');
		} else {
			responsiveVoice.speak('You currently haven\'t selected any words. To compute a cycle duration you must select words to add to learning list.');
		}
	},
	inputSpeed: function () {
		responsiveVoice.speak('In the input box below, you may select the amount of seconds you would like per word');
	},
	inputNumber: function () {
		responsiveVoice.speak('In the input box below, you may add the amount of words you would like to randomly select from your database to your learning list.');
	},
	addNewWords: function () {
		responsiveVoice.speak('You may add one or multiple words below! To add multiple words, you must separate each word with a comma.');
	}
}


function tutorial() {
	var intro = 'Hello! This vocabulary building website is the best vocabulary building tool on the web! I will walk you through how this tool works!';
	responsiveVoice.speak(intro);
	var selectSeconds = 'To begin, lets first choose how many seconds we would like per word. For sake of demonstration, I am going to enter 10 seconds per word.';
	responsiveVoice.speak(selectSeconds);
	var estimatedTimeTilSpeedInput = responsiveVoice.getEstimatedTimeLength(intro + selectSeconds);
	setTimeout(function () {
		document.querySelector('#speed-input').value = 10;
	}, estimatedTimeTilSpeedInput);
	var selectNumberOfWords = 'Next let’s select how many words we would like to learn, I will select 10 words. Now as you can see, the cycle speed is 10 seconds which is what we just selected, this means that each word will be shown for 10 seconds before the next word is shown.';
	responsiveVoice.speak(selectNumberOfWords);
	var estimatedTimeTilNumberInput = responsiveVoice.getEstimatedTimeLength(intro + selectSeconds + selectNumberOfWords);
	setTimeout(function () {
		document.querySelector('#random-number-input').value = 10;
		updateCycleInformation();
	}, estimatedTimeTilSpeedInput);
	responsiveVoice.speak('Next you will see the cycle duration is 1.8 minutes, or in other words 100 seconds. This means that it will take 100 seconds to cycle through the entire learning list.');
	responsiveVoice.speak('Here you can see the “take quiz” button. If you click this button a quiz will automatically be generated with the ten words in your current learning list. Now lets begin!');
}


function turnCurrentLearningListSpanIntoClickableArray(){
	var newInnerHTMLSpan = '';
	for (var i = 0; i < wordsArray.length; i++) {
		if(i === wordsArray.length - 1){
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInCurrentLearningList" id="'+wordsArray[i]+'-currentLearningList'+'" onclick="removeWordClickableSpanInCurrentLearningList(`'+wordsArray[i]+'`)">'+wordsArray[i]+'</span>';
		}else{
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInCurrentLearningList" id="'+wordsArray[i]+'-currentLearningList'+'" onclick="removeWordClickableSpanInCurrentLearningList(`'+wordsArray[i]+'`)">'+wordsArray[i]+',</span>';
		}
	}
	document.querySelector('#wordsInLearningListArray').innerHTML = newInnerHTMLSpan;
}

function removeWordClickableSpanInCurrentLearningList(word){
	// spliceFromArray(wordsArray, word.replace(/\s/g, ''));
	removeWordFromStudyArray(word.replace(/\s/g, ''));
	turnCurrentLearningListSpanIntoClickableArray();
}

function spliceFromArray(array, whatToSplice){
	var index = array.indexOf(whatToSplice);
	array.splice(index,1);
}




window.onbeforeunload = function(){
	if(wordsArray.length > 0){
   downloadSynonymNewWords();
 }
}
