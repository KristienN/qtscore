$(document).ready(function () {
    let $card;
    $.ajax({
        type: "GET",
        url: "https://qtscore.herokuapp.com/prediction/",
        success: function (response) {
            response.forEach(res => {
                $card = `
                                <div class="row p-5 align-items-enter justify-content-center text-center mb-3" style="border: 2px solid black;">
                                <div class="col-sm-2">
                                    <h4>${res.home_team}</h4>
                                </div>
                                <div class="col-sm-1 align-items-center justify-content-center"><h4>vs</h4></div>
                                <div class="col-sm-2">
                                    <h4>${res.away_team}</h4>
                                </div>
                                <div class="col-sm-2">
                                    <p><strong>Home Score</strong></p>
                                    <p>${res.home_score}</p>
                                </div>
                                <div class="col-sm-2">
                                    <p><strong>Away Score</strong></p>
                                    <p>${res.away_score}</p>
                                </div>
                                </div>`
                
                $('#admin-data').append($card);
            });

            
            
        }
    });
});