document.addEventListener('DOMContentLoaded', function () {

    // Constants (assumes you have js_vars available for these values)
    let pieceRate = js_vars.Piece_rate;  // Assign the piece-rate dynamically
    let tournamentRate = js_vars.Tournament_rate;  // Assign the tournament-rate dynamically
    let investmentPieChartInstance;

    $(document).ready(function () {
        // Create the tournament investment slider
        var calcLabel = "<label for='calcLabel' style='display: block; text-align: center;'><span style='font-size: 1.1em;'>How much do you allocate to Tournament-rate in this scenario?</span><br><span style='font-size: 0.8em; color: gray;'>(click anywhere on the blue part to reveal the slider!)</span><br>";
        $("#calculator_slider").append(calcLabel);
        slider_calc = new mgslider("Calculator", 0, 100, 1);  // Slider for tournament investment
        slider_calc.recall = false;  // Optional: remembers value across errors
        slider_calc.print(document.getElementById("calculator_slider"));
        // Override the feedback text for slider_calc
        slider_calc.feedback = function (value) {
            var pieceRateInvestment = 100 - value;  // Calculate Piece-rate investment
            updatePieChart(value, pieceRateInvestment);
            return "Tournament-rate: <b class='mgslider-value'>" + this.f2s(value, false) + "</b> tokens" +
                "<br>Piece-rate: <b class='mgslider-value'>" + this.f2s(pieceRateInvestment, false) + "</b> tokens";
        };
        // add blank lines after the slider
        // $("#calculator_slider").append("<br><br>");
        
        
        
        // Create the score slider
        var scoreLabel = "<label for='scoreLabel' style='display: block; text-align: center;'><span style='font-size: 1.1em;'>How many points have you scored in this scenario?</span><br><span style='font-size: 0.8em; color: gray;'>(click anywhere on the blue part to reveal the slider!)</span><br>";
        $("#score_slider").append(scoreLabel);
        slider_score = new mgslider("Score", 0, 48, 1);  // Slider for score input - the max slider value is more than what I can score (8 pairs in 5 decks = 40) #argun-checkout
        slider_score.recall = false;  // Optional: remembers value across errors
        slider_score.print(document.getElementById("score_slider"));
        // Override the feedback text for slider_calc
        slider_score.feedback = function (value) {
            return "Score: <b class='mgslider-value'>" + this.f2s(value, false) + "</b> points"                
        };
        // $("#score_slider").append("<br>");

        
        // Set up hooks to call calculateBonus when the sliders are changed
        slider_calc.hook = function(slider, value) {
            calculateBonus();  // Call calculateBonus when the tournament slider changes
        };

        slider_score.hook = function(slider, value) {
            calculateBonus();  // Call calculateBonus when the score slider changes
        };

        // Trigger calculateBonus when the rank dropdown is changed
        $("#rank").change(calculateBonus);  // Trigger calculation when rank dropdown changes
    });

    // Initialize the bar chart for Piece-part and Tournament-part
    var ctxBar = document.getElementById('bonusBarChart').getContext('2d');
    var bonusBarChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Piece-part', 'Tournament-part'],
            datasets: [{
                label: 'Bonus Parts ($)',
                data: [0, 0], // Initial values for Piece-part and Tournament-part
                backgroundColor: ['#FFCE56', '#36A2EB'], // Colors for Piece-part and Tournament-part
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Disable the legend to remove the yellow square
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    // Function to calculate the bonus and update both display and bar chart
    function calculateBonus() {
        // Get user inputs from the sliders
        const score = slider_score.value();  // Get value from score slider
        const tokensTournament = slider_calc.value();  // Get value from tournament investment slider
        
        // Get rank from the dropdown
        const rank = parseInt(document.getElementById('rank').value);
        
        // Calculate the number of tokens invested in the piece-rate scheme
        const tokensPiece = 100 - tokensTournament;
        
        // Calculate the piece-part of the bonus
        const piecePart = (tokensPiece / 100) * pieceRate * score;
        // Calculate the tournament-part of the bonus (only if rank is 1)
        let tournamentPart = 0;
        if (rank === 1) {
            tournamentPart = (tokensTournament / 100) * tournamentRate * score;
        }

        // Calculate the total bonus
        
        const totalBonus = piecePart + tournamentPart;

        // Display the total bonus in the designated area
        if (!isNaN(score) && !isNaN(tokensTournament) && Number.isInteger(rank)) {
            document.getElementById('bonusDisplay').innerText = totalBonus.toFixed(2);
            document.getElementById('bonusDisplay_Piece').innerText = piecePart.toFixed(2);
            document.getElementById('bonusDisplay_Tournament').innerText = tournamentPart.toFixed(2);
            // Update the bar chart with new values for Piece-part and Tournament-part
            bonusBarChart.data.datasets[0].data = [piecePart, tournamentPart];
            bonusBarChart.update();
            // console.log('Piece part: ', piecePart);
        }


        // Increment hidden field's value
        hidden_field = document.getElementById('id_Calculator');
        hidden_field.value = parseInt(hidden_field.value) + 1;
    }
});


// <strong>Bonus in this scenario</strong>