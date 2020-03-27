// Get brand color according to brand name.
function brandColor (name) {
    const info = {
        "medium": '#00ab6c',
        "twitter": '#1da1f2',
        "weibo": '#DA291C',
        "reddit": '#ff4500',
        "website": '#737373',
        "telegram": '#0088cc',
        "github": '#24292e',
        "mobile": '#a4c639',
        "desktop": '#0078d7'
    }
    
    return (info[name.toLowerCase()] || 'black')
}

// Get jobStatus from key
function jobStatusName(key) {
    const info = {
        "vechain_team": "VeChain Staff",
        "community_member": "Community Member",
        "third_party": "Third Party"
    }
    return (info[key.toLowerCase()] || null)
}

// Compare two items.
function compareItems(itemA, itemB) {
    // if has official mark
    if (itemA["run_by_vechain"] || itemB["run_by_vechain"]) {
        // both official.
        if (itemA["run_by_vechain"] && itemB["run_by_vechain"]) {
            return 0
        }
        // Only A is official
        if (itemA["run_by_vechain"]) {
            return -1
        }
        // Only B is official
        if (itemB["run_by_vechain"]) {
            return 1
        }
    }

    // if has staff mark
    if (itemA["job_status"] == "vechain_team" || itemB["job_status"] == "vechain_team") {
        // both staff
        if (itemA["job_status"] == "vechain_team" && itemB["job_status"] == "vechain_team") {
            return 0
        }
        // only A is staff
        if (itemA["job_status"] == "vechain_team") {
            return -1
        }
        // only B is staff
        if (itemB["job_status"] == "vechain_team") {
            return 1
        }
    }

    // cannot compare, leave it equal.
    return 0
}

function buildMenuElements (categories) {
    var elements = []
    for (let key in categories) {
        const menuID = "menu-" + key
        var linkElement = $(`<a class="p-2 text-muted text-capitalize" href="#${key}" id="${menuID}" onclick="jumpToAnchor(this)">${categories[key].display}</a>`)
        elements.push(linkElement)
    }
    return elements
}

function buildItemElement(item) {
    const outside = $('<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12"></div>')
    const cardBox = $('<div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"></div>')
    const cardBody = $('<div class="col-12 p-4 d-flex flex-column position-static"></div>')
    const topColorText = $(`<strong class="d-inline-block mb-2 text-capitalize" style="color: ${brandColor(item.platform)}">${item.platform}</strong>`)
    var cardTitle;
    if (item.job_status !== null ) {
        cardTitle = $(`<h3 class="mb-1">${item.editor_title}</h3><div class="mb-1 text-muted job-title">${jobStatusName(item.job_status)}</div>`)
    } else {
        cardTitle = $(`<h3 class="mb-1">${item.editor_title}</h3><div class="mb-1 text-muted">`)
    }
    const cardDescribe = $(`<p class="card-text mb-auto">${item.editor_comments}</p>`)
    const cardLink = $(`<a href="${item.url}" target="_blank">Continue reading</a>`)
    
    topColorText.appendTo(cardBody)
    cardTitle.appendTo(cardBody)
    cardDescribe.appendTo(cardBody)
    cardLink.appendTo(cardBody)

    cardBody.appendTo(cardBox)
    cardBox.appendTo(outside)

    return outside
}

function buildContainer(items, categoryKey, categoryDetail) {

    const container = $(`<main role="main" class="container"></main>`)
    const header = $(`<h3 class="pb-4 mb-4 font-italic border-bottom text-capitalize" id="${categoryKey}">${categoryDetail.display} <a class="my-anchor text-muted" href="#${categoryKey}" onclick="jumpToAnchor(this)">#</a></h3>`)
    const cardsSection = $('<div class="row mb-2" id="blogs-section"></div>')
    
    const matchedItems = []
    items.forEach(item => {
        if (item.category == categoryKey) {
            matchedItems.push(item)
        }
    })

    matchedItems.sort(compareItems)

    const cardElementList = []
    matchedItems.forEach(item => {
        cardElementList.push(buildItemElement(item))
    });

    cardElementList.forEach(item => {
        item.appendTo(cardsSection)
    })
    header.appendTo(container)
    cardsSection.appendTo(container)

    return container
}

$(document).ready(function(){
    console.log(items.length)
    // Stuff the Nav Bar.
    const navBarElements = buildMenuElements(categories)
    navBarElements.forEach(element => element.appendTo($("#category-section")))

    // Stuff the main body.
    const containers = []
    for (let categoryKey in categories) {
        containers.push(
            buildContainer(items, categoryKey, categories[categoryKey])
        )
    }
    containers.forEach(container => {
        container.appendTo($('#my-body'))
    })
})