
// Each cell on the crossword grid is null or one of these
function CrosswordCell(letter,word,index_of_word_in_input_list,index_of_char,r,c,direction){
    this.index_of_word_in_input_list=index_of_word_in_input_list;
    this.index_of_char=index_of_char;
    this.r=r;
    this.c=c;
    this.direction=direction;
    this.word = word;
    this.char = letter; // the actual letter for the cell on the crossword
    // If a word hits this cell going in the "across" direction, this will be a CrosswordCellNode
    this.across = null;
    // If a word hits this cell going in the "down" direction, this will be a CrosswordCellNode
    this.down = null;
}

// You can tell if the Node is the start of a word (which is needed if you want to number the cells)
// and what word and clue it corresponds to (using the index)
function CrosswordCellNode(is_start_of_word, index){
    this.is_start_of_word = is_start_of_word;
    this.index = index; // use to map this node to its word or clue
}

function WordElement(word, index){
    this.word = word; // the actual word
    this.index = index; // use to map this node to its word or clue
}

function Crossword(words_in, clues_in){
    var GRID_ROWS = 50;
    var GRID_COLS = 50;
    // This is an index of the positions of the char in the crossword (so we know where we can potentially place words)
    // example {"a" : [{'row' : 10, 'col' : 5}, {'row' : 62, 'col' :17}], {'row' : 54, 'col' : 12}], "b" : [{'row' : 3, 'col' : 13}]}
    // where the two item arrays are the row and column of where the letter occurs
    var char_index = {};

    // these words are the words that can't be placed on the crossword
    var bad_words;

    // returns the crossword grid that has the ratio closest to 1 or null if it can't build one
    this.getSquareGrid = function(max_tries){
        var best_grid = null;
        var best_ratio = 0;
        for(var i = 0; i < max_tries; i++){
            var a_grid = this.getGrid(1);
            if(a_grid == null) continue;
            var ratio = Math.min(a_grid.length, a_grid[0].length) * 1.0 / Math.max(a_grid.length, a_grid[0].length);
            if(ratio > best_ratio){
                best_grid = a_grid;
                best_ratio = ratio;
            }

            if(best_ratio == 1) break;
        }
        return best_grid;
    }

    // returns an abitrary grid, or null if it can't build one
    this.getGrid = function(max_tries){
        for(var tries = 0; tries < max_tries; tries++){
            clear(); // always start with a fresh grid and char_index
            // place the first word in the middle of the grid
            var start_dir = randomDirection();
            var r = Math.floor(grid.length / 2);
            var c = Math.floor(grid[0].length / 2);
            var word_element = word_elements[0];
            if(start_dir == "across"){
                c -= Math.floor(word_element.word.length/2);
            } else {
                r -= Math.floor(word_element.word.length/2);
            }

            if(canPlaceWordAt(word_element.word, r, c, start_dir) !== false){
                placeWordAt(word_element.word, word_element.index, r, c, start_dir);
            } else {
                bad_words = [word_element];
                return null;
            }

            // start with a group containing all the words (except the first)
            // as we go, we try to place each word in the group onto the grid
            // if the word can't go on the grid, we add that word to the next group
            var groups = [];
            groups.push(word_elements.slice(1));
            for(var g = 0; g < groups.length; g++){
                word_has_been_added_to_grid = false;
                // try to add all the words in this group to the grid
                for(var i = 0; i < groups[g].length; i++){
                    var word_element = groups[g][i];
                    var best_position = findPositionForWord(word_element.word);
                    if(!best_position){
                        // make the new group (if needed)
                        if(groups.length - 1 == g) groups.push([]);
                        // place the word in the next group
                        groups[g+1].push(word_element);
                    } else {
                        var r = best_position["row"], c = best_position["col"], dir = best_position['direction'];

                        // console.log(best_position["row"], best_position["col"], best_position['direction'], word_element.word, word_element.index);

                        placeWordAt(word_element.word, word_element.index, r, c, dir);
                        word_has_been_added_to_grid = true;
                    }
                }
                // if we haven't made any progress, there is no point in going on to the next group
                if(!word_has_been_added_to_grid) break;
            }
            // no need to try again
            if(word_has_been_added_to_grid) return minimizeGrid();
        }

        bad_words = groups[groups.length - 1];
        return null;
    }

    // returns the list of WordElements that can't fit on the crossword
    this.getBadWords = function(){
        return bad_words;
    }

    // get two arrays ("across" and "down") that contain objects describing the
    // topological position of the word (e.g. 1 is the first word starting from
    // the top left, going to the bottom right), the index of the word (in the
    // original input list), the clue, and the word itself
    this.getLegend = function(grid){
        var groups = {"across" : [], "down" : []};
        var position = 1;
        for(var r = 0; r < grid.length; r++){
            for(var c = 0; c < grid[r].length; c++){
                var cell = grid[r][c];
                var increment_position = false;
                // check across and down
                for(var k in groups){
                    // does a word start here? (make sure the cell isn't null, first)
                    if(cell && cell[k] && cell[k]['is_start_of_word']){
                        var index = cell[k]['index'];
                        groups[k].push({"position" : position, "index" : index, "clue" : clues_in[index], "word" : words_in[index]});
                        increment_position = true;
                    }
                }

                if(increment_position) position++;
            }
        }
        return groups;
    }

    // move the grid onto the smallest grid that will fit it
    var minimizeGrid = function(){
        // find bounds
        var r_min = GRID_ROWS-1, r_max = 0, c_min = GRID_COLS-1, c_max = 0;
        for(var r = 0; r < GRID_ROWS; r++){
            for(var c = 0; c < GRID_COLS; c++){
                var cell = grid[r][c];
                if(cell != null){
                    if(r < r_min) r_min = r;
                    if(r > r_max) r_max = r;
                    if(c < c_min) c_min = c;
                    if(c > c_max) c_max = c;
                }
            }
        }
        // initialize new grid
        var rows = r_max - r_min + 1;
        var cols = c_max - c_min + 1;
        var new_grid = new Array(rows);
        for(var r = 0; r < rows; r++){
            for(var c = 0; c < cols; c++){
                new_grid[r] = new Array(cols);
            }
        }

        // copy the grid onto the smaller grid
        for(var r = r_min, r2 = 0; r2 < rows; r++, r2++){
            for(var c = c_min, c2 = 0; c2 < cols; c++, c2++){
                new_grid[r2][c2] = grid[r][c];
            }
        }

        return new_grid;
    }

    // helper for placeWordAt();
    var addCellToGrid = function(word, index_of_word_in_input_list, index_of_char, r, c, direction){
        var char = word.charAt(index_of_char);
        if(grid[r][c] == null){
            grid[r][c] = new CrosswordCell(char,word,index_of_word_in_input_list, index_of_char, r, c, direction);
            // console.log(grid[r][c]);

            // init the char_index for that character if needed
            if(!char_index[char]) char_index[char] = [];

            // add to index
            char_index[char].push({"row" : r, "col" : c});

        }

        var is_start_of_word = index_of_char == 0;
        grid[r][c][direction] = new CrosswordCellNode(is_start_of_word, index_of_word_in_input_list);

    }

    // place the word at the row and col indicated (the first char goes there)
    // the next chars go to the right (across) or below (down), depending on the direction
    var placeWordAt = function(word, index_of_word_in_input_list, row, col, direction){
        if(direction == "across"){
            for(var c = col, i = 0; c < col + word.length; c++, i++){
                addCellToGrid(word, index_of_word_in_input_list, i, row, c, direction);
            }
        } else if(direction == "down"){
            for(var r = row, i = 0; r < row + word.length; r++, i++){
                addCellToGrid(word, index_of_word_in_input_list, i, r, col, direction);
            }
        } else {
            throw "Invalid Direction";
        }
    }

    // you can only place a char where the space is blank, or when the same
    // character exists there already
    // returns false, if you can't place the char
    // 0 if you can place the char, but there is no intersection
    // 1 if you can place the char, and there is an intersection
    var canPlaceCharAt = function(char, row, col){
        // no intersection
        if(grid[row][col] == null) return 0;
        // intersection!
        if(grid[row][col]['char'] == char) return 1;

        return false;
    }

    // determines if you can place a word at the row, column in the direction
    var canPlaceWordAt = function(word, row, col, direction){
        // out of bounds
        if(row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) return false;

        if(direction == "across"){
            // out of bounds (word too long)
            if(col + word.length > grid[row].length) return false;
            // can't have a word directly to the left
            if(col - 1 >= 0 && grid[row][col - 1] != null) return false;
            // can't have word directly to the right
            if(col + word.length < grid[row].length && grid[row][col+word.length] != null) return false;

            // check the row above to make sure there isn't another word
            // running parallel. It is ok if there is a character above, only if
            // the character below it intersects with the current word
            for(var r = row - 1, c = col, i = 0; r >= 0 && c < col + word.length; c++, i++){
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[row][c] != null && grid[row][c]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if(!can_place_here) return false;
            }

            // same deal as above, we just search in the row below the word
            for(var r = row + 1, c = col, i = 0; r < grid.length && c < col + word.length; c++, i++){
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[row][c] != null && grid[row][c]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if(!can_place_here) return false;
            }

            // check to make sure we aren't overlapping a char (that doesn't match)
            // and get the count of intersections
            var intersections = 0;
            for(var c = col, i = 0; c < col + word.length; c++, i++){
                var result = canPlaceCharAt(word.charAt(i), row, c);
                if(result === false) return false;
                intersections += result;
            }
        } else if(direction == "down"){
            // out of bounds
            if(row + word.length > grid.length) return false;
            // can't have a word directly above
            if(row - 1 >= 0 && grid[row - 1][col] != null) return false;
            // can't have a word directly below
            if(row + word.length < grid.length && grid[row+word.length][col] != null) return false;

            // check the column to the left to make sure there isn't another
            // word running parallel. It is ok if there is a character to the
            // left, only if the character to the right intersects with the
            // current word
            for(var c = col - 1, r = row, i = 0; c >= 0 && r < row + word.length; r++, i++){
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[r][col] != null && grid[r][col]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if(!can_place_here) return false;
            }

            // same deal, but look at the column to the right
            for(var c = col + 1, r = row, i = 0; r < row + word.length && c < grid[r].length; r++, i++){
                var is_empty = grid[r][c] == null;
                var is_intersection = grid[r][col] != null && grid[r][col]['char'] == word.charAt(i);
                var can_place_here = is_empty || is_intersection;
                if(!can_place_here) return false;
            }

            // check to make sure we aren't overlapping a char (that doesn't match)
            // and get the count of intersections
            var intersections = 0;
            for(var r = row, i = 0; r < row + word.length; r++, i++){
                var result = canPlaceCharAt(word.charAt(i, 1), r, col);
                if(result === false) return false;
                intersections += result;
            }
        } else {
            throw "Invalid Direction";
        }
        return intersections;
    }

    var randomDirection = function(){
        return Math.floor(Math.random()*2) ? "across" : "down";
    }

    var findPositionForWord = function(word){
        // check the char_index for every letter, and see if we can put it there in a direction
        var bests = [];
        for(var i = 0; i < word.length; i++){
            var possible_locations_on_grid = char_index[word.charAt(i)];
            if(!possible_locations_on_grid) continue;
            for(var j = 0; j < possible_locations_on_grid.length; j++){
                var point = possible_locations_on_grid[j];
                var r = point['row'];
                var c = point['col'];
                // the c - i, and r - i here compensate for the offset of character in the word
                var intersections_across = canPlaceWordAt(word, r, c - i, "across");
                var intersections_down = canPlaceWordAt(word, r - i, c, "down");

                if(intersections_across !== false)
                    bests.push({"intersections" : intersections_across, "row" : r, "col" : c - i, "direction" : "across"});
                if(intersections_down !== false)
                    bests.push({"intersections" : intersections_down, "row" : r - i, "col" : c, "direction" : "down"});
            }
        }

        if(bests.length == 0) return false;

        // find a good random position
        var best = bests[Math.floor(Math.random()*bests.length)];

        return best;
    }

    var clear = function(){
        for(var r = 0; r < grid.length; r++){
            for(var c = 0; c < grid[r].length; c++){
                grid[r][c] = null;
            }
        }
        char_index = {};
    }

    // constructor
    if(words_in.length < 2){
      throw "A crossword must have at least 2 words";
      alert("A crossword must have at least 2 words");
    }
    if(words_in.length != clues_in.length){
      throw "The number of words must equal the number of clues";
      alert("The number of words must equal the number of clues");
    }

    // build the grid;
    var grid = new Array(GRID_ROWS);
    for(var i = 0; i < GRID_ROWS; i++){
        grid[i] = new Array(GRID_COLS);
    }

    // build the element list (need to keep track of indexes in the originial input arrays)
    var word_elements = [];
    for(var i = 0; i < words_in.length; i++){
        word_elements.push(new WordElement(words_in[i], i));
    }

    // I got this sorting idea from http://stackoverflow.com/questions/943113/algorithm-to-generate-a-crossword/1021800#1021800
    // seems to work well
    word_elements.sort(function(a, b){ return b.word.length - a.word.length; });
}

var CrosswordUtils = {
    PATH_TO_PNGS_OF_NUMBERS : "numbers/",

    toHtml : function(grid, show_answers){
        if(grid == null) return;
        var html = [];
        html.push("<table class='crossword'>");
        var label = 1;
        for(var r = 0; r < grid.length; r++){
            html.push("<tr>");
            for(var c = 0; c < grid[r].length; c++){
                var cell = grid[r][c];
                var is_start_of_word = false;
                if(cell == null){
                    var char = "&nbsp;";
                    var css_class = "no-border";
                } else {
                    var char = cell['char'];
                    var css_class = "";
                    var is_start_of_word = (cell['across'] && cell['across']['is_start_of_word']) || (cell['down'] && cell['down']['is_start_of_word']);
                }
                var rString = r.toString();
                var cString = c.toString();
                var onclickString = rString+','+cString;
                var arrayOfCoordinates = [r,c];
                if(is_start_of_word) {
                    var img_url = CrosswordUtils.PATH_TO_PNGS_OF_NUMBERS + label + ".png";
                    html.push("<td id='coordinate-"+r + "-" + c+"' class='startOfWord startOfWord-"+label+ " "+ css_class + "' title='" + r + ", " + c + "' style=\"background-image:url('" + img_url + "')\" onclick='colorInWordWhenClickingOnCoordinateOnCrosswordBoard(`"+onclickString+"`)'>");
                    label++;
                } else {
                    html.push("<td id='coordinate-"+r + "-" + c+"' class='" + css_class + "' title='" + r + ", " + c + "' onclick='colorInWordWhenClickingOnCoordinateOnCrosswordBoard(`"+onclickString+"`)'>");
                }

                if(show_answers) {
                    html.push(char);
                } else {
                    html.push("&nbsp;");
                }
            }
            html.push("</tr>");
        }
        html.push("</table>");
        return html.join("\n");
    }
}

function colorInWordWhenClickingOnCoordinateOnCrosswordBoard(string){
  var arrayOfCoordinates = string.split(',');
  if (theCrosswordGridWithPositions[arrayOfCoordinates[0]][arrayOfCoordinates[1]]) {
    var thePosition = theCrosswordGridWithPositions[arrayOfCoordinates[0]][arrayOfCoordinates[1]];
    console.log('Clicked Word With Position: ' + thePosition);
    if (document.querySelector('#wordAcrossHintId-'+thePosition)) {
      document.querySelector('#wordAcrossHintId-'+thePosition).click();
    }else if(document.querySelector('#wordDownHintId-'+thePosition)){
      document.querySelector('#wordDownHintId-'+thePosition).click();
    }
    colorInBeginningCoordinatesWithRegularColors(thePosition);
    document.querySelector('#coordinate-'+arrayOfCoordinates[0]+'-'+arrayOfCoordinates[1]).style.backgroundColor = '#E9DEFF';
  }
}




// YOUR ADDITIONAL LOGIC --------------------------------------------------------------------------
var crosswordArray = [];

function addSingleWordToCrosswordArray(word){
  for (var i = 0; i < crosswordArray.length; i++) {
    if (word === crosswordArray[i]) {
      console.log('--------------------------------------------');
      console.log('addSingleWordToCrosswordArray is logging:');
      console.log(word + ' is already in crosswordArray!');
      return;
    }
  }
  for (var i = 0; i < databaseArray.length; i++) {
    if (word === databaseArray[i]) {
      crosswordArray.push(word);
      updateCrosswordNumberHtml();
      console.log('Added ' + word + ' to crosswordArray from databaseArray');
      createAndAddObjectWithWordAndHintForCrossword(word);
      return;
    }
  }
  addWordEvenIfNotInDatabaseIfItPassedAjaxTest(word, crosswordArray);
  updateCrosswordNumberHtml();
  createAndAddObjectWithWordAndHintForCrossword(word);
}

function addMultipleWordsToCrosswordArray(){
  var addSpecificWordsArray = document.querySelector('#specificWordForCrosswordPlayGame-input').value.replace(/\s/g, '').split(',');
  for (var i = 0; i < addSpecificWordsArray.length; i++) {
    addSingleWordToCrosswordArray(addSpecificWordsArray[i]);
  }
}

function addWordOrWordsToCrosswordArray(){
  var actualWord = document.querySelector('#specificWordForCrosswordPlayGame-input').value;
  if (document.querySelector('#specificWordForCrosswordPlayGame-input').value.indexOf(',') > -1) {
    addMultipleWordsToCrosswordArray();
  }
  else {
    var indicateRepeatWord = false;
    for (var i = 0; i < crosswordArray.length; i++) {
      if(actualWord.toLowerCase() === crosswordArray[i]){
        indicateRepeatWord = true;
      }
    }
    if (indicateRepeatWord) {
      console.log('--------------------------------------------');
      console.log('addWordOrWordsToCrosswordArray is logging:');
      console.log(actualWord+' is already in crosswordArray!');
    }else{
      addSingleWordToCrosswordArray(actualWord);
    }
  }
  document.querySelector('#specificWordForCrosswordPlayGame-input').value = '';
}

function addMultipleRandomWordsToCrosswordArray(){
  var randomNumber = document.querySelector('#random-number-crosswordPlayGame-input').value;
  var theRandomDatabaseArray = _arrayRandom(randomNumber, 0, databaseArray.length, true);
  for (var i = 0; i < theRandomDatabaseArray.length; i++) {
    addSingleWordToCrosswordArray(databaseArray[theRandomDatabaseArray[i]],crosswordArray);
  }
  document.querySelector('#random-number-crosswordPlayGame-input').value = '';
}

function addSingleWordToCrosswordArrayInputVersion() {
    addSingleWordToCrosswordArray(document.querySelector('#specificWordForCrosswordPlayGame-input').value);
}

function updateCrosswordNumberHtml(){
  if (crosswordArray.length === 0) {
    document.querySelector('#numberOfWordsInCrosswordArray').innerHTML = '';
    turnCrosswordArraySpanIntoClickableArray();
  }else{
    document.querySelector('#numberOfWordsInCrosswordArray').innerHTML = " ("+crosswordArray.length+")";
    turnCrosswordArraySpanIntoClickableArray();
    // document.querySelector('#wordsInSynonymClustersArray').innerHTML = hangmanArray;
  }
}

function turnCrosswordArraySpanIntoClickableArray(){
	var newInnerHTMLSpan = '';
	for (var i = 0; i < crosswordArray.length; i++) {
		if(i === crosswordArray.length - 1){
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInCrosswordArray" id="'+crosswordArray[i]+'-currentLearningList'+'" onclick="removeWordFromCrosswordArray(`'+crosswordArray[i]+'`)">'+crosswordArray[i]+'</span>';
		}else{
			newInnerHTMLSpan += '<span style="cursor:pointer;" class="wordInCrosswordArray" id="'+crosswordArray[i]+'-currentLearningList'+'" onclick="removeWordFromCrosswordArray(`'+crosswordArray[i]+'`)">'+crosswordArray[i]+',</span>';
		}
	}
	document.querySelector('#wordsInCrosswordArray').innerHTML = newInnerHTMLSpan;
}

function removeWordFromCrosswordArray(word){
  // Find where word exists in wordsArray
  var indexOfWord = crosswordArray.indexOf(word);
  // Splice word from wordsArray
  crosswordArray.splice(indexOfWord, 1);
  console.log('Removing ' + word + ' from crosswordArray Array!');
  updateCrosswordNumberHtml();
  for (var i = 0; i < fullWordObjectsArrayForCrossword.length; i++) {
    if (word === fullWordObjectsArrayForCrossword[i].word) {
      fullWordObjectsArrayForCrossword.splice(i,1);
    }
  }
}

function emptyCrosswordArray(){
  crosswordArray = [];
  fullWordObjectsArrayForCrossword = [];
  updateCrosswordNumberHtml();
}

// -------------------------------------------------------------------





// CROSSWORD LOGIC----------------------------------------------------
var fullWordObjectsArrayForCrossword = {
  words: [],
  hints:[],
  definitionNumbers:[],
  countOfDefinitons:[]
}


function displayCrosswordHtml(){
  document.querySelector('#favicon').href = "/images/crossword-favicon.png";
  document.querySelector('#titleNextToFavicon').innerHTML = "Crossword Puzzle!";

  document.querySelector('#crossword-body').style.display = 'block';
  document.querySelector('#hangman-body').style.display = 'none';
  document.querySelector('#hangman-game').style.display = 'none';

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

function createAndAddObjectWithWordAndHintForCrossword(word){
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
      if (response.getElementsByTagName('mc') && response.getElementsByTagName('mc')[randomNumber]) {
        fullWordObjectsArrayForCrossword.countOfDefinitons.push(countSens);
        fullWordObjectsArrayForCrossword.definitionNumbers.push(randomNumber);
        fullWordObjectsArrayForCrossword.words.push(word);
        fullWordObjectsArrayForCrossword.hints.push(response.getElementsByTagName('mc')[randomNumber].innerHTML);
        console.log(fullWordObjectsArrayForCrossword);
    }
  },
    error: function (err) {
      console.log(err);
    }
  })
}

function multipleCreateAndAddObjectWithWordAndHintForCrossword(array){
  // fullWordObjectsArrayForCrossword = [];
  for (var i = 0; i < array.length; i++) {
    createAndAddObjectWithWordAndHintForCrossword(array[i]);
  }
}

function generateCrosswordPuzzleUsingPreviousList(array){
    document.querySelector('#expandPreviousLists').click();
    document.querySelector('#favicon').href = "/images/crossword-favicon.png";
    document.querySelector('#titleNextToFavicon').innerHTML = "Crossword Puzzle!";

    document.querySelector('#crossword-body').style.display = 'none';
    document.querySelector('#hangman-body').style.display = 'none';
    document.querySelector('#hangman-game').style.display = 'none';

    document.querySelector('#synonym-clusters-body').style.display = 'none';
    document.querySelector('#synonym-clusters-game').style.display = 'none';
    document.querySelector('#quiz').style.display = 'none';
    document.querySelector('#results').style.display = 'none';
    document.querySelector('#roundNumberDiv').style.display = 'none';
    document.querySelector('#first-body').style.display = 'none';
    document.querySelector('#second-body').style.display = 'none';
    document.querySelector('#percentageCompleted').style.display = 'none';
    stopKeydownListenerPlayGame();


    multipleCreateAndAddObjectWithWordAndHintForCrossword(array);
  setTimeout(function(){
    generateCrosswordPuzzle(fullWordObjectsArrayForCrossword.words, fullWordObjectsArrayForCrossword.hints);

  },8000);
}

var theCrosswordObject;
var theCrosswordGrid;
var theCrosswordLegend;
var theCrosswordGridWithLetters;
var theCrosswordGridWithWords;
var theCrosswordGridWithPositions;
var arraysAsString = [];


function generateCrosswordPuzzle(words, hints){
    // words[i] correlates to clues[i]
    // var words = ["dog", "cat", "bat", "elephant", "kangaroo", "afdsaf"];
    // var clues = ["Man's best friend", "Likes to chase mice", "Flying mammal", "Has a trunk", "Large marsupial","the brabadooo"];

    var words = words;
    var clues = hints;
    // Create crossword object with the words and clues
    var cw = new Crossword(words, clues);
    // create the crossword grid (try to make it have a 1:1 width to height ratio in 10 tries)
    var tries = 15;
    var grid = cw.getSquareGrid(tries);
    // report a problem with the words in the crossword
    if(grid == null){
        var bad_words = cw.getBadWords();
        var str = [];
        for(var i = 0; i < bad_words.length; i++){
            str.push(bad_words[i].word);
        }
        alert("Shoot! A grid could not be created with these words:\n" + str.join("\n"));
        return;
    }
    // turn the crossword grid into HTML
    var show_answers = false;
    document.getElementById("crossword").innerHTML = CrosswordUtils.toHtml(grid, show_answers);
    // make a nice legend for the clues
    var legend = cw.getLegend(grid);
    addLegendToPage(legend);

    document.querySelector('#crossword-body').style.display = 'none';
    document.querySelector('#crossword').style.display = 'block';
    document.querySelector('#crossword-game').style.display = 'block';

    theCrosswordObject = cw;
    theCrosswordGrid = grid;
    theCrosswordLegend = legend;
    theCrosswordGridWithLetters = JSON.parse(JSON.stringify(theCrosswordGrid));
    theCrosswordGridWithWords = JSON.parse(JSON.stringify(theCrosswordGrid));
    theCrosswordGridWithPositions = JSON.parse(JSON.stringify(theCrosswordGrid));

    setTimeout(function(){ updateClassesOnCrossword(); }, 3000);
    setTimeout(function(){
      makeAllHintLiElementsHaveProperClasses();
      document.querySelector('#clues').style.display = 'block';
      document.querySelector('#revealOrHideAllAnswersCrosswordButton').style.display = 'block';
      document.querySelector('#revealOrHideAllAnswersCrosswordButton').innerHTML = 'Reveal All Answers';
      document.querySelector('#revealOrHideAllAnswersCrosswordButton').classList.add('answersHidden');
      document.querySelector('#revealOrHideAllAnswersCrosswordButton').classList.remove("answersRevealed");
      makeAllCoordinatesStyleCursorPointer();
    }, 5000);

    for (var i = 0; i < theCrosswordGridWithLetters.length; i++) {
      for (var y = 0; y < theCrosswordGridWithLetters[i].length; y++) {
        if (theCrosswordGridWithLetters[i][y]) {
          theCrosswordGridWithLetters[i][y] = theCrosswordGridWithLetters[i][y].char
        }
      }
    }
    for (var i = 0; i < theCrosswordGridWithWords.length; i++) {
      for (var y = 0; y < theCrosswordGridWithWords[i].length; y++) {
        if (theCrosswordGridWithWords[i][y]) {
          theCrosswordGridWithWords[i][y] = theCrosswordGridWithWords[i][y].word
        }
      }
    }
    for (var i = 0; i < theCrosswordGridWithPositions.length; i++) {
      for (var y = 0; y < theCrosswordGridWithPositions[i].length; y++) {
        if (theCrosswordGridWithPositions[i][y]) {
          theCrosswordGridWithPositions[i][y] = getPositionOfWordWithWord(theCrosswordGridWithPositions[i][y].word);
        }
      }
    }

};
function addLegendToPage(groups){
    for(var k in groups){
        var html = [];
        for(var i = 0; i < groups[k].length; i++){
            html.push("<li><strong>" + groups[k][i]['position'] + ".</strong> " + groups[k][i]['clue'] + "</li>");
        }
        document.getElementById(k).innerHTML = html.join("\n");
    }
}


function updateClassesOnCrossword(){
  for (var i = 0; i < theCrosswordGrid.length; i++) {
    for (var y = 0; y < theCrosswordGrid[i].length; y++) {
      if (theCrosswordGrid[i][y]) {
        var direction = theCrosswordGrid[i][y].direction;
        var index_of_word_in_input_list = theCrosswordGrid[i][y].index_of_word_in_input_list;



        if (direction === 'across') {
          for (var n = 0; n < theCrosswordLegend.across.length; n++) {
            if (theCrosswordLegend.across[n].index === index_of_word_in_input_list) {
              var wordPosition = theCrosswordLegend.across[n].position;
            }
          }
        }else if(direction === 'down'){
          for (var n = 0; n < theCrosswordLegend.down.length; n++) {
            if (theCrosswordLegend.down[n].index === index_of_word_in_input_list) {
              var wordPosition = theCrosswordLegend.down[n].position;
            }
          }
        }

        var index_of_char = theCrosswordGrid[i][y].index_of_char;
        var word = theCrosswordGrid[i][y].word;

        document.querySelector('#coordinate-'+i+'-'+y).classList.add('direction-'+direction);
        document.querySelector('#coordinate-'+i+'-'+y).classList.add('letterNumber-'+index_of_char);
        document.querySelector('#coordinate-'+i+'-'+y).classList.add('indexOfWord-'+index_of_word_in_input_list);
        document.querySelector('#coordinate-'+i+'-'+y).classList.add('wordPosition-'+wordPosition);
        document.querySelector('#coordinate-'+i+'-'+y).classList.add('word-'+word.replace(' ','-'));
        document.querySelector('#coordinate-'+i+'-'+y).classList.add(direction+'-word-'+word.replace(' ','-'));

        if (theCrosswordGrid[i][y].across) {
          var acrossTrueOrFalse = 'across-true';
          document.querySelector('#coordinate-'+i+'-'+y).classList.add(acrossTrueOrFalse);
          if (theCrosswordGrid[i][y].across.is_start_of_word) {
            var startOfWordAcross = 'startOfWordAcross';
            document.querySelector('#coordinate-'+i+'-'+y).classList.add(startOfWordAcross);
          }
        }

        if (theCrosswordGrid[i][y].down) {
          var downTrueOrFalse = 'down-true';
          document.querySelector('#coordinate-'+i+'-'+y).classList.add(downTrueOrFalse);
          if (theCrosswordGrid[i][y].down.is_start_of_word) {
            var startOfWordDown = 'startOfWordDown';
            document.querySelector('#coordinate-'+i+'-'+y).classList.add(startOfWordDown);
            document.querySelector('#coordinate-'+i+'-'+y).classList.add('startOfWord-'+word);
          }
        }
      }
    }
  }
}


function makeAllHintLiElementsHaveProperClasses(){
  for (var i = 0; i < document.querySelector('#across').querySelectorAll('li').length; i++) {
    document.querySelector('#across').querySelectorAll('li')[i].onclick = function(){clickLiOnCrossword(this);}
    document.querySelector('#across').querySelectorAll('li')[i].style.cursor = "pointer";
    document.querySelector('#across').querySelectorAll('li')[i].id = 'wordAcrossHintId-'+Number(document.querySelector('#across').querySelectorAll('li')[i].querySelector('strong').innerHTML.replace('.',''));
    // document.querySelector('#across').querySelectorAll('li')[i].classList.add('wordAcrossHint');
    document.querySelector('#across').querySelectorAll('li')[i].innerHTML = document.querySelector('#across').querySelectorAll('li')[i].innerHTML.replace('<strong>','<strong class="wordAcrossHintStrongTag-'+Number(document.querySelector('#across').querySelectorAll('li')[i].querySelector('strong').innerHTML.replace('.',''))+'">');
  }
  for (var i = 0; i < document.querySelector('#down').querySelectorAll('li').length; i++) {
    document.querySelector('#down').querySelectorAll('li')[i].onclick = function(){clickLiOnCrossword(this);}
    document.querySelector('#down').querySelectorAll('li')[i].style.cursor = "pointer";
    document.querySelector('#down').querySelectorAll('li')[i].id = 'wordDownHintId-'+Number(document.querySelector('#down').querySelectorAll('li')[i].querySelector('strong').innerHTML.replace('.',''));
    // document.querySelector('#across').querySelectorAll('li')[i].classList.add('wordDownHint');
    document.querySelector('#down').querySelectorAll('li')[i].innerHTML = document.querySelector('#down').querySelectorAll('li')[i].innerHTML.replace('<strong>','<strong class="wordDownHintStrongTag-'+Number(document.querySelector('#down').querySelectorAll('li')[i].querySelector('strong').innerHTML.replace('.',''))+'">');
  }
}

function clickLiOnCrossword(element){
  console.log(element);
  var numberOfHint = Number(element.id.replace('wordDownHintId-',"").replace('wordAcrossHintId-',""));
  console.log(numberOfHint);
  // uncolorAllWordsDuringGuessPeriod();
  colorInWordDuringGuessUsingCoordinatesUsingPosition(numberOfHint);
  colorInBeginningCoordinates(numberOfHint);
  hideAllInputSpanHints();

  if (!$( element ).hasClass( "clickedOnElementLi")) {
    element.classList.add('clickedOnElementLi');
    element.innerHTML += '<span class="inputSpanCrossword" id="inputSpan-'+numberOfHint+'"><br class="breakInputCrossword"><input id="inputInput'+numberOfHint+'"></input><button style="margin-left:5px;" id="inputButtonCrossword-'+numberOfHint+'">Enter</button><button style="margin-left:5px;" id="fillInAnswer-'+numberOfHint+'">Give Up</button></span>';
    document.querySelector('#inputInput'+numberOfHint).focus();
    // element.style.fontWeight = 'bold';
    document.querySelector('#inputButtonCrossword-'+numberOfHint).onclick = function(){
      // Execute code and store binary
        // var correctOrIncorrect = testIfWordIsCorrectOnCrossword(numberOfHint,document.querySelector('#inputInput'+numberOfHint).value);
        var correctOrIncorrect = guessWordCrossword(numberOfHint,document.querySelector('#inputInput'+numberOfHint).value);
        if (correctOrIncorrect) {
          document.querySelector('#inputSpan-'+numberOfHint).style.display = 'none';
          element.style.color = 'green';
        }
        if (!correctOrIncorrect) {
          document.querySelector('#inputInput'+numberOfHint).value = '';
        }
      }
      document.querySelector('#fillInAnswer-'+numberOfHint).onclick = function(){
          var word = getWordWithPosition(numberOfHint);
          guessWordCrossword(numberOfHint, word);
          document.querySelector('#inputSpan-'+numberOfHint).style.display = 'none';
          element.style.color = 'green';
        }
  }else if(element.style.color !== 'green' && document.querySelector('#inputSpan-'+numberOfHint)){
    document.querySelector('#inputSpan-'+numberOfHint).style.display = 'block';
    hideAllBreaksOnInputHints();
    document.querySelector('#inputInput'+numberOfHint).focus();
  }
  // else if (document.querySelector('#inputSpan-'+numberOfHint) && document.querySelector('#inputSpan-'+numberOfHint).style.display === 'none') {
  //       document.querySelector('#inputSpan-'+numberOfHint).style.display = 'block';
  // }
  // else if (document.querySelector('#inputSpan-'+numberOfHint) && document.querySelector('#inputSpan-'+numberOfHint).style.display === 'block') {
  //       document.querySelector('#inputSpan-'+numberOfHint).style.display = 'none';
  // }
}



function toggleHideOrRevealAnswersCrossword(){
  if (document.querySelector('#revealOrHideAllAnswersCrosswordButton').innerHTML === 'Hide All Answers') {
    hideAllAnswersCrosswordWithCrosswordLettersArray();
    // document.querySelector('#revealOrHideAllAnswersCrosswordButton').innerHTML = 'Reveal All Answers'
  }else {
    revealAllAnswersCrosswordWithCrosswordLettersArray();
    // document.querySelector('#revealOrHideAllAnswersCrosswordButton').innerHTML = 'Hide All Answers';
  }
}


function revealAllAnswersCrosswordWithCrosswordLettersArray(){
  for (var i = 0; i < theCrosswordGridWithLetters.length; i++) {
    for (var y = 0; y < theCrosswordGridWithLetters[i].length; y++) {
      if (theCrosswordGridWithLetters[i] && theCrosswordGridWithLetters[i][y]) {
        document.querySelector('#coordinate-'+i+'-'+y).innerHTML = theCrosswordGridWithLetters[i][y];
      }
    }
  }
  document.querySelector('#revealOrHideAllAnswersCrosswordButton').innerHTML = 'Hide All Answers';
  document.querySelector('#revealOrHideAllAnswersCrosswordButton').classList.remove('answersHidden');
  document.querySelector('#revealOrHideAllAnswersCrosswordButton').classList.add("answersRevealed");
}
function hideAllAnswersCrosswordWithCrosswordLettersArray(){
  for (var i = 0; i < theCrosswordGridWithLetters.length; i++) {
    for (var y = 0; y < theCrosswordGridWithLetters[i].length; y++) {
      if (theCrosswordGridWithLetters[i] && theCrosswordGridWithLetters[i][y]) {
        document.querySelector('#coordinate-'+i+'-'+y).innerHTML = '';
      }
    }
  }
  document.querySelector('#revealOrHideAllAnswersCrosswordButton').innerHTML = 'Reveal All Answers';
  document.querySelector('#revealOrHideAllAnswersCrosswordButton').classList.add('answersHidden');
  document.querySelector('#revealOrHideAllAnswersCrosswordButton').classList.remove("answersRevealed");
}

function getBeginningCoordinatesCrossword(word){
  var thePosition;
  for (var i = 0; i < theCrosswordLegend.across.length; i++) {
    if (theCrosswordLegend.across[i].word === word) {
      thePosition = theCrosswordLegend.across[i].position;
    }
  }
  for (var i = 0; i < theCrosswordLegend.down.length; i++) {
    if (theCrosswordLegend.down[i].word === word) {
      thePosition = theCrosswordLegend.down[i].position;
    }
  }
  var stringCoordinatesArray = document.querySelector('.startOfWord-'+thePosition).id.replace('coordinate-','').split('-');
  var coordinatesArray = [Number(stringCoordinatesArray[0]),Number(stringCoordinatesArray[1])]
  return coordinatesArray;
}

function getEndingCoordinatesCrossword(word){
  var beginningCoordinates = getBeginningCoordinatesCrossword(word);
  var acrossTrue;
  var downTrue;
  for (var i = 0; i < theCrosswordLegend.across.length; i++) {
    if (theCrosswordLegend.across[i].word === word) {
      acrossTrue = true;
    }else{
      downTrue = true;
    }
  }
  if (acrossTrue) {
    var endingCoordinates = [
      beginningCoordinates[0],
      beginningCoordinates[1] + word.length - 1
    ]
  }else{
    var endingCoordinates = [
      beginningCoordinates[0] + word.length - 1,
      beginningCoordinates[1]
    ]
  }
  return endingCoordinates;
}

function getAllCoordinatesCrossword(word){
  var beginning = getBeginningCoordinatesCrossword(word);
  var end = getEndingCoordinatesCrossword(word);

  var multi = [];
  if (beginning[0] === end[0]) {
    for(var i = beginning[1]; i <= end[1]; i++){
      multi.push([beginning[0],i]);
  }
  }else if(beginning[1] === end[1]){
    for(var i = beginning[0]; i <= end[0]; i++){
      multi.push([i,beginning[1]]);
  }
  }
  return multi;
}



function fillInWordUsingCoordinates(word){
  var allCoordinates = getAllCoordinatesCrossword(word);
  for (var i = 0; i < word.length; i++) {
    document.querySelector('#coordinate-'+allCoordinates[i][0]+'-'+allCoordinates[i][1]).innerHTML = word[i];
  }
}

function guessWordCrossword(position,word){
  var wordPostionAndWordArray =[];
  for (var i = 0; i < theCrosswordLegend.across.length; i++) {
    wordPostionAndWordArray.push(theCrosswordLegend.across[i]);
  }
  for (var i = 0; i < theCrosswordLegend.down.length; i++) {
    wordPostionAndWordArray.push(theCrosswordLegend.down[i]);
  }

  for (var i = 0; i < wordPostionAndWordArray.length; i++) {
    console.log(wordPostionAndWordArray[i].position, wordPostionAndWordArray[i].word);
    if (wordPostionAndWordArray[i].position === position && wordPostionAndWordArray[i].word === word ) {
      fillInWordUsingCoordinates(word);
      return true;
    }
  }
  console.log('INCORRECT');
}

function findWordWithPositionCrossword(position){
  var theWord = [];
  var theCount = 0;
  var direction;

  for (var i = 0; i < theCrosswordLegend.across.length; i++) {
    if (theCrosswordLegend.across[i].position === position) {
      theWord.push(theCrosswordLegend.across[i].word);
      theCount ++;
      direction = 'across';
    }
  }
  for (var i = 0; i < theCrosswordLegend.down.length; i++) {
    if (theCrosswordLegend.down[i].position === position) {
      theWord.push(theCrosswordLegend.down[i].word);
      theCount ++;
      direction = 'down';
    }
  }
  if (theCount === 1) {
    return {
      word:theWord[0],
      direction:direction
    }
  }else if(theCount > 1){
    return {
      word:theWord[0],
      word2:theWord[1],
      wordsObject: {word1:theWord[0],word2:theWord[1]},
      direction: 'both'
    }
  }else{
    console.log('No word at that position');
  }
}

function getAllCoordinatesCrosswordUsingPosition(position){
  var wordObject = findWordWithPositionCrossword(position);
  var word = wordObject.word;
  return getAllCoordinatesCrossword(word);
}

function colorInWordDuringGuessUsingCoordinates(word){
  var allCoordinates = getAllCoordinatesCrossword(word);
  for (var i = 0; i < word.length; i++) {
    document.querySelector('#coordinate-'+allCoordinates[i][0]+'-'+allCoordinates[i][1]).style.backgroundColor = '#E0FFFF';
  }
}

function colorInWordDuringGuessUsingCoordinatesUsingPosition(position){
  uncolorAllWordsDuringGuessPeriod();
  var allCoordinates = getAllCoordinatesCrosswordUsingPosition(position);
  for (var i = 0; i < allCoordinates.length; i++) {
    document.querySelector('#coordinate-'+allCoordinates[i][0]+'-'+allCoordinates[i][1]).style.backgroundColor = '#E0FFFF'
  }
}

function colorInBeginningCoordinates(position){
  var word = getWordWithPosition(position);
  var beginningCoordinates = getBeginningCoordinatesCrossword(word);
  document.querySelector('#coordinate-'+beginningCoordinates[0]+'-'+beginningCoordinates[1]).style.backgroundColor = 'rgb(233, 222, 255)';
}
function colorInBeginningCoordinatesWithRegularColors(position){
  var word = getWordWithPosition(position);
  var beginningCoordinates = getBeginningCoordinatesCrossword(word);
  document.querySelector('#coordinate-'+beginningCoordinates[0]+'-'+beginningCoordinates[1]).style.backgroundColor = '#E0FFFF';
}

function uncolorAllWordsDuringGuessPeriod(){
  for (var i = 0; i < theCrosswordGridWithLetters.length; i++) {
    for (var y = 0; y < theCrosswordGridWithLetters[i].length; y++) {
      if (theCrosswordGridWithLetters[i] && theCrosswordGridWithLetters[i][y]) {
        document.querySelector('#coordinate-'+i+'-'+y).style.backgroundColor = 'white';
      }
    }
  }
}

function makeAllCoordinatesStyleCursorPointer(){
  for (var i = 0; i < theCrosswordGridWithLetters.length; i++) {
    for (var y = 0; y < theCrosswordGridWithLetters[i].length; y++) {
      if (theCrosswordGridWithLetters[i] && theCrosswordGridWithLetters[i][y]) {
        document.querySelector('#coordinate-'+i+'-'+y).style.cursor = 'pointer';
      }else{
        document.querySelector('#coordinate-'+i+'-'+y).style.backgroundColor = 'gainsboro';
      }
    }
  }
}

function hideAllInputSpanHints(){
  for (var i = 0; i < document.querySelectorAll('.inputSpanCrossword').length; i++) {
    document.querySelectorAll('.inputSpanCrossword')[i].style.display = 'none';
    document.querySelectorAll('.inputSpanCrossword')[i].style.fontWeight = 'normal';
  }
  for (var i = 0; i < document.querySelectorAll('.boldCorrectCrosswordHint').length; i++) {
    document.querySelectorAll('.boldCorrectCrosswordHint')[i].style.fontWeight = 'bold';
  }
}
function hideAllBreaksOnInputHints(){
  for (var i = 0; i < document.querySelectorAll('.breakInputCrossword').length; i++) {
    document.querySelectorAll('.breakInputCrossword')[i].style.display = 'none';
  }
}

function getPositionOfWordWithWord(word){
  for (var i = 0; i < theCrosswordLegend.across.length; i++) {
    if (theCrosswordLegend.across[i].word === word) {
      return theCrosswordLegend.across[i].position;
    }
  }
  for (var i = 0; i < theCrosswordLegend.down.length; i++) {
    if (theCrosswordLegend.down[i].word === word) {
      return theCrosswordLegend.down[i].position;
    }
  }
}
function getWordWithPosition(position){
  for (var i = 0; i < theCrosswordLegend.across.length; i++) {
    if (theCrosswordLegend.across[i].position === position) {
      return theCrosswordLegend.across[i].word;
    }
  }
  for (var i = 0; i < theCrosswordLegend.down.length; i++) {
    if (theCrosswordLegend.down[i].position === position) {
      return theCrosswordLegend.down[i].word;
    }
  }
}
