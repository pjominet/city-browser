$(document).ready(function () {

    /** Initialization **/
    let submitButton = $('#submit');
    let resetButton = $('#resetForm');
    let authorInput = $('#inputAuthor').focus();
    let countryPicker = $('#countryPicker');
    let cityInputEN = $('#inputCity-en');
    let cityInputDE = $('#inputCity-de');
    let abstractInputEN = $('#inputAbstract-en');
    let abstractInputDE = $('#inputAbstract-de');


    /** Country Picker Constructor **/
    let countries;

    $.ajax({
        type: 'GET',
        url: "data/countries.xml",
        dataType: "xml",
        success: function (countries) {
            let options = '';
            $.each($(countries).find('country'), function(index, country) {
                let countryCode = $(country).find('countryCode').text();
                let label = $(country).find('name').text();
                options += ("<option value='"+ countryCode +"'>"+ label +"</option>");
            });
            countryPicker.append(options);
        }
    });

    /** Input Handlers **/
    let authorIsSet = false;
    let cityEnIsSet = false;
    let cityDeIsSet = false;
    let abstractEnIsSet = false;
    let abstractDeIsSet = false;

    authorInput.keyup(function () {
        authorIsSet = validateInput(authorInput.val(), $('#validateAuthor'));
        everythingIsSet();
        somethingIsSet();
    });

    cityInputEN.keyup(function () {
        cityEnIsSet = validateInput(cityInputEN.val(), $('#validateCity-en'));
        everythingIsSet();
        somethingIsSet();
    });

    cityInputDE.keyup(function () {
        cityDeIsSet = validateInput(cityInputDE.val(), $('#validateCity-de'));
        everythingIsSet();
        somethingIsSet();
    });

    abstractInputEN.keyup(function () {
        abstractEnIsSet = validateInput(abstractInputEN.val(), $('#validateAbstract-en'));
        everythingIsSet();
        somethingIsSet();
    });

    abstractInputDE.keyup(function () {
        abstractDeIsSet = validateInput(abstractInputDE.val(), $('#validateAbstract-de'));
        everythingIsSet();
        somethingIsSet();
    });

    countryPicker.click(function () {
        everythingIsSet();
        somethingIsSet();
    });

    /** Validate Inputs **/
    function validateInput(input, inputField) {
        if (input != "") {
            inputField.addClass('has-success');
            return true;
        } else {
            inputField.removeClass('has-success');
            return false;
        }
    }

    function everythingIsSet() {
        if (authorIsSet &&
            ((cityDeIsSet && abstractDeIsSet) || (cityEnIsSet && abstractEnIsSet)) &&
            countryPicker.find('option:selected').val() != 'placeholder') {
            submitButton.removeAttr('disabled');
            return true;
        } else {
            submitButton.attr('disabled', true);
            return false;
        }
    }

    function somethingIsSet() {
        if(authorIsSet || cityDeIsSet || cityInputEN || abstractDeIsSet || abstractEnIsSet ||
            countryPicker.find('option:selected').val() != 'placeholder') {
            resetButton.removeAttr('disabled');
            return true;
        }
        else return false;
    }

    /** Submit Addition **/
    submitButton.click(
        function (event) {
            event.preventDefault();

            let city = {
                author: authorInput.val(),
                nameEn: cityInputEN.val(),
                nameDe: cityInputDE.val(),
                abstractEn: abstractInputEN.val(),
                abstractDe: abstractInputDE.val(),
                countryCode: countryPicker.find('option:selected').val()
            };
            let message = $('#operationMessage');

            $.post("php/addToXML.php", {data: city}, function (response) {
                //console.log(response);
                if (response == 200) {
                    message.replaceWith(
                        '<div class="alert alert-success" id="operationMessage">' +
                        '<p><span class="glyphicon glyphicon-ok"></span> Addition of ' + cityInputEN.val() + 'successful.</p>' +
                        '</div>'
                    );
                    resetButton.click();
                } else {
                    message.replaceWith(
                        '<div class="alert alert-danger" id="operationMessage">' +
                        '<p>' +
                        '<span class="glyphicon glyphicon-remove"></span> ' +
                        response + '<br>' +
                        '</p>' +
                        '</div>'
                    );
                }
            });
        });

    /** Reset Form **/
    resetButton.click (
        function (event) {
            event.preventDefault();
            $(this).closest('form').find("input, textarea").val("");
            resetButton.attr('disabled', true);
            submitButton.attr('disabled', true);
            validateInput(authorInput.val(), $('#validateAuthor'));
            validateInput(cityInputEN.val(), $('#validateCity-en'));
            validateInput(cityInputDE.val(), $('#validateCity-de'));
            validateInput(abstractInputEN.val(), $('#validateAbstract-en'));
            validateInput(abstractInputDE.val(), $('#validateAbstract-de'));
            authorInput.focus();
        }
    )
});