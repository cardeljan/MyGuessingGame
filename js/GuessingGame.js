function generateWinningNumber() {
    return Math.floor(Math.random()*100 + 1);
}

/* Shuffle the array in place, so the computation is O(n) (linear)
*/

function shuffle(arr) {
    var n = arr.length;
    var i;
    var j;

/* Variable i picks a random element in the unshuffled portion of the array;
   We make sure we're only using unshuffled elements by setting n to arr.length
   and then decrementing n, so Math.floor(Math.random() * n) has an upper bound;
   We then swap the randomly selected element with the last element in the array,
   by storing it in a variable j first, assigning the random element to the last
   element (arr[n] = arr[i]), and then assigning the last element, which hasn't
   been shuffled yet, to the position where the randomly picked element was
   (arr[i] = j;) so that it can be shuffled in further iterations.
*/

    while (n) {
        i = Math.floor(Math.random() * n--);

        j = arr[n];
        arr[n] = arr[i];
        arr[i] = j;
    }
    return arr;
}

function Game() { 
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

/*
Game.prototype.provideHint

function newGame
*/

// Use Math.abs() for absolute value
Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(n) {
    if (n < 1 || n > 100 || isNaN(n)) {
        throw "That is an invalid guess.";
    } else {
    this.playersGuess = n;
    }
    return this.checkGuess();
}

// Game.prototype.playersGuessSubmission = function(n) {
//     if (typeof n !== "number" || n < 1 || n > 100) {
//         throw "That is an invalid guess.";
//     }
//     this.playersGuess = n;
// }

Game.prototype.checkGuess = function(){
    if (this.playersGuess === this.winningNumber) {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        $('#hint, #submit').prop('disabled', true);
        $('#subtitle').text("Click the reset button to play again!");
        return "You Win!";
    } else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return "You have already guessed that number.";
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if (this.pastGuesses.length === 5) {
                $('#hint, #submit').prop('disabled', true);
                $('subtitle').text("Press the Reset button to play again!")
                return "You Lose.";
            } else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!");
                } else {
                    $('#subtitle').text("Guess Lower!");
                }
                if (diff < 10) return 'You\'re burning up!';
                else if (diff < 25) return 'You\'re lukewarm.';
                else if (diff < 50) return 'You\'re a bit chilly.';
                else return 'You\'re ice cold!';
            }
        }
    }
}

function newGame () {
    return new Game();
}

Game.prototype.provideHint = function() {
    var hint = [];
    hint.push(this.winningNumber);
    hint.push(generateWinningNumber());
    hint.push(generateWinningNumber());
    return shuffle(hint);
}

function makeAGuess(game) {
    var guess = $('#players-input').val();
    $('#players-input').val('');
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}

$(document).ready(function() {
    var game = new Game;
    $('#submit').on('click', function() {
        makeAGuess(game);
    })
    $('#players-input').keypress(function(event) {
        if(event.which == 13) {
            makeAGuess(game);
        }
    })
    $('#hint').on('click', function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    })
    $('#reset').on('click', function() {
        game = new Game;
        $('#title').text("Play the Guessing Game!");
        $('#subtitle').text("Guess a number between 1 and 100!");
        $('.guess').text('-');
        $('#hint, #submit').prop('disabled', false);

    })
});