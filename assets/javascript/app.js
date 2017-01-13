//function that constructs my questions into objects//

    function Question(questionNumber, questionString, answerChoices, answerIndex) {
        this.questionNumber = questionNumber;
        this.questionString = questionString;
        this.answerChoices = answerChoices;
        this.answerIndex = answerIndex;
    }

    var questionBank = [
        new Question(1, "What is Bart's full name?", ["Bartholomew", "Barticus", "Bartrum", "Barty"], "0"),
        new Question(2, "What are the names of Marge's sisters?", ["Patsy and Selina", "Patsy and Selma", "Patty and Selma", "Patty and Selina"], "2"),
        new Question(3, "What town do the Simpsons live in?", ["Cleveland", "Springfield", "Springview", "none of the above"], "1"),
        new Question(4, "What is the name of Mr. Burns' right hand man?", ["Chief Wiggum", "Moe Szyslak", "Troy McClure", "Waylon Smithers"], "3"),
        new Question(5, "Which is NOT a Bart Simpson catchphrase?", ["'Eat My Shorts!'", "'Don't Have a Cow, Man!'", "'I did it!'", "'Ay Caramba!'"], "2"),
        new Question(6, "What was Maggie's first word?", ["Mamma", "Bart", "Lisa", "Daddy"], "3"),
        new Question(7, "What is the name of the school bully?", ["Nelson", "Bob", "Martin", "none of the above"], "0"),
        new Question(8, "What is the name of the groundskeeper at the school?", ["Billy", "Willie", "Wallie", "Jocky"], "1"),
        new Question(9, "What is the name of the shop owned by Apu?", ["7-Eleven", "Dash-E-Mart", "Fast-E-Mart", "Kwik-E-Mart"], "3"),
        new Question(10, "Finally, what are the names of Homer's two colleagues from Sector 7G?", ["Carl and Lenny", "Skinner and Krabappel", "Moe and Barney", "Wiggum and Abe"], "0"),
    ]

    var quesNumCounter = 0;
    var randomNumber = Math.floor(Math.random() * 10) + 1


    //shorthand for jquery document ready function//
    $(function() {

    	 $(".content").effect("slide", "slow");


        var $wrapper = $("#wrapper");
        var $start = $("#start");
        var $question = $("#question");
        var $next = $("#next");
        var $answers = $("#answers");
        var timerStop = false;
        var correctGuess = 0;
        var incorrectGuess = 0;
        var unansweredGuess = 0;



        //countdown timer//

        function startTimer() {
            var count = 16;
            timerStop = false;
            timer();
            var counter = setInterval(timer, 1000); //timer function will  run every 1 second

            function timer() {
                count--;
                $("#countdown").css("background","#70D1FF");
                $("#countdown").css("color","");

                        
                if (timerStop === true) {
                    clearInterval(counter);
                    return;

                }else if(count <= 5 && count > 0){
                    $("#countdown").css({
                        background: 'red',
                        color: 'white'
                    });
                }

                else if (count <= 0) {
                    clearInterval(counter);
                    timeUp();
                    return;
                }

                $("#countdown").html("Timer: " + count)
            }
        }


        $start.on("click", function() {
            quesNumCounter = 0;
            $(this).hide();
            $("#info-panel").hide();
            $(".content").css("height", "700px")
            $wrapper.show();
            generateQuestion(quesNumCounter);
            startTimer();


        });



        function nextQuestion() {
            $("#info-panel").hide();

            if (quesNumCounter == questionBank.length - 1) {
                endScreen();
            } else {
                quesNumCounter++
                $wrapper.show();
                generateQuestion(quesNumCounter)
                startTimer();

            }
        };

        //matching the data attribute to our correct answer index
        $answers.on("click", "li", function() {
            timerStop = true;
            var indexNum = $(this).attr("data-index");
            if (indexNum === questionBank[quesNumCounter].answerIndex) {
                winScreen(indexNum, true);
            } else {
                winScreen(indexNum, false);
            }

        });


        //generates the questions and answers
        function generateQuestion(quesNum, correct) {
            var question = questionBank[quesNum]
            $question.text(question.questionString)
            $("li").remove();
            for (i = 0; i < question.answerChoices.length; i++) {
                $answers.append("<li data-index=" + "'" + i + "''>" + question.answerChoices[i] + "</li>")
            }
        }

        //display if player is correct
        function winScreen(indexNum, correct) {
            $wrapper.hide();
            if (correct) {
                $("#info-panel").html("<p> Your answer of " + questionBank[quesNumCounter].answerChoices[indexNum] + " was correct")
                ajaxGiphy(questionBank[quesNumCounter].answerChoices[indexNum]);
                correctGuess++;

            } else {
                var indexShort = questionBank[quesNumCounter].answerIndex
                $("#info-panel").html("<p> Your answer of " + questionBank[quesNumCounter].answerChoices[indexNum] + " was wrong</p><p> The correct answer was " + questionBank[quesNumCounter].answerChoices[indexShort] + "<p>")
                ajaxGiphy(questionBank[quesNumCounter].answerChoices[indexShort]);
                incorrectGuess++;
            }
            $("#info-panel").show();
            setTimeout(nextQuestion, 3500);
        }

        function timeUp() {
            $wrapper.hide();
            var indexShort = questionBank[quesNumCounter].answerIndex
            $("#info-panel").html("<p>Time has run out!<p><p> The correct answer was " + questionBank[quesNumCounter].answerChoices[indexShort] + "<p>")
            unansweredGuess++;
            ajaxGiphy(questionBank[quesNumCounter].answerChoices[indexShort]);
            $("#info-panel").show();
            setTimeout(nextQuestion, 3500);
        }

        function endScreen() {
            $("#info-panel").html("<p>Here are your results!<p><p>Correct: " + correctGuess + "</p>" + "<p>Incorrect: " + incorrectGuess + "</p><p>Unanswered: " + unansweredGuess + "</p>")
            $start.show();
            $start.text("Again");
            $("#info-panel").show();

        }

        function ajaxGiphy(gifSearch){
            $.ajax({
                url: "https://api.giphy.com/v1/gifs/search?q=the+simpsons+" + gifSearch,
                method: 'GET',
                data: { api_key: "dc6zaTOxFJmzC"}
                }).done(function(data) {
                 return $("#info-panel").append("<img src='" + data.data[randomNumber].images.downsized_medium.url + "' height='200'>")

            });
        }

    });



