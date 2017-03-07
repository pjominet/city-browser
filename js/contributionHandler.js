$(document).ready(function () {

    /** Initialization **/
    var submitButton = $('#submit');
    var resetButton = $('#resetForm');
    var authorInput = $('#inputAuthor').focus();
    var cityInputEN = $('#inputCity-en');
    var cityInputDE = $('#inputCity-de');
    var abstractInputEN = $('#inputAbstract-en');
    var abstractInputDE = $('#inputAbstract-de');
    var authorIsSet = false;
    var cityEnIsSet = false;
    var cityDeIsSet = false;
    var abstractEnIsSet = false;
    var abstractDeIsSet = false;

    /** Input Handler **/
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
        if (authorIsSet && ((cityDeIsSet && abstractDeIsSet) || (cityEnIsSet && abstractEnIsSet))) {
            submitButton.removeAttr('disabled');
            return true;
        } else {
            submitButton.attr('disabled', true);
            return false;
        }
    }

    function somethingIsSet() {
        if(authorIsSet || cityDeIsSet || cityInputEN || abstractDeIsSet || abstractEnIsSet) {
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
                author: authorInput.val(),
                nameEn: cityInputEN.val(),
                nameDe: cityInputDE.val(),
                abstractEn: abstractInputEN.val(),
                abstractDe: abstractInputDE.val()
            };
            var message = $('#operationMessage');

            $.post("php/addToXML.php", {data: city}, function (response) {
                //console.log(response);
                if (response == true) {
                    message.replaceWith(
                        '<div class="alert alert-success" id="operationMessage">' +
                        '<p><span class="glyphicon glyphicon-ok"></span> Addition successful.</p>' +
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