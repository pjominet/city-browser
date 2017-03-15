$(document).ready(function () {

    /** Initialization **/
    let searchResults = 0;
    let searchByOption = 0; //default state, 1 = German, 2 = English
    let searchBar = $('#searchBar').focus();
    let searchButton = $('#searchButton');

    /** Data Handler **/
    let cities;
    let weather;
    let apiKey = "abcbdb8391c5d46d624cb81ecbdd9d91";
    let icon;
    let temp;

    function queryCities() {
        let deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: "data/cities.xml",
            dataType: "xml",
            success: function (data) {
                cities = data;
            }
        });
        return deferred.promise();
    }

    function queryWeather(cityName, countryCode) {
        let apiURL = 'http://api.openweathermap.org/data/2.5/weather?mode=xml&units=metric'
            + '&q=' + cityName + ',' + countryCode.toLowerCase()
            + '&APPID=' + apiKey;
        //console.log(apiURL);
        let deferred = $.Deferred();
        // limited to 60 calls/minute
        $.ajax({
            type: 'GET',
            url: apiURL,
            dataType: "xml",
            success: function (data) {
                weather = data;
                if(weather != undefined) {
                    icon = $(weather).find('weather').attr('icon') + '.png';
                    temp = $(weather).find('temperature').attr('value') + '°C';
                }
            }
        });
        return deferred.promise();
    }

    /** Action Handlers **/
    //instantly query City Data
    queryCities();

    // when any key is pressed while typing
    searchBar.keyup(
        function () {
            executeSearch();
        });

    // when search button is clicked
    searchButton.click(
        function () {
            executeSearch();
        });

    /** Button label Handlers **/
    let appendDefaultOption = false; //default state

    $('#searchGerman').click(
        function (event) {
            event.preventDefault();
            if (!appendDefaultOption) {
                appendDropdownDefault();
                appendDefaultOption = true;
            }
            changeDropdownLabel('Deutsch');
            searchByOption = 1;
            let checkInput = searchBar.val();
            if (checkInput != '') {
                executeSearch();
            }
            searchBar.focus();
        });

    $('#searchEnglish').click(
        function (event) {
            event.preventDefault();
            if (!appendDefaultOption) {
                appendDropdownDefault();
                appendDefaultOption = true;
            }
            changeDropdownLabel('English');
            searchByOption = 2;
            let checkInput = searchBar.val();
            if (checkInput != '') {
                executeSearch();
            }
            searchBar.focus();
        });

    $('#dropdownLabelList').on('click', '#searchAll', function (event) {
        event.preventDefault();
        changeDropdownLabel('International');
        searchByOption = 0;
        if (appendDefaultOption) {
            $('li.divider').remove();
            $('li').filter(":contains('International')").remove();
            appendDefaultOption = false;
        }
        let checkInput = searchBar.val();
        if (checkInput != '') {
            executeSearch();
        }
        searchBar.focus();
    });

    /** Dropdown Handlers **/
    function changeDropdownLabel(label) {
        $('#dropdownLabel').html(
            label + '&nbsp;' +
            '<span class="caret"></span>'
        );
    }

    function appendDropdownDefault() {
        $('#dropdownLabelList').append(
            '<li class="divider"></li>' +
            '<li><a href="#" id="searchAll">International</a></li>'
        );
    }


    /** Input Handler **/
    function executeSearch() {
        //reset variables & flush old data
        searchResults = 0;
        matchedCities = [];
        $('#accordion').empty();
        // start search
        let userInput = searchBar.val();
        searchCities(userInput);
        resultPanelHandler();
    }

    /** Search Algorithms **/
    let matchedCities = [];
    let cityName = {en: "", de: ""};
    let descriptionAuthor = "";
    let countryCode = "";
    let descriptionAbstract = {en: "", de: ""};
    let nameWithLangExt;

    function searchCities(input) {
        // all input to lowercase for better comparability
        input = input.toLowerCase();

        if (input.length > 0 && !/(\s+)/.test(input)) {
            if (cities != undefined) {
                $.each($(cities).find('city'), function (index, city) {
                    descriptionAuthor = $(city).find('description').find('author').text();
                    countryCode = $(city).find('countryCode').text();
                    cityName["en"] = $(city).find('cityName[lang="en"]').text();
                    cityName["de"] = $(city).find('cityName[lang="de"]').text();
                    descriptionAbstract["en"] = $(city).find('description').find('abstract[lang="en"]').text();
                    descriptionAbstract["de"] = $(city).find('description').find('abstract[lang="de"]').text();
                    //console.log(index + '=' + cityName);
                    $.each(cityName, function (key, value) {
                        //console.log(key + '=' + value);
                        if (searchByOption === 0) {
                            if (cityName[key].toLowerCase().includes(input)) {
                                if (findCityInArray(cityName[key]) == null) {
                                    if (cityName["en"] == cityName["de"])
                                        nameWithLangExt = cityName[key] + " (" + key + ")";
                                    else
                                        nameWithLangExt = cityName[key];
                                    matchedCities.push({
                                        name: nameWithLangExt,
                                        author: descriptionAuthor,
                                        abstract: descriptionAbstract[key],
                                        cc: countryCode
                                    });
                                    searchResults++;
                                }
                            }
                        } else if (searchByOption === 1) {
                            if (cityName["de"].toLowerCase().includes(input)) {
                                if (findCityInArray(cityName["de"]) == null) {
                                    matchedCities.push({
                                        name: cityName["de"],
                                        author: descriptionAuthor,
                                        abstract: descriptionAbstract["de"],
                                        cc: countryCode
                                    });
                                    searchResults++;
                                }
                            }
                        } else if (searchByOption === 2) {
                            if (cityName["en"].toLowerCase().includes(input)) {
                                if (findCityInArray(cityName["en"]) == null) {
                                    matchedCities.push({
                                        name: cityName["en"],
                                        author: descriptionAuthor,
                                        abstract: descriptionAbstract["en"],
                                        cc: countryCode
                                    });
                                    searchResults++;
                                }
                            }
                        }
                    })
                });
            }
        }
    }

    function findCityInArray(byName) {
        for (let i = 0, len = matchedCities.length; i < len; i++) {
            if (matchedCities[i].name === byName)
                return matchedCities[i];
        }
        return null;
    }

    /** Result Panel Handler **/
    function resultPanelHandler() {
        let input = searchBar.val();
        let resultPanel = $('#resultPanel');
        if (searchResults > 0 && input.length > 1) {
            resultPanel.replaceWith(
                '<div class="panel panel-default" id="resultPanel">' +
                    '<div class="panel-heading">' +
                        '<h3>Search Results&nbsp;<span class="label label-info" id="resultNbr">' + searchResults + '</span></h3>' +
                    '</div>' +
                    '<div class="panel-body">' +
                        '<!-- Accordion View -->' +
                        '<div class="panel-group" id="accordion"></div>' +
                    '</div>' +
                '</div>'
            );
            generateAccordion(searchResults);

        } else if (searchResults === 0 && input.length > 2 && !/(\s+)/.test(input)) {
            resultPanel.replaceWith(
                '<div class="alert alert-warning" id="resultPanel">' +
                '<p><span class="glyphicon glyphicon-remove"></span>&nbsp;No city found</p>' +
                '</div>'
            );
        } else {
            resultPanel.replaceWith(
                '<div id="resultPanel"></div>'
            );
        }
    }

    /** Accordion Constructor **/
    let nameWithoutExt;
    let cc;
    let weatherDisplay;

    function generateAccordion(numberResults) {
        let accordion = '';

        for (let i = 0; i < numberResults; i++) {
            nameWithoutExt = matchedCities[i].name.replace('(en)', '').replace('(de)', '').replace(' ', '');
            cc = matchedCities[i].cc;
            queryWeather(nameWithLangExt, cc);
            // set loading icon if ajax hasn't completed yet or request limit is exceeded
            if (icon != undefined && temp != undefined && matchedCities.length < 60) {
                weatherDisplay = '<img src="http://openweathermap.org/img/w/' + icon + '" alt="current weather icon">&nbsp;@&nbsp;' + temp;
            } else
                weatherDisplay = '<img src="img/loading.svg" alt="current weather icon">';

            accordion +=
                '<!-- Tab ' + (i + 1) + ' -->' +
                '<div class="panel panel-default">' +
                    '<div class="panel-heading accordion-heading" data-toggle="collapse" data-target="#collapse_' + i + '" data-parent="#accordion">' +
                        '<h4 class="panel-title">' + matchedCities[i].name + '</h4>' +
                    '</div>' +
                    '<!-- Collapsible Content -->' +
                    '<div id="collapse_' + i + '" class="panel-collapse collapse">' +
                        '<ul class="list-group">' +
                            '<li class="list-group-item">' +
                                '<p class="list-group-item-text">' + cc + '</p>' +
                            '</li> ' +
                            '<li class="list-group-item">' +
                                '<p class="list-group-item-text">' +
                                    weatherDisplay +
                                '</p>' +
                            '</li>' +
                            '<li class="list-group-item">' +
                                '<p class="list-group-item-text">' + matchedCities[i].abstract + '</p>' +
                            '</li>' +
                        '</ul>' +
                        '<div class="panel-footer text-muted small">' + matchedCities[i].author + '</div>' +
                    '</div>' +
                '</div>'
            }
        $('#accordion').append(accordion).find('.panel-collapse:first').addClass("in");
    }
});