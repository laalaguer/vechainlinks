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
        `<div class="col-md-6">
            <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div class="col p-4 d-flex flex-column position-static">
                    <strong class="d-inline-block mb-2 ${colorClass} text-capitalize">${item.category}</strong>
                    <h3 class="mb-0">${item.editor_title}</h3>
                    <div class="mb-1 text-muted text-capitalize">${item.platform}</div>
                    <p class="card-text mb-auto">${item.editor_comments}</p>
                    <a href="${item.url}" target="_blank">Continue reading</a>
                </div>
                <div class="col-auto d-none d-lg-block">
                    <svg class="bd-placeholder-img" width="200" height="250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">${item.editor_title}</text></svg>
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