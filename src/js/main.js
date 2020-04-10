const BELL_STORAGE = 'SILENT_BELLS'
const PREFERENCE_STORAGE = 'PREFERENCE'
const frontendStorageDB = new StorageDB()
// Unread Button
const unreadButtonID = 'unreadButton'
const unreadButtonTextID = 'unreadButtonText'

function getHashID(key) {
    return CryptoJS.SHA256(key).toString().slice(0,7)
}

// ID is based on robot_name + robot_params
function calculateTarget(feedItem) {
    const input = String(feedItem.robotName) + feedItem.robotParams.join('')
    return getHashID(input)
}

// Prefix ID with 'bell-'
function calculateBellID(feedItem) {
    return 'bell-'+ calculateTarget(feedItem)
}

// Prefix ID with 'modal-'
function calculateModalID(feedItem) {
    return 'modal-'+ calculateTarget(feedItem)
}

let guideOfBellCount = 0

function markElementVisibility(idOfElement, visible = true) {
    const element = document.getElementById(idOfElement)
    if (!element) {
        console.error('cannot mark visible:', idOfElement)
        return;
    }
    if (visible) {
        element.removeAttribute('hidden')
        if (guideOfBellCount == 0){
            element.parentElement.parentElement.parentElement.parentElement.setAttribute('data-intro', 'Card is the main place you see updates of Twitter, Reddit and more.')
            element.parentElement.parentElement.parentElement.parentElement.setAttribute('data-position', 'bottom')
            element.parentElement.parentElement.parentElement.parentElement.setAttribute('data-step', '2')

            element.setAttribute('data-intro', 'Click the bell to see new updates.')
            element.setAttribute('data-step', '3')

            guideOfBellCount = 1
        }
    } else {
        element.setAttribute('hidden', true)
    }
}

// Show feed modal on an HTML element.
function showFeedModal(element){ // element = html element, card
    const targetURL = element.getAttribute('data-url')

    // grey the bell element
    const bellID = String(element.id).replace('card-', 'bell-')
    greyIt(bellID)
    // Set storage, that bell is visited.
    writeToSilentBells(bellID)
    
    // insert a dynamic modal. and bring up.
    const modalID = String(element.id).replace('card-', 'modal-')
    const target = $('#' + modalID)
    if (target.length > 0) {
        target.modal('show')
    } else {
        window.open(targetURL, "_blank")
    }
}

// {bell_id: last_silent_UTC_time_in_milliseconds}
function getSilentBells() {
    return frontendStorageDB.getTable(BELL_STORAGE)
}

function getBellSilent(bellID) {
    return frontendStorageDB.getKey(BELL_STORAGE, bellID)
}

function removeSilentBell(bellID) {
    frontendStorageDB.removeKey(BELL_STORAGE, bellID)
}

function writeToSilentBells(bellID) {
    frontendStorageDB.setKey(BELL_STORAGE, bellID, Date.now())
}

function markBellsVisibile(feedItems) {
    for (let feedItem of feedItems) {
        // no robot? skip!
        if (!feedItem.robotName) {
            continue
        }
        const bellID = calculateBellID(feedItem)
        // console.log(feedItem.robotName, feedItem.robotParams, bellID)
        const lastSilentTimeStamp = getBellSilent(bellID)
        if (!lastSilentTimeStamp) { // bell is clean an never touched!
            markElementVisibility(bellID, true)
        } else { // bell is silenced by user, so is there any new stuff?
            const itemTimeStamp = feedItem.pubDate * 1000
            if (itemTimeStamp > lastSilentTimeStamp) { // new stuff!
                removeSilentBell(bellID)
                markElementVisibility(bellID, true)
                colorIt(bellID)
            } else { // else old stuff, user has visited.
                markElementVisibility(bellID, true)
                greyIt(bellID)
            }
        }
    }
}

function groupFeedItems(feedItems) {
    const m = {} // key: [values]
    for (let feedItem of feedItems) {
        if (feedItem.robotName) {
            const groupKey = calculateTarget(feedItem)
            if (!m[groupKey]){
                m[groupKey] = [feedItem]
            } else {
                m[groupKey].push(feedItem)
            }
        }
    }

    return m
}

function greyIt(idOfElement) {
    $('#' + idOfElement).addClass('gray-out')
}

function colorIt(idOfElement) {
    $('#' + idOfElement).removeClass('gray-out')
}

function buildFeedModal(groupKey, feedItems) {
    let bigLink = undefined

    let elements = []
    for (let feed of feedItems) {
        const publishDate = feed.pubDate * 1000
        const now = Date.now()

        let displayDateString = ''
        if (now - publishDate > 12 * 3600 * 1000) {
            displayDateString = new Date(feed.pubDate*1000).toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})
        } else {
            displayDateString = new Date(feed.pubDate*1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        }

        const truncatedTitle = feed.title.length > 120 ? feed.title.slice(0, 120) + ' ...' : feed.title
        const excerpt = truncatedTitle.length > 0 ? truncatedTitle : "[Media post, click to view]"
        
        elements.push(`
        <li class="list-group-item">
          <a href="${feed.link}" target="_blank" class="text-info">${excerpt}</a>
          <div class="d-flex flex-row-reverse"><span class="text-muted">${displayDateString}</span></div>
        </li>`
        )

        if (!bigLink) {
            bigLink = feed.link
        }
    }

    elements = elements.slice(0, 5)

    const modal_string_middle = elements.join('')

    const modalTitle = '@' + feedItems[0].robotParams.join('/')
    const modal_html_part_1 = `
    <div id="modal-${groupKey}" class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title" id="exampleModalLongTitle">${modalTitle}</h5>
         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
           <span aria-hidden="true">&times;</span>
         </button>
       </div>
       <div class="modal-body p-0">
           <ul class="list-group list-group-flush" id="modal-ul">`

    const modal_string_part_2 = `
            </ul>
        </div>
        <div class="card-footer bg-transparent text-center"><a href="${bigLink}">View more...</a></div>
       </div>
     </div>
   </div>`

    const modal_string = modal_html_part_1 + modal_string_middle + modal_string_part_2
    const modal = $(modal_string)

    modal.appendTo($("html, body"))
}

async function fetchFeeds(endpoint, hours) {
    try {
        const resp = await fetch(`${endpoint}api/v1/feeds/?hours=` + String(hours))
        return await resp.json()
    } catch (err) {
        return []
    }
}

// Init the data and build the modals.
async function run() {
    // Get Feeds
    const feedItems = await fetchFeeds(API_ENDPOINT, 48)
    // console.log('feeds:', feedItems.length)

    // Mark Bells visible.
    markBellsVisibile(feedItems)

    // Build Feed Modals
    const groupedFeedItems = groupFeedItems(feedItems)
    for (let key in groupedFeedItems) {
        buildFeedModal(key, groupedFeedItems[key])
    }
}

// flip the unread button,
// change the preference in the storage.
// filter out the cards on the webpage.
function toggleUnreadButtonStatus(shouldUnread) {
    if (shouldUnread) { // should filter out unread
        $('#' + unreadButtonID).removeClass('btn-light').addClass('btn-warning')
        frontendStorageDB.setKey(PREFERENCE_STORAGE, "onlyUnread", true)
        $('.business-card')
            .filter(function(index, element) { // get those without bells.
                const bell = element.children[0].children[0].children[0].children[1]
                if (bell.hasAttribute('hidden')){
                    return true;
                } else {
                    return false
                }
            }).addClass('d-none')
    } else { // should not filter out any elements
        $('#' + unreadButtonID).removeClass('btn-warning').addClass('btn-light')
        frontendStorageDB.setKey(PREFERENCE_STORAGE, "onlyUnread", false)
        $('.business-card').removeClass('d-none')
    }
}

// sync the unread button from the storage
function syncUnreadButtonStatus() {
    const shouldUnread = frontendStorageDB.getKey(PREFERENCE_STORAGE, "onlyUnread")
    toggleUnreadButtonStatus(shouldUnread)
}

$('#' + unreadButtonID).click(function (eventObject){
    if (frontendStorageDB.getKey(PREFERENCE_STORAGE, "onlyUnread")){
        toggleUnreadButtonStatus(false)
    } else {
        toggleUnreadButtonStatus(true)
    }
})

const welcomeModalID = 'welcomeModal'

function syncWelcomeStatus() {
    if (frontendStorageDB.getKey(PREFERENCE_STORAGE, "oldVisitor")){
        return;
    } else {
        $('html, body').stop().animate({ scrollTop: '+0' }, 600);
        $('#' + welcomeModalID).modal('show')
        frontendStorageDB.setKey(PREFERENCE_STORAGE, "oldVisitor", true)
    }
}

$('#' + 'user-guide-link').click(function(eventObject) {
    eventObject.preventDefault();
    $('html, body').stop().animate({ scrollTop: '+0' }, 600);
    $('#' + welcomeModalID).modal('show')
})

const getStartedButtonID = 'getStartedButton'
const welcomeDoneModalID = 'welcomeDoneModal'

$('#' + getStartedButtonID).click(function(){
    introJs()
    .setOption("hidePrev", true)
    .setOption("hideNext", true)
    .setOption("showBullets", false)
    .setOption("scrollToElement", true)
    .setOption("exitOnOverlayClick", false)
    .setOption("exitOnEsc", false)
    .setOption("tooltipClass", "bg-warning text-body")
    .oncomplete(function(){
        $('#' + welcomeDoneModalID).modal('show')
    })
    .onbeforechange(function(targetElement) {
        if (targetElement.id == "unreadButton") {
            $('html, body').stop().animate({ scrollTop: '+0' }, 000);
        }
    })
    .start(); 
})

$(document).ready(function(){
    run()
        .then(() => {console.log('init complete.');})
        .then(() => {syncUnreadButtonStatus(); console.log('sync unread button complete.'); })
        .then(() => {syncWelcomeStatus(); console.log('Guide is shown or hide.')})
})
