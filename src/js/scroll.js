/**
 * Depends on: jQuery
 */
const toTopButton = document.getElementById("to-top-button");
const biggestTitleContainer = document.getElementById("headline-container");
const biggestTitle = document.getElementById("biggest-title");
const biggestLogo = document.getElementById("biggest-logo");

window.onscroll = function () { scrollFunction() };

// Adjust font size according to scroll.
function adjustFontSize(yPosition) {
  const maxPosition = 115;
  const minPosition = 0;
  const maxFontSize = 2.25;
  const minFontSize = 1.5;
  // const minFontSize = 0;

  const unit = "rem"

  if (yPosition >= maxPosition) { return minFontSize.toString() + unit }
  if (yPosition <= minPosition) { return maxFontSize.toString() + unit }

  return (maxFontSize - (yPosition / maxPosition) * (maxFontSize - minFontSize)).toString() + unit
}

// Adjust logo according to scroll.
function adjustLogoSize(yPosition) {
  const maxPosition = 115;
  const minPosition = 0;
  const maxFontSize = 34;
  const minFontSize = 24;

  const unit = 'px';

  if (yPosition >= maxPosition) { return minFontSize.toString() + unit }
  if (yPosition <= minPosition) { return maxFontSize.toString() + unit }

  return (maxFontSize - (yPosition / maxPosition) * (maxFontSize - minFontSize)).toString() + unit
}

// When user starts to scroll.
function scrollFunction() {
  // px that user scrolled.
  const scrolledPx = document.body.scrollTop || document.documentElement.scrollTop || 0
  // adjust the title size.
  biggestTitle.style['font-size'] = adjustFontSize(scrolledPx)
  // adjust the logo size.
  biggestLogo.style['width'] = adjustLogoSize(scrolledPx)

  // always display hover button.
  toTopButton.style.display = "block";
  // hide/display to-top button
  // if (scrolledPx > 500) {
  //   toTopButton.style.display = "block";
  // } else {
  //   toTopButton.style.display = "none";
  // }
}

// When the user clicks on the to-top button, scroll to the top of the document
function topFunction() {
  $('html, body').stop().animate({ scrollTop: '+0' }, 600);
}

toTopButton.addEventListener("click", function (event) {
  // console.log('here')
  topFunction()
  event.preventDefault()
})

biggestTitle.addEventListener("click", function (event) {
  // console.log('here2')
  topFunction()
  event.preventDefault()
})

function jumpToAnchor(element) {
  element.scrollIntoView({
    behavior: "smooth"
  })
  const link = element.getAttribute('href')
  const menuHeaderHeight = $(link).offset().top

  const menuHeight = $('#sticky-header').outerHeight() + 10
  $('html, body').stop().animate({ scrollTop: menuHeaderHeight - menuHeight }, 600);
}