function displayHangmanHtml(){
  document.querySelector('#favicon').href = "/images/hangman-favicon.png";
  document.querySelector('#titleNextToFavicon').innerHTML = "Hangman!";

  document.querySelector('#hangman-body').style.display = 'block';
  document.querySelector('#hangman-game').style.display = 'none';
  document.querySelector('#crossword-body').style.display = 'none';
  document.querySelector('#crossword-game').style.display = 'none';

  document.querySelector('#synonym-clusters-body').style.display = 'none';
  document.querySelector('#synonym-clusters-game').style.display = 'none';
  document.querySelector('#quiz').style.display = 'none';
  document.querySelector('#results').style.display = 'none';
  document.querySelector('#roundNumberDiv').style.display = 'none';
  document.querySelector('#first-body').style.display = 'none';
  document.querySelector('#second-body').style.display = 'none';
  document.querySelector('#percentageCompleted').style.display = 'none';

  stopKeydownListenerPlayGame();
}

var hangmanArray = [];

var fullWordObjectsArrayForHangman = [];

function createObjectArrayWithSynonymsAndAntonymsAndRelatedWordsForHangmanGame(word) {
	$.ajax({
		url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/' + word + '?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
		method: "GET",
		success: function (response) {
      console.log(response);
      var countSens = 0;
      for (var i = 0; i <= 20; i++) {
        if (response.getElementsByTagName('sens')[i]) {
          countSens++
        }
        else{
          break;
        }
      }
      console.log('Number Of Definitions for '+word+': ' + countSens);
      var randomNumber = Math.floor(Math.random() * countSens);
      var wordObjectToAddToArray = {
        word:word,
        definitionNumber:randomNumber + 1,
        definition: response.getElementsByTagName('mc')[randomNumber].innerHTML,
        sentence:response.getElementsByTagName('vi')[randomNumber].innerHTML
      };

      wordObjectToAddToArray.totalPossiblePoints = 0;

      if(response.getElementsByTagName('syn')[randomNumber]){
        var synonyms = response.getElementsByTagName('syn')[randomNumber].innerHTML;
				var synonymsArray = synonyms.split(",");
        var synonymsArrayWithoutSpaces = [];
        for (var i = 0; i < synonymsArray.length; i++) {
            var currentWord = synonymsArray[i].replace(" ", "").replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, "");
            // Check if current word is duplicated in array and if any of the words in the array are substringed which would give too much of a hint
            if(currentWord !== word && word.indexOf(currentWord) === -1 && currentWord.indexOf(word) === -1){
            synonymsArrayWithoutSpaces.push(currentWord);
          }
        }
        wordObjectToAddToArray.synonyms = synonymsArrayWithoutSpaces;
        wordObjectToAddToArray.totalPossiblePoints += synonymsArrayWithoutSpaces.length;
      }
      if(response.getElementsByTagName('ant')[randomNumber]){
        var antonyms = response.getElementsByTagName('ant')[randomNumber].innerHTML;
        var antonymsArray = antonyms.split(",");
        var antonymsArrayWithoutSpaces = [];
        for (var i = 0; i < antonymsArray.length; i++) {
            var currentWord = antonymsArray[i].replace(" ", "").replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, "");
            // Check if current word is duplicated in array and if any of the words in the array are substringed which would give too much of a hint
            if(currentWord !== word && word.indexOf(currentWord) === -1 && currentWord.indexOf(word) === -1){
            antonymsArrayWithoutSpaces.push(currentWord);
          }
        }
        wordObjectToAddToArray.antonyms = antonymsArrayWithoutSpaces;
        wordObjectToAddToArray.totalPossiblePoints += antonymsArrayWithoutSpaces.length;

      }
      if(response.getElementsByTagName('rel')[randomNumber]){
        var relatedWords = response.getElementsByTagName('rel')[randomNumber].innerHTML;
        var relatedWordsArray = relatedWords.split(",");
        var relatedWordsArrayWithoutSpaces = [];
        for (var i = 0; i < relatedWordsArray.length; i++) {
            var currentWord = relatedWordsArray[i].replace(" ", "").replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, "");
            // Check if current word is duplicated in array and if any of the words in the array are substringed which would give too much of a hint
            if(currentWord !== word && word.indexOf(currentWord) === -1 && currentWord.indexOf(word) === -1){
            relatedWordsArrayWithoutSpaces.push(currentWord);
          }
        }
        wordObjectToAddToArray.relatedWords = relatedWordsArrayWithoutSpaces;
        wordObjectToAddToArray.totalPossiblePoints += relatedWordsArrayWithoutSpaces.length;

      }
      fullWordObjectsArrayForHangman.push(wordObjectToAddToArray);
  },
		error: function (err) {
			console.log(err);
		}
	})
}


function addSingleWordToHangmanArray(word){
  for (var i = 0; i < hangmanArray.length; i++) {
    if (word === hangmanArray[i]) {
      console.log('--------------------------------------------');
      console.log('addSingleWordToHangmanArray is logging:');
      console.log(word + ' is already in hangmanArray!');
      return;
    }
  }
  for (var i = 0; i < databaseArray.length; i++) {
    if (word === databaseArray[i]) {
      hangmanArray.push(word);
      updateHangmanNumberHtml();
      console.log('Added ' + word + ' to hangmanArray from databaseArray');
      createObjectArrayWithSynonymsAndAntonymsAndRelatedWordsForHangmanGame(word);
      return;
    }
  }
  addWordEvenIfNotInDatabaseIfItPassedAjaxTest(word, hangmanArray);
  updateHangmanNumberHtml();
  createObjectArrayWithSynonymsAndAntonymsAndRelatedWordsForHangmanGame(word);

}

function addMultipleWordsToHangmanArray(){
  var addSpecificWordsArray = document.querySelector('#specificWordForHangmanPlayGame-input').value.replace(/\s/g, '').split(',');
  for (var i = 0; i < addSpecificWordsArray.length; i++) {
    addSingleWordToHangmanArray(addSpecificWordsArray[i]);
  }
}

function addWordOrWordsToHangmanArray(){
  var actualWord = document.querySelector('#specificWordForHangmanPlayGame-input').value;
  if (document.querySelector('#specificWordForHangmanPlayGame-input').value.indexOf(',') > -1) {
    addMultipleWordsToHangmanArray();
  }
  else {
    var indicateRepeatWord = false;
    for (var i = 0; i < hangmanArray.length; i++) {
      if(actualWord.toLowerCase() === hangmanArray[i]){
        indicateRepeatWord = true;
      }
    }
    if (indicateRepeatWord) {
      console.log('--------------------------------------------');
      console.log('addWordOrWordsToHangmanArray is logging:');
      console.log(actualWord+' is already in hangmanArray!');
    }else{
      addSingleWordToHangmanArray(actualWord);
    }
  }
  document.querySelector('#specificWordForHangmanPlayGame-input').value = '';
}

function addMultipleRandomWordsToHangmanArray(){
  var randomNumber = document.querySelector('#random-number-hangmanPlayGame-input').value;
  if(randomNumber > datesArray.length){
    randomNumber = limiter(randomNumber);
  }
  console.log('Number of random words being selected: '+randomNumber);
  var theRandomDatabaseArray = _arrayRandom(randomNumber, 0, databaseArray.length, true);
  for (var i = 0; i < theRandomDatabaseArray.length; i++) {
    addSingleWordToHangmanArray(databaseArray[theRandomDatabaseArray[i]],hangmanArray);
  }
  document.querySelector('#random-number-hangmanPlayGame-input').value = '';
}

function addSingleWordToHangmanArrayInputVersion() {
    addSingleWordToHangmanArray(document.querySelector('#specificWordForHangmanPlayGame-input').value);
}

function updateHangmanNumberHtml(){
  if (hangmanArray.length === 0) {
    document.querySelector('#numberOfWordsInHangmanArray').innerHTML = '';
    turnHangmanArraySpanIntoClickableArray();
  }else{
    document.querySelector('#numberOfWordsInHangmanArray').innerHTML = " ("+hangmanArray.length+")";
    turnHangmanArraySpanIntoClickableArray();
    // document.querySelector('#wordsInSynonymClustersArray').innerHTML = hangmanArray;
  }
}


function turnHangmanArraySpanIntoClickableArray(){
	var newInnerHTMLSpan = '';
	for (var i = 0; i < hangmanArray.length; i++) {
		if(i === hangmanArray.length - 1){
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInHangmanArray" id="'+hangmanArray[i]+'-currentLearningList'+'" onclick="removeWordFromHangmanArray(`'+hangmanArray[i]+'`)">'+hangmanArray[i]+'</span>';
		}else{
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInHangmanArray" id="'+hangmanArray[i]+'-currentLearningList'+'" onclick="removeWordFromHangmanArray(`'+hangmanArray[i]+'`)">'+hangmanArray[i]+',</span>';
		}
	}
	document.querySelector('#wordsInHangmanArray').innerHTML = newInnerHTMLSpan;
}

function removeWordFromHangmanArray(word){
  // Find where word exists in wordsArray
  var indexOfWord = hangmanArray.indexOf(word);
  // Splice word from wordsArray
  hangmanArray.splice(indexOfWord, 1);
  console.log('Removing ' + word + ' from hangmanArray Array!');
  updateHangmanNumberHtml();
  for (var i = 0; i < fullWordObjectsArrayForHangman.length; i++) {
    if (word === fullWordObjectsArrayForHangman[i].word) {
      fullWordObjectsArrayForHangman.splice(i,1);
    }
  }
}

function emptyHangmanArray(){
  hangmanArray = [];
  fullWordObjectsArrayForHangman = [];
  updateHangmanNumberHtml();
}





// CODE THAT HAS TO DO WITH ACTUAL GAMEPLAY-------------------------


function beginHangmanGame(){

  document.querySelector('#favicon').href = "/images/hangman-favicon.png";
  document.querySelector('#titleNextToFavicon').innerHTML = "Hangman!";
  document.querySelector('#synonym-clusters-body').style.display = 'none';
  document.querySelector('#synonym-clusters-game').style.display = 'none';
  document.querySelector('#quiz').style.display = 'none';
  document.querySelector('#results').style.display = 'none';
  document.querySelector('#roundNumberDiv').style.display = 'none';
  document.querySelector('#first-body').style.display = 'none';
  document.querySelector('#second-body').style.display = 'none';
  document.querySelector('.flashcard').style.display = 'none';
  stopKeydownListenerPlayGame();

  if (hangmanArray.length > 0) {
    document.querySelector('#hangman-body').style.display = 'none';
    document.querySelector('#hangman-game').style.display = 'block';

    for (var i = 0; i < 26; i++) {
      var letter = document.querySelectorAll('.hangman-letter')[i].innerHTML.toLowerCase();
      document.querySelectorAll('.hangman-letter')[i].id = letter + '-buttonForHangman';
      document.querySelectorAll('.hangman-letter')[i].style.fontWeight = 'bold';
    }

  }else{
    console.log('hangmanArray doesnt have any words!');
  }
  createWordToBeTestedDashes();
  resetHangmanState();
  enableAllLettersInHangman();
  document.querySelector('#winOrLoseIndicator').style.display = 'none';
  document.querySelector('#nextWordDuringHangman').style.display = 'none';
  document.querySelector('#multipleLettersInHangman-input').focus();
}


var hangmanState1 = window.location.href + "images/hang_1.gif";
var hangmanState2 = window.location.href +  "images/hang_2n.gif";
var hangmanState3 = window.location.href +  "images/hang_3n.gif";
var hangmanState4 = window.location.href +  "images/hang_4n.gif";
var hangmanState5 = window.location.href +  "images/hang_5n.gif";
var hangmanState6 = window.location.href +  "images/hang_6n.gif";
var hangmanState7 = window.location.href +  "images/hang_7n.gif";

var previousWordsTestedOnHangman = [];

var currentWordProgressObject = {
  correctLetters: [],
  incorrectLetters: []
};

function changeHangmanState(element){

  var letterOfElement = element.innerHTML.toLowerCase();

  // Perform code and also set true or false value;
  var indicateWhetherHangmanShouldChange = testIfLetterIsInWord(letterOfElement);

  if (!indicateWhetherHangmanShouldChange) {
    if(document.querySelector('#hangmanImage').src === hangmanState1){
      document.querySelector('#hangmanImage').src = hangmanState2;
    }
    else if(document.querySelector('#hangmanImage').src === hangmanState2){
      document.querySelector('#hangmanImage').src = hangmanState3;
    }
    else if(document.querySelector('#hangmanImage').src === hangmanState3){
      document.querySelector('#hangmanImage').src = hangmanState4;
    }
    else if(document.querySelector('#hangmanImage').src === hangmanState4){
      document.querySelector('#hangmanImage').src = hangmanState5;
    }
    else if(document.querySelector('#hangmanImage').src === hangmanState5){
      document.querySelector('#hangmanImage').src = hangmanState6;
    }
    else if(document.querySelector('#hangmanImage').src === hangmanState6){
      document.querySelector('#hangmanImage').src = hangmanState7;
      document.querySelector('#winOrLoseIndicator').style.display = 'block';
      document.querySelector('#winOrLoseIndicator').innerHTML = 'YOU LOSE!!!';
      currentWordProgressObject.successTrueOrFalse = false;
      currentWordProgressObject.wordFinishedBeingTestedTrueOrFalse = true;
      document.querySelector('#winOrLoseIndicator').style.color = 'red';
      document.querySelector('#winOrLoseIndicator').style.fontWeight = 'bold';
      document.querySelector('#nextWordDuringHangman').style.display = 'block';
      fillInWordWhenPlayerLoses();
      wordCurrentlyBeingPlayedInHangmanFullObject.successTrueOrFalse = false;
      wordCurrentlyBeingPlayedInHangmanFullObject.relevantLetterData = currentWordProgressObject;
      wordCurrentlyBeingPlayedInHangmanFullObject.html = document.querySelector('#hangmanDiv').innerHTML;
      previousWordsTestedOnHangman.push(wordCurrentlyBeingPlayedInHangmanFullObject);

      disableAllLettersInHangman();
      document.querySelector('.flashcard').style.display = 'block';
    }
    else if(document.querySelector('#hangmanImage').src === hangmanState7){
      resetHangmanState();
    }
    else {
      console.log('Something went wrong with hangman!');
    }
  }
  testIfPlayerHasSpelledOutTheHangmanWord();
  currentWordProgressObject.html = document.querySelector('#hangmanDiv').innerHTML;

  document.querySelector('#multipleLettersInHangman-input').focus();
}

function disableAllLettersInHangman(){
  for (var i = 0; i < 26; i++) {
    document.querySelectorAll('.hangman-letter')[i].disabled = true;
  }
}
function enableAllLettersInHangman(){
  for (var i = 0; i < 26; i++) {
    document.querySelectorAll('.hangman-letter')[i].disabled = false;
  }
}


function resetHangmanState(){
  document.querySelector('#hangmanImage').src = hangmanState1;

  for (var i = 0; i < 26; i++) {
    document.querySelectorAll('.hangman-letter')[i].disabled = false;
    document.querySelectorAll('.hangman-letter')[i].style.color = 'black';
  }
}

var wordCurrentlyBeingPlayedInHangman;
var wordCurrentlyBeingPlayedInHangmanFullObject;

function createWordToBeTestedDashes(){

  var numberOfWords = fullWordObjectsArrayForHangman.length;
  var randomWordNumber = Math.floor(Math.random() * numberOfWords);
  var wordToBeTested = fullWordObjectsArrayForHangman[randomWordNumber].word;

// This will allow you to keep track of the current question
  currentWordProgressObject.correctLetters = [];
  currentWordProgressObject.incorrectLetters = [];
  currentWordProgressObject.submissions = [];
  currentWordProgressObject.word = wordToBeTested;
  currentWordProgressObject.successTrueOrFalse = false;
  currentWordProgressObject.wordFinishedBeingTestedTrueOrFalse = false;


  var wordToBeTestedDefintion = fullWordObjectsArrayForHangman[randomWordNumber].definition;
  var numberOfDifferentTypesOfHints = 1;
  if (fullWordObjectsArrayForHangman[randomWordNumber].synonyms) {
    var wordToBeTestedSynonymsArray = fullWordObjectsArrayForHangman[randomWordNumber].synonyms;
    numberOfDifferentTypesOfHints ++;
  }
  if (fullWordObjectsArrayForHangman[randomWordNumber].antonyms) {
    var wordToBeTestedAntonymsArray = fullWordObjectsArrayForHangman[randomWordNumber].antonyms;
    numberOfDifferentTypesOfHints ++;
  }

  wordCurrentlyBeingPlayedInHangman = wordToBeTested;
  wordCurrentlyBeingPlayedInHangmanFullObject = fullWordObjectsArrayForHangman[randomWordNumber];
  lookupWord(wordCurrentlyBeingPlayedInHangman,false,wordCurrentlyBeingPlayedInHangmanFullObject.definitonNumber);
  document.querySelector('.flashcard').style.display = 'none';

  var dashesToBeAddedToHtml = '';

  for (var i = 0; i < wordToBeTested.length; i++) {
    if (wordToBeTested[i] === '-' || wordToBeTested[i] === ' ') {
      dashesToBeAddedToHtml += '<span style="color:black;" id="wordBeingTestedInHangmanLetterThatDoesNotHaveToBeGuessed">'+' '+' '+' '+'</span>'
    }
    else if (i === wordToBeTested.length-1) {
      dashesToBeAddedToHtml += '<span style="color:black;" id="wordBeingTestedInHangmanLetter-'+i+'" class="letterThatHasntBeenGuessedYet">-</span>'
    }else{
      dashesToBeAddedToHtml += '<span style="color:black;" id="wordBeingTestedInHangmanLetter-'+i+'" class="letterThatHasntBeenGuessedYet">- </span>'
    }
  }
  document.querySelector('#wordThatIsBeingTestHangman').innerHTML = dashesToBeAddedToHtml;

  var randomNumberThatDeterminesHintType = Math.floor(Math.random() * numberOfDifferentTypesOfHints);
  if (randomNumberThatDeterminesHintType === 0) {
    document.querySelector('#wordThatIsBeingTestHangmanDefinition').innerHTML = wordToBeTestedDefintion;
    currentWordProgressObject.hint = wordToBeTestedDefintion;
    currentWordProgressObject.html = document.querySelector('#hangmanDiv').innerHTML;
  }
  else if (randomNumberThatDeterminesHintType === 1) {
    document.querySelector('#wordThatIsBeingTestHangmanDefinition').innerHTML = '<span style="font-weight:bold;">Synonyms: </span>' + wordToBeTestedSynonymsArray;
    currentWordProgressObject.hint = 'Synonyms: ' + wordToBeTestedSynonymsArray;
    currentWordProgressObject.html = document.querySelector('#hangmanDiv').innerHTML;

  }
  else if (randomNumberThatDeterminesHintType === 2) {
    document.querySelector('#wordThatIsBeingTestHangmanDefinition').innerHTML = '<span style="font-weight:bold;">Opposite of: </span>' + wordToBeTestedAntonymsArray;
    currentWordProgressObject.hint = 'Opposite of: ' + wordToBeTestedAntonymsArray;
    currentWordProgressObject.html = document.querySelector('#hangmanDiv').innerHTML;
  }
}

function testIfLetterIsInWord(letter){
  document.querySelector('#'+letter + '-buttonForHangman').disabled = true;
  var indicateColorLetterShouldBeGreen = false;

  for (var i = 0; i < wordCurrentlyBeingPlayedInHangman.length; i++) {
    if(letter === wordCurrentlyBeingPlayedInHangman[i]){
      var iString = i.toString();
      document.querySelector('#wordBeingTestedInHangmanLetter-'+iString).innerHTML = letter.toUpperCase() + ' ';
      $('#wordBeingTestedInHangmanLetter-'+iString).removeClass('letterThatHasntBeenGuessedYet');
      indicateColorLetterShouldBeGreen = true;
    }else{
      document.querySelector('#'+letter + '-buttonForHangman').style.color = 'red';
      document.querySelector('#'+letter + '-buttonForHangman').style.fontWeight = 'bold';
    }
  }

  if (indicateColorLetterShouldBeGreen) {
    document.querySelector('#'+letter + '-buttonForHangman').style.color = 'green';
    document.querySelector('#'+letter + '-buttonForHangman').style.fontWeight = 'bold';
    currentWordProgressObject.correctLetters.push(letter);
    currentWordProgressObject.submissions.push(letter);
    currentWordProgressObject.html = document.querySelector('#hangmanDiv').innerHTML;
    return true;
  }else{
    currentWordProgressObject.incorrectLetters.push(letter);
    currentWordProgressObject.submissions.push(letter);
    currentWordProgressObject.html = document.querySelector('#hangmanDiv').innerHTML;
    return false;
  }

}
var totalWordsSuccessfullyCompletedInHangman = 0;

function testIfPlayerHasSpelledOutTheHangmanWord(){
  var countHowManyLettersAreLeftToBeGuessed = document.querySelectorAll('.letterThatHasntBeenGuessedYet').length;

  if (countHowManyLettersAreLeftToBeGuessed === 0) {
    totalWordsSuccessfullyCompletedInHangman ++;
    document.querySelector('#totalWordsSuccessfullyCompletedInHangman').innerHTML = totalWordsSuccessfullyCompletedInHangman;

    document.querySelector('#winOrLoseIndicator').style.display = 'block';
    document.querySelector('#winOrLoseIndicator').innerHTML = 'YOU WIN!!!!';
    var allLettersInCurrentWord = [];
    for (var i = 0; i < wordCurrentlyBeingPlayedInHangman.length; i++) {
      allLettersInCurrentWord.push(wordCurrentlyBeingPlayedInHangman[i]);
    }
    wordCurrentlyBeingPlayedInHangmanFullObject.successTrueOrFalse = true;
    currentWordProgressObject.successTrueOrFalse = true;
    currentWordProgressObject.wordFinishedBeingTestedTrueOrFalse = true;
    wordCurrentlyBeingPlayedInHangmanFullObject.letters = allLettersInCurrentWord;
    wordCurrentlyBeingPlayedInHangmanFullObject.relevantLetterData = currentWordProgressObject;
    wordCurrentlyBeingPlayedInHangmanFullObject.html = document.querySelector('#hangmanDiv').innerHTML;
    previousWordsTestedOnHangman.push(wordCurrentlyBeingPlayedInHangmanFullObject);
    document.querySelector('#winOrLoseIndicator').style.color = 'green';
    document.querySelector('#winOrLoseIndicator').style.fontWeight = 'bold';
    document.querySelector('#nextWordDuringHangman').style.display = 'block';
    document.querySelector('#wordThatIsBeingTestHangman').innerHTML = wordCurrentlyBeingPlayedInHangman.toUpperCase();
    document.querySelector('#wordThatIsBeingTestHangman').style.color = 'green';
    disableAllLettersInHangman();
    currentWordProgressObject.html = document.querySelector('#hangmanDiv').innerHTML;
    document.querySelector('.flashcard').style.display = 'block';
  }
}

function fillInWordWhenPlayerLoses(){
  var allLetters = [];
  var lettersGuessedCorrectly = [];
  var lettersNotGuessedCorrectly = [];
  var lengthOfWordCurrentWordBeingPlayed = wordCurrentlyBeingPlayedInHangman.length
  for (var i = 0; i < lengthOfWordCurrentWordBeingPlayed; i++) {
    var currentLetter = wordCurrentlyBeingPlayedInHangman[i];
    document.querySelector('#wordBeingTestedInHangmanLetter-'+i).innerHTML = currentLetter.toUpperCase();
    if ($('#wordBeingTestedInHangmanLetter-'+i).hasClass('letterThatHasntBeenGuessedYet')) {
      document.querySelector('#wordBeingTestedInHangmanLetter-'+i).style.color = 'red';
      lettersNotGuessedCorrectly.push(currentLetter);
      allLetters.push(currentLetter);
    }else{
      document.querySelector('#wordBeingTestedInHangmanLetter-'+i).style.color = 'green';
      lettersGuessedCorrectly.push(currentLetter);
      allLetters.push(currentLetter);
    }
  }
  wordCurrentlyBeingPlayedInHangmanFullObject.correctlyGuessedLetters = lettersGuessedCorrectly;
  wordCurrentlyBeingPlayedInHangmanFullObject.incorrectlyGuessedLetters = lettersNotGuessedCorrectly;
  wordCurrentlyBeingPlayedInHangmanFullObject.letters = allLetters;
}

function playHangmanWithSetArray(array){
  hangmanArray = array;
  fullWordObjectsArrayForHangman = [];
  for (var i = 0; i < hangmanArray.length; i++) {
    createObjectArrayWithSynonymsAndAntonymsAndRelatedWordsForHangmanGame(hangmanArray[i]);
  }
  setTimeout(function(){ beginHangmanGame(); }, 4000);
}

function playHangmanWithPreviousLearningList(array){
  playHangmanWithSetArray(array);
  document.querySelector('#expandPreviousLists').click();
}

function playHangmanWithCurrentLearningList(){
  playHangmanWithSetArray(wordsArray);
}

function viewPreviousHangmanResults(questionNumber){
  document.querySelector('#hangmanDiv').innerHTML = previousWordsTestedOnHangman[questionNumber].html;
  document.querySelector('#nextWordDuringHangman').style.display = 'none';
  disableAllLettersInHangman();
}

function enterMultipleLettersInHangman(){
  var inputText = document.querySelector('#multipleLettersInHangman-input').value;
  for (var i = 0; i < inputText.length; i++) {
    var letter = inputText[i];
    // Check if letter is anything other than a letter a-z
    if (!/[^a-zA-Z]/.test(letter)){
      document.querySelector('#'+letter+'-buttonForHangman').click();
    }
  }
  document.querySelector('#multipleLettersInHangman-input').value = '';
}

function resumeCurrentHangmanGameAfterViewingPreviousQuestions(){
  document.querySelector('#hangmanDiv').innerHTML = currentWordProgressObject.html;
}

function addUpTotalPointsInHangman(){
  var totalPoints = 0;
  for (var i = 0; i < previousWordsTestedOnHangman.length; i++) {
    if (previousWordsTestedOnHangman[i].successTrueOrFalse) {
      totalPoints += 6;
    }
  }
}
