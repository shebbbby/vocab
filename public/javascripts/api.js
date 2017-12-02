// Remove Elements
// And then you can remove elements like this
// document.getElementById("my-element").remove();
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
function addWord(word){
// if($.inArray(word, wordsArray) === -1){
// If the plus sign button is 'style: block' then add the word
if(document.getElementById("plus-"+word).style.display === 'block'){
  console.log($.inArray(word, wordsArray));
  wordsArray.push(word);
  document.getElementById("demo").innerHTML = wordsArray;
  document.getElementById("numberInList").innerHTML = wordsArray.length;
  document.getElementById("plus-"+word).style.display = 'none';
  document.getElementById("checkmark-"+word).style.display = 'block';
  document.getElementById('word-search-error').style.display = 'none';
  document.getElementById('repeat-word-error').style.display = 'none';
  var cycleDurationSeconds = ((Number(document.getElementById("numberInList").innerHTML)) * (cycleSpeed / 1000));
  var cycleDurationMinutes = cycleDurationSeconds / 60;
  document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Minutes / ' + cycleDurationSeconds.toFixed(0) + ' Seconds';
}
}
// }
function cycleTime(){
  document.getElementById("cycleTime").innerHTML = document.getElementById("numberInList").innerHTML;
}
function removeWordFromStudyArray(word){
  // Find where word exists in wordsArray
  var indexOfWord = wordsArray.indexOf(word);
  // Splice word from wordsArray
  wordsArray.splice(indexOfWord,1);
  document.getElementById("demo").innerHTML = wordsArray;
  document.getElementById("numberInList").innerHTML = wordsArray.length;
  document.querySelector("#plus-"+word).style.display = 'block';
  document.querySelector("#checkmark-"+word).style.display = 'none';
  var cycleDurationSeconds = ((Number(document.getElementById("numberInList").innerHTML)) * (cycleSpeed / 1000));
  var cycleDurationMinutes = cycleDurationSeconds / 60;
  document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Minutes / ' + cycleDurationSeconds.toFixed(0) + ' Seconds';
}

function showSpeedInput(){
  document.querySelector("#speed-input").style.display = 'block';
  document.querySelector(".edit-speed-off").style.display = 'block';
  document.querySelector(".edit-speed-on").style.display = 'none';
}
function hideSpeedInput(){
  document.querySelector("#speed-input").style.display = 'none';
  document.querySelector(".edit-speed-off").style.display = 'none';
  document.querySelector(".edit-speed-on").style.display = 'block';
}

function showCustomInputs(){
  document.querySelector("#hidden-inputs").style.display = 'block';
}

var wordsArray = [];
var wordCount = 0;
cycleSpeed = 5000;
document.querySelector('#cycleSpeed').innerHTML = (cycleSpeed / 1000) + ' Seconds Per Word';
document.getElementById("cycleTime").innerHTML = '0 Seconds';

function changeSpeed(){
  var x = document.querySelector("#speed-input").value;
  cycleSpeed = Number(x)*1000;
  console.log(cycleSpeed)
  document.querySelector('#cycleSpeed').innerHTML = (cycleSpeed / 1000) + ' Seconds Per Word';
  document.querySelector('#defaultSpeed').innerHTML = '';
  var cycleDurationSeconds = ((Number(document.getElementById("numberInList").innerHTML)) * (cycleSpeed / 1000));
  var cycleDurationMinutes = cycleDurationSeconds / 60;
  document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Minutes / ' + cycleDurationSeconds.toFixed(0) + ' Seconds';
  // document.getElementById("time").innerHTML = cycleSpeed;
}

// This is only if you use the input to add something
function addWordUsingInput(){
  var x = document.getElementById("age").value;
  wordsArray.push(x);
  document.getElementById("age").value = '';
  document.getElementById("demo").innerHTML = wordsArray;
}

function cycleWordsArray(num){
  if(num >= 0){
    wordCount = num;
  }
  thesaurus(wordsArray[wordCount]);
  wordCount ++;
  if(wordCount === wordsArray.length){
    wordCount = 0;
  }
}
function previousWord(){
  if(wordCount >= 2){
  cycleWordsArray(wordCount-2)
}
else if (currentFlashcardWordIndexInStudyArray === 0) {
  cycleWordsArray(wordsArray.length-1);
}
else{
  cycleWordsArray(wordsArray.length-2);
}
}
function nextWord(){
  cycleWordsArray(wordCount)
}



// Meant to allow you to remove word from learning array when cycle has already started.
function removeWordButton(word){
  var indexOfWord = wordsArray.indexOf(word);
  // If you are removing any word but the last word, skip to the next word
  if(currentFlashcardWordIndexInStudyArray !== wordsArray.length-1){
  wordsArray.splice(indexOfWord,1);
  document.getElementById("demo").innerHTML = wordsArray;
  document.getElementById("numberInList").innerHTML = wordsArray.length;
  document.querySelector("#plus-"+word).style.display = 'block';
  document.querySelector("#checkmark-"+word).style.display = 'none';
  var cycleDurationSeconds = ((Number(document.getElementById("numberInList").innerHTML)) * (cycleSpeed / 1000));
  var cycleDurationMinutes = cycleDurationSeconds / 60;
  document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Minutes / ' + cycleDurationSeconds.toFixed(0) + ' Seconds';
  cycleWordsArray(currentFlashcardWordIndexInStudyArray);
}
// If you are removing the last word, skip to the first word in array.
  else if(currentFlashcardWordIndexInStudyArray === wordsArray.length-1){
    wordsArray.splice(indexOfWord,1);
    document.getElementById("demo").innerHTML = wordsArray;
    document.getElementById("numberInList").innerHTML = wordsArray.length;
    document.querySelector("#plus-"+word).style.display = 'block';
    document.querySelector("#checkmark-"+word).style.display = 'none';
    var cycleDurationSeconds = ((Number(document.getElementById("numberInList").innerHTML)) * (cycleSpeed / 1000));
    var cycleDurationMinutes = cycleDurationSeconds / 60;
    document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Minutes / ' + cycleDurationSeconds.toFixed(0) + ' Seconds';
    cycleWordsArray(wordsArray[1]);
  }
  if(wordsArray.length === 0){
    alert('You do not have any words left! Please select some words!');
    document.querySelector("body").style.display = 'none';
    location.reload();
  }
}

var cycleTimer = cycleSpeed;
var intervalCycle = function(){ setInterval(function(){

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
function startCycle(){
  if(wordsArray.length > 0){
  getAllSentences();
  document.querySelector('.flashcard').style.display = 'block';
  document.getElementById('colorLabelInforation').style.display = 'block';
  document.querySelector('#next-previous-buttons').style.display = 'block';
  document.querySelector('#display-words-list').style.display = 'block';
  document.querySelector('#begin-cycle-button').style.display = 'none';
  document.querySelector('#hideUponBegin').style.display = 'none';
  document.getElementById('begin-error').style.display = 'none';
  nextWord();
  intervalCycle();
}
else{
  document.querySelector('#begin-error').style.display = 'block';
}
}
// Starts cycling with wordsArray and cycleSpeed
function displayWordsList(){
  document.querySelector('#hideUponBegin').style.display = 'block';
  document.querySelector('#begin-cycle-button').style.display = 'block';
  document.querySelector('#begin-cycle-button').innerHTML = 'Continue';
  document.querySelector('#display-words-list').style.display = 'none';
}
// startCycle();
function inputFiller() {
  var uploadWordsArray = document.querySelector('#age').value.split(",");
  console.log(uploadWordsArray);
  var newWord = uploadWordsArray[0];
  wordToWords();
$.ajax({
  url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+newWord+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
  method: "GET",
  success: function (response) {
// If database already has that word then display error message
// Convert value to have no upper case or spaces
    if($.inArray(newWord.toLowerCase().replace(/\s/g, ''), databaseArray) == -1){
    if(document.querySelector('#word-input') != '' && response.querySelector('hw')){
      document.querySelector('#word-input').value = response.querySelector('hw').innerHTML
    }
    if(document.querySelector('#definition-input') != '' && response.querySelector('mc')){
      document.querySelector('#definition-input').value = response.querySelector('mc').innerHTML
    }
    if(document.querySelector('#speech-input') != '' && response.querySelector('fl')){
      document.querySelector('#speech-input').value = response.querySelector('fl').innerHTML
    }
    if(document.querySelector('#sentence-input') != '' && response.querySelector('vi')){
      document.querySelector('#sentence-input').value = response.querySelector('vi').innerHTML
    }
    if(document.querySelector('#synonyms-input') != '' && response.querySelector('syn')){
      document.querySelector('#synonyms-input').value = response.querySelector('syn').innerHTML
    }
    if(document.querySelector('#relatedwords-input') != '' && response.querySelector('rel')){
      document.querySelector('#relatedwords-input').value = response.querySelector('rel').innerHTML
    }
    if(document.querySelector('#antonyms-input') != '' && response.querySelector('ant')){
      document.querySelector('#antonyms-input').value = response.querySelector('ant').innerHTML
    }
    if(response.querySelector('hw')){
      document.getElementById('word-search-success').innerHTML = newWord + ' was added!';
      document.getElementById('word-search-success').style.display = 'block';
      document.getElementById('word-search-error').style.display = 'none';
      document.getElementById('repeat-word-error').style.display = 'none';
      document.getElementById('begin-error').style.display = 'none';
      if(uploadWordsArray.length === 1){
        document.getElementById('word-submitter').click();
      }
      else{
        document.getElementById('words-uploading').style.display = 'block';
        // Give wordToWords() time to finish all ajax requests before clicking and posting.
        setTimeout(function(){
          document.getElementById('word-submitter').click(); }, 3000);
      }
  }
  if(!response.querySelector('hw'))
  {
    document.getElementById('word-search-error').innerHTML = 'Sorry, ' + newWord + ' not Found';
    document.getElementById('word-search-error').style.display = 'block';
    document.getElementById('repeat-word-error').style.display = 'none';
  }
}
else{
  document.getElementById('repeat-word-error').innerHTML = 'You Already Have The Word: ' + newWord;
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

function downloadSynonymNewWords(){
  document.querySelector('#words-input').value = '';
  for(var i = 0; i <= wordsToAdd.length - 1; i++){
    // If the word is not already in database
    if($.inArray(wordsToAdd[i].toLowerCase().replace(/\s/g, ''), databaseArray) !== -1){
      wordsToAdd.splice(i,1);
    }
  }
  document.querySelector('#word-input').value = wordsToAdd[0];
  for(var i = 1; i <= wordsToAdd.length - 1; i++){
    if(i === wordsToAdd.length - 1){
      document.querySelector('#words-input').value += wordsToAdd[i];
    }
    else{
      document.querySelector('#words-input').value += wordsToAdd[i] + ',';
    }
  }
  document.getElementById('word-submitter').click()
}

function addWordFromSynonyms(word){
// if($.inArray(word, wordsArray) === -1){
// If the plus sign button is 'style: block' then add the word
var indexOfWord = wordsArray.indexOf(word);
var indexOfWordInWordsToAddArray = wordsToAdd.indexOf(word);

if($.inArray(word, wordsArray) === -1 && document.getElementById("synonym-"+word).style.color !== 'blue'){
  console.log($.inArray(word, wordsArray));
  wordsArray.push(word);
  document.getElementById("demo").innerHTML = wordsArray;
  document.getElementById("numberInList").innerHTML = wordsArray.length;
  document.getElementById("synonym-"+word).style.color = 'blue';
  var cycleDurationSeconds = ((Number(document.getElementById("numberInList").innerHTML)) * (cycleSpeed / 1000));
  var cycleDurationMinutes = cycleDurationSeconds / 60;
  document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Minutes / ' + cycleDurationSeconds.toFixed(0) + ' Seconds';

if($.inArray(word, databaseArray) !== -1){
    document.getElementById("plus-"+word).style.display = 'none';
    document.getElementById("checkmark-"+word).style.display = 'block';
  }
if($.inArray(word, databaseArray) === -1 && $.inArray(word, wordsToAdd) === -1){
    wordsToAdd.push(word);
    document.getElementById("wordstoaddparagraph").style.display = 'block';
    document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
    document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
    }
  }
  // if color is blue and word is not in database:
else if(document.getElementById("synonym-"+word).style.color === 'blue' && $.inArray(word, databaseArray) !== -1){
  wordsArray.splice(indexOfWord,1);
  document.getElementById("demo").innerHTML = wordsArray;
  document.getElementById("numberInList").innerHTML = wordsArray.length;
  document.getElementById("synonym-"+word).style.color = 'green';
  var cycleDurationSeconds = ((Number(document.getElementById("numberInList").innerHTML)) * (cycleSpeed / 1000));
  var cycleDurationMinutes = cycleDurationSeconds / 60;
  document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Minutes / ' + cycleDurationSeconds.toFixed(0) + ' Seconds';
  document.getElementById("plus-"+word).style.display = 'block';
  document.getElementById("checkmark-"+word).style.display = 'none';
}
else if(document.getElementById("synonym-"+word).style.color === 'blue' && $.inArray(word, databaseArray) === -1){
  wordsArray.splice(indexOfWord,1);
  wordsToAdd.splice(indexOfWordInWordsToAddArray,1);
  document.getElementById("demo").innerHTML = wordsArray;
  if(wordsToAdd.length === 0){
  document.getElementById("wordstoaddparagraph").style.display = 'none';
}
  document.getElementById("wordsToAdd").innerHTML = wordsToAdd;
  document.getElementById("wordsToAddNumber").innerHTML = wordsToAdd.length;
  document.getElementById("numberInList").innerHTML = wordsArray.length;
  document.getElementById("synonym-"+word).style.color = 'red';
  var cycleDurationSeconds = ((Number(document.getElementById("numberInList").innerHTML)) * (cycleSpeed / 1000));
  var cycleDurationMinutes = cycleDurationSeconds / 60;
  document.getElementById("cycleTime").innerHTML = cycleDurationMinutes.toFixed(2) + ' Minutes / ' + cycleDurationSeconds.toFixed(0) + ' Seconds';
}
 }

var appendThis;
var currentFlashcardWord;
var currentFlashcardWordIndexInStudyArray;
function thesaurus(word) {
$.ajax({
  url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+word+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
  method: "GET",
  success: function (response) {
    if(response.querySelector('hw')){
      currentFlashcardWord = response.querySelector('hw').innerHTML;
      currentFlashcardWordIndexInStudyArray = wordsArray.indexOf(currentFlashcardWord);
      console.log(response);
      console.log(currentFlashcardWord);
      console.log('Word# '+currentFlashcardWordIndexInStudyArray);
      var countSens = 0;
      for(var i = 0; i <= 5; i++){
        if(response.getElementsByTagName('sens')[i]){
          countSens++
        }
      }
      var randomNumber = Math.floor(Math.random() * countSens);

// CODE THAT HAS TO DO WITH SYNONYMS--------------------------------------------------
    var synonyms = response.getElementsByTagName('syn')[randomNumber].innerHTML;
    var synonymsArray = synonyms.split(",");
    function isInArray(value, array) {
      return array.indexOf(value) > -1;
    }
    function addSynonymsHtml(){
      var synonymsHtml = '';
      for(var i = 0; i<= synonymsArray.length - 1; i++){
        var comma = ', ';
        if(i === synonymsArray.length - 1){
          comma = '';
        }
        var noSpacesWord = synonymsArray[i].replace(" ", "");
        if(noSpacesWord === response.querySelector('hw').innerHTML){
          synonymsHtml += '';
        }
        // If a synonym has symbols incombatible with the api search, make it black.
        else if(noSpacesWord.includes("(") || noSpacesWord.includes(")") || noSpacesWord.includes("[") || noSpacesWord.includes("]")){
          synonymsHtml += '<span style="color: black; cursor: auto;">' + noSpacesWord + comma + '</span>';
        }
        else if(isInArray(noSpacesWord, wordsArray)){
          // If word is in learning list, make it blue
        synonymsHtml += '<span id="synonym-'+ noSpacesWord +'" style="color: blue; cursor: pointer;" onclick="addWordFromSynonyms('+ "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
      }
        else if(isInArray(noSpacesWord, databaseArray)){
          // If word is in database, make it green
        synonymsHtml += '<span id="synonym-'+ noSpacesWord +'" style="color: green; cursor: pointer;" onclick="addWordFromSynonyms('+ "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
      }
        else{
          // If word is not in database, make it red
          synonymsHtml += '<span id="synonym-'+ noSpacesWord +'" style="color: red; cursor: pointer;"onclick="addWordFromSynonyms('+ "'" + noSpacesWord + "'" + ')">' + noSpacesWord + comma + '</span>';
        }
  }
    return synonymsHtml;
  }
  var synonymsHtml = addSynonymsHtml();
  // -------------------------------------------------------------------------------------------------------------------

// CODE THAT HAS TO DO WITH THE SENTENCE----------------------------------------------------------------------------------
  var sentence = response.getElementsByTagName('vi')[randomNumber].innerHTML;
  var boldedWordSentence = sentence.replace("<it>", "<it style='font-weight:bold;'>");
// -----------------------------------------------------------------------------------------------------------------------

    appendThis = `<li class="word">`+  response.querySelector('hw').innerHTML + `<span style='font-size:12px; color: black;'> (`+response.querySelector('fl').innerHTML+`)</span>
    <span style='font-size:12px; color: black;'>(V.`+ (randomNumber+1)+`)</span><span id="timer" style='font-size:12px; color: black;'></span></li>`
    console.log('random definition number: ' + randomNumber);
    // appendThis += `<li> Version ` + (randomNumber+1) +':' + `</li>`
    if(response.getElementsByTagName('mc')[randomNumber]){
      appendThis += `<li class="en_eg">`+  response.getElementsByTagName('mc')[randomNumber].innerHTML + `</li>`
    }
    if(response.getElementsByTagName('vi')[randomNumber]){
      appendThis += `<li class="en_eg">`+  boldedWordSentence + `</li>`
    }
    if(response.getElementsByTagName('syn')[randomNumber]){
      appendThis += `<li class="en_eg"> <strong>Synonyms:</strong> ` +  synonymsHtml + ` </li>`;
    }
    appendThis += '<li style="border:1px solid black;" class="btn btn-sm" onclick="makeQuestions()">Take Quiz</li>';

    document.getElementById("wordslist").innerHTML = appendThis;
  }
  else{
    nextWord();
    // Remove word with extra symbols ex.'()'. This is rarely going to be used because this has been resolved when adding synonyms list in thesaurus();
    removeWordButton(word);
  }
},
  error: function (err) {
    console.log(err);
  }
})
}
//
function getDefinition(word) {
  document.querySelector('.flashcard').style.display = 'block';
$.ajax({
  url: 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml/'+word+'?key=633f95e2-e228-4685-993c-466be1bb78cf',
  method: "GET",
  success: function (response) {
    console.log(response);
    appendThis = `<li class="word">`+  response.querySelector('ew').innerHTML + `<span style='font-size:12px; color: black;'> (`+response.querySelector('fl').innerHTML+`)</span>
    <span style='font-size:12px; color: black;'>(V.`+ 1 +`)</li>`
    // appendThis += `<li> Version ` + (randomNumber+1) +':' + `</li>`
    if(response.getElementsByTagName('dt')[0]){
      appendThis += `<li class="en_eg">`+  response.getElementsByTagName('dt')[0].innerHTML + `</li>`
    }
    if(response.getElementsByTagName('vi')[0]){
      appendThis += `<li class="en_eg">`+  response.getElementsByTagName('vi')[0].innerHTML + `</li>`
    }
    if(response.getElementsByTagName('syn')[0]){
      appendThis += `<li class="en_eg"> <strong>Synonyms:</strong> `+  response.getElementsByTagName('syn')[0].innerHTML + `</li>`
    }
    document.getElementById("wordslist").innerHTML = appendThis;
  },
  error: function (err) {
    console.log(err);
  }
});
}

var ajaxPassedTestArray = [];
// Code that has to do with adding multiple words at a time.
function wordToWords(){
  wordsArray = document.querySelector('#age').value.split(',');
  document.querySelector('#word-input').value = wordsArray[0];
  wordsArray.splice(0,1);
  for(var i = 0; i <= wordsArray.length - 1; i++){
    ajaxTest(wordsArray[i]);
}
}
function ajaxTest(word){
  var indexOfWord = wordsArray.indexOf(word);
  $.ajax({
    url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+word+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
    method: "GET",
    success: function (response) {
  // If database already has that word then display error message
  // Convert value to have no upper case or spaces
      if($.inArray(word.toLowerCase().replace(/\s/g, ''), databaseArray) === -1 && response.querySelector('hw')){
        ajaxPassedTestArray.push(response.querySelector('hw').innerHTML);
        console.log(word+ ' was successfully found');
        console.log(ajaxPassedTestArray);
        document.querySelector('#words-input').value = ajaxPassedTestArray;
        }
      else if($.inArray(word.toLowerCase().replace(/\s/g, ''), databaseArray) !== -1){
        // wordsArray.splice(indexOfWord,1);
        console.log(word+ ' is already in database');
        // document.querySelector('#words-input').value = wordsArray;
      }
      else if(!response.querySelector('hw')){
        // wordsArray.splice(indexOfWord,1);
        console.log(word+ ' not found')
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

function clickSubmitButton(){
  document.querySelector('#word-submitter').click();
}
function addWordFromRemoveWordsArray(word){
  if($.inArray(word, wordsToRemoveArray) === -1){
    wordsToRemoveArray.push(word);
    console.log('wordsToRemoveArray: ' + wordsToRemoveArray);
    document.querySelector('#wordsToBeDeleted-input').value = wordsToRemoveArray;
    document.querySelector('#wordsToDelete').innerHTML = wordsToRemoveArray;
    document.querySelector('#wordsToDeleteParagraph').style.display = 'block';
    document.querySelector('#minus-'+word).style.display = 'none';
  }
}

function displayMinusButtons(){
  if(document.querySelector('#plus-and-delete-buttons').style.display === 'block'){
    $( "#plus-and-delete-buttons").hide();
    $( ".delete-buttons" ).hide();
    $( ".plus-buttons" ).hide();
    $( ".minus-buttons" ).show();
  }
  else{
    $( "#plus-and-delete-buttons").show();
    $( ".delete-buttons" ).show();
    $( ".plus-buttons" ).show();
    $( ".minus-buttons" ).hide();
    wordsToRemoveArray = [];
    document.querySelector('#wordsToDelete').innerHTML = wordsToRemoveArray;
    document.querySelector('#wordsToDeleteParagraph').style.display = 'none';
  }
}



function generateQuiz(){
  (function() {
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
            `<label>
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
      let numCorrect = 0;

      // for each question...
      myQuestions.forEach((currentQuestion, questionNumber) => {
        // find selected answer
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;

        // if answer is correct
        if (userAnswer === currentQuestion.correctAnswer) {
          // add to the number of correct answers
          numCorrect++;

          // color the answers green
          answerContainers[questionNumber].style.color = "lightgreen";
        } else {
          // if answer is wrong or blank
          // color the answers red
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

function pushQuizQuestion(word,mc1,mc2,mc3,mc4,answer){
  myQuestions.push(
    {
      question: word,
      answers: {
        a: mc1,
        b: mc2,
        c: mc3,
        d: mc4
      },
      correctAnswer: answer
    }
  )
  generateQuiz();
}
function pushQuizQuestionUsingInputs(){
  pushQuizQuestion(document.querySelector('#quizWord-input').value,
                      document.querySelector('#mc1-input').value,
                      document.querySelector('#mc2-input').value,
                      document.querySelector('#mc3-input').value,
                      document.querySelector('#mc4-input').value,'c')
    }
var sentencesArray = [];
function getSentence(word){
  // var randomWord = Math.floor(Math.random()* wordsArray.length );
  $.ajax({
    url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+word+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
    method: "GET",
    success: function (response) {
      var wordForFlashcard = {
        word: word,
        sentence: response.getElementsByTagName('mc')[0].innerHTML
      };
      sentencesArray.push(wordForFlashcard);
      console.log(sentencesArray);
    },
    error: function (err) {
      console.log(err);
    }
  })
}
function getAllSentences(){
  for(var i = 0; i <= wordsArray.length - 1; i++){
    getSentence(wordsArray[i]);
  }
}

function makeQuestions(){
  myQuestions = [];
  // console.log(randomWordNumber);
  for(var i = 0; i <= sentencesArray.length; i++){
    var randomWordNumber = findRandomNumber();
    if(randomWordNumber === i){
      randomWordNumber = findRandomNumber();
    }
    var randomWordNumber2 = findRandomNumber();
    while(randomWordNumber2 === i || randomWordNumber2 === randomWordNumber|| randomWordNumber2 === randomWordNumber3 || randomWordNumber2 === randomWordNumber4){
      randomWordNumber2 = findRandomNumber();
    }
    var randomWordNumber3 = findRandomNumber();
    while(randomWordNumber3 === i || randomWordNumber3 === randomWordNumber|| randomWordNumber3 === randomWordNumber2 || randomWordNumber3 === randomWordNumber4){
      randomWordNumber3 = findRandomNumber();
    }
    var randomWordNumber4 = findRandomNumber();
    while(randomWordNumber4 === i || randomWordNumber4 === randomWordNumber|| randomWordNumber4 === randomWordNumber2 || randomWordNumber4 === randomWordNumber3){
      randomWordNumber4 = findRandomNumber();
    }
    var randomAnswerNumber = Math.floor(Math.random() * 4);
    var randomAnswerLetter;

    if(randomAnswerNumber === 0){
      randomAnswerLetter = 'a';
      randomWordNumber = i;
    }
    else if(randomAnswerNumber === 1){
      randomAnswerLetter = 'b';
      randomWordNumber2 = i;
    }
    else if(randomAnswerNumber === 2){
      randomAnswerLetter = 'c';
      randomWordNumber3 = i;
    }
    else{
      randomAnswerLetter = 'd';
      randomWordNumber4 = i;
    }
    pushQuizQuestion(sentencesArray[i].word,sentencesArray[randomWordNumber].sentence,sentencesArray[randomWordNumber2].sentence,sentencesArray[randomWordNumber3].sentence,sentencesArray[randomWordNumber4].sentence,randomAnswerLetter);
  }
}


function findRandomNumber(){
  var randomNumber = Math.floor(Math.random() * sentencesArray.length);
  return randomNumber;
}
