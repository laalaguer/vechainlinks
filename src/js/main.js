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

function markElementVisibility(idOfElement, visible = true) {
    const element = document.getElementById(idOfElement)
    if (!element) {
        console.error('cannot mark visible:', idOfElement)
        return;
    }
    if (visible) {
        element.removeAttribute('hidden')
    } else {
        element.setAttribute('hidden', true)
    }
}

function showFeedModal(element){ // element = html element
    const currentID = element.id
    // grey the current element
    greyIt(currentID)
    // Set cookie, that bell-is-visited.
    writeToSilentBells(currentID)
    // insert a dynamic modal. and bring up.
    const modalID = String(element.id).replace('bell-', 'modal-')
    $('#' + modalID).modal('show')
}

const BELL_STORAGE = 'SILENT_BELLS'
const cookieDB = new CookieDB()

// {bell_id: last_silent_UTC_time_in_milliseconds}
function getSilentBells() {
    return cookieDB.getTable(BELL_STORAGE)
}

function getBellSilent(bellID) {
    return cookieDB.getKey(BELL_STORAGE, bellID)
}

function removeSilentBell(bellID) {
    cookieDB.removeKey(BELL_STORAGE, bellID)
}

function writeToSilentBells(bellID) {
    cookieDB.setKey(BELL_STORAGE, bellID, Date.now())
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
        // displayDateString = new Date(feed.pubDate*1000).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})
        
        const truncatedTitle = feed.title.length > 120 ? feed.title.slice(0, 120) + ' ...' : feed.title
        const excerpt = truncatedTitle.length > 0 ? truncatedTitle : "[Nonverbal update, click to see more]"
        
        // https://vechainlinks.com/permalink/${feed.cryptoID}
        elements.push(`
        <li class="list-group-item">
          <a href="${feed.link}" target="_blank">${excerpt}</a>
          
          <div class="d-flex flex-row-reverse"><span class="text-muted">${displayDateString}</span></div>
        </li>`
        )
    }

    elements = elements.slice(0, 6)

    const modal_string_middle = elements.join('')

    // console.log(modal_string_middle)

    const modalTitle = '@' + feedItems[0].robotParams.join('/')
    const modal_html_part_1 = `
    <div id="modal-${groupKey}" class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
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
       </div>
     </div>
   </div>`

   const modal_string = modal_html_part_1 + modal_string_middle + modal_string_part_2

//    console.log(modal_string)
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

async function run() {
    // Get Feeds
    const feedItems = await fetchFeeds(API_ENDPOINT, 48)
    // console.log('feeds:', feedItems.length)

    markBellsVisibile(feedItems)
    const groupedFeedItems = groupFeedItems(feedItems)

    // console.log(groupedFeedItems)
    for (let key in groupedFeedItems) {
        buildFeedModal(key, groupedFeedItems[key])
    }
}

$(document).ready(function(){
    run().then(() => {console.log('init complete.')})
})
