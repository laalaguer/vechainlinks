//Get the button:
const toTopButton = document.getElementById("to-top-button");
const biggestTitleContainer = document.getElementById("headline-container");
const biggestTitle = document.getElementById("biggest-title");

window.onscroll = function() {scrollFunction()};

// When the user scrolls down 500px from the top of the document, show the button
function scrollFunction() {
  const scrolledPx = document.body.scrollTop || document.documentElement.scrollTop || 0
  if (scrolledPx > 115) {
    biggestTitleContainer.classList.remove("py-3")
    biggestTitleContainer.classList.add("py-1")
    biggestTitle.classList.add("small-big-title")
  } else {
    biggestTitleContainer.classList.remove("py-1")
    biggestTitleContainer.classList.add("py-3")
    biggestTitle.classList.remove("small-big-title")
  }

  if (scrolledPx > 500) {
      toTopButton.style.display = "block";
    } else {
      toTopButton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    $('html, body').animate({ scrollTop: '+0' }, 600);
}