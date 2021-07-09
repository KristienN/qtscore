// ---------------------------------
// ---------- widgetMatchResults ----------
// ---------------------------------
// Widget for MatchResults Display
// ------------------------
;
(function($, window, document, undefined) {

    var widgetMatchResults = 'widgetMatchResults';

    function Plugin(element, options) {
        this.element = element;
        this._name = widgetMatchResults;
        this._defaults = $.fn.widgetMatchResults.defaults;
        this.options = $.extend({}, this._defaults, options);

        this.init();
    }

    $.extend(Plugin.prototype, {

        // Initialization logic
        init: function() {
            this.buildCache();
            this.bindEvents();
            this.initialContent(this.options.matchResultsDetailsAjaxURL, this.options.match_id, this.options.action, this.options.Widgetkey, this.options.leagueLogo);
        },

        // Remove plugin instance completely
        destroy: function() {
            this.unbindEvents();
            this.$element.removeData();
        },

        // Cache DOM nodes for performance
        buildCache: function() {
            this.$element = $(this.element);
        },

        // Bind events that trigger actions
        bindEvents: function() {
            var plugin = this;
        },

        // Unbind events that trigger actions
        unbindEvents: function() {
            this.$element.off('.' + this._name);
        },

        initialContent: function(matchResultsDetailsAjaxURL, match_id, action, Widgetkey, leagueLogo) {

            // Get widget location
            var matchResultsLocation = $(this.element);

             // Adding the "widgetMatchResults" class for styling and easyer targeting
            matchResultsLocation.addClass('widgetMatchResults');

            // If backgroundColor setting is set, here we activate the color
            if (this.options.backgroundColor) {
                matchResultsLocation.css('background-color', this.options.backgroundColor);
            }

            // If widgetWidth setting is set, here we set the width of the list
            if (this.options.widgetWidth) {
                matchResultsLocation.css('width', this.options.widgetWidth);
            }

            // We send a request to server for Match infos
            $.ajax({
                url: matchResultsDetailsAjaxURL,
                cache: false,
                data: {
                    action: action,
                    Widgetkey: Widgetkey,
                    match_id: match_id,
                    from: sessionStorage.getItem('fixturesDate'),
                    to: sessionStorage.getItem('fixturesDate'),
                    timezone: getTimeZone()
                },
                dataType: 'json'
            }).done(function(res) {
                // If server send results we populate HTML with sended information
                if (!res.error) {

                    // Check if we get the time
                    var seeWhatMatchDetailsToShow = setInterval(function() {
                        if (timeForFixtures.length > 0) {
                            // If date is in local storage or event status dose not exist we show predefined HTML
                            if ((sessionStorage.getItem('fixturesDate') > timeForFixtures) || ((res[0].match_status == null) || (res[0].match_status === ''))) {
                                // Hide loading screen
                                $('.loading').hide();
                                // Details for match
                                var otherMatchDetails = '<div class="otherMatchDetails">';
                                otherMatchDetails += '<div class="otherMatchDetailsInfos">';
                                otherMatchDetails += '<div class="leagueImg" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.apifootball.com/badges/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div>';
                                otherMatchDetails += '<div>' + res[0].country_name + ': ' + res[0].league_name + '</div>';
                                otherMatchDetails += '</div>';
                                var formattedDate = new Date(res[0].match_date);
                                var d = formattedDate.getDate();
                                var m = formattedDate.getMonth() + 1;
                                var y = formattedDate.getFullYear();
                                otherMatchDetails += '<div>' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + ' ' + res[0].match_time + '</div>';
                                otherMatchDetails += '</div>';
                                $(matchResultsLocation).prepend(otherMatchDetails);

                                // Add hook in HTML for Match Results Tab content infos
                                $(matchResultsLocation).append('<section id="matchResultsContentTable"></section>');
                                var htmlConstructor = '<div id="matchResultsDates">';
                                htmlConstructor += '<div id="matchResultsDatesTitle">';
                                if (!res.error) {
                                    htmlConstructor += '<div class="match_hometeam_name">';
                                    htmlConstructor += '<div class="match_hometeam_name_part">';
                                    htmlConstructor += '<div class="match_hometeam_name_part_img">';
                                    htmlConstructor += '<div class="image-style-for-flag" style="background-image: url(\'' + ((!res[0].team_home_badge) ? 'img/no-img.png' : ((res[0].team_home_badge == '') ? 'img/no-img.png' : res[0].team_home_badge)) + '\');"></div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="match_hometeam_name_part_name">';
                                    htmlConstructor += '<div>' + res[0].match_hometeam_name + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_info">';
                                    htmlConstructor += '<div class="event_info_score">';
                                    htmlConstructor += '<div>-</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_info_status">';
                                    htmlConstructor += '<div>' + ((res[0].match_status) ? res[0].match_status : '') + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="match_awayteam_name_part">';
                                    htmlConstructor += '<div class="match_awayteam_name_part_img">';
                                    htmlConstructor += '<div class="image-style-for-flag" style="background-image: url(\'' + ((!res[0].team_away_badge) ? 'img/no-img.png' : ((res[0].team_away_badge == '') ? 'img/no-img.png' : res[0].team_away_badge)) + '\');"></div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="match_awayteam_name_part_name">';
                                    htmlConstructor += '<div>' + res[0].match_awayteam_name + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="nav-tab-wrapper-all">';
                                htmlConstructor += '<ul class="nav-tab-wrapper-all-container">';
                                htmlConstructor += '<li><span><a href="#matchSummary" class="matchResults-h2 nav-tab nav-tab-active">Match Summary</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchOdds" class="matchResults-h2 nav-tab d-none-tab-odds">Odds</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchPredictions" class="matchResults-h2 nav-tab d-none-tab-prediction">Predictions</a></span></li>';
                                htmlConstructor += '</ul>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '<section id="matchSummary" class="tab-content active">';
                                htmlConstructor += '<div class="tab-container futureMatch">';
                                htmlConstructor += '<p>No live score information available now.</p>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Odds section
                                htmlConstructor += '<section id="matchOdds" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';

                                // Send server request for Standings
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        action: 'get_odds',
                                        Widgetkey: Widgetkey,
                                        from: sessionStorage.getItem('fixturesDate'),
                                        to: sessionStorage.getItem('fixturesDate'),
                                        match_id: res[0].match_id
                                    },
                                    dataType: 'json'
                                }).done(function(res) {

                                    // If server send results hide loading
                                    $('.loading').hide();

                                    if(!res.error){

                                        $('.d-none-tab-odds').removeClass('d-none-tab-odds');

                                        var htmlInsideTabsConstructorO = '<div class="nav-tab-wrapper">';
                                        var htmlConstructorO = '<a href="#1x2" class="standing-h2 nav-tab nav-tab-active">1x2</a>';
                                        htmlConstructorO += '<a href="#ah" class="standing-h2 nav-tab">Asian Handicap</a>';
                                        htmlConstructorO += '<a href="#ou" class="standing-h2 nav-tab">O/U</a>';
                                        htmlConstructorO += '<a href="#bts" class="standing-h2 nav-tab">BTS</a>';

                                        htmlInsideTabsConstructorO += '<section id="1x2" class="tab-content active">';
                                        htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorO += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorO += '<div title="Bookmakers" class="flex-row bookmakers" role="columnheader">Bookmakers</div>';
                                        htmlInsideTabsConstructorO += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                        htmlInsideTabsConstructorO += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                        htmlInsideTabsConstructorO += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '<div class="table__body">';
                                        var onextwo = '';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</section>';

                                        htmlInsideTabsConstructorO += '<section id="ou" class="tab-content">';
                                        htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</section>';

                                        htmlInsideTabsConstructorO += '<section id="bts" class="tab-content">';
                                        htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorO += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorO += '<div title="Bookmakers" class="flex-row bookmakers" role="columnheader">Bookmakers</div>';
                                        htmlInsideTabsConstructorO += '<div title="Yes" class="flex-row oddWidth" role="columnheader">Yes</div>';
                                        htmlInsideTabsConstructorO += '<div title="No" class="flex-row oddWidth" role="columnheader">No</div>';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '<div class="table__body">';
                                        var btsyesno = '';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</section>';

                                        htmlInsideTabsConstructorO += '<section id="ah" class="tab-content">';
                                        htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</section>';

                                        var ahminus45 = [], ahminus4 = [], ahminus35 = [], ahminus3 = [], ahminus25 = [], ahminus2 = [], ahminus15 = [], ahminus1 = [], ahminus05 = [], ah0 = [], ahplus05 = [], ahplus1 = [], ahplus15 = [], ahplus2 = [], ahplus25 = [], ahplus3 = [], ahplus35 = [], ahplus4 = [], ahplus45 = [], ou05 = [], ou1 = [], ou15 = [], ou2 = [], ou25 = [], ou3 = [], ou35 = [], ou4 = [], ou45 = [], ou5 = [], ou55 = [];

                                        var asianHandicapArray = {
                                            'ah-4.5' : ahminus45 = [],
                                            'ah-4' : ahminus4 = [],
                                            'ah-3.5' : ahminus35 = [],
                                            'ah-3' : ahminus3 = [],
                                            'ah-2.5' : ahminus25 = [],
                                            'ah-2' : ahminus2 = [],
                                            'ah-1.5' : ahminus15 = [],
                                            'ah-1' : ahminus1 = [],
                                            'ah-0.5' : ahminus05 = [],
                                            'ah-0' : ah0 = [],
                                            'ah+0.5' : ahplus05 = [],
                                            'ah+1' : ahplus1 = [],
                                            'ah+1.5' : ahplus15 = [],
                                            'ah+2' : ahplus2 = [],
                                            'ah+2.5' : ahplus25 = [],
                                            'ah+3' : ahplus3 = [],
                                            'ah+3.5' : ahplus35 = [],
                                            'ah+4' : ahplus4 = [],
                                            'ah+4.5' : ahplus45 = [],
                                        };

                                        var overUnderArray = {
                                            '0.5' : ou05 = [],
                                            '1' : ou1 = [],
                                            '1.5' : ou15 = [],
                                            '2' : ou2 = [],
                                            '2.5' : ou25 = [],
                                            '3' : ou3 = [],
                                            '3.5' : ou35 = [],
                                            '4' : ou4 = [],
                                            '4.5' : ou45 = [],
                                            '5' : ou5 = [],
                                            '5.5' : ou55 = [],
                                        };

                                        $.each(res, function(key, value) {

                                            if(value['odd_1'] !== '' || value['odd_x'] !== '' || value['odd_2'] !== '') {
                                                onextwo += '<div class="flex-table row" role="rowgroup">';
                                                onextwo += '<div class="flex-row bookmakers" role="cell">' + ((typeof value.odd_bookmakers != 'undefined') ? value.odd_bookmakers : '' ) + '</div>';
                                                onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_1 != 'undefined') ? value.odd_1 : '' ) + '</div>';
                                                onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_x != 'undefined') ? value.odd_x : '' ) + '</div>';
                                                onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_2 != 'undefined') ? value.odd_2 : '' ) + '</div>';
                                                onextwo += '</div>';
                                            }

                                            if(value['bts_no'] !== '' || value['bts_yes'] !== '') {
                                                btsyesno += '<div class="flex-table row" role="rowgroup">';
                                                btsyesno += '<div class="flex-row bookmakers" role="cell">' + ((typeof value.odd_bookmakers != 'undefined') ? value.odd_bookmakers : '' ) + '</div>';
                                                btsyesno += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.bts_yes != 'undefined') ? value.bts_yes : '' ) + '</div>';
                                                btsyesno += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.bts_no != 'undefined') ? value.bts_no : '' ) + '</div>';
                                                btsyesno += '</div>';
                                            }

                                            $.each(asianHandicapArray, function(key, values) {
                                                if((typeof value[key + '_1'] !== 'undefined' && value[key + '_1'] !== '') || (typeof value[key + '_2'] !== 'undefined' && value[key + '_2'] !== '')){
                                                    whatToPush(values, value.odd_bookmakers, value[key + '_1'], value[key + '_2']);
                                                }
                                            });

                                            $.each(overUnderArray, function(key, values) {
                                                if((typeof value['o+' + key] !== 'undefined' && value['o+' + key] !== '') || (typeof value['u+' + key] !== 'undefined' && value['u+' + key] !== '')){
                                                    whatToPush(values, value.odd_bookmakers, value['o+' + key], value['u+' + key]);
                                                }
                                            });

                                        });

                                        var asianHandicapData = {
                                            "Asian handicap -4.5" : ahminus45,
                                            "Asian handicap -4" : ahminus4,
                                            "Asian handicap -3.5" : ahminus35,
                                            "Asian handicap -3" : ahminus3,
                                            "Asian handicap -2.5" : ahminus25,
                                            "Asian handicap -2" : ahminus2,
                                            "Asian handicap -1.5" : ahminus15,
                                            "Asian handicap -1" : ahminus1,
                                            "Asian handicap -0.5" : ahminus05,
                                            "Asian handicap 0" : ah0,
                                            "Asian handicap +0.5" : ahplus05,
                                            "Asian handicap +1" : ahplus1,
                                            "Asian handicap +1.5" : ahplus15,
                                            "Asian handicap +2" : ahplus2,
                                            "Asian handicap +2.5" : ahplus25,
                                            "Asian handicap +3" : ahplus3,
                                            "Asian handicap +3.5" : ahplus35,
                                            "Asian handicap +4" : ahplus4,
                                            "Asian handicap +4.5" : ahplus45
                                        };

                                        var allHandicaps = '';

                                        $.each(asianHandicapData, function(key, value) {
                                            if(value != ''){
                                                allHandicaps += '<div class="flex-table header" role="rowgroup">';
                                                allHandicaps += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                allHandicaps += '<div title="Home" class="flex-row oddWidth" role="columnheader">Home</div>';
                                                allHandicaps += '<div title="Away" class="flex-row oddWidth" role="columnheader">Away</div>';
                                                allHandicaps += '</div>';
                                                allHandicaps += '<div class="table__body">';
                                                $.each(value, function(keys, values) {
                                                    allHandicaps += '<div class="flex-table row" role="rowgroup">';
                                                    allHandicaps += '<div class="flex-row bookmakers" role="cell">' + values.bookmaker + '</div>';
                                                    allHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.one + '</div>';
                                                    allHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.two + '</div>';
                                                    allHandicaps += '</div>';
                                                });
                                                allHandicaps += '</div>';
                                            }
                                        });

                                        var ouData = {
                                            "Over/Under +0.5" : ou05,
                                            "Over/Under +1" : ou1,
                                            "Over/Under +1.5" : ou15,
                                            "Over/Under +2" : ou2,
                                            "Over/Under +2.5" : ou25,
                                            "Over/Under +3" : ou3,
                                            "Over/Under +3.5" : ou35,
                                            "Over/Under +4" : ou4,
                                            "Over/Under +4.5" : ou45,
                                            "Over/Under +5" : ou5,
                                            "Over/Under +5.5" : ou55
                                        };

                                        var allou = '';

                                        $.each(ouData, function(key, value) {
                                            if(value != ''){
                                                allou += '<div class="flex-table header" role="rowgroup">';
                                                allou += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                allou += '<div title="Over" class="flex-row oddWidth" role="columnheader">Over</div>';
                                                allou += '<div title="Under" class="flex-row oddWidth" role="columnheader">Under</div>';
                                                allou += '</div>';
                                                allou += '<div class="table__body">';
                                                $.each(value, function(keys, values) {
                                                    allou += '<div class="flex-table row" role="rowgroup">';
                                                    allou += '<div class="flex-row bookmakers" role="cell">' + values.bookmaker + '</div>';
                                                    allou += '<div class="flex-row oddWidth" role="cell">' + values.one + '</div>';
                                                    allou += '<div class="flex-row oddWidth" role="cell">' + values.two + '</div>';
                                                    allou += '</div>';
                                                });
                                                allou += '</div>';
                                            }
                                        });

                                        htmlInsideTabsConstructorO += '</div>';
                                        $('#matchOdds .tab-container').append(htmlInsideTabsConstructorO);
                                        $('#matchOdds .nav-tab-wrapper').prepend(htmlConstructorO);

                                        if(onextwo.length > 0){
                                            $('#1x2 .tablele-container .table__body').append(onextwo);
                                        } else {
                                            $('#1x2 .tablele-container .table__body').append('<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>');
                                        }

                                        if(btsyesno.length > 0){
                                            $('#bts .tablele-container .table__body').append(btsyesno);
                                        } else {
                                            $('#bts .tablele-container .table__body').append('<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>');
                                        }

                                        if(allHandicaps.length > 0){
                                            $('#ah .tablele-container').append(allHandicaps);
                                        } else {
                                            $('#ah .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Asian handicap" class="flex-row bookmakers" role="columnheader">Asian handicap</div><div title="1" class="flex-row oddWidth" role="columnheader">1</div><div title="2" class="flex-row oddWidth" role="columnheader">2</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                        }

                                        if(allou.length > 0){
                                            $('#ou .tablele-container').append(allou);
                                        } else {
                                            $('#ou .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Over/Under" class="flex-row bookmakers" role="columnheader">Over/Under</div><div title="Over" class="flex-row oddWidth" role="columnheader">Over</div><div title="Under" class="flex-row oddWidth" role="columnheader">Under</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                        }

                                        // Switching tabs on click
                                        $('#matchOdds .nav-tab').unbind('click').on('click', function(e) {
                                            e.preventDefault();
                                            //Toggle tab link
                                            $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                            //Toggle target tab
                                            $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                        });
                                    } else {
                                        $('#matchOdds .tab-container').addClass('lineForNoData').prepend('<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>');
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Prediction section
                                htmlConstructor += '<section id="matchPredictions" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';

                                // Send server request for Standings
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        action: 'get_predictions',
                                        Widgetkey: Widgetkey,
                                        from: sessionStorage.getItem('fixturesDate'),
                                        to: sessionStorage.getItem('fixturesDate'),
                                        match_id: res[0].match_id
                                    },
                                    dataType: 'json'
                                }).done(function(res) {

                                    // If server send results hide loading
                                    $('.loading').hide();

                                    if(!res.error){

                                        $('.d-none-tab-prediction').removeClass('d-none-tab-prediction');

                                        var htmlInsideTabsConstructorP = '<div class="nav-tab-wrapper">';
                                        var htmlConstructorO = '<a href="#p1x2" class="standing-h2 nav-tab nav-tab-active">1x2</a>';
                                        htmlConstructorO += '<a href="#pdc" class="standing-h2 nav-tab">Double Chance</a>';
                                        htmlConstructorO += '<a href="#pah" class="standing-h2 nav-tab">Asian Handicap</a>';
                                        htmlConstructorO += '<a href="#pou" class="standing-h2 nav-tab">O/U</a>';
                                        htmlConstructorO += '<a href="#pbts" class="standing-h2 nav-tab">BTS</a>';

                                        htmlInsideTabsConstructorP += '<section id="p1x2" class="tab-content active">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                        htmlInsideTabsConstructorP += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                        htmlInsideTabsConstructorP += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                        htmlInsideTabsConstructorP += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '<div class="table__body">';
                                        if(res[0]['prob_HW'] !== '' || res[0]['prob_D'] !== '' || res[0]['prob_AW'] !== '') {
                                            htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_HW != 'undefined') ? res[0].prob_HW : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_D != 'undefined') ? res[0].prob_D : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_AW != 'undefined') ? res[0].prob_AW : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                        } else {
                                            htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                        }
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '<section id="pdc" class="tab-content">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                        htmlInsideTabsConstructorP += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                        htmlInsideTabsConstructorP += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                        htmlInsideTabsConstructorP += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '<div class="table__body">';
                                        if(res[0]['prob_HW_D'] !== '' || res[0]['prob_HW_AW'] !== '' || res[0]['prob_AW_D'] !== '') {
                                            htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_HW_D != 'undefined') ? res[0].prob_HW_D : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_HW_AW != 'undefined') ? res[0].prob_HW_AW : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_AW_D != 'undefined') ? res[0].prob_AW_D : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                        } else {
                                            htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                        }
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '<section id="pah" class="tab-content">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';

                                        var pasianHandicapData = {
                                            "Asian handicap -4.5" : [{
                                                home : res[0]['prob_ah_h_-45'],
                                                away : res[0]['prob_ah_a_-45']
                                            }],
                                            "Asian handicap -3.5" : [{
                                                home : res[0]['prob_ah_h_-35'],
                                                away : res[0]['prob_ah_a_-35']
                                            }],
                                            "Asian handicap -2.5" : [{
                                                home : res[0]['prob_ah_h_-25'],
                                                away : res[0]['prob_ah_a_-25']
                                            }],
                                            "Asian handicap -1.5" : [{
                                                home : res[0]['prob_ah_h_-15'],
                                                away : res[0]['prob_ah_a_-15']
                                            }],
                                            "Asian handicap -0.5" : [{
                                                home : res[0]['prob_ah_h_-05'],
                                                away : res[0]['prob_ah_a_-05']
                                            }],
                                            "Asian handicap +0.5" : [{
                                                home : res[0]['prob_ah_h_05'],
                                                away : res[0]['prob_ah_a_05']
                                            }],
                                            "Asian handicap +1.5" : [{
                                                home : res[0]['prob_ah_h_15'],
                                                away : res[0]['prob_ah_a_15']
                                            }],
                                            "Asian handicap +2.5" : [{
                                                home : res[0]['prob_ah_h_25'],
                                                away : res[0]['prob_ah_a_25']
                                            }],
                                            "Asian handicap +3.5" : [{
                                                home : res[0]['prob_ah_h_35'],
                                                away : res[0]['prob_ah_a_35']
                                            }],
                                            "Asian handicap +4.5" : [{
                                                home : res[0]['prob_ah_h_45'],
                                                away : res[0]['prob_ah_a_45']
                                            }]
                                        };

                                        var pallHandicaps = '';

                                        $.each(pasianHandicapData, function(key, value) {
                                            if(value != ''){
                                                pallHandicaps += '<div class="flex-table header" role="rowgroup">';
                                                pallHandicaps += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                pallHandicaps += '<div title="Home" class="flex-row oddWidth" role="columnheader">Home</div>';
                                                pallHandicaps += '<div title="Away" class="flex-row oddWidth" role="columnheader">Away</div>';
                                                pallHandicaps += '</div>';
                                                pallHandicaps += '<div class="table__body">';
                                                $.each(value, function(keys, values) {
                                                    pallHandicaps += '<div class="flex-table row" role="rowgroup">';
                                                    pallHandicaps += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                    pallHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.home + '</div>';
                                                    pallHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.away + '</div>';
                                                    pallHandicaps += '</div>';
                                                });
                                                pallHandicaps += '</div>';
                                            }
                                        });

                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '<section id="pou" class="tab-content">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';

                                        var pouData = {
                                            "Over/Under" : [{
                                                over : res[0]['prob_O'],
                                                under : res[0]['prob_U']
                                            }],
                                            "Over/Under +1" : [{
                                                over : res[0]['prob_O_1'],
                                                under : res[0]['prob_U_1']
                                            }],
                                            "Over/Under +3" : [{
                                                over : res[0]['prob_O_3'],
                                                under : res[0]['prob_U_3']
                                            }]
                                        };

                                        var pallou = '';

                                        $.each(pouData, function(key, value) {
                                            if(value != ''){
                                                pallou += '<div class="flex-table header" role="rowgroup">';
                                                pallou += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                pallou += '<div title="Over" class="flex-row oddWidth" role="columnheader">Over</div>';
                                                pallou += '<div title="Under" class="flex-row oddWidth" role="columnheader">Under</div>';
                                                pallou += '</div>';
                                                pallou += '<div class="table__body">';
                                                $.each(value, function(keys, values) {
                                                    pallou += '<div class="flex-table row" role="rowgroup">';
                                                    pallou += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                    pallou += '<div class="flex-row oddWidth" role="cell">' + values.over + '</div>';
                                                    pallou += '<div class="flex-row oddWidth" role="cell">' + values.under + '</div>';
                                                    pallou += '</div>';
                                                });
                                                pallou += '</div>';
                                            }
                                        });

                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '<section id="pbts" class="tab-content">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                        htmlInsideTabsConstructorP += '<div title="Yes" class="flex-row oddWidth" role="columnheader">Yes</div>';
                                        htmlInsideTabsConstructorP += '<div title="No" class="flex-row oddWidth" role="columnheader">No</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '<div class="table__body">';
                                        if(res[0]['prob_bts'] !== '' || res[0]['prob_ots'] !== '') {
                                            htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_bts != 'undefined') ? res[0].prob_bts : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_ots != 'undefined') ? res[0].prob_ots : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                        } else {
                                            htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                        }
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '</div>';
                                        $('#matchPredictions .tab-container').append(htmlInsideTabsConstructorP);
                                        $('#matchPredictions .nav-tab-wrapper').prepend(htmlConstructorO);

                                        if(pallHandicaps.length > 0){
                                            $('#pah .tablele-container').append(pallHandicaps);
                                        } else {
                                            $('#pah .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Asian handicap" class="flex-row bookmakers" role="columnheader">Asian handicap</div><div title="1" class="flex-row oddWidth" role="columnheader">1</div><div title="2" class="flex-row oddWidth" role="columnheader">2</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                        }

                                        if(pallou.length > 0){
                                            $('#pou .tablele-container').append(pallou);
                                        } else {
                                            $('#pou .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Over/Under" class="flex-row bookmakers" role="columnheader">Over/Under</div><div title="Over" class="flex-row oddWidth" role="columnheader">Over</div><div title="Under" class="flex-row oddWidth" role="columnheader">Under</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                        }

                                        // Switching tabs on click
                                        $('#matchPredictions .nav-tab').unbind('click').on('click', function(e) {
                                            e.preventDefault();
                                            //Toggle tab link
                                            $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                            //Toggle target tab
                                            $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                        });
                                    } else {
                                        $('#matchPredictions .tab-container').addClass('lineForNoData').prepend('<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>');
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                $('#matchResultsContentTable').append(htmlConstructor);

                                // Remove Fixture Date from local storage
                                sessionStorage.removeItem('fixturesDate');

                                // Added close button in HTML
                                $('#matchResultsContentTable').append('<p class="closeWindow">close window</p>');
                                // Added click function to close window
                                $('.closeWindow').click(function() {
                                    window.close();
                                });

                                // Switching tabs on click
                                $('.nav-tab').unbind('click').on('click', function(e) {
                                    e.preventDefault();
                                    //Toggle tab link
                                    $(this).addClass('nav-tab-active').parent().parent().siblings().find('a').removeClass('nav-tab-active');
                                    //Toggle target tab
                                    $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                });

                                // Added click function to header close window
                                $('.backButton').click(function() {
                                    window.close();
                                });

                            } else {

                                // If server send details for match we populate HTML
                                // Set key for Home Team
                                var hometeamKeyMain = res[0].match_hometeam_id;
                                // Set key for Away Team
                                var awayteamKeyMain = res[0].match_awayteam_id;

                                // Hide loading sreen
                                $('.loading').hide();

                                // Details for match
                                var otherMatchDetails = '<div class="otherMatchDetails">';
                                otherMatchDetails += '<div class="otherMatchDetailsInfos">';
                                otherMatchDetails += '<div class="leagueImg" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.apifootball.com/badges/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div>';
                                otherMatchDetails += '<div>' + res[0].country_name + ': ' + res[0].league_name + '</div>';
                                otherMatchDetails += '</div>';
                                var formattedDate = new Date(res[0].match_date);
                                var d = formattedDate.getDate();
                                var m = formattedDate.getMonth() + 1;
                                var y = formattedDate.getFullYear();
                                otherMatchDetails += '<div>' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + ' ' + res[0].match_time + '</div>';
                                otherMatchDetails += '</div>';
                                $(matchResultsLocation).prepend(otherMatchDetails);
                                // Added click function to header close window
                                $('.backButton').click(function() {
                                    window.close();
                                });
                                // Add hook in HTML for Match Results Tab content infos
                                $(matchResultsLocation).append('<section id="matchResultsContentTable"></section>');
                                var htmlConstructor = '<div id="matchResultsDates">';
                                htmlConstructor += '<div id="matchResultsDatesTitle">';
                                if (!res.error) {
                                    htmlConstructor += '<div class="match_hometeam_name">';
                                    htmlConstructor += '<div class="match_hometeam_name_part">';
                                    htmlConstructor += '<div class="match_hometeam_name_part_img">';
                                    htmlConstructor += '<div class="image-style-for-flag" style="background-image: url(\'' + (((res[0].team_home_badge == '') || (res[0].team_home_badge == 'null') || (res[0].team_home_badge == null)) ? 'img/no-img.png' : res[0].team_home_badge) + '\');"></div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="match_hometeam_name_part_name">';
                                    htmlConstructor += '<div>' + res[0].match_hometeam_name + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_info">';
                                    htmlConstructor += '<div class="event_info_score">';
                                    htmlConstructor += '<div>' + res[0].match_hometeam_score + ' - ' + res[0].match_awayteam_score + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_info_status">';
                                    var removeNumericAdd = res[0].match_status.replace('+', '');
                                    htmlConstructor += '<div class="' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? 'matchIsLive' : '') + '"> ' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? res[0].match_status + ((removeNumericAdd == 'Half Time') ? '' : '\'') : res[0].match_status) + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="match_awayteam_name_part">';
                                    htmlConstructor += '<div class="match_awayteam_name_part_img">';
                                    htmlConstructor += '<div class="image-style-for-flag" style="background-image: url(\'' + (((res[0].team_away_badge == '') || (res[0].team_away_badge == 'null') || (res[0].team_away_badge == null)) ? 'img/no-img.png' : res[0].team_away_badge) + '\');"></div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="match_awayteam_name_part_name">';
                                    htmlConstructor += '<div>' + res[0].match_awayteam_name + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="nav-tab-wrapper-all">';
                                htmlConstructor += '<ul class="nav-tab-wrapper-all-container">';
                                htmlConstructor += '<li><span><a href="#matchSummary" class="matchResults-h2 nav-tab nav-tab-active">Match Summary</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchStatistics" class="matchResults-h2 nav-tab">Statistics</a></span></li>';
                                htmlConstructor += '<li><span><a href="#lineups" class="matchResults-h2 nav-tab">Lineups</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchh2h" class="matchResults-h2 nav-tab">H2H</a></span></li>';
                                // If match_round: contains "finals" then hide Standings Tab
                                htmlConstructor += ((res[0].match_round.indexOf('finals') != -1) ? '' : '<li><span><a href="#matchStandings" class="matchResults-h2 nav-tab">Standings</a></span></li>');
                                htmlConstructor += '<li><span><a href="#matchTopScorers" class="matchResults-h2 nav-tab">Top Scorers</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchOdds" class="matchResults-h2 nav-tab d-none-tab-odds">Odds</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchPredictions" class="matchResults-h2 nav-tab d-none-tab-prediction">Predictions</a></span></li>';
                                htmlConstructor += '</ul>';
                                htmlConstructor += '</div>';

                                // Populate Match Summary section
                                htmlConstructor += '<section id="matchSummary" class="tab-content active">';
                                htmlConstructor += '<div class="tab-container">';

                                var substitutions_home_array = [res[0].substitutions.home];
                                substitutions_home_array[0].forEach(function (whatTeam) {
                                    whatTeam.whatTeam = 'home_team';
                                });

                                var substitutions_away_array = [res[0].substitutions.away];
                                substitutions_away_array[0].forEach(function (whatTeam) {
                                    whatTeam.whatTeam = 'away_team';
                                });

                                var multipleArrays = [res[0].goalscorer, substitutions_home_array[0], substitutions_away_array[0], res[0].cards];
                                var flatArray = [].concat.apply([], multipleArrays);
                                var nrArray = flatArray;
                                nrArray.sort(naturalCompare);
                                if (nrArray.length == 0) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                } else {
                                    var htmlCC = 0;
                                    var htmlCC2 = 0;
                                    $.each(nrArray, function(key, value) {
                                        if ((value.time < 46) || (value.time.indexOf("45+") >= 0)) {
                                            if (htmlCC == 0) {
                                                htmlConstructor += '<div class="lineupsTitle">1st Half</div>';
                                            }
                                            if ((value.home_scorer || value.away_scorer) && value.score !== "substitution") {
                                                htmlConstructor += '<div class="' + ((value.home_scorer) ? 'action_home' : 'action_away') + '">' + ((value.home_scorer) ? value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>' + value.home_scorer : '') + ' ' + ((value.away_scorer) ? value.time + '\'' + '<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>' + value.away_scorer : '') + '</div>';
                                            }
                                            if ((value.home_scorer == '') && (value.away_scorer == '')) {
                                                htmlConstructor += '<div class="action_unknown">' + (value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>') + '</div>';
                                            }
                                            if (value.home_fault || value.away_fault) {
                                                htmlConstructor += '<div class="' + ((value.home_fault) ? 'action_home' : 'action_away') + '">' + ((value.home_fault) ? value.time + '\' ' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + ' ' + value.home_fault : '') + ' ' + ((value.away_fault) ? value.time + '\'' + ' ' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + ' ' + value.away_fault : '') + '</div>';
                                            }
                                            if ((value.home_fault == '') && (value.away_fault == '')) {
                                                htmlConstructor += '<div class="action_unknown">' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + '</div>';
                                            }
                                            if(value.substitution) {
                                                htmlConstructor += '<div class="' + ((value.whatTeam == 'home_team') ? 'action_home' : 'action_away') + '">' + ((value.whatTeam == 'home_team') ? value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/match_red.png);"></div>' + value.substitution + '<div class="imgMatchSummary" style="background-image: url(img/match_green.png);"></div>' : '') + ' ' + ((value.whatTeam == 'away_team') ? value.time + '\'' + '<div class="imgMatchSummary" style="background-image: url(img/match_green.png);"></div>' + value.substitution + '<div class="imgMatchSummary" style="background-image: url(img/match_red.png);"></div>' : '') + '</div>';
                                            }
                                            htmlCC++;
                                        } else {
                                            if (htmlCC == 0) {
                                                htmlConstructor += '<div class="lineupsTitle">1st Half</div>';
                                                htmlConstructor += '<div class="noHalfEvent">-</div>';
                                            }
                                            htmlCC++
                                        }
                                        if ((value.time > 45) || (value.time.indexOf("90+") >= 0)) {
                                            if (htmlCC2 == 0) {
                                                htmlConstructor += '<div class="lineupsTitle">2nd Half</div>';
                                            }
                                            if ((value.home_scorer || value.away_scorer) && value.score !== "substitution") {
                                                htmlConstructor += '<div class="' + ((value.home_scorer) ? 'action_home' : 'action_away') + '">' + ((value.home_scorer) ? value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>' + value.home_scorer : '') + ' ' + ((value.away_scorer) ? value.time + '\'' + '<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>' + value.away_scorer : '') + '</div>';
                                            }
                                            if ((value.home_scorer == '') && (value.away_scorer == '')) {
                                                htmlConstructor += '<div class="action_unknown">' + (value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>') + '</div>';
                                            }
                                            if (value.home_fault || value.away_fault) {
                                                htmlConstructor += '<div class="' + ((value.home_fault) ? 'action_home' : 'action_away') + '">' + ((value.home_fault) ? value.time + '\' ' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + ' ' + value.home_fault : '') + ' ' + ((value.away_fault) ? value.time + '\'' + ' ' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + ' ' + value.away_fault : '') + '</div>';
                                            }
                                            if(value.substitution) {
                                                htmlConstructor += '<div class="' + ((value.whatTeam == 'home_team') ? 'action_home' : 'action_away') + '">' + ((value.whatTeam == 'home_team') ? value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/match_red.png);"></div>' + value.substitution + '<div class="imgMatchSummary" style="background-image: url(img/match_green.png);"></div>' : '') + ' ' + ((value.whatTeam == 'away_team') ? value.time + '\'' + '<div class="imgMatchSummary" style="background-image: url(img/match_green.png);"></div>' + value.substitution + '<div class="imgMatchSummary" style="background-image: url(img/match_red.png);"></div>' : '') + '</div>';
                                            }
                                            htmlCC2++;
                                        }
                                    });
                                }
                                htmlConstructor += '</div>';
                                if ((res[0].match_referee != '') || (res[0].match_stadium != '')) {
                                    htmlConstructor += '<div>';
                                    htmlConstructor += '<div class="matchExtraInfosTitle">Match Information</div>';
                                    htmlConstructor += '<div class="matchExtraInfos">' + ((res[0].match_referee != '') ? 'Referee: ' + res[0].match_referee : '') + ' ' + ((res[0].match_stadium != '') ? 'Stadium: ' + res[0].match_stadium : '') + '</div>';
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</section>';

                                // Populate Match Statistics section
                                htmlConstructor += '<section id="matchStatistics" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                if (res[0].statistics.length == 0) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                } else {
                                    $.each(res[0].statistics, function(key, value) {
                                        if (JSON.stringify(value).indexOf('%') > -1) {
                                            htmlConstructor += '<div class="matchStatisticsRow">';
                                            htmlConstructor += '<div class="matchStatisticsRowText">';
                                            htmlConstructor += '<div class="matchStatisticsRowHome">' + value.home + '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowType">' + value.type + '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowAway">' + value.away + '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowBar">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarHome">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarHomeBg">';
                                            htmlConstructor += '<div class="matchStatisticsRowHomeLine" style="width:' + value.home + ';background-color:' + ((value.home > value.away) ? 'red' : '') + ';"></div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowBarAway">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarAwayBg">';
                                            htmlConstructor += '<div class="matchStatisticsRowAwayLine" style="width:' + value.away + ';background-color:' + ((value.away > value.home) ? 'red' : '') + ';"></div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                        } else {
                                            var x = parseInt(value.home) + parseInt(value.away);
                                            var xx = 100 / x;
                                            var tt = xx * value.home;
                                            var vv = xx * value.away;
                                            htmlConstructor += '<div class="matchStatisticsRow">';
                                            htmlConstructor += '<div class="matchStatisticsRowText">';
                                            htmlConstructor += '<div class="matchStatisticsRowHome">' + value.home + '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowType">' + value.type + '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowAway">' + value.away + '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowBar">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarHome">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarHomeBg">';
                                            htmlConstructor += '<div class="matchStatisticsRowHomeLine" style="width:' + tt + '%;background-color:' + ((tt > vv) ? 'red' : '') + ';"></div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowBarAway">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarAwayBg">';
                                            htmlConstructor += '<div class="matchStatisticsRowAwayLine" style="width:' + vv + '%;background-color:' + ((vv > tt) ? 'red' : '') + ';"></div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                        }
                                    });
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Lineups section
                                htmlConstructor += '<section id="lineups" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                htmlConstructor += '<div class="lineupsTitle">Starting Lineups</div>';
                                htmlConstructor += '<div class="lineupsContainer">';
                                if ((res[0].lineup.home.starting_lineups.length == 0) || (res[0].lineup.away.starting_lineups.length == 0)) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px;">Sorry, no data!</p>';
                                } else {
                                    htmlConstructor += '<div class="col-left">';
                                    $.each(res[0].lineup.home.starting_lineups, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerHome"><div class="lineupsNb">' + ((value.lineup_number == '-1' ? ' ' : value.lineup_number)) + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res[0].team_home_badge + '\');"></div> <div class="lineupsPlayer">' + value.lineup_player + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="col-right">';
                                    $.each(res[0].lineup.away.starting_lineups, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerAway"><div class="lineupsPlayer">' + value.lineup_player + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res[0].team_away_badge + '\');"></div> <div class="lineupsNb">' + ((value.lineup_number == '-1' ? ' ' : value.lineup_number)) + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';

                                // Populate Match Substitutes section
                                htmlConstructor += '<div class="lineupsTitle">Substitutes</div>';
                                htmlConstructor += '<div class="lineupsContainer">';
                                if ((res[0].lineup.home.substitutes.length == 0) || (res[0].lineup.away.substitutes.length == 0)) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px;">Sorry, no data!</p>';
                                } else {
                                    htmlConstructor += '<div class="col-left">';
                                    $.each(res[0].lineup.home.substitutes, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerHome"><div class="lineupsNb">' + ((value.lineup_number == '-1' ? ' ' : value.lineup_number)) + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res[0].team_home_badge + '\');"></div> <div class="lineupsPlayer">' + value.lineup_player + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="col-right">';
                                    $.each(res[0].lineup.away.substitutes, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerAway"><div class="lineupsPlayer">' + value.lineup_player + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res[0].team_away_badge + '\');"></div> <div class="lineupsNb">' + ((value.lineup_number == '-1' ? ' ' : value.lineup_number)) + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="lineupsTitle">Coaches</div>';
                                htmlConstructor += '<div class="lineupsContainer">';
                                if ((res[0].lineup.home.coach.length == 0) || (res[0].lineup.away.coach.length == 0)) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px;">Sorry, no data!</p>';
                                } else {
                                    htmlConstructor += '<div class="col-left">';
                                    $.each(res[0].lineup.home.coach, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerHome"><div class="lineupsNb"></div> <div class="lineupsFlag" style="background-image: url(\'' + res[0].team_home_badge + '\');"></div> <div class="lineupsPlayer">' + value.lineup_player + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="col-right">';
                                    $.each(res[0].lineup.away.coach, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerAway"><div class="lineupsPlayer">' + value.lineup_player + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res[0].team_away_badge + '\');"></div> <div class="lineupsNb"></div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match H2H (Head to head) section
                                htmlConstructor += '<section id="matchh2h" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                var htmlInsideTabsConstructorh2h = '';
                                // Send server request for H2H
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        action: 'get_H2H',
                                        Widgetkey: Widgetkey,
                                        firstTeam: res[0].match_hometeam_name,
                                        secondTeam: res[0].match_awayteam_name,
                                        timezone:getTimeZone()
                                    },
                                    dataType: 'json'
                                }).done(function(res2) {
                                    // If server send results we populate HTML with sended information
                                    if(!res2.error){
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Last matches: ' + res[0].match_hometeam_name + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.firstTeam_lastResults, function(key, value) {
                                            var event_final_result_class = value.match_hometeam_score + ' - ' + value.match_awayteam_score;
                                            var event_final_result_class_away = value.match_awayteam_score;
                                            var event_final_result_class_home = value.match_hometeam_score;
                                            var formattedDate = new Date(value.match_date);
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.apifootball.com/badges/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width ' + (((res[0].match_hometeam_name == value.match_hometeam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res[0].match_hometeam_name == value.match_awayteam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_awayteam_name + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res[0].match_hometeam_name == value.match_hometeam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width ' + (((res[0].match_hometeam_name == value.match_awayteam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_awayteam_name + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res[0].match_hometeam_name == value.match_hometeam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res[0].match_hometeam_name == value.match_awayteam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_awayteam_name + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Last matches: ' + res[0].match_awayteam_name + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.secondTeam_lastResults, function(key, value) {
                                            var event_final_result_class = value.match_hometeam_score + ' - ' + value.match_awayteam_score;
                                            var event_final_result_class_away = value.match_awayteam_score;
                                            var event_final_result_class_home = value.match_hometeam_score;
                                            var formattedDate = new Date(value.match_date);
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.apifootball.com/badges/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width ' + (((res[0].match_awayteam_name == value.match_hometeam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res[0].match_awayteam_name == value.match_awayteam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_awayteam_name + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res[0].match_awayteam_name == value.match_hometeam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width ' + (((res[0].match_awayteam_name == value.match_awayteam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_awayteam_name + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res[0].match_awayteam_name == value.match_hometeam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res[0].match_awayteam_name == value.match_awayteam_name)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.match_awayteam_name + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Head-to-head matches: ' + res[0].match_hometeam_name + ' - ' + res[0].match_awayteam_name + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.firstTeam_VS_secondTeam, function(key, value) {
                                            var event_final_result_class = value.match_hometeam_score + ' - ' + value.match_awayteam_score;
                                            var event_final_result_class_away = value.match_awayteam_score;
                                            var event_final_result_class_home = value.match_hometeam_score;
                                            var formattedDate = new Date(value.match_date);
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.apifootball.com/badges/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width" role="cell">' + value.match_awayteam_name + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width" role="cell">' + value.match_awayteam_name + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width" role="cell">' + value.match_hometeam_name + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width" role="cell">' + value.match_awayteam_name + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        $('#matchh2h .tab-container').append(htmlInsideTabsConstructorh2h);
                                    } else {
                                        htmlInsideTabsConstructorh2h += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                        $('#matchh2h .tab-container').append(htmlInsideTabsConstructorh2h);
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Top Scorers section
                                htmlConstructor += '<section id="matchTopScorers" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                var htmlInsideTabsConstructorTS = '';
                                // Send server request for Topscorers
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        action: 'get_topscorers',
                                        Widgetkey: Widgetkey,
                                        league_id: res[0].league_id
                                    },
                                    dataType: 'json'
                                }).done(function(res) {
                                    // If server send results we populate HTML with sended information
                                    if (!res.error) {
                                        htmlInsideTabsConstructorTS += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorTS += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorTS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Player" class="flex-row players" role="columnheader">Player</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Team" class="flex-row playerTeam fix-width" role="columnheader">Team</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                        htmlInsideTabsConstructorTS += '</div>';
                                        htmlInsideTabsConstructorTS += '<div class="table__body">';
                                        $.each(res, function(key, value) {
                                            htmlInsideTabsConstructorTS += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row first fix-width" role="cell">' + value.player_place + '.</div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row players" role="cell"><a href="#">' + value.player_name + '</a></div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row playerTeam" role="cell"><a href="#">' + value.team_name + '</a></div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row goals fix-width" role="cell">' + value.goals + '</div>';
                                            htmlInsideTabsConstructorTS += '</div>';
                                        });
                                        htmlInsideTabsConstructorTS += '</div>';
                                        htmlInsideTabsConstructorTS += '</div>';
                                    } else {
                                        htmlInsideTabsConstructorTS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                    }
                                    $('#matchTopScorers .tab-container').append(htmlInsideTabsConstructorTS);
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Standings section
                                // If match_round: contains "finals" then hide Standings Tab
                                if (res[0].match_round.indexOf('finals') == -1) {

                                    htmlConstructor += '<section id="matchStandings" class="tab-content">';
                                    htmlConstructor += '<div class="tab-container">';
                                    // Send server request for Standings
                                    $.ajax({
                                        url: matchResultsDetailsAjaxURL,
                                        cache: false,
                                        data: {
                                            action: 'get_standings',
                                            Widgetkey: Widgetkey,
                                            league_id: res[0].league_id
                                        },
                                        dataType: 'json'
                                    }).done(function (res) {
                                        var newStand = {
                                            'total': [],
                                            'home': [],
                                            'away': []
                                        };
                                        var i = 0;

                                        if (!res.error) {
                                            $.each(res, function (key, value) {
                                                var ii = i++;
                                                newStand['total'][ii] = {
                                                    'country_name': value['country_name'],
                                                    'league_id': value['league_id'],
                                                    'league_name': value['league_name'],
                                                    'team_id': value['team_id'],
                                                    'team_name': value['team_name'],
                                                    'league_round': value['league_round'],
                                                    'league_position': value['overall_league_position'],
                                                    'league_payed': value['overall_league_payed'],
                                                    'league_W': value['overall_league_W'],
                                                    'league_D': value['overall_league_D'],
                                                    'league_L': value['overall_league_L'],
                                                    'league_GF': value['overall_league_GF'],
                                                    'league_GA': value['overall_league_GA'],
                                                    'league_PTS': value['overall_league_PTS'],
                                                    'promotion': value['overall_promotion']
                                                };
                                                newStand['home'][ii] = {
                                                    'country_name': value['country_name'],
                                                    'league_id': value['league_id'],
                                                    'league_name': value['league_name'],
                                                    'team_id': value['team_id'],
                                                    'team_name': value['team_name'],
                                                    'league_round': value['league_round'],
                                                    'league_position': value['home_league_position'],
                                                    'league_payed': value['home_league_payed'],
                                                    'league_W': value['home_league_W'],
                                                    'league_D': value['home_league_D'],
                                                    'league_L': value['home_league_L'],
                                                    'league_GF': value['home_league_GF'],
                                                    'league_GA': value['home_league_GA'],
                                                    'league_PTS': value['home_league_PTS']
                                                };
                                                newStand['away'][ii] = {
                                                    'country_name': value['country_name'],
                                                    'league_id': value['league_id'],
                                                    'league_name': value['league_name'],
                                                    'team_id': value['team_id'],
                                                    'team_name': value['team_name'],
                                                    'league_round': value['league_round'],
                                                    'league_position': value['away_league_position'],
                                                    'league_payed': value['away_league_payed'],
                                                    'league_W': value['away_league_W'],
                                                    'league_D': value['away_league_D'],
                                                    'league_L': value['away_league_L'],
                                                    'league_GF': value['away_league_GF'],
                                                    'league_GA': value['away_league_GA'],
                                                    'league_PTS': value['away_league_PTS']
                                                };
                                            });
                                        }
                                        // If server send results hide loading
                                        $('.loading').hide();
                                        var htmlInsideTabsConstructorS = '<div class="nav-tab-wrapper">';
                                        var firstElementInJson = 0;
                                        var htmlConstructorS = '';
                                        $.each(newStand, function (key, value) {
                                            var sorted = sortByKey(newStand[key], 'key');
                                            var sorted_array = sortByKeyAsc(sorted, "league_round");
                                            var groubedByTeam = groupBy(sorted_array, 'league_round');
                                            var leagueRoundMatchResult = '';
                                            var leagueRoundName = '';
                                            $.each(groubedByTeam, function (keyss, valuess) {
                                                $.each(valuess, function (keyssss, valuessss) {
                                                    if (valuessss.team_id == hometeamKeyMain) {
                                                        leagueRoundName = valuessss.league_round;
                                                        leagueRoundMatchResult = valuessss.league_round;
                                                    }
                                                });
                                            });
                                            var onlySelectedGroup = groubedByTeam[leagueRoundMatchResult];
                                            if (firstElementInJson == 0) {
                                                htmlConstructorS += '<a href="#' + key + '" class="standing-h2 nav-tab nav-tab-active">' + key + '</a>';
                                                htmlInsideTabsConstructorS += '<section id="' + key + '" class="tab-content active">';
                                                htmlInsideTabsConstructorS += '<div class="tablele-container">';
                                                if ($.isEmptyObject(onlySelectedGroup)) {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Team" class="flex-row teams" role="columnheader">Team</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    htmlInsideTabsConstructorS += '<div class="flex-table-error row" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                } else {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '" class="flex-row teams" role="columnheader">' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    var colorForStanding = ['colorOne', 'colorTwo', 'colorThree', 'colorFour', 'colorFive', 'colorSix', 'colorSeven', 'colorEight', 'colorNine', 'colorTen'];
                                                    var colorStringValue = -1;
                                                    var stringToCompareStandings = '';
                                                    $.each(onlySelectedGroup, function (keys, values) {
                                                        htmlInsideTabsConstructorS += '<div class="flex-table row" role="rowgroup">';
                                                        if (values.promotion) {
                                                            if (stringToCompareStandings != values.promotion) {
                                                                stringToCompareStandings = values.promotion;
                                                                colorStringValue++;
                                                                colorForStanding[colorStringValue];
                                                                htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + colorForStanding[colorStringValue] + '" title="' + values.promotion + '" role="cell">' + values.league_position + '.</div>';
                                                            } else if (stringToCompareStandings == values.promotion) {
                                                                colorForStanding[colorStringValue];
                                                                htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + colorForStanding[colorStringValue] + '" title="' + values.promotion + '" role="cell">' + values.league_position + '.</div>';
                                                            }
                                                        } else if (!values.promotion) {
                                                            colorStringValue = $(colorForStanding).length / 2;
                                                            htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + '" role="cell">' + values.league_position + '.</div>';
                                                        }
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row teams" role="cell"><a href="#" onclick="windowPreventOpening()">' + values.team_name + '</a></div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_payed + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_W + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_D + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_L + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row goals" role="cell">' + values.league_GF + ':' + values.league_GA + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_PTS + '</div>';
                                                        htmlInsideTabsConstructorS += '</div>';
                                                    });
                                                    htmlInsideTabsConstructorS += '</div>';
                                                }
                                                htmlInsideTabsConstructorS += '</div>';
                                                htmlInsideTabsConstructorS += '</section>';
                                                firstElementInJson++
                                            } else {
                                                htmlConstructorS += '<a href="#' + key + '" class="standing-h2 nav-tab">' + key + '</a>';
                                                htmlInsideTabsConstructorS += '<section id="' + key + '" class="tab-content">';
                                                htmlInsideTabsConstructorS += '<div class="tablele-container">';
                                                if ($.isEmptyObject(onlySelectedGroup)) {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Team" class="flex-row teams" role="columnheader">Team</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    htmlInsideTabsConstructorS += '<div class="flex-table-error row" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                } else {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '" class="flex-row teams" role="columnheader">' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';

                                                    var sortStandingTabs = onlySelectedGroup;
                                                    sortStandingTabs.sort(function (a, b) {
                                                        return b.league_PTS - a.league_PTS
                                                    });

                                                    var league_position_nb = 1;
                                                    $.each(sortStandingTabs, function (keys, values) {
                                                        htmlInsideTabsConstructorS += '<div class="flex-table row" role="rowgroup">';
                                                        htmlInsideTabsConstructorS += '<div class="flex-row first fix-width" role="cell">' + league_position_nb + '.</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row teams" role="cell"><a href="#" onclick="windowPreventOpening()">' + values.team_name + '</a></div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_payed + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_W + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_D + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_L + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row goals" role="cell">' + values.league_GF + ':' + values.league_GA + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_id) || (awayteamKeyMain == values.team_id)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.league_PTS + '</div>';
                                                        htmlInsideTabsConstructorS += '</div>';
                                                        league_position_nb++;
                                                    });
                                                    htmlInsideTabsConstructorS += '</div>';
                                                }
                                                htmlInsideTabsConstructorS += '</div>';
                                                htmlInsideTabsConstructorS += '</section>';
                                            }
                                        });
                                        htmlInsideTabsConstructorS += '</div>';
                                        $('#matchStandings .tab-container').append(htmlInsideTabsConstructorS);
                                        $('#matchStandings .nav-tab-wrapper').prepend(htmlConstructorS);

                                        // Switching tabs on click
                                        $('#matchStandings .nav-tab').unbind('click').on('click', function (e) {
                                            e.preventDefault();
                                            //Toggle tab link
                                            $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                            //Toggle target tab
                                            $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                        });
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</section>';
                                }

                                // Populate Match Odds section
                                htmlConstructor += '<section id="matchOdds" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';

                                // Send server request for Standings
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        action: 'get_odds',
                                        Widgetkey: Widgetkey,
                                        from: sessionStorage.getItem('fixturesDate'),
                                        to: sessionStorage.getItem('fixturesDate'),
                                        match_id: res[0].match_id
                                    },
                                    dataType: 'json'
                                }).done(function(res) {

                                    // If server send results hide loading
                                    $('.loading').hide();

                                    if(!res.error){

                                        $('.d-none-tab-odds').removeClass('d-none-tab-odds');

                                        var htmlInsideTabsConstructorO = '<div class="nav-tab-wrapper">';
                                        var htmlConstructorO = '<a href="#1x2" class="standing-h2 nav-tab nav-tab-active">1x2</a>';
                                        htmlConstructorO += '<a href="#ah" class="standing-h2 nav-tab">Asian Handicap</a>';
                                        htmlConstructorO += '<a href="#ou" class="standing-h2 nav-tab">O/U</a>';
                                        htmlConstructorO += '<a href="#bts" class="standing-h2 nav-tab">BTS</a>';

                                        htmlInsideTabsConstructorO += '<section id="1x2" class="tab-content active">';
                                        htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorO += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorO += '<div title="Bookmakers" class="flex-row bookmakers" role="columnheader">Bookmakers</div>';
                                        htmlInsideTabsConstructorO += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                        htmlInsideTabsConstructorO += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                        htmlInsideTabsConstructorO += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '<div class="table__body">';
                                        var onextwo = '';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</section>';

                                        htmlInsideTabsConstructorO += '<section id="ou" class="tab-content">';
                                        htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</section>';

                                        htmlInsideTabsConstructorO += '<section id="bts" class="tab-content">';
                                        htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorO += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorO += '<div title="Bookmakers" class="flex-row bookmakers" role="columnheader">Bookmakers</div>';
                                        htmlInsideTabsConstructorO += '<div title="Yes" class="flex-row oddWidth" role="columnheader">Yes</div>';
                                        htmlInsideTabsConstructorO += '<div title="No" class="flex-row oddWidth" role="columnheader">No</div>';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '<div class="table__body">';
                                        var btsyesno = '';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</section>';

                                        htmlInsideTabsConstructorO += '<section id="ah" class="tab-content">';
                                        htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorO += '</div>';
                                        htmlInsideTabsConstructorO += '</section>';

                                        var ahminus45 = [], ahminus4 = [], ahminus35 = [], ahminus3 = [], ahminus25 = [], ahminus2 = [], ahminus15 = [], ahminus1 = [], ahminus05 = [], ah0 = [], ahplus05 = [], ahplus1 = [], ahplus15 = [], ahplus2 = [], ahplus25 = [], ahplus3 = [], ahplus35 = [], ahplus4 = [], ahplus45 = [], ou05 = [], ou1 = [], ou15 = [], ou2 = [], ou25 = [], ou3 = [], ou35 = [], ou4 = [], ou45 = [], ou5 = [], ou55 = [];

                                        var asianHandicapArray = {
                                            'ah-4.5' : ahminus45 = [],
                                            'ah-4' : ahminus4 = [],
                                            'ah-3.5' : ahminus35 = [],
                                            'ah-3' : ahminus3 = [],
                                            'ah-2.5' : ahminus25 = [],
                                            'ah-2' : ahminus2 = [],
                                            'ah-1.5' : ahminus15 = [],
                                            'ah-1' : ahminus1 = [],
                                            'ah-0.5' : ahminus05 = [],
                                            'ah-0' : ah0 = [],
                                            'ah+0.5' : ahplus05 = [],
                                            'ah+1' : ahplus1 = [],
                                            'ah+1.5' : ahplus15 = [],
                                            'ah+2' : ahplus2 = [],
                                            'ah+2.5' : ahplus25 = [],
                                            'ah+3' : ahplus3 = [],
                                            'ah+3.5' : ahplus35 = [],
                                            'ah+4' : ahplus4 = [],
                                            'ah+4.5' : ahplus45 = [],
                                        };

                                        var overUnderArray = {
                                            '0.5' : ou05 = [],
                                            '1' : ou1 = [],
                                            '1.5' : ou15 = [],
                                            '2' : ou2 = [],
                                            '2.5' : ou25 = [],
                                            '3' : ou3 = [],
                                            '3.5' : ou35 = [],
                                            '4' : ou4 = [],
                                            '4.5' : ou45 = [],
                                            '5' : ou5 = [],
                                            '5.5' : ou55 = [],
                                        };

                                        $.each(res, function(key, value) {

                                            if(value['odd_1'] !== '' || value['odd_x'] !== '' || value['odd_2'] !== '') {
                                                onextwo += '<div class="flex-table row" role="rowgroup">';
                                                onextwo += '<div class="flex-row bookmakers" role="cell">' + ((typeof value.odd_bookmakers != 'undefined') ? value.odd_bookmakers : '' ) + '</div>';
                                                onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_1 != 'undefined') ? value.odd_1 : '' ) + '</div>';
                                                onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_x != 'undefined') ? value.odd_x : '' ) + '</div>';
                                                onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_2 != 'undefined') ? value.odd_2 : '' ) + '</div>';
                                                onextwo += '</div>';
                                            }

                                            if(value['bts_no'] !== '' || value['bts_yes'] !== '') {
                                                btsyesno += '<div class="flex-table row" role="rowgroup">';
                                                btsyesno += '<div class="flex-row bookmakers" role="cell">' + ((typeof value.odd_bookmakers != 'undefined') ? value.odd_bookmakers : '' ) + '</div>';
                                                btsyesno += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.bts_yes != 'undefined') ? value.bts_yes : '' ) + '</div>';
                                                btsyesno += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.bts_no != 'undefined') ? value.bts_no : '' ) + '</div>';
                                                btsyesno += '</div>';
                                            }

                                            $.each(asianHandicapArray, function(key, values) {
                                                if((typeof value[key + '_1'] !== 'undefined' && value[key + '_1'] !== '') || (typeof value[key + '_2'] !== 'undefined' && value[key + '_2'] !== '')){
                                                    whatToPush(values, value.odd_bookmakers, value[key + '_1'], value[key + '_2']);
                                                }
                                            });

                                            $.each(overUnderArray, function(key, values) {
                                                if((typeof value['o+' + key] !== 'undefined' && value['o+' + key] !== '') || (typeof value['u+' + key] !== 'undefined' && value['u+' + key] !== '')){
                                                    whatToPush(values, value.odd_bookmakers, value['o+' + key], value['u+' + key]);
                                                }
                                            });

                                        });

                                        var asianHandicapData = {
                                            "Asian handicap -4.5" : ahminus45,
                                            "Asian handicap -4" : ahminus4,
                                            "Asian handicap -3.5" : ahminus35,
                                            "Asian handicap -3" : ahminus3,
                                            "Asian handicap -2.5" : ahminus25,
                                            "Asian handicap -2" : ahminus2,
                                            "Asian handicap -1.5" : ahminus15,
                                            "Asian handicap -1" : ahminus1,
                                            "Asian handicap -0.5" : ahminus05,
                                            "Asian handicap 0" : ah0,
                                            "Asian handicap +0.5" : ahplus05,
                                            "Asian handicap +1" : ahplus1,
                                            "Asian handicap +1.5" : ahplus15,
                                            "Asian handicap +2" : ahplus2,
                                            "Asian handicap +2.5" : ahplus25,
                                            "Asian handicap +3" : ahplus3,
                                            "Asian handicap +3.5" : ahplus35,
                                            "Asian handicap +4" : ahplus4,
                                            "Asian handicap +4.5" : ahplus45
                                        };

                                        var allHandicaps = '';

                                        $.each(asianHandicapData, function(key, value) {
                                            if(value != ''){
                                                allHandicaps += '<div class="flex-table header" role="rowgroup">';
                                                allHandicaps += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                allHandicaps += '<div title="Home" class="flex-row oddWidth" role="columnheader">Home</div>';
                                                allHandicaps += '<div title="Away" class="flex-row oddWidth" role="columnheader">Away</div>';
                                                allHandicaps += '</div>';
                                                allHandicaps += '<div class="table__body">';
                                                $.each(value, function(keys, values) {
                                                    allHandicaps += '<div class="flex-table row" role="rowgroup">';
                                                    allHandicaps += '<div class="flex-row bookmakers" role="cell">' + values.bookmaker + '</div>';
                                                    allHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.one + '</div>';
                                                    allHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.two + '</div>';
                                                    allHandicaps += '</div>';
                                                });
                                                allHandicaps += '</div>';
                                            }
                                        });

                                        var ouData = {
                                            "Over/Under +0.5" : ou05,
                                            "Over/Under +1" : ou1,
                                            "Over/Under +1.5" : ou15,
                                            "Over/Under +2" : ou2,
                                            "Over/Under +2.5" : ou25,
                                            "Over/Under +3" : ou3,
                                            "Over/Under +3.5" : ou35,
                                            "Over/Under +4" : ou4,
                                            "Over/Under +4.5" : ou45,
                                            "Over/Under +5" : ou5,
                                            "Over/Under +5.5" : ou55
                                        };

                                        var allou = '';

                                        $.each(ouData, function(key, value) {
                                            if(value != ''){
                                                allou += '<div class="flex-table header" role="rowgroup">';
                                                allou += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                allou += '<div title="Over" class="flex-row oddWidth" role="columnheader">Over</div>';
                                                allou += '<div title="Under" class="flex-row oddWidth" role="columnheader">Under</div>';
                                                allou += '</div>';
                                                allou += '<div class="table__body">';
                                                $.each(value, function(keys, values) {
                                                    allou += '<div class="flex-table row" role="rowgroup">';
                                                    allou += '<div class="flex-row bookmakers" role="cell">' + values.bookmaker + '</div>';
                                                    allou += '<div class="flex-row oddWidth" role="cell">' + values.one + '</div>';
                                                    allou += '<div class="flex-row oddWidth" role="cell">' + values.two + '</div>';
                                                    allou += '</div>';
                                                });
                                                allou += '</div>';
                                            }
                                        });

                                        htmlInsideTabsConstructorO += '</div>';
                                        $('#matchOdds .tab-container').append(htmlInsideTabsConstructorO);
                                        $('#matchOdds .nav-tab-wrapper').prepend(htmlConstructorO);

                                        if(onextwo.length > 0){
                                            $('#1x2 .tablele-container .table__body').append(onextwo);
                                        } else {
                                            $('#1x2 .tablele-container .table__body').append('<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>');
                                        }

                                        if(btsyesno.length > 0){
                                            $('#bts .tablele-container .table__body').append(btsyesno);
                                        } else {
                                            $('#bts .tablele-container .table__body').append('<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>');
                                        }

                                        if(allHandicaps.length > 0){
                                            $('#ah .tablele-container').append(allHandicaps);
                                        } else {
                                            $('#ah .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Asian handicap" class="flex-row bookmakers" role="columnheader">Asian handicap</div><div title="1" class="flex-row oddWidth" role="columnheader">1</div><div title="2" class="flex-row oddWidth" role="columnheader">2</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                        }

                                        if(allou.length > 0){
                                            $('#ou .tablele-container').append(allou);
                                        } else {
                                            $('#ou .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Over/Under" class="flex-row bookmakers" role="columnheader">Over/Under</div><div title="Over" class="flex-row oddWidth" role="columnheader">Over</div><div title="Under" class="flex-row oddWidth" role="columnheader">Under</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                        }

                                        // Switching tabs on click
                                        $('#matchOdds .nav-tab').unbind('click').on('click', function(e) {
                                            e.preventDefault();
                                            //Toggle tab link
                                            $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                            //Toggle target tab
                                            $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                        });
                                    } else {
                                        $('#matchOdds .tab-container').addClass('lineForNoData').prepend('<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>');
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Prediction section
                                htmlConstructor += '<section id="matchPredictions" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';

                                // Send server request for Standings
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        action: 'get_predictions',
                                        Widgetkey: Widgetkey,
                                        from: sessionStorage.getItem('fixturesDate'),
                                        to: sessionStorage.getItem('fixturesDate'),
                                        match_id: res[0].match_id
                                    },
                                    dataType: 'json'
                                }).done(function(res) {

                                    // If server send results hide loading
                                    $('.loading').hide();

                                    if(!res.error){

                                        $('.d-none-tab-prediction').removeClass('d-none-tab-prediction');

                                        var htmlInsideTabsConstructorP = '<div class="nav-tab-wrapper">';
                                        var htmlConstructorO = '<a href="#p1x2" class="standing-h2 nav-tab nav-tab-active">1x2</a>';
                                        htmlConstructorO += '<a href="#pdc" class="standing-h2 nav-tab">Double Chance</a>';
                                        htmlConstructorO += '<a href="#pah" class="standing-h2 nav-tab">Asian Handicap</a>';
                                        htmlConstructorO += '<a href="#pou" class="standing-h2 nav-tab">O/U</a>';
                                        htmlConstructorO += '<a href="#pbts" class="standing-h2 nav-tab">BTS</a>';

                                        htmlInsideTabsConstructorP += '<section id="p1x2" class="tab-content active">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                        htmlInsideTabsConstructorP += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                        htmlInsideTabsConstructorP += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                        htmlInsideTabsConstructorP += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '<div class="table__body">';
                                        if(res[0]['prob_HW'] !== '' || res[0]['prob_D'] !== '' || res[0]['prob_AW'] !== '') {
                                            htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_HW != 'undefined') ? res[0].prob_HW : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_D != 'undefined') ? res[0].prob_D : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_AW != 'undefined') ? res[0].prob_AW : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                        } else {
                                            htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                        }
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '<section id="pdc" class="tab-content">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                        htmlInsideTabsConstructorP += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                        htmlInsideTabsConstructorP += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                        htmlInsideTabsConstructorP += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '<div class="table__body">';
                                        if(res[0]['prob_HW_D'] !== '' || res[0]['prob_HW_AW'] !== '' || res[0]['prob_AW_D'] !== '') {
                                            htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_HW_D != 'undefined') ? res[0].prob_HW_D : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_HW_AW != 'undefined') ? res[0].prob_HW_AW : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_AW_D != 'undefined') ? res[0].prob_AW_D : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                        } else {
                                            htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                        }
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '<section id="pah" class="tab-content">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';

                                        var pasianHandicapData = {
                                            "Asian handicap -4.5" : [{
                                                home : res[0]['prob_ah_h_-45'],
                                                away : res[0]['prob_ah_a_-45']
                                            }],
                                            "Asian handicap -3.5" : [{
                                                home : res[0]['prob_ah_h_-35'],
                                                away : res[0]['prob_ah_a_-35']
                                            }],
                                            "Asian handicap -2.5" : [{
                                                home : res[0]['prob_ah_h_-25'],
                                                away : res[0]['prob_ah_a_-25']
                                            }],
                                            "Asian handicap -1.5" : [{
                                                home : res[0]['prob_ah_h_-15'],
                                                away : res[0]['prob_ah_a_-15']
                                            }],
                                            "Asian handicap -0.5" : [{
                                                home : res[0]['prob_ah_h_-05'],
                                                away : res[0]['prob_ah_a_-05']
                                            }],
                                            "Asian handicap +0.5" : [{
                                                home : res[0]['prob_ah_h_05'],
                                                away : res[0]['prob_ah_a_05']
                                            }],
                                            "Asian handicap +1.5" : [{
                                                home : res[0]['prob_ah_h_15'],
                                                away : res[0]['prob_ah_a_15']
                                            }],
                                            "Asian handicap +2.5" : [{
                                                home : res[0]['prob_ah_h_25'],
                                                away : res[0]['prob_ah_a_25']
                                            }],
                                            "Asian handicap +3.5" : [{
                                                home : res[0]['prob_ah_h_35'],
                                                away : res[0]['prob_ah_a_35']
                                            }],
                                            "Asian handicap +4.5" : [{
                                                home : res[0]['prob_ah_h_45'],
                                                away : res[0]['prob_ah_a_45']
                                            }]
                                        };

                                        var pallHandicaps = '';

                                        $.each(pasianHandicapData, function(key, value) {
                                            if(value != ''){
                                                pallHandicaps += '<div class="flex-table header" role="rowgroup">';
                                                pallHandicaps += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                pallHandicaps += '<div title="Home" class="flex-row oddWidth" role="columnheader">Home</div>';
                                                pallHandicaps += '<div title="Away" class="flex-row oddWidth" role="columnheader">Away</div>';
                                                pallHandicaps += '</div>';
                                                pallHandicaps += '<div class="table__body">';
                                                $.each(value, function(keys, values) {
                                                    pallHandicaps += '<div class="flex-table row" role="rowgroup">';
                                                    pallHandicaps += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                    pallHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.home + '</div>';
                                                    pallHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.away + '</div>';
                                                    pallHandicaps += '</div>';
                                                });
                                                pallHandicaps += '</div>';
                                            }
                                        });

                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '<section id="pou" class="tab-content">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';

                                        var pouData = {
                                            "Over/Under" : [{
                                                over : res[0]['prob_O'],
                                                under : res[0]['prob_U']
                                            }],
                                            "Over/Under +1" : [{
                                                over : res[0]['prob_O_1'],
                                                under : res[0]['prob_U_1']
                                            }],
                                            "Over/Under +3" : [{
                                                over : res[0]['prob_O_3'],
                                                under : res[0]['prob_U_3']
                                            }]
                                        };

                                        var pallou = '';

                                        $.each(pouData, function(key, value) {
                                            if(value != ''){
                                                pallou += '<div class="flex-table header" role="rowgroup">';
                                                pallou += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                pallou += '<div title="Over" class="flex-row oddWidth" role="columnheader">Over</div>';
                                                pallou += '<div title="Under" class="flex-row oddWidth" role="columnheader">Under</div>';
                                                pallou += '</div>';
                                                pallou += '<div class="table__body">';
                                                $.each(value, function(keys, values) {
                                                    pallou += '<div class="flex-table row" role="rowgroup">';
                                                    pallou += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                    pallou += '<div class="flex-row oddWidth" role="cell">' + values.over + '</div>';
                                                    pallou += '<div class="flex-row oddWidth" role="cell">' + values.under + '</div>';
                                                    pallou += '</div>';
                                                });
                                                pallou += '</div>';
                                            }
                                        });

                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '<section id="pbts" class="tab-content">';
                                        htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                        htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                        htmlInsideTabsConstructorP += '<div title="Yes" class="flex-row oddWidth" role="columnheader">Yes</div>';
                                        htmlInsideTabsConstructorP += '<div title="No" class="flex-row oddWidth" role="columnheader">No</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '<div class="table__body">';
                                        if(res[0]['prob_bts'] !== '' || res[0]['prob_ots'] !== '') {
                                            htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_bts != 'undefined') ? res[0].prob_bts : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res[0].prob_ots != 'undefined') ? res[0].prob_ots : '' ) + '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                        } else {
                                            htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                        }
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</div>';
                                        htmlInsideTabsConstructorP += '</section>';

                                        htmlInsideTabsConstructorP += '</div>';
                                        $('#matchPredictions .tab-container').append(htmlInsideTabsConstructorP);
                                        $('#matchPredictions .nav-tab-wrapper').prepend(htmlConstructorO);

                                        if(pallHandicaps.length > 0){
                                            $('#pah .tablele-container').append(pallHandicaps);
                                        } else {
                                            $('#pah .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Asian handicap" class="flex-row bookmakers" role="columnheader">Asian handicap</div><div title="1" class="flex-row oddWidth" role="columnheader">1</div><div title="2" class="flex-row oddWidth" role="columnheader">2</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                        }

                                        if(pallou.length > 0){
                                            $('#pou .tablele-container').append(pallou);
                                        } else {
                                            $('#pou .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Over/Under" class="flex-row bookmakers" role="columnheader">Over/Under</div><div title="Over" class="flex-row oddWidth" role="columnheader">Over</div><div title="Under" class="flex-row oddWidth" role="columnheader">Under</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                        }

                                        // Switching tabs on click
                                        $('#matchPredictions .nav-tab').unbind('click').on('click', function(e) {
                                            e.preventDefault();
                                            //Toggle tab link
                                            $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                            //Toggle target tab
                                            $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                        });
                                    } else {
                                        $('#matchPredictions .tab-container').addClass('lineForNoData').prepend('<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>');
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                htmlConstructor += '</div>';
                                htmlConstructor += '</div>';
                                $('#matchResultsContentTable').append(htmlConstructor);
                                // Added close button in HTML
                                $('#matchResultsContentTable').append('<p class="closeWindow">close window</p>');
                                // Added click function to close window
                                $('.closeWindow').click(function() {
                                    window.close();
                                });
                                // Switching tabs on click
                                $('.nav-tab').unbind('click').on('click', function(e) {
                                    e.preventDefault();
                                    //Toggle tab link
                                    $(this).addClass('nav-tab-active').parent().parent().siblings().find('a').removeClass('nav-tab-active');
                                    //Toggle target tab
                                    $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                });
                            }
                            clearInterval(seeWhatMatchDetailsToShow);
                        }
                    }, 10);
                } else {
                    // If server not sending data, show pop-up and after click closing window
                    alert('Sorry, no data!');
                    window.close();
                }

            }).fail(function(error) {

            });
        },

        callback: function() {

        }

    });

    $.fn.widgetMatchResults = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + widgetMatchResults)) {
                $.data(this, "plugin_" + widgetMatchResults, new Plugin(this, options));
            }
        });
        return this;
    };

    $.fn.widgetMatchResults.defaults = {
        // Widgetkey will be set in jqueryGlobals.js and can be obtained from your account
        Widgetkey: Widgetkey,
        // Action for this widget
        action: 'get_events',
        // Link to server data
        matchResultsDetailsAjaxURL: 'https://apiv2.apifootball.com/?',
        // Background color for your Leagues Widget
        backgroundColor: null,
        // Width for your widget
        widgetWidth: '100%',
        // Set the match Id (it will be set automaticaly when you click on a match)
        match_id: (sessionStorage.getItem('matchDetailsKey') ? sessionStorage.getItem('matchDetailsKey') : null),
        // Set the match league logo (it will be set automaticaly when you click on a match)
        leagueLogo: (sessionStorage.getItem('leagueLogo') ? sessionStorage.getItem('leagueLogo') : 'img/no-img.png')
    };

})(jQuery, window, document);