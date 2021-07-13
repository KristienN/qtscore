$(document).ready(function () {
    let $card;
    $.ajax({
        type: "GET",
        url: "https://qtscore.herokuapp.com/prediction/",
        success: function (response) {
            response.forEach(res => {
                $card = `
                                <div class="row p-5 align-items-center justify-content-center text-center mb-3 text-light" style="border: 2px solid black; background-color: black;">
                                <div class="col-md-2 d-flex flex-column align-items-center justify-content-center">
                                    <p><strong>Country</strong></p>
                                    <img src="${res.country}" class="img-fluid">
                                </div>
                                <div class="col-md-2">
                                    <h4 class="fe_pred">${res.home_team}</h4>
                                </div>
                                <div class="col-md-1 align-items-center justify-content-center"><h4>vs</h4></div>
                                <div class="col-md-2">
                                    <h4 class="fe_pred">${res.away_team}</h4>
                                </div>
                                <div class="col-md-2">
                                    <p class="fe_pred_2"><strong>Tip</strong></p>
                                    <p class="fe_pred_2">${res.tip}</p>
                                </div>
                                <div class="col-md-2">
                                    <p class="fe_pred_3"><strong>Date</strong></p>
                                    <p class="fe_pred_3">${res.date.toString().substring(0,10)}</p>
                                </div>
                                </div>`
                

                if(res.page == 1){
                    $('#admin-data').append($card);
                }

                if(res.page == 2){
                    $('#tomorrow-data').append($card);
                }
                
            });

            
            
        }
    });
});