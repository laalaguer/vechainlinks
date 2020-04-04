/**
 * Depends on:
 * jQuery
 * env.js
 */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const subscribeModalID = 'emailSubscribeModal'
const userEmailInputID = 'userEmailInput'
const emailSubmitButtonID = 'emailSubmitButton'
const emailLabelID = 'emailLabel'
const emailSentTextID = 'emailSentText'
const formUserInputID = 'formUserInput'
const badMessageID = 'badMessage'
const subscribeFooterID = 'subscribeFooter'

// Bring up the subscribe modal.
function bringUpEmailSubscribeModal(){
    $('#' + emailLabelID).removeClass('text-danger')
    $('#' + emailLabelID).text('Email address')
    $('#' + subscribeModalID).modal('show')
    $('#' + formUserInputID).removeClass('d-none').addClass('d-block')
    $('#' + userEmailInputID).val('')
    $('#' + emailSentTextID).removeClass('d-block').addClass('d-none')
    $('#' + badMessageID).removeClass('d-block').addClass('d-none')
    $('#' + subscribeFooterID).removeClass('d-none')
    $('#' + emailSubmitButtonID).removeAttr('disabled')
}

// Try to XHR subscribe and hear from the server.
async function trySubscribe(userEmail, endpoint) {
    try {
        const response = await fetch(`${endpoint}subscribe/?email=${userEmail}`)
        const data = await response.json()
        if (!data.success) { // subscribe failed.
            console.log(data)
            const table = {
                'email-included': 'You already subscribed!',
                'email-invalid': 'Email format invalid',
                'need-email': 'Where is the email address?',
                'email-already-sent': 'Email is sent, check your mailbox (spam folder especially), if the problem persists, write to admin@vechainlinks.com'
            }
            console.log(data.success)
            const message = table[data.message]
            console.log('message', message)
            $('#' + badMessageID).text(message)
            $('#' + badMessageID).removeClass('d-none').addClass('d-block')
            $('#' + formUserInputID).removeClass('d-block').addClass('d-none')
            $('#' + emailSubmitButtonID).attr('disabled', true)
            // hide footer
            $('#' + subscribeFooterID).removeClass('d-block').addClass('d-none')
        } else { // subscribe success!
            console.log('good!')
            // clean up input, hide input area.
            $('#' + userEmailInputID).text('')
            $('#' + formUserInputID).removeClass('d-block').addClass('d-none')
            // Show "Email is sent, check your mailbox (maybe spam folder)."
            $('#' + emailSentTextID).removeClass('d-none').addClass('d-block')
            // button color=success text=Success! clickable=false
            $('#' + emailSubmitButtonID).attr('disabled', true)
            // hide footer
            $('#' + subscribeFooterID).removeClass('d-block').addClass('d-none')
        }
    } catch (err) {
        console.error(err)
    }
}

// Once click, show the modal.
$('#subscribe-email-button').click(function (eventObject) {
    eventObject.preventDefault();
    bringUpEmailSubscribeModal()
})

$('#subscribe-email-link').click(function (eventObject) {
    eventObject.preventDefault();
    bringUpEmailSubscribeModal()
})

$('#subscribe-big-button').click(function (eventObject) {
    eventObject.preventDefault();
    bringUpEmailSubscribeModal()
})


// Once click, verify the email address and submit/show error.
$('#' + emailSubmitButtonID).click(function (eventObject) {
    eventObject.preventDefault();

    // console.log(eventObject)
    const userEmail = $('#' + userEmailInputID).val()
    if (!userEmail.match(EMAIL_REGEX)) {
        $('#' + emailLabelID).addClass("text-danger")
        $('#' + emailLabelID).text("Email invalid, please check.")
        return;
    } else {
        console.log(userEmail, API_ENDPOINT)
        trySubscribe(userEmail, API_ENDPOINT)
    }

    
})

// Turn email input box back to normal once user is typing.
$('#' + userEmailInputID).on('keydown', function (eventObject) {
    const userEmail = $('#' + userEmailInputID).val()
    if (!userEmail.match(EMAIL_REGEX)) {
        $('#' + emailLabelID).text("Email address, continue typing...")
        $('#' + emailLabelID).removeClass("text-danger").addClass("text-black")
    } else {
        $('#' + emailLabelID).text("Email address, looks good!")
        $('#' + emailLabelID).removeClass("text-danger")
    }
})