// ---------------------------------
// ---------- widgetCountries ----------
// ---------------------------------
// Widget for Countries Display
// ------------------------
;
(function($, window, document, undefined) {

    var widgetCountries = 'widgetCountries';

    function Plugin(element, options) {
        this.element = element;
        this._name = widgetCountries;
        this._defaults = $.fn.widgetCountries.defaults;
        this.options = $.extend({}, this._defaults, options);

        this.init();
    }

    $.extend(Plugin.prototype, {

        // Initialization logic
        init: function() {
            this.buildCache();
            this.bindEvents();

            this.initialContent(this.options.countriesAjaxURL, this.options.action, this.options.Widgetkey, this.options.preferentialCountries, this.options.preferentialLeagues);

            // If widgetLeagueLocation is set in the option for Country Widget, call the scripts and css from jqueryGlobals.js and initiate League Widget
            if (this.options.widgetLeagueLocation != null) {
                if (typeof initiateWidgetLeagueScript == 'function') {
                    initiateWidgetLeagueScript(this.options.widgetLeagueLocation, this.options.Widgetkey);
                }
            }
            // If widgetMatchResultsLocation is set in the option for Country Widget, call the scripts and css from jqueryGlobals.js and initiate Match Result Widget, this is an extra HTML page and need to add it in same folder with jqueryGlobals.js
            if (this.options.widgetMatchResultsLocation != null) {
                if (typeof initiateWidgetMatchResultsScript == 'function') {
                    initiateWidgetMatchResultsScript(this.options.widgetMatchResultsLocation, this.options.Widgetkey);
                }
            }
            // If widgetLiveScoreLocation is set in the option for Country Widget, call the scripts and css from jqueryGlobals.js and initiate Live Score Widget
            if (this.options.widgetLiveScoreLocation != null) {
                if (typeof initiateWidgetLiveScoreScript == 'function') {
                    initiateWidgetLiveScoreScript(this.options.widgetLiveScoreLocation, this.options.Widgetkey);
                }
            }
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

        initialContent: function(countriesAjaxURL, action, Widgetkey, preferentialCountries, preferentialLeagues) {

            // Get league widget location
            var widgetLeagueLocation = this.options.widgetLeagueLocation;
            var countriesElementRendering = $(this.element);
            // Widget Html constructor
            var htmlConstructor = '';

            // Header menu display constructor (need to link to html location) 
            var headerMenuDisplay = '<nav id="page-nav">';
            // Here you can change your "Home Page"
            headerMenuDisplay += '<div class="nav-menu-content"><a href="index.html"><img class="logo-img-size" src="img/Logo-Test.png" alt="Website Logo"></a>';
            headerMenuDisplay += '<select id="callendar-select-for-mobile" class="callendar-select-for-mobile">';
            // setTimeout(function(){
            var timeDateCalendarMobile = setInterval(function() {
                if (timeForFixtures.length > 0) {
                    headerMenuDisplay += getDateCalendarMobile('callendar-select-for-mobile', timeForFixtures, 'threeDayAfter', 3, 'addDateCalendar');
                    headerMenuDisplay += getDateCalendarMobile('callendar-select-for-mobile', timeForFixtures, 'twoDayAfter', 2, 'addDateCalendar');
                    headerMenuDisplay += getDateCalendarMobile('callendar-select-for-mobile', timeForFixtures, 'oneDayAfter', 1, 'addDateCalendar');
                    headerMenuDisplay += $('<option class="thisDateForSelect" value="' + timeForFixtures + '" data-dateclicked="' + timeForFixtures + '" selected>Current Day</option>').prependTo($('#callendar-select-for-mobile'));
                    headerMenuDisplay += getDateCalendarMobile('callendar-select-for-mobile', timeForFixtures, 'oneDayBefore', 1, 'substractDateCalendar');
                    headerMenuDisplay += getDateCalendarMobile('callendar-select-for-mobile', timeForFixtures, 'twoDayBefore', 2, 'substractDateCalendar');
                    headerMenuDisplay += getDateCalendarMobile('callendar-select-for-mobile', timeForFixtures, 'threeDayBefore', 3, 'substractDateCalendar');
                    clearInterval(timeDateCalendarMobile);
                }
            }, 10);
            // }, 2000);
            headerMenuDisplay += '</select>';
            headerMenuDisplay += '<label for="hamburger">&#9776;</label></div>';
            headerMenuDisplay += '<input type="checkbox" id="hamburger"/>';
            headerMenuDisplay += '<ul id="country-list-mobile">';
            headerMenuDisplay += '</ul>';
            headerMenuDisplay += '</nav>';
            // Connection to HTML location of Menu
            $('.headerMenuDisplay').prepend(headerMenuDisplay);

            // Trigger data select on mobile and populate with new information 
            $('#callendar-select-for-mobile').on('change', function() {
                // Adding loading screen and remove all active classes
                $('#allGame').html('<div class="loading">Loading&#8230;</div>').addClass('active').siblings().removeClass('active');
                // Remove active tab and switch to firs one after click
                $('.widgetLiveScore .titleWidget').removeClass('nav-tab-active').first().addClass('nav-tab-active');
                // Call Fixtures Data from server
                $.ajax({
                    url: countriesAjaxURL,
                    cache: false,
                    data: {
                        action: 'get_events',
                        Widgetkey: Widgetkey,
                        from: $(this).val(),
                        to: $(this).val(),
                        timezone: getTimeZone()
                    },
                    dataType: 'json'
                }).done(function(res) {
                    // If server send data, hide loading sreen
                    $('.loading').hide();
                    // Construct the section for All Games in that specific day
                    $('#allGame').append('<section id="allGameContentTable"></section>');

                    // If server send results we populate HTML with sended information
                    if (!res.error) {

                        // Order information by Event Time and then group them by Country Name
                        var windowWidthSize = $(window).width();
                        var sorted = sortByKey(res, 'key');
                        var sorted_array = sortByKeyAsc(sorted, "match_time");
                        var groubedByTeam = groupBy(sorted_array, 'country_name');
                        const orderedLeagues = {};
                        Object.keys(groubedByTeam).sort().forEach(function(key) {
                            orderedLeagues[key] = groubedByTeam[key];
                        });
                        var htmlConstructor = '<div class="tablele-container">';
                        $.each(orderedLeagues, function(keyes, valuees) {
                            var sortedValuess = groupBy(valuees, 'league_name');
                            $.each(sortedValuess, function(key, value) {
                                htmlConstructor += '<div class="flex-table header" role="rowgroup">';
                                htmlConstructor += '<div class="countryListDisplays"><div class="countryLogo" style="background-image: url(\'' + ((value[0].country_logo == '' || value[0].country_logo == null) ? 'img/no-img.png' : value[0].country_logo) + '\');"></div>';
                                htmlConstructor += '<div title="' + ((key) ? key : 'Team') + '" class="flex-row keyOfTeam" onclick="windowOpenLeagueInfo(\'' + value[0].league_id + '\',\'' + value[0].league_name +'\', \'' + value[0].league_logo + '\')" role="columnheader">' + ((value[0].country_name) ? '<span class="countryOfTeams">' + value[0].country_name + ':</span>' : '') + ' ' + ((key) ? key : 'Team') + '</div>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="table__body_fixtures">';
                                $.each(value, function(keys, values) {
                                    if (values.match_hometeam_score == null || values.match_awayteam_score == null) {
                                        var event_final_result_class_away = '';
                                        var event_final_result_class_home = '';
                                    } else {
                                        var event_final_result_class_away = values.match_awayteam_score;
                                        var event_final_result_class_home = values.match_hometeam_score;
                                    }
                                    if (values.match_status) {
                                        var removeNumericAdd = values.match_status.replace('+', '');
                                    } else {
                                        var removeNumericAdd = values.match_status;
                                    }
                                    var generatedLink = values.country_name+'/'+values.league_name+'/'+values.match_hometeam_name+'-vs-'+values.match_awayteam_name+'/'+values.match_date+'/'+values.match_id;
                                    var newGeneratedLink = generatedLink.replace(/\s/g,'-');
                                    htmlConstructor += '<a href="widgetMatchResults.html?'+newGeneratedLink+'" class="' + ((windowWidthSize < 769) ? 'container-mobile-grid' : '') + ' flex-table row ' + values.match_id + '" role="rowgroup" onclick="event.preventDefault(); windowOpenMatch(' + values.match_id + ', false, \'' + values.match_date + '\', \'' + values.country_name + '\', \'' + values.league_name + '\', \'' + values.match_hometeam_name + '\', \'' + values.match_awayteam_name + '\')" title="Click for match detail!">';
                                    htmlConstructor += '<div class="' + ((windowWidthSize < 769) ? 'item-mobile-grid' : '') + ' flex-row matchDetails ' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? ' matchIsLive' : '') + '" role="cell"> ' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? values.match_status + ((removeNumericAdd == 'Half Time') ? '' : '\'') : values.match_time) + '</div>';
                                    htmlConstructor += '<div class="' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? 'd-none-mobile-div' : (((values.match_status == null) || values.match_status == '') ? 'd-none-mobile-div' : '')) + ' ' + ((windowWidthSize < 769) ? 'item-mobile-grid' : '') + ' flex-row matchDetails secondMatchDetails" role="cell">' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? '' : ((values.match_status == null) ? '' : values.match_status)) + '</div>';
                                    htmlConstructor += ((windowWidthSize < 769) ? '<div class="break-mobile-grid"></div>' : '');
                                    if (event_final_result_class_home > event_final_result_class_away) {
                                        htmlConstructor += '<div class="flex-row matchHomeTeam winningMatchStyle" role="cell">' + values.match_hometeam_name + '</div>';
                                        htmlConstructor += '<div class="flex-row matchDelimiter" role="cell">' + ((values.match_hometeam_score && values.match_awayteam_score ) ? (values.match_hometeam_score + ' - ' + values.match_awayteam_score ) : '-') + '</div>';
                                        htmlConstructor += '<div class="flex-row matchAwayTeam" role="cell">' + values.match_awayteam_name + '</div>';
                                    } else if (event_final_result_class_home < event_final_result_class_away) {
                                        htmlConstructor += '<div class="flex-row matchHomeTeam" role="cell">' + values.match_hometeam_name + '</div>';
                                        htmlConstructor += '<div class="flex-row matchDelimiter" role="cell">' + ((values.match_hometeam_score && values.match_awayteam_score ) ? (values.match_hometeam_score + ' - ' + values.match_awayteam_score ) : '-') + '</div>';
                                        htmlConstructor += '<div class="flex-row matchAwayTeam winningMatchStyle" role="cell">' + values.match_awayteam_name + '</div>';
                                    } else if (event_final_result_class_home == event_final_result_class_away) {
                                        htmlConstructor += '<div class="flex-row matchHomeTeam" role="cell">' + values.match_hometeam_name + '</div>';
                                        htmlConstructor += '<div class="flex-row matchDelimiter" role="cell">' + ((values.match_hometeam_score && values.match_awayteam_score ) ? (values.match_hometeam_score + ' - ' + values.match_awayteam_score ) : '-') + '</div>';
                                        htmlConstructor += '<div class="flex-row matchAwayTeam" role="cell">' + values.match_awayteam_name + '</div>';
                                    }
                                    htmlConstructor += '<div class="' + ((((windowWidthSize < 769) && (values.match_hometeam_score == '') && (values.match_awayteam_score == '')) || ((windowWidthSize < 769) && (values.match_hometeam_score == null) && (values.match_awayteam_score == null))) ? 'd-none-mobile-div' : '') + ' flex-row matchAwayTeam firstHalfStyle ' + ((windowWidthSize < 769) ? 'mobile-firstHalfStyle d-none-mobile-div' : '') + '" role="cell">' + (((values.match_hometeam_score) && (values.match_awayteam_score)) ? '(' + (values.match_hometeam_score + ' - ' + values.match_awayteam_score ) + ')' : '') + '</div>';
                                    htmlConstructor += '</a>';
                                });
                                htmlConstructor += '</div>';
                            });
                        });
                        htmlConstructor += '</div>';
                        $('#allGameContentTable').append(htmlConstructor);

                    } else {

                        // If server dont send results we populate HTML with "Sorry, no data!"
                        var htmlConstructor = '<div class="tablele-container">';
                        htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                        htmlConstructor += '</div>';
                        $('#allGameContentTable').append(htmlConstructor);
                    }
                }).fail(function(error) {

                });
            });

            // Added to bottom right an icon for scrolling to top
            var scrollToTop = '<div class="scroll-top d-none-scroll">\n' +
                '<span class="scroll-top-icon">&#65087;</span>\n' +
                '</div>';
            $('.headerMenuDisplay').prepend(scrollToTop);
            // Scroll To Top appear at 401px and hide at 400px
            $(window).scroll(function() {
                if ($(window).scrollTop() < 400) {
                    $('.scroll-top').addClass('d-none-scroll');
                }
                if ($(window).scrollTop() > 401) {
                    $('.scroll-top').removeClass('d-none-scroll');
                }
            });
            // Added functionability on icon, witch on click scroll the page to top
            $('.scroll-top').click(function() {
                $("html, body").animate({
                    scrollTop: 0
                }, 600);
                return false;
            });
            // If window size is less then 769px we move entire Country list inside the upper top "hamburger" menu
            var windowWidthSize = $(window).width();
            if (windowWidthSize < 769) {
                $(countriesElementRendering).detach().appendTo('#country-list-mobile')
            }
            // Adding loading screen
            $('<div class="loading">Loading&#8230;</div>').prependTo($(countriesElementRendering));
            // Create the div's witch later we will populate them with Country lists and preference
            $('<div class="active-list-of"><div class="first-list-countryes widgetCountries-list-group-item widgetCountries-active"></div></div><div class="second-list-of"></div>').prependTo($(countriesElementRendering));

            // Adding the "widgetCountries" class for styling and easyer targeting
            countriesElementRendering.addClass('widgetCountries');

            // If backgroundColor setting is set, here we activate the color 
            if (this.options.backgroundColor) {
                countriesElementRendering.css('background-color', this.options.backgroundColor);
            }

            // If widgetWidth setting is set, here we set the width of the list 
            if (this.options.widgetWidth) {
                countriesElementRendering.css('width', this.options.widgetWidth);
            }

            // If preferentialLeagues setting is set, here we make a new top left list that contain the specific Leagues
            if (preferentialLeagues) {
                $.ajax({
                    url: countriesAjaxURL,
                    cache: false,
                    data: {
                        action: 'get_leagues',
                        Widgetkey: Widgetkey
                    },
                    dataType: 'json'
                }).done(function(res) {

                    if(res.error){
                        $('.container-with-errors').html('<h2 style="margin: 0 auto;">' + res.message + '</h2>');
                        console.log(res.message);
                    }
                    
                    var LeaguesOdered = res;
                    var getNrOfLeaguesFovorites = preferentialLeagues.length;
                    var addingSpaceToLast = 1;
                    var htmlForPreferedLeagues = '';
                    var resultForPreff = [];
                    $.each(LeaguesOdered, function(keyss, valuess) {
                        if ($.inArray(valuess.league_id, preferentialLeagues) !== -1) {
                            resultForPreff.push(valuess);
                        }
                    });
                    var sorted_array = groupBy(resultForPreff, "league_id");
                    $.each(sorted_array, function(keyss, valuess) {
                        if ($.inArray(valuess[0].league_id, preferentialLeagues) !== -1) {
                            htmlForPreferedLeagues += '<div class="leagueFavoriteClick widgetCountries-list-group-item favoriteListStyle ' + ((getNrOfLeaguesFovorites == addingSpaceToLast) ? 'favoriteListStylePadding' : '') + '" data-countries-key="' + valuess[0].country_id + '" data-leaguefav-key="' + valuess[0].league_id + '" data-leaguefav-logo="' + valuess[0].league_logo + '">';
                            htmlForPreferedLeagues += '<div class="countryListDisplays"><div class="countryLogo" style="background-image: url(\'' + ((valuess[0].country_logo == '' || valuess[0].country_logo == null) ? 'img/no-img.png' : valuess[0].country_logo) + '\');"></div>';
                            htmlForPreferedLeagues += '<p>' + valuess[0].league_name + '</p></div><ul class="widgetCountries-inside-ul"><div class="loading2">Loading&#8230;</div></ul></div>';
                            addingSpaceToLast++;
                        }
                    });
                    $('.second-list-of').prepend(htmlForPreferedLeagues);
                    $(countriesElementRendering).find('div .leagueFavoriteClick .countryListDisplays').on('click', function() {
                        $('.widgetLiveScore').css('display', 'none');
                        $('.widgetLeague').css('display', 'block');
                        $('.first-list-countryes').css('display', 'block');
                        $('.mainPageHeader').show();
                        $('.callendar-select-for-mobile').hide();
                        $('.switchButton').html('Back to Live Score');
                        $('.widgetCountries-list-group-item:not(.first-list-countryes)').removeClass('widgetCountries-active').find('ul').css('display', 'none');
                        var htmlForFavoriteLeagueDisplay = '';
                        var countriesList = $(this).parent();
                        var getFavleague_id = $(this).parent().attr("data-leaguefav-key");
                        var getFavLeagueText = $(this).find('p').text();
                        var getFavLeagueLogo = $(this).parent().attr("data-leaguefav-logo");
                        $.ajax({
                            url: countriesAjaxURL,
                            cache: false,
                            data: {
                                action: 'get_leagues',
                                Widgetkey: Widgetkey,
                                country_id: $(this).parent().attr("data-countries-key")
                            },
                            dataType: 'json'
                        }).done(function(res) {
                            $('.active-list-of').css('visibility', 'visible');
                            $('.active-list-of').css('height', 'initial');
                            htmlForFavoriteLeagueDisplay += '<div class="widgetCountries-list-group-item widgetCountries-active">';
                            htmlForFavoriteLeagueDisplay += '<div class="countryListDisplays"><div class="countryLogo" style="background-image: url(\'' + ((res[0].country_logo == '' || res[0].country_logo == null) ? 'img/no-img.png' : res[0].country_logo) + '\');"></div>';
                            htmlForFavoriteLeagueDisplay += '<p>' + res[0].country_name + '</p></div><ul class="widgetCountries-inside-ul elementToAdd" style="    padding-top: 0.75rem;padding-bottom: 0.75rem;display: block;">';
                            var firstLiElementInJson = 0;
                            $.each(res, function(key, value) {
                                if (firstLiElementInJson == 0) {
                                    htmlForFavoriteLeagueDisplay += '<li><a class="" data-league-key="' + value.league_id + '" data-league-logo="' + value.league_logo + '">' + value.league_name + '</li></a>';
                                    firstLiElementInJson++;
                                } else {
                                    htmlForFavoriteLeagueDisplay += '<li><hr class="widgetCountriesHr"><a class="" data-league-key="' + value.league_id + '" data-league-logo="' + value.league_logo + '">' + value.league_name + '</li></a>';
                                }
                            });
                            htmlForFavoriteLeagueDisplay += '</ul></div>';
                            $('.first-list-countryes').html('').append(htmlForFavoriteLeagueDisplay);

                            $([document.documentElement, document.body]).animate({
                                scrollTop: 0
                            }, 1);

                            if (isWidgetLeague == 1) {
                                if (typeof initiateWidgetLeague == 'function') {
                                    $('.loading').show();

                                    initiateWidgetLeague(widgetLeagueLocation, Widgetkey, getFavleague_id, getFavLeagueText, getFavLeagueLogo);
                                }
                            }

                            if (windowWidthSize < 769) {
                                $('#hamburger').click();
                            }

                            $('.first-list-countryes').find('ul li').unbind('click').on('click', function() {

                                $([document.documentElement, document.body]).animate({
                                    scrollTop: 0
                                }, 1);

                                $('.widgetLiveScore').css('display', 'none');
                                $('.widgetLeague').css('display', 'block');
                                $('.first-list-countryes').css('display', 'block');
                                $('.mainPageHeader').show();
                                $('.callendar-select-for-mobile').hide();
                                $('.switchButton').html('Back to Live Score');

                                if (isWidgetLeague == 1) {
                                    if (typeof initiateWidgetLeague == 'function') {
                                        $('.loading').show();
                                        initiateWidgetLeague(widgetLeagueLocation, Widgetkey, $(this).find('a').attr("data-league-key"), $(this).find('a').text(), $(this).find('a').attr("data-league-logo"));
                                    }
                                }

                                if (windowWidthSize < 769) {
                                    $('#hamburger').click();
                                }

                            });

                        }).fail(function(error) {

                        });

                    });

                }).fail(function(error) {

                });
            }

            // Construct the Countries list with all of them
            $.ajax({
                url: countriesAjaxURL,
                cache: false,
                data: {
                    action: action,
                    Widgetkey: Widgetkey
                },
                dataType: 'json'
            }).done(function(res) {

                var getAllCountriesForFavorite = res;
                htmlConstructor += '';
                var firstElementInJson = 0;

                // If preferentialCountries setting is set, here we make a new top left list that contain the specific Countries
                if (preferentialCountries) {
                    var getNrOfCountriesFovorites = preferentialCountries.length;
                    var addingSpaceToLast = 1;
                    $.each(getAllCountriesForFavorite, function(keyss, valuess) {
                        if ($.inArray(valuess.country_id, preferentialCountries) !== -1) {
                            htmlConstructor += '<div class="widgetCountries-list-group-item favoriteListStyle ' + ((getNrOfCountriesFovorites == addingSpaceToLast) ? 'favoriteListStylePadding' : '') + '" data-countries-key="' + valuess.country_id + '">';
                            htmlConstructor += '<div class="countryListDisplays"><div class="countryLogo" style="background-image: url(\'' + ((valuess.country_logo == '' || valuess.country_logo == null) ? 'img/no-img.png' : valuess.country_logo) + '\');"></div>';
                            htmlConstructor += '<p>' + valuess.country_name + '</p></div><ul class="widgetCountries-inside-ul"><div class="loading2">Loading&#8230;</div></ul></div>';
                            addingSpaceToLast++;
                        }
                    });
                }

                // Display all the countries one by one
                $.each(res, function(key, value) {
                    htmlConstructor += '<div class="widgetCountries-list-group-item" data-countries-key="' + value.country_id + '">';
                    htmlConstructor += '<div class="countryListDisplays"><div class="countryLogo" style="background-image: url(\'' + ((value.country_logo == '' || value.country_logo == null) ? 'img/no-img.png' : value.country_logo) + '\');"></div>';
                    htmlConstructor += '<p>' + value.country_name + '</p></div><ul class="widgetCountries-inside-ul"><div class="loading2">Loading&#8230;</div></ul></div>';
                    firstElementInJson++;
                });
                htmlConstructor += '</div>';
                $(countriesElementRendering).append(htmlConstructor);

                // When a country is clicked we make it active and create a list with Leagues
                $(countriesElementRendering).find('div .countryListDisplays').on('click', function() {
                    $(this).parent().find('ul').toggle();
                    $(this).parent().toggleClass('widgetCountries-active');
                    $(this).parent().addClass('thisActive');
                    $(this).parent().siblings().find('ul').parent().removeClass('thisActive');
                });
                // Aditionally we send a request to server to get all the leagues for that country
                $(countriesElementRendering).find('div .countryListDisplays').one('click', function() {
                    $('.loading2').show();
                    var countriesList = $(this).parent();
                    $.ajax({
                        url: countriesAjaxURL,
                        cache: false,
                        data: {
                            action: 'get_leagues',
                            Widgetkey: Widgetkey,
                            country_id: $(this).parent().attr("data-countries-key")
                        },
                        dataType: 'json'
                    }).done(function(res) {

                        var htmlConstructor3 = '';
                        var firstLiElementInJson = 0;
                        $.each(res, function(key, value) {
                            if (firstLiElementInJson == 0) {
                                htmlConstructor3 += '<li><a class="" data-league-key="' + value.league_id + '" data-league-logo="' + value.league_logo + '">' + value.league_name + '</li></a>';
                                firstLiElementInJson++;
                            } else {
                                htmlConstructor3 += '<li><hr class="widgetCountriesHr"><a class="" data-league-key="' + value.league_id + '" data-league-logo="' + value.league_logo + '">' + value.league_name + '</li></a>';
                            }
                        });
                        $(countriesList).find('ul').html('').css({
                            'padding-top': '0.75rem',
                            'padding-bottom': '0.75rem'
                        }).append(htmlConstructor3);
                        // When clicked on a league we activate the League Widget and scroll page to top
                        $(countriesList).find('ul li').unbind('click').on('click', function() {
                            $('.widgetLiveScore').css('display', 'none');
                            $('.widgetLeague').css('display', 'block');
                            $('.first-list-countryes').css('display', 'block');
                            $('.mainPageHeader').show();
                            $('.callendar-select-for-mobile').hide();
                            $('.switchButton').html('Back to Live Score');
                            $('.active-list-of').css('visibility', 'visible');
                            $('.active-list-of').css('height', 'initial');

                            $([document.documentElement, document.body]).animate({
                                scrollTop: 0
                            }, 1);

                            $('.first-list-countryes').html('').append($(this).parent().parent().html());
                            $('.widgetCountries-list-group-item:not(.first-list-countryes)').removeClass('widgetCountries-active').find('ul').css('display', 'none');
                            if (isWidgetLeague == 1) {
                                if (typeof initiateWidgetLeague == 'function') {
                                    $('.loading').show();
                                    initiateWidgetLeague(widgetLeagueLocation, Widgetkey, $(this).find('a').attr("data-league-key"), $(this).find('a').text(), $(this).find('a').attr("data-league-logo"));
                                }
                            }
                            // If window size is less than 769px we activate the "hamburger" menu
                            if (windowWidthSize < 769) {
                                $('#hamburger').click();
                            }

                            $('.first-list-countryes').find('ul li').unbind('click').on('click', function() {

                                $([document.documentElement, document.body]).animate({
                                    scrollTop: 0
                                }, 1);

                                $('.widgetLiveScore').css('display', 'none');
                                $('.widgetLeague').css('display', 'block');
                                $('.first-list-countryes').css('display', 'block');
                                $('.mainPageHeader').show();
                                $('.callendar-select-for-mobile').hide();
                                $('.switchButton').html('Back to Live Score');

                                if (isWidgetLeague == 1) {
                                    if (typeof initiateWidgetLeague == 'function') {
                                        $('.loading').show();
                                        initiateWidgetLeague(widgetLeagueLocation, Widgetkey, $(this).find('a').attr("data-league-key"), $(this).find('a').text(), $(this).find('a').attr("data-league-logo"));
                                    }
                                }

                                if (windowWidthSize < 769) {
                                    $('#hamburger').click();
                                }

                            });
                        });

                    }).fail(function(error) {

                    });

                });
            }).fail(function(error) {

            });
        },

        callback: function() {

        }

    });

    $.fn.widgetCountries = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + widgetCountries)) {
                $.data(this, "plugin_" + widgetCountries, new Plugin(this, options));
            }
        });
        return this;
    };

    $.fn.widgetCountries.defaults = {
        // Widgetkey will be set in jqueryGlobals.js and can be obtained from your account
        Widgetkey: Widgetkey,
        // Action for this widget
        action: 'get_countries',
        // Link to server data
        countriesAjaxURL: 'https://apiv2.apifootball.com/?',
        // Location to your HTML (can be set here but recomended to put it where your activate your widget - index.html)
        widgetLeagueLocation: 'index.html',
        // Background color for your Countries Widget
        backgroundColor: null,
        // Set widgetLiveScore target
        widgetLiveScoreLocation: null,
        // Width for your Countries Widget
        widgetWidth: null,
        // You can set your preferential Countries
        preferentialCountries: null,
        // You can set your preferential Leagues, write them in the order you want to display them
        preferentialLeagues: null
    };

})(jQuery, window, document);