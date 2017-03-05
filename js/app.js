$(document).ready(function () {

    /** Initialization **/
    var cities;
    var weather;
    var searchResults = 0;
    var searchByOption = 0; //default state
    var appendState = false; //default state
    var searchBar = $('#searchBar');
    var searchButton = $('#searchButton');
    var apiKey = "abcbdb8391c5d46d624cb81ecbdd9d91";
    searchBar.focus();

    /** Data Handler **/
    function queryCity() {
        $.get("data/cities.xml", function (data) {
            cities = data;
        }, "xml");
    }

    function queryWeather(query) {
        $.get("api.openweathermap.org/data/2.5/weather?q=" + query, function (data) {
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
        // start search
        var userInput = searchBar.val();
        search(userInput);
        resultPanelHandler();
        //data handler ---- here -----
    }

    /** Search Algorithm **/
    function search(input) {
        input = input.toLowerCase();
        queryCity()
    }

    /** Result Panel Handler **/
    function resultPanelHandler() {
        var checkInput = searchBar.val();
        var resultPanel = $('#resultPanel');
        if (searchResults > 0) {
            resultPanel.replaceWith(
                '<div class="panel panel-default" id="resultPanel">' +
                '<div class="panel-heading">' +
                '<h4 class="panel-title">' + cities.name + '</h4>' +
                '</div>' +
                '<div class="panel-body">' +
                '<ul class="list-group">' +
                '<li class="list-group-item">' +
                '<p class="list-group-item-text">' + cities.abstract + '</p>' +
                '</li>' +
                '<li class="list-group-item">' +
                '<p class="list-group-item-text">' + cities.author + '</p>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>'
            );

        } else if (searchResults === 0 && checkInput != '') {
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
});