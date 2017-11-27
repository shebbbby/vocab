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
if(document.querySelector("#plus-"+word).style.display === 'block'){
  console.log($.inArray(word, wordsArray));
  wordsArray.push(word);
  document.getElementById("demo").innerHTML = wordsArray;
  document.getElementById("numberInList").innerHTML = wordsArray.length;
  document.querySelector("#plus-"+word).style.display = 'none';
  document.querySelector("#checkmark-"+word).style.display = 'block';
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
  cycleWordsArray(wordCount-2)
}
function nextWord(){
  cycleWordsArray(wordCount)
}
var intervalCycle = function(){ setInterval(function(){
  cycleWordsArray();
}, cycleSpeed);
}
function myStopFunction() {
    clearInterval(intervalCycle);
}

// Starts cycling with wordsArray and cycleSpeed
function startCycle(){
  if(wordsArray.length > 0){
  document.querySelector('.flashcard').style.display = 'block';
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
  var newWord = document.querySelector('#age').value;
  // My attempt to be able to post multiple words at a time. Doesnt work because of reloading of page upon post.
  // if (newWord.indexOf(',') > -1){
  //   var arrayWords = newWord.split(",");
  //   console.log(arrayWords);
  //   for(var i = 0; i <= arrayWords.length-1; i++){
  //     $.ajax({
  //       url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+arrayWords[i]+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
  //       method: "GET",
  //       success: function (response) {
  //     // If database already has that word then display error message
  //     // Convert value to have no upper case or spaces
  //         if($.inArray(response.querySelector('hw').innerHTML.toLowerCase().replace(/\s/g, ''), databaseArray) == -1){
  //         if(document.querySelector('#word-input') != '' && response.querySelector('hw')){
  //           document.querySelector('#word-input').value = response.querySelector('hw').innerHTML
  //         }
  //         if(document.querySelector('#definition-input') != '' && response.querySelector('mc')){
  //           document.querySelector('#definition-input').value = response.querySelector('mc').innerHTML
  //         }
  //         if(document.querySelector('#speech-input') != '' && response.querySelector('fl')){
  //           document.querySelector('#speech-input').value = response.querySelector('fl').innerHTML
  //         }
  //         if(document.querySelector('#sentence-input') != '' && response.querySelector('vi')){
  //           document.querySelector('#sentence-input').value = response.querySelector('vi').innerHTML
  //         }
  //         if(document.querySelector('#synonyms-input') != '' && response.querySelector('syn')){
  //           document.querySelector('#synonyms-input').value = response.querySelector('syn').innerHTML
  //         }
  //         if(document.querySelector('#relatedwords-input') != '' && response.querySelector('rel')){
  //           document.querySelector('#relatedwords-input').value = response.querySelector('rel').innerHTML
  //         }
  //         if(document.querySelector('#antonyms-input') != '' && response.querySelector('ant')){
  //           document.querySelector('#antonyms-input').value = response.querySelector('ant').innerHTML
  //         }
  //         if(response.querySelector('hw')){
  //           document.getElementById('word-search-success').style.display = 'block';
  //           document.getElementById('word-search-error').style.display = 'none';
  //           document.getElementById('repeat-word-error').style.display = 'none';
  //           document.getElementById('begin-error').style.display = 'none';
  //           document.getElementById('word-submitter').click()
  //       }
  //       if(!response.querySelector('hw'))
  //       {
  //         document.getElementById('word-search-error').style.display = 'block';
  //         document.getElementById('repeat-word-error').style.display = 'none';
  //       }
  //     }
  //     else{
  //       document.getElementById('repeat-word-error').style.display = 'block';
  //       document.getElementById('word-search-error').style.display = 'none';
  //     }
  //       },
  //       error: function (err) {
  //         console.log(err);
  //       }
  //     })
  //   }
  // }
  // if(newWord.indexOf(',') === -1){
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
      document.getElementById('word-search-success').style.display = 'block';
      document.getElementById('word-search-error').style.display = 'none';
      document.getElementById('repeat-word-error').style.display = 'none';
      document.getElementById('begin-error').style.display = 'none';
      document.getElementById('word-submitter').click()
  }
  if(!response.querySelector('hw'))
  {
    document.getElementById('word-search-error').style.display = 'block';
    document.getElementById('repeat-word-error').style.display = 'none';
  }
}
else{
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
var appendThis;
function thesaurus(word) {
$.ajax({
  url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+word+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
  method: "GET",
  success: function (response) {
    if(response.querySelector('hw')){
    console.log(response);
    var countSens = 0;
    for(var i = 0; i <= 5; i++){
      if(response.getElementsByTagName('sens')[i]){
        countSens++
      }
    }
    var randomNumber = Math.floor(Math.random() * countSens);
    appendThis = `<li class="word">`+  response.querySelector('hw').innerHTML + `<span style='font-size:12px; color: black;'> (`+response.querySelector('fl').innerHTML+`)</span>
    <span style='font-size:12px; color: black;'>(V.`+ (randomNumber+1)+`)</li>`
    console.log('random definition number: ' + randomNumber);
    // appendThis += `<li> Version ` + (randomNumber+1) +':' + `</li>`
    if(response.getElementsByTagName('mc')[randomNumber]){
      appendThis += `<li class="en_eg">`+  response.getElementsByTagName('mc')[randomNumber].innerHTML + `</li>`
    }
    if(response.getElementsByTagName('vi')[randomNumber]){
      appendThis += `<li class="en_eg">`+  response.getElementsByTagName('vi')[randomNumber].innerHTML + `</li>`
    }
    if(response.getElementsByTagName('syn')[randomNumber]){
      appendThis += `<li class="en_eg"> <strong>Synonyms:</strong> `+  response.getElementsByTagName('syn')[randomNumber].innerHTML + `</li>`
    }
    document.getElementById("wordslist").innerHTML = appendThis;
  }
  else{
    getDefinition(word);
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

// function getSynonyms(word) {
// $.ajax({
//   url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+word+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
//   method: "GET",
//   success: function (response) {
//     console.log(response);
//     document.querySelector('#synonyms').innerHTML += response.querySelector('syn').innerHTML;
//     document.querySelector('#relatedwords').innerHTML += response.querySelector('rel').innerHTML;
//
//     var countVi = 0;
//     for(var i = 0; i<= 5; i++){
//       if(response.getElementsByTagName('vi')[i]){
//         countVi++
//       }
//     }
//     for(var i = 0; i <= countVi-1; i++){
//     document.querySelector('#sentence').innerHTML += ', '+response.getElementsByTagName('vi')[i].innerHTML;
//   }
//     document.querySelector('#antonyms').innerHTML += response.querySelector('ant').innerHTML;
//   },
//   error: function (err) {
//     console.log(err);
//   }
// });
// }
