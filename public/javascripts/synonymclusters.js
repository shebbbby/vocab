
// SYNONYM CLUSTERS ------------------------------------------------------
function displaySynonymClustersHtml () {
  document.querySelector('#favicon').href = "/images/thesaurus.png";
  document.querySelector('#titleNextToFavicon').innerHTML = "Synonym-Clusters!";
  document.querySelector('#synonym-clusters-body').style.display = 'block';
  document.querySelector('#synonym-clusters-game').style.display = 'none';
  document.querySelector('#hangman-body').style.display = 'none';
  document.querySelector('#hangman-game').style.display = 'none';
  document.querySelector('#crossword-body').style.display = 'none';
  document.querySelector('#crossword-game').style.display = 'none';

  document.querySelector('#quiz').style.display = 'none';
  document.querySelector('#results').style.display = 'none';
  document.querySelector('#roundNumberDiv').style.display = 'none';
  document.querySelector('#first-body').style.display = 'none';
  document.querySelector('#second-body').style.display = 'none';
  document.querySelector('#percentageCompleted').style.display = 'none';

  stopKeydownListenerPlayGame();
}

var synonymClusterArray = [];

var fullWordObjectsArray = [];

function createObjectArrayWithSynonymsAndAntonymsAndRelatedWords(word) {
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
            if(currentWord !== word){
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
            if(currentWord !== word){
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
            if(currentWord !== word){
            relatedWordsArrayWithoutSpaces.push(currentWord);
          }
        }
        wordObjectToAddToArray.relatedWords = relatedWordsArrayWithoutSpaces;
        wordObjectToAddToArray.totalPossiblePoints += relatedWordsArrayWithoutSpaces.length;

      }
      fullWordObjectsArray.push(wordObjectToAddToArray);
  },
		error: function (err) {
			console.log(err);
		}
	})
}

function addSingleWordToSynonymClusterArray(word){
  for (var i = 0; i < synonymClusterArray.length; i++) {
    if (word === synonymClusterArray[i]) {
      console.log('--------------------------------------------');
      console.log('addSingleWordToSynonymClusterArray is logging:');
      console.log(word + ' is already in synonymClusterArray!');
      // createObjectArrayWithSynonymsAndAntonymsAndRelatedWords(word);
      return;
    }
  }
  for (var i = 0; i < databaseArray.length; i++) {
    if (word === databaseArray[i]) {
      synonymClusterArray.push(word);
      updateSynonymClusterNumberHtml();
      console.log('Added ' + word + ' to synonymClusterArray from databaseArray');
      createObjectArrayWithSynonymsAndAntonymsAndRelatedWords(word);
      return;
    }
  }
  addWordEvenIfNotInDatabaseIfItPassedAjaxTest(word, synonymClusterArray);
  updateSynonymClusterNumberHtml();
  createObjectArrayWithSynonymsAndAntonymsAndRelatedWords(word);
}

function addMultipleWordsToSynonymClusterArray(){
  var addSpecificWordsArray = document.querySelector('#specificWordForSynonymClustersPlayGame-input').value.replace(/\s/g, '').split(',');
  for (var i = 0; i < addSpecificWordsArray.length; i++) {
    addSingleWordToSynonymClusterArray(addSpecificWordsArray[i]);
  }
}

function addWordOrWordsToSynonymClusterArray(){
  var actualWord = document.querySelector('#specificWordForSynonymClustersPlayGame-input').value;
  if (document.querySelector('#specificWordForSynonymClustersPlayGame-input').value.indexOf(',') > -1) {
    addMultipleWordsToSynonymClusterArray();
  }
  else {
    var indicateRepeatWord = false;
    for (var i = 0; i < synonymClusterArray.length; i++) {
      if(actualWord.toLowerCase() === synonymClusterArray[i]){
        indicateRepeatWord = true;
      }
    }
    if (indicateRepeatWord) {
      console.log('addWordOrWordsToSynonymClusterArray is logging');
      console.log(actualWord+' is already in synonymClusterArray!');
    }else{
      addSingleWordToSynonymClusterArray(actualWord);
    }
  }

  document.querySelector('#specificWordForSynonymClustersPlayGame-input').value = '';
}

function addMultipleRandomWordsToSynoymsClusterArray(){
  var randomNumber = document.querySelector('#random-number-synonymClustersPlayGame-input').value;
  if(randomNumber > datesArray.length){
    randomNumber = limiter(randomNumber);
  }
  console.log('Number of random words being selected: '+randomNumber);
  var theRandomDatabaseArray = _arrayRandom(randomNumber, 0, databaseArray.length, true);
  for (var i = 0; i < theRandomDatabaseArray.length; i++) {
    addSingleWordToSynonymClusterArray(databaseArray[theRandomDatabaseArray[i]],synonymClusterArray);
  }
  document.querySelector('#random-number-synonymClustersPlayGame-input').value = '';
}

function addSingleWordToSynonymClusterArrayInputVersion() {
    addSingleWordToSynonymClusterArray(document.querySelector('#specificWordForSynonymClustersPlayGame-input').value);
}

function updateSynonymClusterNumberHtml(){
  if (synonymClusterArray.length === 0) {
    document.querySelector('#numberOfWordsInSynonymClustersArray').innerHTML = '';
    turnSynonymClustersArraySpanIntoClickableArray();
  }else{
    document.querySelector('#numberOfWordsInSynonymClustersArray').innerHTML = " ("+synonymClusterArray.length+")";
    turnSynonymClustersArraySpanIntoClickableArray();
    // document.querySelector('#wordsInSynonymClustersArray').innerHTML = synonymClusterArray;
  }
}


function turnSynonymClustersArraySpanIntoClickableArray(){
	var newInnerHTMLSpan = '';
	for (var i = 0; i < synonymClusterArray.length; i++) {
		if(i === synonymClusterArray.length - 1){
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInSynonymClustersArray" id="'+synonymClusterArray[i]+'-currentLearningList'+'" onclick="removeWordFromSynonymClustersArray(`'+synonymClusterArray[i]+'`)">'+synonymClusterArray[i]+'</span>';
		}else{
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInSynonymClustersArray" id="'+synonymClusterArray[i]+'-currentLearningList'+'" onclick="removeWordFromSynonymClustersArray(`'+synonymClusterArray[i]+'`)">'+synonymClusterArray[i]+',</span>';
		}
	}
	document.querySelector('#wordsInSynonymClustersArray').innerHTML = newInnerHTMLSpan;
}

function removeWordFromSynonymClustersArray(word){
  // Find where word exists in wordsArray
  var indexOfWord = synonymClusterArray.indexOf(word);
  // Splice word from wordsArray
  synonymClusterArray.splice(indexOfWord, 1);
  console.log('Removing ' + word + ' from synonym Clusters Array!');
  updateSynonymClusterNumberHtml();
  for (var i = 0; i < fullWordObjectsArray.length; i++) {
    if (word === fullWordObjectsArray[i].word) {
      fullWordObjectsArray.splice(i,1);
    }
  }
}

function emptySynonymClustersArray(){
  synonymClusterArray = [];
  fullWordObjectsArray = [];
  updateSynonymClusterNumberHtml();
}







// CODE THAT HAS TO DO WITH ACTUAL GAMEPLAY-------------------------

function scrollToSynonymClusters(){
    $('html, body').stop(true,true).animate({
    scrollTop: $("#synonym-clusters-game").offset().top
  }, 2000)
}


var secondsPerWordDuringSynonymClusterGame = 'unlimited';
document.querySelector('#timePerWordForSynonymClusters').innerHTML = 'Unlimited';

function changeTimePerWordSynonymClusters() {
	var x = document.querySelector("#secondsPerWord-synonymClustersPlayGame-input").value;
	secondsPerWordDuringSynonymClusterGame = Number(x) * 1000;
	console.log(secondsPerWordDuringSynonymClusterGame / 1000 + ' Seconds Per Word for Synonym Cluster Game');
	document.querySelector('#timePerWordForSynonymClusters').innerHTML = (secondsPerWordDuringSynonymClusterGame / 1000) + ' Seconds / Word';
	document.querySelector('#defaultTimePerWordForSynonymClusters').innerHTML = '';
	updateCycleInformation(); // document.getElementById("time").innerHTML = cycleSpeed;
  document.querySelector("#secondsPerWord-synonymClustersPlayGame-input").value = '';
}

var wordCurrentlyBeingPlayedInSynonymClusterGame;
var synonymsThatYouHaveAlreadyFoundArray = [];
var antonymsThatYouHaveAlreadyFoundArray = [];
var relatedWordsThatYouHaveAlreadyFoundArray = [];
var synonymsThatYouHaveNotAlreadyFoundArray = [];
var antonymsThatYouHaveNotAlreadyFoundArray = [];
var relatedWordsThatYouHaveNotAlreadyFoundArray = [];
var wordsThatHavePreviouslyBeenTestedObjectArray = [];
var highScoresForWordsThatHavePreviouslyBeenTestedObjectArray = [];


// function updateHighScoresArray(){
//
//   var arrayWithEquivalentWords = [];
//   var largest = 0;
//
//     for (i=0; i<wordsThatHavePreviouslyBeenTestedObjectArray.length; i++) {
//       if (wordsThatHavePreviouslyBeenTestedObjectArray[i].points>largest) {
//           largest = array[i];
//       }
//     }
// console.log(largest);
//
//   for (var i = 0; i < wordsThatHavePreviouslyBeenTestedObjectArray.length; i++) {
//     for (var y = 0; y < wordsThatHavePreviouslyBeenTestedObjectArray.length; y++) {
//       if (wordsThatHavePreviouslyBeenTestedObjectArray[i].word === wordsThatHavePreviouslyBeenTestedObjectArray[y].word) {
//
//       }
//     }
//   }
// }

function beginSynonymClustersGame(nextWordIndicator){

// Check if this function is being used initially or being cycled to the next word
  if (nextWordIndicator) {

    var objectToPushIntoPreviouslyTestedArray = {};
      objectToPushIntoPreviouslyTestedArray.word = wordCurrentlyBeingPlayedInSynonymClusterGame.word;
      objectToPushIntoPreviouslyTestedArray.wordInformation = wordCurrentlyBeingPlayedInSynonymClusterGame;
      objectToPushIntoPreviouslyTestedArray.points = currentPointsSynonymClusterGame;
      objectToPushIntoPreviouslyTestedArray.synonymsFound = synonymsThatYouHaveAlreadyFoundArray;
      objectToPushIntoPreviouslyTestedArray.antonymsFound = antonymsThatYouHaveAlreadyFoundArray;
      objectToPushIntoPreviouslyTestedArray.relatedWordsFound = relatedWordsThatYouHaveAlreadyFoundArray;
      objectToPushIntoPreviouslyTestedArray.synonymsNotFound = synonymsThatYouHaveNotAlreadyFoundArray;
      objectToPushIntoPreviouslyTestedArray.antonymsNotFound = antonymsThatYouHaveNotAlreadyFoundArray;
      objectToPushIntoPreviouslyTestedArray.relatedWordsNotFound = relatedWordsThatYouHaveNotAlreadyFoundArray;

      wordsThatHavePreviouslyBeenTestedObjectArray.push(objectToPushIntoPreviouslyTestedArray);

  // CODE THAT HAS TO DO WITH HIGH SCORE PUSHING------------------------------------------------------------------------
      var newWordToPushIntoHighScoreIndicator = true;
      for (var i = 0; i < highScoresForWordsThatHavePreviouslyBeenTestedObjectArray.length; i++) {
        if (objectToPushIntoPreviouslyTestedArray.word === highScoresForWordsThatHavePreviouslyBeenTestedObjectArray[i].word) {
          newWordToPushIntoHighScoreIndicator = false;
          if (objectToPushIntoPreviouslyTestedArray.points > highScoresForWordsThatHavePreviouslyBeenTestedObjectArray[i].points) {
            highScoresForWordsThatHavePreviouslyBeenTestedObjectArray[i] = objectToPushIntoPreviouslyTestedArray;
          }
        }
      }
      if (newWordToPushIntoHighScoreIndicator) {
        highScoresForWordsThatHavePreviouslyBeenTestedObjectArray.push(objectToPushIntoPreviouslyTestedArray);
      }
  // ---------------------------------------------------------------------------------------------------------------------
  }
  // ---------------------------------------------------------------------------------------------------------------------

  resetCurrentPointsHtml();
  timeIntervalDuringSynonymClusterWord();



  document.querySelector('#quiz').style.display = 'none';
  document.querySelector('#results').style.display = 'none';
  document.querySelector('#roundNumberDiv').style.display = 'none';
  document.querySelector('#first-body').style.display = 'none';
  document.querySelector('#second-body').style.display = 'none';
  stopKeydownListenerPlayGame();

  document.querySelector('#synonym-clusters-body').style.display = 'none';
  document.querySelector('#synonym-clusters-game').style.display = "block";
  document.querySelector('#enterTheWordDuringSynonymClusterGame').style.display = "block";
  document.querySelector('#nextWordDuringSynonymClusterGame').style.display = "none";
  document.querySelector('#giveUpOnSynonymClusterGame').style.display = "block";
  document.querySelector('#hangman-body').style.display = 'none';
  document.querySelector('#hangman-game').style.display = 'none';


  var numberOfWords = fullWordObjectsArray.length;
  var randomWordNumber = Math.floor(Math.random() * numberOfWords);
  var wordToBeTested = fullWordObjectsArray[randomWordNumber].word;
  wordCurrentlyBeingPlayedInSynonymClusterGame = fullWordObjectsArray[randomWordNumber];
  displayPreviousPointsForSpecificWordDuringSynonymClustersPoints();
  displayHighScoresForSpecificWordDuringSynonymClustersPoints();

// Reset the following 3 arrays
  synonymsThatYouHaveAlreadyFoundArray = [];
  antonymsThatYouHaveAlreadyFoundArray = [];
  relatedWordsThatYouHaveAlreadyFoundArray = [];

  synonymsThatYouHaveNotAlreadyFoundArray = [];
  antonymsThatYouHaveNotAlreadyFoundArray = [];
  relatedWordsThatYouHaveNotAlreadyFoundArray = [];

  document.querySelector('#individualSynonymClusterWord').innerHTML = wordToBeTested + ':';
  document.querySelector('#individualSynonymClusterWordDefinition').innerHTML = wordCurrentlyBeingPlayedInSynonymClusterGame.definition;


document.getElementById("listOfSynonymsDuringGame").innerHTML = '';
document.getElementById("listOfAntonymsDuringGame").innerHTML = '';
document.getElementById("listOfRelatedWordsDuringGame").innerHTML = '';

  if (wordCurrentlyBeingPlayedInSynonymClusterGame.synonyms) {
    document.querySelector('#synonymsDivDuringClusterGame').style.display = "block";
  }else{
    document.querySelector('#synonymsDivDuringClusterGame').style.display = "none";
  }
  if (wordCurrentlyBeingPlayedInSynonymClusterGame.antonyms) {
    document.querySelector('#antonymsDivDuringClusterGame').style.display = "block";
  }else {
    document.querySelector('#antonymsDivDuringClusterGame').style.display = "none";
  }
  if (wordCurrentlyBeingPlayedInSynonymClusterGame.relatedWords) {
    document.querySelector('#relatedWordsDivDuringClusterGame').style.display = "block";
  }else{
    document.querySelector('#relatedWordsDivDuringClusterGame').style.display = "none";
  }
  updateTotalPossiblePointsForSynonymClusters();
  scrollToSynonymClusters();
  document.querySelector('#individualSynonymCluster-input').focus();
}

var totalPointsSynonymClusterGame = 0;
var currentPointsSynonymClusterGame = 0;

function checkIfWordIsSynonymOrAntonymOrRelatedWord(){
  updateTotalPossiblePointsForSynonymClusters();
  var originalInputTextLowercased = document.querySelector('#individualSynonymCluster-input').value.toLowerCase()
  var inputText = document.querySelector('#individualSynonymCluster-input').value.toLowerCase().replace(" ", "");

  for (var i = 0; i < synonymsThatYouHaveAlreadyFoundArray.length; i++) {
    if (inputText === synonymsThatYouHaveAlreadyFoundArray[i]) {
      console.log('Already found the synonym: ' + inputText + '!');
      document.querySelector('#individualSynonymCluster-input').value = '';
      return;
    }
    else if (originalInputTextLowercased === synonymsThatYouHaveAlreadyFoundArray[i]) {
      console.log('Already found the synonym: ' + originalInputTextLowercased + '!');
      document.querySelector('#individualSynonymCluster-input').value = '';
      return;
    }
  }
  for (var i = 0; i < antonymsThatYouHaveAlreadyFoundArray.length; i++) {
    if (inputText === antonymsThatYouHaveAlreadyFoundArray[i]) {
      console.log('Already found the antonym: ' + inputText + '!');
      document.querySelector('#individualSynonymCluster-input').value = '';
      return;
    }
    else if (originalInputTextLowercased === antonymsThatYouHaveAlreadyFoundArray[i]) {
      console.log('Already found the antonym: ' + originalInputTextLowercased + '!');
      document.querySelector('#individualSynonymCluster-input').value = '';
      return;
    }
  }
  for (var i = 0; i < relatedWordsThatYouHaveAlreadyFoundArray.length; i++) {
    if (inputText === relatedWordsThatYouHaveAlreadyFoundArray[i]) {
      console.log('Already found the related word: ' + inputText + '!');
      document.querySelector('#individualSynonymCluster-input').value = '';
      return;
    }
    else if (originalInputTextLowercased === relatedWordsThatYouHaveAlreadyFoundArray[i]) {
      console.log('Already found the related word: ' + originalInputTextLowercased + '!');
      document.querySelector('#individualSynonymCluster-input').value = '';
      return;
    }
  }

  if (wordCurrentlyBeingPlayedInSynonymClusterGame.synonyms) {
    var listOfSynonyms = document.getElementById("listOfSynonymsDuringGame").innerHTML;
    var synonymsArrayToBeTested = wordCurrentlyBeingPlayedInSynonymClusterGame.synonyms;

    for (var i = 0; i < synonymsArrayToBeTested.length; i++) {
      if (inputText === synonymsArrayToBeTested[i]) {
        synonymsThatYouHaveAlreadyFoundArray.push(inputText);
        updateSynonymClustersPoints();
        var appendThis = '<li class="synonymClusterListItem correctSynonym">' + inputText + '</li>'
        listOfSynonyms += appendThis;
        document.getElementById("listOfSynonymsDuringGame").innerHTML = listOfSynonyms;
      }
      else if (originalInputTextLowercased === synonymsArrayToBeTested[i]) {
        synonymsThatYouHaveAlreadyFoundArray.push(originalInputTextLowercased);
        updateSynonymClustersPoints();
        var appendThis = '<li class="synonymClusterListItem correctSynonym">' + originalInputTextLowercased + '</li>'
        listOfSynonyms += appendThis;
        document.getElementById("listOfSynonymsDuringGame").innerHTML = listOfSynonyms;
      }
    }
  }

  if (wordCurrentlyBeingPlayedInSynonymClusterGame.antonyms) {
    var listOfAntonyms = document.getElementById("listOfAntonymsDuringGame").innerHTML;
    var antonymsArrayToBeTested = wordCurrentlyBeingPlayedInSynonymClusterGame.antonyms;

    for (var i = 0; i < antonymsArrayToBeTested.length; i++) {
      if (inputText === antonymsArrayToBeTested[i]) {
        antonymsThatYouHaveAlreadyFoundArray.push(inputText);
        updateSynonymClustersPoints();
        var appendThis = '<li class="antonymClusterListItem correctAntonym">' + inputText + '</li>'
        listOfAntonyms += appendThis;
        document.getElementById("listOfAntonymsDuringGame").innerHTML = listOfAntonyms;
      }
      else if (originalInputTextLowercased === antonymsArrayToBeTested[i]) {
        antonymsThatYouHaveAlreadyFoundArray.push(originalInputTextLowercased);
        updateSynonymClustersPoints();
        var appendThis = '<li class="antonymClusterListItem correctAntonym">' + originalInputTextLowercased + '</li>'
        listOfAntonyms += appendThis;
        document.getElementById("listOfAntonymsDuringGame").innerHTML = listOfAntonyms;
      }
    }
  }

  if (wordCurrentlyBeingPlayedInSynonymClusterGame.relatedWords) {
    var listOfRelatedWords = document.getElementById("listOfRelatedWordsDuringGame").innerHTML;
    var relatedWordsArrayToBeTested = wordCurrentlyBeingPlayedInSynonymClusterGame.relatedWords;

    for (var i = 0; i < relatedWordsArrayToBeTested.length; i++) {
      if (inputText === relatedWordsArrayToBeTested[i]) {
        relatedWordsThatYouHaveAlreadyFoundArray.push(inputText);
        updateSynonymClustersPoints();
        var appendThis = '<li class="relatedWordClusterListItem correctRelatedWord">' + inputText + '</li>'
        listOfRelatedWords += appendThis;
        document.getElementById("listOfRelatedWordsDuringGame").innerHTML = listOfRelatedWords;
      }
      else if (originalInputTextLowercased === relatedWordsArrayToBeTested[i]) {
        relatedWordsThatYouHaveAlreadyFoundArray.push(originalInputTextLowercased);
        updateSynonymClustersPoints();
        var appendThis = '<li class="relatedWordClusterListItem correctRelatedWord">' + originalInputTextLowercased + '</li>'
        listOfRelatedWords += appendThis;
        document.getElementById("listOfRelatedWordsDuringGame").innerHTML = listOfRelatedWords;
      }
    }
  }

  document.querySelector('#individualSynonymCluster-input').value = '';
  document.querySelector('#individualSynonymCluster-input').focus();
}

function updateSynonymClustersPoints(){
  totalPointsSynonymClusterGame ++;
  currentPointsSynonymClusterGame ++;
  document.querySelector('#currentPointsForSpecificWordDuringSynonymClustersGame').innerHTML = currentPointsSynonymClusterGame;
  document.querySelector('#pointsDuringSynonymClustersGame').innerHTML = totalPointsSynonymClusterGame;
}

function updateTotalPossiblePointsForSynonymClusters(){
  var totalPoints = wordCurrentlyBeingPlayedInSynonymClusterGame.totalPossiblePoints;
  document.querySelector('#totalPossiblePointsForSpecificWordDuringSynonymClustersGame').innerHTML = totalPoints;
}

function resetCurrentPointsHtml(){
  currentPointsSynonymClusterGame = 0;
  document.querySelector('#currentPointsForSpecificWordDuringSynonymClustersGame').innerHTML = currentPointsSynonymClusterGame;
}

function displayPreviousPointsForSpecificWordDuringSynonymClustersPoints(){
  var wordIsFoundIndicator = false;
  for (var i = 0; i < wordsThatHavePreviouslyBeenTestedObjectArray.length; i++) {
    if (wordCurrentlyBeingPlayedInSynonymClusterGame.word === wordsThatHavePreviouslyBeenTestedObjectArray[i].word) {
      document.querySelector('#pointsParagraphForSpecificWordDuringSynonymClustersGame').style.display = 'block';
      document.querySelector('#pointsForSpecificWordDuringSynonymClustersGame').innerHTML = wordsThatHavePreviouslyBeenTestedObjectArray[i].points;
      wordIsFoundIndicator = true;
    }
  }
  if (!wordIsFoundIndicator) {
    document.querySelector('#pointsParagraphForSpecificWordDuringSynonymClustersGame').style.display = 'none';
    document.querySelector('#pointsForSpecificWordDuringSynonymClustersGame').innerHTML = 0;
  }
}

function displayHighScoresForSpecificWordDuringSynonymClustersPoints(){
  var wordIsFoundIndicator = false;
  for (var i = 0; i < highScoresForWordsThatHavePreviouslyBeenTestedObjectArray.length; i++) {
    if (wordCurrentlyBeingPlayedInSynonymClusterGame.word === highScoresForWordsThatHavePreviouslyBeenTestedObjectArray[i].word) {
      document.querySelector('#highScoreParagraphForSpecificWordDuringSynonymClustersGame').style.display = 'block';
      document.querySelector('#highScoreForSpecificWordDuringSynonymClustersGame').innerHTML = highScoresForWordsThatHavePreviouslyBeenTestedObjectArray[i].points;
      wordIsFoundIndicator = true;
    }
  }
  if (!wordIsFoundIndicator) {
    document.querySelector('#highScoreParagraphForSpecificWordDuringSynonymClustersGame').style.display = 'none';
    document.querySelector('#highScoreForSpecificWordDuringSynonymClustersGame').innerHTML = 0;
  }
}

function timeIsUpOrPlayerHasGivenUpOnSynonymClusterGame(){
  secondsPerWordInSeconds = 0;
  document.querySelector('#enterTheWordDuringSynonymClusterGame').style.display = "none";

  document.getElementById("listOfSynonymsDuringGame").innerHTML = '';
  document.getElementById("listOfAntonymsDuringGame").innerHTML = '';
  document.getElementById("listOfRelatedWordsDuringGame").innerHTML = '';
  document.querySelector('#individualSynonymCluster-input').value = '';

  // var totalCorrectSynonyms = document.querySelectorAll('.correctSynonym').length;
  // for (var i = 0; i < totalCorrectSynonyms; i++) {
  //   document.querySelectorAll('.correctSynonym')[i].style.color = 'green';
  // }
  // var totalCorrectAntonyms = document.querySelectorAll('.correctAntonym').length;
  // for (var i = 0; i < totalCorrectAntonyms; i++) {
  //   document.querySelectorAll('.correctAntonym')[i].style.color = 'green';
  // }
  // var totalCorrectRelatedWords = document.querySelectorAll('.correctRelatedWord').length;
  // for (var i = 0; i < totalCorrectRelatedWords; i++) {
  //   document.querySelectorAll('.correctRelatedWord')[i].style.color = 'green';
  // }




if (wordCurrentlyBeingPlayedInSynonymClusterGame.synonyms) {
  var synonymsArrayToBeTested = wordCurrentlyBeingPlayedInSynonymClusterGame.synonyms;
  var synonymsHtml = document.getElementById("listOfSynonymsDuringGame").innerHTML;

  for (var i = 0; i < synonymsThatYouHaveAlreadyFoundArray.length; i++) {
    var appendThis = '<li style="color:green;" class="synonymClusterListItem correctSynonym">' + synonymsThatYouHaveAlreadyFoundArray[i] + '</li>'
    synonymsHtml += appendThis;
  }

  for (var i = 0; i < synonymsArrayToBeTested.length; i++) {
    var synonymChecker = true;
    for (var y = 0; y < synonymsThatYouHaveAlreadyFoundArray.length; y++) {
      if (synonymsArrayToBeTested[i] === synonymsThatYouHaveAlreadyFoundArray[y]) {
          synonymChecker = false;
      }
    }
    if (synonymChecker) {
      var appendThis = '<li style="color:red;" class="synonymClusterListItem incorrectSynonym">' + synonymsArrayToBeTested[i] + '</li>'
      synonymsThatYouHaveNotAlreadyFoundArray.push(synonymsArrayToBeTested[i]);
      synonymsHtml += appendThis;
    }
  }
  document.getElementById("listOfSynonymsDuringGame").innerHTML = synonymsHtml;
}


if (wordCurrentlyBeingPlayedInSynonymClusterGame.antonyms) {
  var antonymsArrayToBeTested = wordCurrentlyBeingPlayedInSynonymClusterGame.antonyms;
  var antonymsHtml = document.getElementById("listOfAntonymsDuringGame").innerHTML;

  for (var i = 0; i < antonymsThatYouHaveAlreadyFoundArray.length; i++) {
    var appendThis = '<li style="color:green;" class="antonymClusterListItem correctAntonym">' + antonymsThatYouHaveAlreadyFoundArray[i] + '</li>'
    antonymsHtml += appendThis;
  }

  for (var i = 0; i < antonymsArrayToBeTested.length; i++) {
    var antonymChecker = true;
    for (var y = 0; y < antonymsThatYouHaveAlreadyFoundArray.length; y++) {
      if (antonymsArrayToBeTested[i] === antonymsThatYouHaveAlreadyFoundArray[y]) {
          antonymChecker = false;
      }
    }
    if (antonymChecker) {
      var appendThis = '<li style="color:red;" class="antonymClusterListItem incorrectAntonym">' + antonymsArrayToBeTested[i] + '</li>'
      antonymsThatYouHaveNotAlreadyFoundArray.push(antonymsArrayToBeTested[i]);
      antonymsHtml += appendThis;
  }
  }
  document.getElementById("listOfAntonymsDuringGame").innerHTML = antonymsHtml;
}
if (wordCurrentlyBeingPlayedInSynonymClusterGame.relatedWords) {
  var relatedWordsArrayToBeTested = wordCurrentlyBeingPlayedInSynonymClusterGame.relatedWords;
  var relatedWordsHtml = document.getElementById("listOfRelatedWordsDuringGame").innerHTML;

  for (var i = 0; i < relatedWordsThatYouHaveAlreadyFoundArray.length; i++) {
    var appendThis = '<li style="color:green;" class="relatedWordClusterListItem correctRelatedWord">' + relatedWordsThatYouHaveAlreadyFoundArray[i] + '</li>'
    relatedWordsHtml += appendThis;
  }

  for (var i = 0; i < relatedWordsArrayToBeTested.length; i++) {
    var relatedWordChecker = true;
    for (var y = 0; y < relatedWordsThatYouHaveAlreadyFoundArray.length; y++) {
      if (relatedWordsArrayToBeTested[i] === relatedWordsThatYouHaveAlreadyFoundArray[y]) {
          relatedWordChecker = false;
      }
    }
    if (relatedWordChecker) {
      var appendThis = '<li style="color:red;" class="relatedWordClusterListItem incorrectRelatedWord">' + relatedWordsArrayToBeTested[i] + '</li>'
      relatedWordsThatYouHaveNotAlreadyFoundArray.push(relatedWordsArrayToBeTested[i]);
      relatedWordsHtml += appendThis;
  }
  }
}

  document.getElementById("listOfRelatedWordsDuringGame").innerHTML = relatedWordsHtml;
  document.getElementById("giveUpOnSynonymClusterGame").style.display = 'none';
  document.querySelector('#nextWordDuringSynonymClusterGame').style.display = "block";

}

var secondsPerWordInSeconds;
function timeIntervalDuringSynonymClusterWord() {
  secondsPerWordInSeconds = secondsPerWordDuringSynonymClusterGame/1000;
  if (typeof secondsPerWordDuringSynonymClusterGame === 'number') {
    function tick() {
        var counter = document.getElementById("timeIntervalDuringSynonymClusterWord");
        secondsPerWordInSeconds--;
        document.getElementById("timeIntervalDuringSynonymClusterWord").innerHTML = secondsPerWordInSeconds;
        timeIntervalDuringSynonymClusterWord.innerHTML = "0:" + (secondsPerWordInSeconds < 10 ? "0" : "") + String(secondsPerWordInSeconds);
        if( secondsPerWordInSeconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
            document.getElementById("timeIntervalDuringSynonymClusterWord").innerHTML = 'TIME UP!!';
            console.log("Game over");
            timeIsUpOrPlayerHasGivenUpOnSynonymClusterGame();
        }
    }
    tick();
  }else{
    console.log('secondsPerWordDuringSynonymClusterGame is set to unlimited');
  }
}



function playSynonymClustersGameWithSetArray(array){
  fullWordObjectsArray = [];
  synonymClusterArray = array;
  for (var i = 0; i < synonymClusterArray.length; i++) {
    createObjectArrayWithSynonymsAndAntonymsAndRelatedWords(synonymClusterArray[i]);
  }
  setTimeout(function(){ beginSynonymClustersGame(); }, 4000);
}

function playSynonymClustersGameWithPreviousLearningList(array){
  playSynonymClustersGameWithSetArray(array);
  document.querySelector('#expandPreviousLists').click();
}

function playSynonymClustersGameWithCurrentLearningList(){
  playSynonymClustersGameWithSetArray(wordsArray);
}
