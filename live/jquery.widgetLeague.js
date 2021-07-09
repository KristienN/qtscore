// ---------------------------------
// ---------- widgetLeague ----------
// ---------------------------------
// Widget for League Display
// ------------------------
;
(function($, window, document, undefined) {

    var widgetLeague = 'widgetLeague';

    function Plugin(element, options) {
        this.element = element;
        this._name = widgetLeague;
        this._defaults = $.fn.widgetLeague.defaults;
        this.options = $.extend({}, this._defaults, options);

        this.init();
    }

    $.extend(Plugin.prototype, {

        // Initialization logic
        init: function() {
            this.buildCache();
            this.bindEvents();
            this.initialContent(this.options.leagueDetailsAjaxURL, this.options.league_id, this.options.Widgetkey, this.options.league_name, this.options.leagueLogo, this.options.timezone);
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

        initialContent: function(leagueDetailsAjaxURL, league_id, Widgetkey, league_name, leagueLogo, timezone) {

            // Get widget location
            var leagueLocation = $(this.element);
            // Adding loading screen
            $('<div class="loading">Loading&#8230;</div>').prependTo($(leagueLocation));
            // Construct the Standings Tab click
            $('<a href="#standingsTabC" class="titleWidget nav-tab">Standings</a>').prependTo($(leagueLocation));
            // Construct the Fixtures Tab click
            $('<a href="#fixturesTabC" class="titleWidget nav-tab">Fixtures</a>').prependTo($(leagueLocation));
            // Construct the Results Tab click
            $('<a href="#resultsTabC" class="titleWidget nav-tab nav-tab-active">Results</a>').prependTo($(leagueLocation));
            // Construct the header for above tabs with logo and name of league
            $('<div class="league_nameCon"><div class="league_nameImg" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == 'https://apiv2.apifootball.com/badges/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div><p class="league_name">' + league_name + '</p></div>').prependTo($(leagueLocation));

            // Adding the "widgetLeague" class for styling and easyer targeting
            leagueLocation.addClass('widgetLeague');

            // If backgroundColor setting is set, here we activate the color 
            if (this.options.backgroundColor) {
                leagueLocation.css('background-color', this.options.backgroundColor);
            }

            // If widgetWidth setting is set, here we set the width of the list 
            if (this.options.widgetWidth) {
                leagueLocation.css('width', this.options.widgetWidth);
            }

            // Add hook in HTML for Results Tab content infos and make it active
            var htmlConstructorResults = '<div id="resultsTabC" class="results-nav-tab-wrapper tab-content active">';
            
            var getTimeForFixturesResults = setInterval(function () {
                if (timeForFixtures.length > 0) {
                    // Set "from" date and "to" date for displaying the wanted interval - currently set to 3 months ago
                    var formattedDatess = new Date(timeForFixtures);
                    var dss = formattedDatess.getDate();
                    var mss = formattedDatess.getMonth() + 1;
                    var yss = formattedDatess.getFullYear();
                    var dateForFixtureToNow = yss + '-' + (mss < 10 ? '0' + mss : mss) + '-' + (dss < 10 ? '0' + dss : dss);
                    var mss2 = formattedDatess.setMonth(formattedDatess.getMonth() - 3);
                    var formattedDatess2 = new Date(mss2);
                    var dss2 = formattedDatess2.getDate();
                    var mss2 = formattedDatess2.getMonth() + 1;
                    var yss2 = formattedDatess2.getFullYear();
                    var dateForFixtureFromPast = yss2 + '-' + (mss2 < 10 ? '0' + mss2 : mss2) + '-' + (dss2 < 10 ? '0' + dss2 : dss2);
                    // Make call to server to get information about league Fixtures
                    $.ajax({
                        url: leagueDetailsAjaxURL,
                        cache: false,
                        data: {
                            action: 'get_events',
                            Widgetkey: Widgetkey,
                            from: dateForFixtureFromPast,
                            to: dateForFixtureToNow,
                            league_id: league_id,
                            timezone: timezone
                        },
                        dataType: 'json'
                    }).done(function(res) {

                        // If server send data, hide loading sreen
                        $('.loading').hide();
                        // Add HTML hook for results tab content
                        $('#resultsTabC').append('<section id="resultsContentTable"></section>');

                        // If server send results we populate HTML with sended information
                        if (!res.error) {

                            // Order information by Event Date and then group them by League Round
                            var sorted = sortByKey(res, 'key');
                            var sorted_array = sortByKeyDesc(sorted, "match_date");
                            var groubedByTeam = groupBy(sorted_array, 'match_round');
                            var htmlConstructor = '<div class="tablele-container">';

                            var countryName = res[0].country_name;
                            var seeWhatTitle = [];

                            $.each(groubedByTeam, function(key, value) {

                                var keyForTitle = key.replace(/\/| |-|  /g, '');
                                htmlConstructor += '<div class="flex-table header '+((keyForTitle) ? keyForTitle : 'Team')+'" role="rowgroup" style="display: none;">';
                                htmlConstructor += '<div title="' + ((key) ? key : 'Team') + '" class="flex-row" role="columnheader">' + ((key) ? key : 'Team') + '</div>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="table__body_results">';

                                $.each(value, function(keys, values) {
                                    // Now time in milliseconds
                                    var dtNow = new Date();
                                    var nowTimeMilliseconds = dtNow.getTime();
                                    // Match time in milliseconds
                                    var dtMatch = new Date(values.match_date + ' ' + values.match_time);
                                    var matchTimeMilliseconds = dtMatch.getTime();
                                    // Compare times for showing just matches before Now time
                                    if (nowTimeMilliseconds > matchTimeMilliseconds) {
                                    if (values.match_hometeam_score == null || values.match_awayteam_score == null) {
                                        var event_final_result_class_away = '';
                                        var event_final_result_class_home = '';
                                    } else {
                                        var event_final_result_class_away = values.match_awayteam_score;
                                        var event_final_result_class_home = values.match_hometeam_score;
                                    }
                                    var formattedDate = new Date(values.match_date);
                                    var d = formattedDate.getDate();
                                    var m = formattedDate.getMonth() + 1;
                                    var str = values.match_time;
                                    if (str.search(/Postp/i) > 0) {
                                        var match_time_simple = str.split("\n")[0];
                                        var match_time_postp = str.split("\n").pop();
                                        var match_time_exact = '<div class="match_time_text_align"><div class="resultslineThrough">' + d + '.' + m + ' ' + match_time_simple + '</div><div><div>' + match_time_postp + '</div></div></div>';
                                    } else {
                                        var match_time_exact = (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + ' ' + values.match_time;
                                    }
                                    var generatedLink = countryName+'/'+league_name+'/'+values.match_hometeam_name+'-vs-'+values.match_awayteam_name+'/'+values.match_date+'/'+values.match_id;
                                    var newGeneratedLink = generatedLink.replace(/\s/g,'-');
                                    htmlConstructor += '<a href="widgetMatchResults.html?'+newGeneratedLink+'" class="flex-table row" role="rowgroup" onclick="event.preventDefault(); windowOpenMatch(' + values.match_id + ', false, \'' + values.match_date  + '\', \'' + countryName + '\', \'' + league_name + '\', \'' + values.match_hometeam_name + '\', \'' + values.match_awayteam_name + '\')" title="Click for match detail!">';
                                    htmlConstructor += '<div class="flex-row matchDetails" role="cell">' + match_time_exact + '</div>';
                                    if (event_final_result_class_home > event_final_result_class_away) {
                                        htmlConstructor += '<div class="flex-row matchHomeTeam winningMatchStyle" role="cell">' + values.match_hometeam_name + '</div>';
                                        htmlConstructor += '<div class="flex-row matchDelimiter winningMatchStyle" role="cell">' + ((values.match_hometeam_score && values.match_awayteam_score ) ? (values.match_hometeam_score + ' - ' + values.match_awayteam_score ) : '-') + '</div>';
                                        htmlConstructor += '<div class="flex-row matchAwayTeam" role="cell">' + values.match_awayteam_name + '</div>';
                                    } else if (event_final_result_class_home < event_final_result_class_away) {
                                        htmlConstructor += '<div class="flex-row matchHomeTeam" role="cell">' + values.match_hometeam_name + '</div>';
                                        htmlConstructor += '<div class="flex-row matchDelimiter winningMatchStyle" role="cell">' + ((values.match_hometeam_score && values.match_awayteam_score ) ? (values.match_hometeam_score + ' - ' + values.match_awayteam_score ) : '-') + '</div>';
                                        htmlConstructor += '<div class="flex-row matchAwayTeam winningMatchStyle" role="cell">' + values.match_awayteam_name + '</div>';
                                    } else if (event_final_result_class_home == event_final_result_class_away) {
                                        htmlConstructor += '<div class="flex-row matchHomeTeam" role="cell">' + values.match_hometeam_name + '</div>';
                                        htmlConstructor += '<div class="flex-row matchDelimiter winningMatchStyle" role="cell">' + ((values.match_hometeam_score && values.match_awayteam_score ) ? (values.match_hometeam_score + ' - ' + values.match_awayteam_score ) : '-') + '</div>';
                                        htmlConstructor += '<div class="flex-row matchAwayTeam" role="cell">' + values.match_awayteam_name + '</div>';
                                    }
                                    htmlConstructor += '</a>';
                                        seeWhatTitle.push((keyForTitle) ? keyForTitle : 'Team');
                                    }
                                });
                                htmlConstructor += '</div>';
                            });
                            htmlConstructor += '</div>';
                            $('#resultsContentTable').append(htmlConstructor);

                            $.each(seeWhatTitle, function( index, value ) {
                                $('#resultsTabC .'+value).show();
                            });
                        } else {
                            // If server dont send results we populate HTML with "Sorry, no data!"
                            var htmlConstructor = '<div class="tablele-container">';
                            htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                            htmlConstructor += '</div>';
                            $('#resultsContentTable').append(htmlConstructor);
                        }
                    }).fail(function(error) {

                    });
                    clearInterval(getTimeForFixturesResults);
                }
            }, 10);
            htmlConstructorResults += '</div>';
            // Adding all above data to league location in HTML
            $(leagueLocation).append(htmlConstructorResults);

            // Add hook in HTML for Fixtures Tab content infos
            var htmlConstructorFixtures = '<div id="fixturesTabC" class="fixtures-nav-tab-wrapper tab-content">';
            var getTimeForFixtures = setInterval(function () {
                if (timeForFixtures.length > 0) {
                    // Set "from" date and "to" date for displaying the wanted interval - now it is set for tomorrow for up to a year
                    var formattedDates = new Date(timeForFixtures);
                    var dsAfter = formattedDates.setDate(formattedDates.getDate());
                    var formattedDatesAfter = new Date(dsAfter);
                    var ds = formattedDates.getDate();
                    var ms = formattedDates.getMonth() + 1;
                    var ys = formattedDates.getFullYear();
                    var dateForFixtureFrom = ys + '-' + (ms < 10 ? '0' + ms : ms) + '-' + (ds < 10 ? '0' + ds : ds);
                    var dateForFixtureTo = (ys + 1) + '-' + (ms < 10 ? '0' + ms : ms) + '-' + (ds < 10 ? '0' + ds : ds)
                    // Make call to server to get information about league Fixtures
                    $.ajax({
                        url: leagueDetailsAjaxURL,
                        cache: false,
                        data: {
                            action: 'get_events',
                            Widgetkey: Widgetkey,
                            from: dateForFixtureFrom,
                            to: dateForFixtureTo,
                            league_id: league_id,
                            timezone: timezone
                        },
                        dataType: 'json'
                    }).done(function(res) {

                        // Add HTML hook for fixtures tab content
                        $('#fixturesTabC').append('<section id="fixturesContentTable"></section>');

                        // If server send results we populate HTML with sended information
                        if (!res.error) {

                            // Order information by Event Date and then group them by League Round
                            var sorted = sortByKey(res, 'key');
                            var sorted_array = sortByKeyAsc(sorted, "match_date");
                            var groubedByTeam = groupBy(sorted_array, 'match_round');
                            var htmlConstructor = '<div class="tablele-container">';

                            var countryName = res[0].country_name;
                            var seeWhatTitle = [];

                            $.each(groubedByTeam, function(key, value) {

                                var keyForTitle = key.replace(/\/| |-|  /g, '');
                                htmlConstructor += '<div class="flex-table header '+((keyForTitle) ? keyForTitle : 'Team')+'" role="rowgroup" style="display: none;">';
                                htmlConstructor += '<div title="' + ((key) ? key : 'Team') + '" class="flex-row" role="columnheader">' + ((key) ? key : 'Team') + '</div>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="table__body_fixtures">';

                                $.each(value, function(keys, values) {
                                    // Now time in milliseconds
                                    var dtNow = new Date();
                                    var nowTimeMilliseconds = dtNow.getTime();
                                    // Match time in milliseconds
                                    var dtMatch = new Date(values.match_date + ' ' + values.match_time);
                                    var matchTimeMilliseconds = dtMatch.getTime();
                                    // Compare times for showing just matches before Now time
                                    if (nowTimeMilliseconds < matchTimeMilliseconds) {
                                    var formattedDate = new Date(values.match_date);
                                    var d = formattedDate.getDate();
                                    var m = formattedDate.getMonth() + 1;
                                    var str = values.match_time;
                                    if (str.search(/Postp/i) > 0) {
                                        var match_time_simple = str.split("\n")[0];
                                        var match_time_postp = str.split("\n").pop();
                                        var match_time_exact = '<div class="match_time_text_align"><div class="fixtureslineThrough">' + d + '.' + m + ' ' + match_time_simple + '</div><div><div>' + match_time_postp + '</div></div></div>';
                                    } else {
                                        var match_time_exact = (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + ' ' + values.match_time;
                                    }
                                    var generatedLink = countryName+'/'+league_name+'/'+values.match_hometeam_name+'-vs-'+values.match_awayteam_name+'/'+values.match_date+'/'+values.match_id;
                                    var newGeneratedLink = generatedLink.replace(/\s/g,'-');
                                    htmlConstructor += '<a href="widgetMatchResults.html?'+newGeneratedLink+'" class="flex-table row" role="rowgroup" onclick="event.preventDefault(); windowOpenMatch(' + values.match_id + ',\'' + leagueLogo + '\', \'' + values.match_date  + '\', \'' + countryName + '\', \'' + league_name + '\', \'' + values.match_hometeam_name + '\', \'' + values.match_awayteam_name + '\')" title="Click for match detail!">';
                                    htmlConstructor += '<div class="flex-row matchDetails" role="cell">' + match_time_exact + '</div>';
                                    htmlConstructor += '<div class="flex-row matchHomeTeam" role="cell">' + values.match_hometeam_name + '</div>';
                                    htmlConstructor += '<div class="flex-row matchDelimiter" role="cell">-</div>';
                                    htmlConstructor += '<div class="flex-row matchAwayTeam" role="cell">' + values.match_awayteam_name + '</div>';
                                    htmlConstructor += '</a>';
                                        seeWhatTitle.push((keyForTitle) ? keyForTitle : 'Team');
                                    }
                                });
                                htmlConstructor += '</div>';
                            });
                            htmlConstructor += '</div>';
                            $('#fixturesContentTable').append(htmlConstructor);
                            $.each(seeWhatTitle, function( index, value ) {
                                $('#fixturesTabC .'+value).show();
                            });
                        } else {
                            // If server dont send results we populate HTML with "Sorry, no data!"
                            var htmlConstructor = '<div class="tablele-container">';
                            htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                            htmlConstructor += '</div>';
                            $('#fixturesContentTable').append(htmlConstructor);
                        }
                    }).fail(function(error) {

                    });
                    clearInterval(getTimeForFixtures);
                }
            }, 10);
            htmlConstructorFixtures += '</div>';
            // Adding all above data to league location in HTML
            $(leagueLocation).append(htmlConstructorFixtures);

            // Add hook in HTML for Standings Tab content infos
            var htmlConstructor = '<div id="standingsTabC" class="standing-nav-tab-wrapper tab-content">';
            // Add HTML hook for standings tab content
            htmlConstructor += '<div class="nav-tab-wrapper">';
            var htmlTabsConstructor = '';
            var htmlInsideTabsConstructor = '';
            var firstElementInJson = 0;
            // Make call to server to get information about league standings
            $.ajax({
                url: leagueDetailsAjaxURL,
                cache: false,
                data: {
                    action: 'get_standings',
                    Widgetkey: Widgetkey,
                    league_id: league_id
                },
                dataType: 'json'
            }).done(function(res) {
                var newStand = {
                    'total': [],
                    'home': [],
                    'away': []
                };
                var i = 0;

                if (!res.error) {
                    $.each(res, function(key, value) {
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
                // If server send results we populate HTML with sended information
                $.each(newStand, function(key, value) {
                    // Order information ascendent, then group them by League Round
                    newStand[key].sort(groupSortingAsc);
                    var groubedByTeam = groupBy(newStand[key], 'league_round');
                    // Making first tab active
                    if (firstElementInJson == 0) {
                        htmlConstructor += '<a href="#' + key + '" class="standing-h2 nav-tab nav-tab-active">' + key + '</a>';
                        htmlInsideTabsConstructor += '<section id="' + key + '" class="tab-content active">';
                        htmlInsideTabsConstructor += '<div class="tablele-container">';
                        if ($.isEmptyObject(groubedByTeam)) {
                            htmlInsideTabsConstructor += '<div class="flex-table header" role="rowgroup">';
                            htmlInsideTabsConstructor += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                            htmlInsideTabsConstructor += '<div title="Team" class="flex-row teams" role="columnheader">Team</div>';
                            htmlInsideTabsConstructor += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                            htmlInsideTabsConstructor += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                            htmlInsideTabsConstructor += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                            htmlInsideTabsConstructor += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                            htmlInsideTabsConstructor += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                            htmlInsideTabsConstructor += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                            htmlInsideTabsConstructor += '</div>';
                            htmlInsideTabsConstructor += '<div class="table__body">';
                            htmlInsideTabsConstructor += '<div class="flex-table-error row" role="rowgroup">';
                            htmlInsideTabsConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                            htmlInsideTabsConstructor += '</div>';
                            htmlInsideTabsConstructor += '</div>';
                        }
                        $.each(groubedByTeam, function(keyss, valuess) {
                            htmlInsideTabsConstructor += '<div class="flex-table header">';
                            htmlInsideTabsConstructor += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                            htmlInsideTabsConstructor += '<div title="' + ((!keyss) ? "Team" : keyss) + '" class="flex-row teams" role="columnheader"><span class="standingsTeamsSpan">' + ((!keyss) ? "Team" : keyss) + '</span></div>';
                            htmlInsideTabsConstructor += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                            htmlInsideTabsConstructor += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                            htmlInsideTabsConstructor += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                            htmlInsideTabsConstructor += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                            htmlInsideTabsConstructor += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                            htmlInsideTabsConstructor += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                            htmlInsideTabsConstructor += '</div>';
                            htmlInsideTabsConstructor += '<div class="table__body">';
                            var colorForStanding = ['colorOne', 'colorTwo', 'colorThree', 'colorFour', 'colorFive', 'colorSix', 'colorSeven', 'colorEight', 'colorNine', 'colorTen'];
                            var colorStringValue = -1;
                            var stringToCompareStandings = '';
                            $.each(valuess, function(keys, values) {
                                htmlInsideTabsConstructor += '<div class="flex-table row" role="rowgroup">';
                                if (values.promotion) {
                                    if (stringToCompareStandings != values.promotion) {
                                        stringToCompareStandings = values.promotion;
                                        colorStringValue++;
                                        colorForStanding[colorStringValue];
                                        htmlInsideTabsConstructor += '<div class="flex-row first-sticky fix-width ' + colorForStanding[colorStringValue] + '" title="' + values.promotion + '" role="cell">' + values.league_position + '.</div>';
                                    } else if (stringToCompareStandings == values.promotion) {
                                        colorForStanding[colorStringValue];
                                        htmlInsideTabsConstructor += '<div class="flex-row first-sticky fix-width ' + colorForStanding[colorStringValue] + '" title="' + values.promotion + '" role="cell">' + values.league_position + '.</div>';
                                    }
                                } else if (!values.promotion) {
                                    colorStringValue = $(colorForStanding).length / 2;
                                    htmlInsideTabsConstructor += '<div class="flex-row first-sticky fix-width" role="cell">' + values.league_position + '.</div>';
                                }
                                htmlInsideTabsConstructor += '<div class="flex-row teams" role="cell"><a href="#" onclick="windowPreventOpening()">' + values.team_name + '</a></div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_payed + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_W + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_D + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_L + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row goals" role="cell">' + values.league_GF + ':' + values.league_GA + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_PTS + '</div>';
                                htmlInsideTabsConstructor += '</div>';
                            });
                            htmlInsideTabsConstructor += '</div>';
                        });
                        htmlInsideTabsConstructor += '</div>';
                        htmlInsideTabsConstructor += '</section>';
                        firstElementInJson++
                    } else {
                        htmlConstructor += '<a href="#' + key + '" class="standing-h2 nav-tab">' + key + '</a>';
                        htmlInsideTabsConstructor += '<section id="' + key + '" class="tab-content">';
                        htmlInsideTabsConstructor += '<div class="tablele-container">';
                        if ($.isEmptyObject(groubedByTeam)) {
                            htmlInsideTabsConstructor += '<div class="flex-table header" role="rowgroup">';
                            htmlInsideTabsConstructor += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                            htmlInsideTabsConstructor += '<div title="Team" class="flex-row teams" role="columnheader">Team</div>';
                            htmlInsideTabsConstructor += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                            htmlInsideTabsConstructor += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                            htmlInsideTabsConstructor += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                            htmlInsideTabsConstructor += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                            htmlInsideTabsConstructor += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                            htmlInsideTabsConstructor += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                            htmlInsideTabsConstructor += '</div>';
                            htmlInsideTabsConstructor += '<div class="table__body">';
                            htmlInsideTabsConstructor += '<div class="flex-table-error row" role="rowgroup">';
                            htmlInsideTabsConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                            htmlInsideTabsConstructor += '</div>';
                            htmlInsideTabsConstructor += '</div>';
                        }
                        $.each(groubedByTeam, function(keyss, valuess) {
                            htmlInsideTabsConstructor += '<div class="flex-table header">';
                            htmlInsideTabsConstructor += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                            htmlInsideTabsConstructor += '<div title="' + ((!keyss) ? "Team" : keyss) + '" class="flex-row teams" role="columnheader">' + ((!keyss) ? "Team" : keyss) + '</div>';
                            htmlInsideTabsConstructor += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                            htmlInsideTabsConstructor += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                            htmlInsideTabsConstructor += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                            htmlInsideTabsConstructor += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                            htmlInsideTabsConstructor += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                            htmlInsideTabsConstructor += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                            htmlInsideTabsConstructor += '</div>';
                            htmlInsideTabsConstructor += '<div class="table__body">';

                            var sortStandingTabs = valuess;
                            sortStandingTabs.sort(function(a, b){
                                return b.league_PTS-a.league_PTS
                            });

                            var league_position_nb = 1;
                            $.each(sortStandingTabs, function(keys, values) {
                                htmlInsideTabsConstructor += '<div class="flex-table row" role="rowgroup">';
                                htmlInsideTabsConstructor += '<div class="flex-row first fix-width" role="cell">' + league_position_nb + '.</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row teams" role="cell"><a href="#" onclick="windowPreventOpening()">' + values.team_name + '</a></div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_payed + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_W + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_D + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_L + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row goals" role="cell">' + values.league_GF + ':' + values.league_GA + '</div>';
                                htmlInsideTabsConstructor += '<div class="flex-row fix-width" role="cell">' + values.league_PTS + '</div>';
                                htmlInsideTabsConstructor += '</div>';
                                league_position_nb ++;
                            });
                            htmlInsideTabsConstructor += '</div>';
                        });
                        htmlInsideTabsConstructor += '</div>';
                        htmlInsideTabsConstructor += '</section>';
                    }
                });
                htmlConstructor += '</div>';
                htmlConstructor += '</div>';
                // Adding all above data to league location in HTML
                $(leagueLocation).append(htmlConstructor);

                // Switching tabs on click
                $('.widgetLeague .nav-tab').unbind('click').on('click', function(e) {
                    e.preventDefault();
                    //Toggle tab link
                    $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                    //Toggle target tab
                    $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                });
                $('.widgetLeague .standing-nav-tab-wrapper .nav-tab-wrapper').after(htmlInsideTabsConstructor);
                $('.widgetLeague .standing-nav-tab-wrapper .nav-tab').unbind('click').on('click', function(e) {
                    e.preventDefault();
                    //Toggle tab link
                    $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                    //Toggle target tab
                    $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                });
                    // });
            }).fail(function(error) {

            });
        },

        callback: function() {

        }

    });

    $.fn.widgetLeague = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + widgetLeague)) {
                $.data(this, "plugin_" + widgetLeague, new Plugin(this, options));
            }
        });
        return this;
    };

    $.fn.widgetLeague.defaults = {
        // Widgetkey will be set in jqueryGlobals.js and can be obtained from your account
        Widgetkey: Widgetkey,
        // Link to server data
        leagueDetailsAjaxURL: 'https://apiv2.apifootball.com/?',
        // Get Leagues information, name and image (reuqested automaticaly from server when you click on a league from country list)
        league_id: null,
        league_name: null,
        leagueLogo: null,
        // Background color for your Leagues Widget
        backgroundColor: null,
        // Width for your Countries Widget
        widgetWidth: '81%',
        // Get the time zone of your location
        timezone: getTimeZone()
    };

})(jQuery, window, document);