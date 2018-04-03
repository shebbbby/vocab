// CODE RELATING TO THE DATAMUSE API!!!

// https://www.datamuse.com/api/

// other apps using datamuse(study them):https://www.datamuse.com/api/users.html

// Data sources
// The Datamuse API leans on many freely available data sources to do its work:
//
// Phonetic data: The CMU pronouncing dictionary is used as a source of phonetic transcriptions for the "sounds-like" constraint and for the various English-language phonetic relations such as perfect rhymes and homophones. The "approximate rhymes" constraint ("rel_nry") is based on this data as well as an analysis of lyrics and poetry on the Web (via the Common Crawl).
// Corpus-based data: The Google Books Ngrams data set is used to build the language model that scores candidate words by context, and also for some of the lexical relations. word2vec is used for reranking result sets by topic (the "topics" parameter). word2vec as well as the excellent Paraphrase Database are used to backfill the results for single-word "means-like" constraints (the "ml" parameter); in particular, the "XXL" lexical paraphrases are used, without modification.
// Semantic knowledge: WordNet 3.0 is used for several of the static semantic lexical relations. For the "means-like" ("ml") constraint, dozens of online dictionaries crawled by OneLook are used in addition to WordNet.

//https://wordnet.princeton.edu/

// If you need multiple objects in an array
var datamuseObjectsArray = [];

// This object gets reset every time the major aggregate function gets called.
var datamuseObjectData = {};

function datamuseWordSoundsLike(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?sl='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.soundsLike = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

function datamuseWordsRelatedToWord(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?ml='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.relatedWordsToWord = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

function datamuseWordsSpelledSimilarly(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?sp='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.spelledLike = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//Popular adjectives used to modify the given noun, per Google Books Ngrams
function datamuseAdjectivesUsedToDescribeWord(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_jjb='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.adjectivesUsedToDescribeWord = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//Popular nouns modified by the given adjective, per Google Books Ngrams
function datamuseNounsUsedToDescribeWord(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_jja='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.nounsUsedToDescribeWord = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

function datamuseSynonyms(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_syn='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.synonyms = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}


//	"Triggers" (words that are statistically associated with the query word in the same piece of text.)
function datamuseTriggers(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_trg='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.triggers = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//	Antonyms (per WordNet)
function datamuseAntonyms(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_ant='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.antonyms = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//"Kind of" (direct hypernyms, per WordNet)	gondola → boat
function datamuseKindOf(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_spc='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.kindOf = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//"More general than" (direct hyponyms, per WordNet)	boat → gondola
function datamuseMoreGeneralThan(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_gen='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.moreGeneralThan = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//	"Comprises" (direct holonyms, per WordNet)	car → accelerator
function datamuseComprises(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_com='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.comprises = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//	"Part of" (direct meronyms, per WordNet)	trunk → tree
function datamusePartOf(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_par='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.partOf = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

// Frequent followers (w′ such that P(w′|w) ≥ 0.001, per Google Books Ngrams)	wreak → havoc
function datamuseFrequentFollowers(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_bga='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.frequentFollowers = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//Frequent predecessors (w′ such that P(w|w′) ≥ 0.001, per Google Books Ngrams)	havoc → wreak
function datamuseFrequentPredecessors(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_bgb='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.frequentPredecessors = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//Rhymes ("perfect" rhymes, per RhymeZone)	spade → aid
function datamuseRhymesWith(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_rhy='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.rhymesWith = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//Approximate rhymes (per RhymeZone)	forest → chorus
function datamuseApproximateRhymes(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_nry='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.approximateRhymes = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//Homophones (sound-alike words)	course → coarse

function datamuseHomophones(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_hom='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.homophones = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

//Consonant match	sample → simple
function datamuseConsonantMatch(word) {
	$.ajax({
		url: 'https://api.datamuse.com/words?rel_con='+word,
		method: "GET",
		success: function (response) {
      datamuseObjectData.consonantMatches = response;
  },
		error: function (err) {
			console.log(err);
		}
	})
}

function datamuseAggregateAllSpecificWordData(word){
  datamuseObjectData = {};
  datamuseObjectData.word = word;
  datamuseConsonantMatch(word);
  datamuseHomophones(word);
  datamuseRhymesWith(word);
  datamusePartOf(word);
  datamuseKindOf(word);
  datamuseComprises(word);
  datamuseAntonyms(word);
  datamuseTriggers(word);
  datamuseSynonyms(word);
  datamuseApproximateRhymes(word);
  datamuseMoreGeneralThan(word);
  datamuseFrequentFollowers(word);
  datamuseWordSoundsLike(word);
  datamuseFrequentPredecessors(word);
  datamuseWordsRelatedToWord(word);
  datamuseWordsSpelledSimilarly(word);
  datamuseNounsUsedToDescribeWord(word);
  datamuseAdjectivesUsedToDescribeWord(word);
  console.log(datamuseObjectData);
}



// ---------------------------------------

// Suggests what you meant based on string
function datamuseSuggestionWithCurrentString(string) {
	$.ajax({
		url: 'https://api.datamuse.com/sug?s='+string+'&max=100',
		method: "GET",
		success: function (response) {
      console.log(response);
  },
		error: function (err) {
			console.log(err);
		}
	})
}

// Apparently not exactly the definition, but finds related words.....
function datamuseWordsSimilarToDefinition(definition) {
  var definitionWithPluses = definition.replace(/\s/g, '+');
	$.ajax({
		url: 'https://api.datamuse.com/words?ml='+definitionWithPluses+'&max=100',
		method: "GET",
		success: function (response) {
      console.log(response);
  },
		error: function (err) {
			console.log(err);
		}
	})
}
