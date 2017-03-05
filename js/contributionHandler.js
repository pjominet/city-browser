$(document).ready(function () {

    /** Initialization **/
    var submitButton = $('#submitBook');
    var resetButton = $('#resetForm');
    var cityInput = $('#inputCity').focus();
    var authorInput = $('#inputAuthor');
    var abstractInput = $('#inputAbstract');
    var cityIsSet = false;
    var authorIsSet = false;
    var abstractIsSet = false;

    /** Input Handler **/
    cityInput.keyup(function () {
        cityIsSet = validateInput(cityInput.val(), $('#validateCity'));
        everythingIsSet();
        somethingIsSet();
    });

    authorInput.keyup(function () {
        authorIsSet = validateInput(authorInput.val(), $('#validateAuthor'));
        everythingIsSet();
        somethingIsSet();
    });

    abstractInput.keyup(function () {
        abstractIsSet = validateInput(abstractInput.val(), $('#validateAbstract'));
        everythingIsSet();
        somethingIsSet();
    });

    /** Validate Input Values **/
    function validateInput(input, inputField) {
        if (input != '') {
            inputField.addClass('has-success');
            return true;
        } else {
            inputField.removeClass('has-success');
            return false;
        }
    }

    function everythingIsSet() {
        if (cityIsSet && authorIsSet && abstractIsSet) {
            submitButton.removeAttr('disabled');
            return true;
        } else {
            submitButton.attr('disabled', true);
            return false;
        }
    }

    function somethingIsSet() {
        if(cityIsSet || authorIsSet || abstractIsSet) {
            resetButton.removeAttr('disabled');
            return true;
        }
        else return false;
    }

    /** Submit Addition **/
    submitButton.click(
        function (event) {
            event.preventDefault();

            var city = {
                name: cityInput.val(),
                author: authorInput.val(),
                abstract: abstractInput.val()
            };
            var message = $('#operationMessage');

            $.post("php/addToXML.php", {xmlData: city}, function (response) {
                //console.log(response);
                if (response == true) {
                    message.replaceWith(
                        '<div class="alert alert-success" id="operationMessage">' +
                        '<p><span class="glyphicon glyphicon-ok"></span> Addition successful.</p>' +
                        '</div>'
                    )
                } else {
                    message.replaceWith(
                        '<div class="alert alert-danger" id="operationMessage">' +
                        '<p>' +
                        '<span class="glyphicon glyphicon-remove"></span> ' +
                        response + '<br>' +
                        '</p>' +
                        '</div>'
                    )
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
            validateInput(cityInput.val(), $('#validateCity'));
            validateInput(authorInput.val(), $('#validateAuthor'));
            validateInput(abstractInput.val(), $('#validateAbstract'));
            cityInput.focus();
        }
    )
});