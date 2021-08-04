$(document).ready(function () {
    let $card;
    let $row;
    $.ajax({
        type: "GET",
        url: "https://qtscore.herokuapp.com/prediction/",
        success: function (response) {
            response.forEach(res => {
                $card = `<tr>
                            <td><img src="${res.country}" class="img-fluid" /></td>
                            <td>
                                <div class="fe_pred" style="text-align: center; margin: 0 2rem">
                                    <p>${res.away_team}</p>
                                </div>
                            </td>
                            <td><p style="color: white">vs</p></td>
                            <td>
                                <div class="fe_pred" style="text-align: center; margin: 0 2rem">
                                    <p>${res.away_team}</p>
                                </div>
                            </td>
                            <td>
                                <div class="fe_pred_2" style="text-align: center; margin: 0 2rem">
                                    <p>${res.tip}</p>
                                </div>
                            </td>
                         </tr>`
                

                if(res.page == 1){
                    $('#today tbody').append($card);
                }

                if(res.page == 2){
                    $('#tomorrow tbody').append($card);
                }
                
            });

            for (let x = 0; x < 5; x++) {
                $row = `<tr>
                            <td><img src="${response[x].country}" class="img-fluid" /></td>
                            <td><p class="fe_pred">${response[x].home_team}</p></td>
                            <td><p style="color: white">vs</p></td>
                            <td><p class="fe_pred">${response[x].away_team}</p></td>
                            <td><p class="fe_pred_2">${response[x].tip}</p></td>
                         </tr>`

                if(response[x].page == 1){
                    $('.tdf tbody').append($row);
                }

                if(response[x].page == 2){
                    $('.tmf tbody').append($row);
                }
                
            }
      
        }
    });
});