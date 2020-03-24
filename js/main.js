function colorClass (index) {
    let classes = [
        "text-primary",
        "text-success",
        "text-info",
        "text-secondary",
        "text-danger",
        "text-warning",
        "text-dark"
    ]
    return classes[index % classes.length]
}

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

function buildNavBarElements (categories) {
    var elements = []
    for (let key in categories) {
        var linkElement = `<a class="p-2 text-muted text-capitalize" href="#${key}">${key}</a>`
        elements.push(linkElement)
    }
    return elements
}

function buildItemElement(item, colorClass) {
    var element = $(
        `<div class="col-md-4">
            <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div class="col-12 p-4 d-flex flex-column position-static">
                    <strong class="d-inline-block mb-2 text-capitalize" style="color: ${brandColor(item.platform)}">${item.platform}</strong>
                    <h3 class="mb-1">${item.editor_title}</h3>
                    <p class="card-text mb-auto">${item.editor_comments}</p>
                    <a href="${item.url}" target="_blank">Continue reading</a>
                </div>
            </div>
        </div>`
    )
    return element
}

function buildContainer(items, categoryName) {
    const categoryNameArray = []
    for (let key in categories) {
        categoryNameArray.push(key)
    }

    const container = $(`<main role="main" class="container" id="${categoryName}"></main>`)
    const header = $(`<h3 class="pb-4 mb-4 font-italic border-bottom text-capitalize">${categoryName}</h3>`)
    const postsSection = $('<div class="row mb-2" id="blogs-section"></div>')
    
    const matchedItems = []
    items.forEach(item => {
        if (item.category == categoryName) {
            matchedItems.push(item)
        }
    })

    const list = []
    matchedItems.forEach(item => {
        list.push(buildItemElement(item, colorClass(categoryNameArray.indexOf(item.category))))
    });

    list.forEach(item => {
        item.appendTo(postsSection)
    })
    header.appendTo(container)
    postsSection.appendTo(container)

    return container
}

$(document).ready(function(){
    // Stuff the Nav Bar.
    const navBarElements = buildNavBarElements(categories)
    $("#category-section").html(navBarElements)
    // Stuff the main body.
    const containers = []
    for (let categoryName in categories) {
        containers.push(buildContainer(items, categoryName))
    }
    containers.forEach(container => {
        container.appendTo($('#my-body'))
    })
})