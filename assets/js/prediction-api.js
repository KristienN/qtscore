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
                                <div class="row p-5 align-items-enter justify-content-center text-center mb-3" style="border: 2px solid black;">
                                <div class="col-sm-2">
                                    <img src="${res.data.localTeam.data.logo_path}" width="50px" class="img-fluid" alt="">
                                    <p>${res.data.localTeam.data.name}</p>
                                </div>
                                <div class="col-sm-1 align-items-center justify-content-center"><h4>vs</h4></div>
                                <div class="col-sm-2">
                                    <img src="${res.data.visitorTeam.data.logo_path}" width="50px" class="img-fluid" alt="">
                                    <p>${res.data.visitorTeam.data.name}</p>
                                </div>
                                <div class="col-sm-2">
                                    <p><strong>BTTS</strong></p>
                                    <p>${rd.predictions.btts}</p>
                                </div>
                                <div class="col-sm-2">
                                    <p><strong>Over / Under 2.5</strong></p>
                                    <p>${rd.predictions.over_2_5} / ${rd.predictions.under_2_5}</p>
                                </div>
                                <div class="col-sm-2">
                                    <p><strong>Date & Time(UTC)</strong></p>
                                    <p>${res.data.time.starting_at.date.substring(5,)} ${res.data.time.starting_at.time.substring(0,5)}</p>
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