// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the pie chart
    var ctx = document.getElementById('investmentPieChart').getContext('2d');
    var investmentPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Tournament-rate', 'Piece-rate'],
            datasets: [{
                data: [50, 50], // Initial values, 50-50 split
                backgroundColor: ['#36A2EB', '#FFCE56'], // Colors for Tournament and Piece rates
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });

    // Function to update the pie chart based on slider values
    window.updatePieChart = function (tournamentInvestment, pieceRateInvestment) {
        investmentPieChart.data.datasets[0].data = [tournamentInvestment, pieceRateInvestment];
        investmentPieChart.update();
    };

});
