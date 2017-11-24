function addWord(word){
// if($.inArray(word, wordsArray) === -1){
console.log($.inArray(word, wordsArray))
  wordsArray.push(word);
  document.getElementById("demo").innerHTML = wordsArray;
  document.getElementById("numberInList").innerHTML = wordsArray.length;
  document.querySelector("#plus-"+word).style.display = 'none';
  document.querySelector("#checkmark-"+word).style.display = 'block';
  document.getElementById('word-search-error').style.display = 'none';
  document.getElementById('repeat-word-error').style.display = 'none';
// }
}
function removeWordFromStudyArray(word){
  wordsArray.splice(word);
  document.getElementById("demo").innerHTML = wordsArray;
  document.querySelector("#plus-"+word).style.display = 'block';
  document.querySelector("#checkmark-"+word).style.display = 'none';
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
document.querySelector('#speed').innerHTML = (cycleSpeed / 1000) + ' Seconds Per Word';

function changeSpeed(){
  var x = document.querySelector("#speed-input").value;
  cycleSpeed = Number(x)*1000;
  console.log(cycleSpeed)
  document.querySelector('#speed').innerHTML = (cycleSpeed / 1000) + ' Seconds Per Word';
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
  setInterval(function(){
    cycleWordsArray();
  }, cycleSpeed);
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
var appendThis;
function thesaurus(word) {
$.ajax({
  url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/'+word+'?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
  method: "GET",
  success: function (response) {
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
    console.log('random: ' + randomNumber);
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
    // if(response.getElementsByTagName('rel')[randomNumber]){
    //   appendThis += `<li class="en_eg"> Related Words: `+  response.getElementsByTagName('rel')[randomNumber].innerHTML + `</li>`
    // }
    // if(response.getElementsByTagName('ant')[randomNumber]){
    //   appendThis += `<li class="en_eg"> Antonyms: `+  response.getElementsByTagName('ant')[randomNumber].innerHTML + `</li>`
    // }

    document.getElementById("wordslist").innerHTML = appendThis;
  },
  error: function (err) {
    console.log(err);
  }
})
}



//
function getDefinition(word) {
$.ajax({
  url: 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml/'+word+'?key=633f95e2-e228-4685-993c-466be1bb78cf',
  method: "GET",
  success: function (response) {
    console.log(response);



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
