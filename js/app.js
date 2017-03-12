$(document).ready(function () {

    /** Initialization **/
    var cities;
    var matchedCities = [];
    var cityName = {en:"", de:""};
    var descriptionAuthor = "";
    var descriptionAbstract = {en:"", de:""};
    var nameWithLangExt;
    var weather;
    var searchResults = 0;
    var searchByOption = 0; //default state, 1 = German, 2 = English
    var appendState = false; //default state
    var searchBar = $('#searchBar');
    var searchButton = $('#searchButton');
    var apiKey = "abcbdb8391c5d46d624cb81ecbdd9d91";
    var weatherImgRoot = "http://openweathermap.org/img/w/";
    searchBar.focus();

    /** Data Handler **/
    function queryCities() {
        var deferred = $.Deferred();
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

    function queryWeather(cityName) {
        var apiURL = 'http://api.openweathermap.org/data/2.5/weather?mode=xml&units=metric' +'&q='+ cityName +'&APPID='+ apiKey;
        //console.log(apiURL);
        var deferred = $.Deferred();
        $.ajax({
            type: 'GET',
            url: apiURL,
            dataType: "xml",
            success: function (data) {
                weather = data;
            }
        });
        return deferred.promise();
    }

    /** Action Handlers **/
    //instantly query Data
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
    $('#searchGerman').click(
        function (event) {
            event.preventDefault();
            if (!appendState) {
                appendDropdownDefault();
                appendState = true;
            }
            changeDropdownLabel('Deutsch');
            searchByOption = 1;
            var checkInput = searchBar.val();
            if (checkInput != '') {
                executeSearch();
            }
            searchBar.focus();
        });

    $('#searchEnglish').click(
        function (event) {
            event.preventDefault();
            if (!appendState) {
                appendDropdownDefault();
                appendState = true;
            }
            changeDropdownLabel('English');
            searchByOption = 2;
            var checkInput = searchBar.val();
            if (checkInput != '') {
                executeSearch();
            }
            searchBar.focus();
        });

    $('#dropdownLabelList').on('click', '#searchAll', function (event) {
        event.preventDefault();
        changeDropdownLabel('International');
        searchByOption = 0;
        if (appendState) {
            $('li.divider').remove();
            $('li').filter(":contains('International')").remove();
            appendState = false;
        }
        var checkInput = searchBar.val();
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
        console.log(weather);
        $('#accordion').empty();
        // start search
        var userInput = searchBar.val();
        searchCities(userInput);
        resultPanelHandler();

    }

    /** Search Algorithms **/
    function searchCities(input) {
        // all input to lowercase for better comparability
        input = input.toLowerCase();

        if (input.length > 0 && !/(\s+)/.test(input)) {
            if(cities != undefined) {
                $.each($(cities).find('city'), function (index, city) {
                    descriptionAuthor = $(city).find('description').find('author').text();
                    cityName["en"] = $(city).find('cityName[lang="en"]').text();
                    cityName["de"] = $(city).find('cityName[lang="de"]').text();
                    descriptionAbstract["en"] = $(city).find('description').find('abstract[lang="en"]').text();
                    descriptionAbstract["de"] = $(city).find('description').find('abstract[lang="de"]').text();
                    //console.log(index + '=' + cityName);
                    $.each(cityName, function (key, value) {
                        //console.log(key + '=' + value);
                        if (searchByOption === 0) {
                            if (cityName[key].toLowerCase().includes(input)) {
                                if (cityName["en"] == cityName["de"])
                                    nameWithLangExt = cityName[key] + " (" + key + ")";
                                else
                                    nameWithLangExt = cityName[key];
                                matchedCities.push({
                                    name: nameWithLangExt,
                                    author: descriptionAuthor,
                                    abstract: descriptionAbstract[key]
                                });
                                searchResults++;
                            }
                        } else if (searchByOption === 1) {
                            if (cityName["de"].toLowerCase().includes(input)) {
                                if (findCityInArray(cityName["de"]) == null) {
                                    matchedCities.push({
                                        name: cityName["de"],
                                        author: descriptionAuthor,
                                        abstract: descriptionAbstract["de"]
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
                                        abstract: descriptionAbstract["en"]
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

    function getWeatherIcon(city) {
        queryWeather(city);
        if(weather != undefined) {
            return $(weather).find('weather').attr('icon') + '.png';
        }
    }

    function getWeatherTemp(city) {
        queryWeather(city);
        if(weather != undefined) {
            return $(weather).find('temperature').attr('value') + '°C';
        }
    }

    function findCityInArray (byName) {
        for (var i = 0, len = matchedCities.length; i < len; i++) {
            if (matchedCities[i].name === byName)
                return matchedCities[i];
        }
        return null;
    }

    /** Result Panel Handler **/
    function resultPanelHandler() {
        var checkInput = searchBar.val();
        var resultPanel = $('#resultPanel');
        if (searchResults > 0) {
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
            setTimeout(generateAccordion(searchResults), 1000);

        } else if (searchResults === 0 && checkInput.length > 2 && !/(\s+)/.test(checkInput)) {
            resultPanel.replaceWith(
                '<div class="alert alert-warning" id="resultPanel">' +
                '<p><span class="glyphicon glyphicon-remove"></span> No city found</p>' +
                '</div>'
            );
        } else {
            resultPanel.replaceWith(
                '<div id="resultPanel"></div>'
            );
        }
    }

    /** Accordion Constructor **/
    function generateAccordion(numberResults) {
        var accordion = '';

        for (var i = 0; i < numberResults; i++) {
            var nameWihtoutExt = matchedCities[i].name.replace('(en)', '').replace('(de)', ''). replace(' ', '');
            var icon = getWeatherIcon(nameWihtoutExt);
            var temp = getWeatherTemp(nameWihtoutExt);

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
                                '<p class="list-group-item-text">' +
                                    '<img src="' + weatherImgRoot + icon + '" alt="current weather icon"> ' +
                                    '&nbsp;@&nbsp;' + temp +
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