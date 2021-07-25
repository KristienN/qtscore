$(document).ready(function () {
    let $card;
    $.ajax({
        type: "GET",
        url: "https://qtscore.herokuapp.com/prediction/",
        success: function (response) {
            response.forEach(res => {
                $card = `<tr >
                            <td><img src="${res.country}" class="img-fluid" /></td>
                            <td><p class="fe_pred">${res.home_team}</p></td>
                            <td><p style="color: white">vs</p></td>
                            <td><p <p class="fe_pred">${res.away_team}</p></td>
                            <td><p <p class="fe_pred_2">${res.tip}</p></td>
                         </tr>`
                

                if(res.page == 1){
                    $('#today tbody').append($card);
                }

                if(res.page == 2){
                    $('#tomorrow tbody').append($card);
                }
                
            });

            
            
        }
    });
});