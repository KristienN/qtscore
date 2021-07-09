$(document).ready(function () {

    let $rawData;
    let $pack;
   
    $.ajax({
        type: "GET",
        url: "https://soccer.sportmonks.com/api/v2.0/predictions/probabilities/next?api_token=Kb8Hv1vaBWcGHhp1TeKEENOS69Sfsg1YOalzUWPEeMRswTEAogmtCPqMU5Sk",
        success: function (response) {

            
            $rawData = response.data;
            $rawData.forEach(rd => {
                let fid = rd.fixture_id;
                let fixData;
                console.log(fid);

                $.ajax({
                    type: "GET",
                    url: `https://soccer.sportmonks.com/api/v2.0/fixtures/${fid}?api_token=Kb8Hv1vaBWcGHhp1TeKEENOS69Sfsg1YOalzUWPEeMRswTEAogmtCPqMU5Sk&include=localTeam,visitorTeam,league`,
                    success: function (res) {
                        
                        console.log(res);

                        let card = `
                                <div class="row p-5 align-items-enter justify-content-center text-center text-light mb-3 shadow-lg" style="border: 2px solid black; background-color: black;">
                                <div class="col-sm-2">
                                    <img src="${res.data.localTeam.data.logo_path}" width="50px" class="img-fluid" alt="">
                                    <p class="fe_pred_4 rounded">${res.data.localTeam.data.name}</p>
                                </div>
                                <div class="col-sm-1 align-items-center justify-content-center"><h4>vs</h4></div>
                                <div class="col-sm-2">
                                    <img src="${res.data.visitorTeam.data.logo_path}" width="50px" class="img-fluid" alt="">
                                    <p class="fe_pred_4 rounded">${res.data.visitorTeam.data.name}</p>
                                </div>
                                <div class="col-sm-2">
                                    <p class="fe_pred rounded"><strong>BTTS</strong></p>
                                    <p class="fe_pred rounded">${rd.predictions.btts}</p>
                                </div>
                                <div class="col-sm-2">
                                    <p class="fe_pred_2 rounded"><strong>Over / Under 2.5</strong></p>
                                    <p class="fe_pred_2 rounded">${rd.predictions.over_2_5} / ${rd.predictions.under_2_5}</p>
                                </div>
                                <div class="col-sm-2">
                                    <p class="fe_pred_3 rounded"><strong>Date & Time(UTC)</strong></p>
                                    <p class="fe_pred_3 rounded">${res.data.time.starting_at.date.substring(5,)} ${res.data.time.starting_at.time.substring(0,5)}</p>
                                </div>
                                </div>`

                        if(res.data.league.data.id == 271){
                            $('#dan-data').append(card);
                        }

                        if(res.data.league.data.id == 513){
                            $('#dan-data-playoffs').append(card);
                        }

                        if(res.data.league.data.id == 501){
                            $('#scot-data').append(card);
                        }

                        if(res.data.league.data.id == 1659){
                            $('#scot-data-playoffs').append(card);
                        }

                        
                    }
                });

            });
            
        }
    });

    


});