$(document).ready(function () {

    /** Initialization **/
    var cities;
    var matchedCities = [];
    var weather;
    var matchedWeather = [];
    var searchResults = 0;
    var searchByOption = 0; //default state, 1 = German, 2 = English
    var appendState = false; //default state
    var searchBar = $('#searchBar');
    var searchButton = $('#searchButton');
    var apiKey = "abcbdb8391c5d46d624cb81ecbdd9d91";
    searchBar.focus();

    /** Data Handler **/
    function queryCities() {
        $.get("data/cities.xml", function (data) {
            cities = data;
        }, "xml");
    }

    function queryWeather(query, language) {
        $.get('http://api.openweathermap.org/data/2.5/weather?q=' + query +
            '&APPID=' + apiKey +
            '&units=metric' +
            '&lang=' + language, function (data) {
            weather = data;
        }, "xml");
    }

    /** Action Handlers **/
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

    $('#searchGerman').click(
        function (event) {
            event.preventDefault();
            if (!appendState) {
                appendDropdownDefault();
                appendState = true;
            }
            changeDropdownLabel('German');
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
        changeDropdownLabel('All');
        searchByOption = 0;
        if (appendState) {
            $('li.divider').remove();
            $('li').filter(":contains('All')").remove();
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
            '<li><a href="#" id="searchAll">All</a></li>'
        );
    }


    /** Input Handler **/
    function executeSearch() {
        //reset variables & flush old data
        searchResults = 0;
        matchedCities = [];
        $('#accordion').empty();
        // start search
        var userInput = searchBar.val();
        search(userInput);
        resultPanelHandler();

    }

    /** Search Algorithm **/
    function search(input) {
        input = input.toLowerCase();
        queryCities();

        var cityName = [];
        var descriptionAuthor = "";
        var descriptionAbstract = [];

        // do not search when input is less than 3 characters
        if (input.length > 2) {
            if(cities != undefined) {
                $.each($(cities).find('city'), function () {
                    descriptionAuthor = $(this).find('description').find('author').text();
                    cityName.push($(this).find('cityName[lang="en"]').text());
                    cityName.push($(this).find('cityName[lang="de"]').text());
                    descriptionAbstract.push($(this).find('description').find('abstract[lang="en"]').text());
                    descriptionAbstract.push($(this).find('description').find('abstract[lang="de"]').text());
                });
                if(searchByOption === 0) {
                    if(cityName[0].toLowerCase().includes(input) || cityName[1].toLowerCase().includes(input)) {
                        matchedCities.push({
                            name: cityName[0],
                            author: descriptionAuthor,
                            abstract: descriptionAbstract[0]
                        });
                        searchResults++;
                    }
                } else if(searchByOption === 1) {
                    if(cityName[1].toLowerCase().includes(input)) {
                        matchedCities.push({
                            name: cityName[1],
                            author: descriptionAuthor,
                            abstract: descriptionAbstract[1]
                        });
                        searchResults++;
                    }
                } else if(searchByOption === 2) {
                    if(cityName[0].toLowerCase().includes(input)) {
                        matchedCities.push({
                            name: cityName[0],
                            author: descriptionAuthor,
                            abstract: descriptionAbstract[0]
                        });
                        searchResults++;
                    }
                }
            }
        }
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
            generateAccordion(searchResults);

        } else if (searchResults === 0 && checkInput.length > 2) {
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

    /** Accordion **/
    function generateAccordion(numberResults) {

        var accordion = '';

        for (var i = 0; i < numberResults; i++) {

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
                '<p class="list-group-item-text">' + matchedCities[i].abstract + '</p>' +
                '</li>' +
                '<li class="list-group-item">' +
                '<p class="list-group-item-text">' + 'Wetter' + '</p>' +
                '</li>' +
                '</ul>' +
                '<div class="panel-footer text-muted">' + matchedCities[i].author + '</div>' +
                '</div>' +
                '</div>'

        }
        $('#accordion').append(accordion);
    }
});