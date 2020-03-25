//Get the button:
const toTopButton = document.getElementById("to-top-button");
const toTopMenu = document.getElementById("to-top-menu");

window.onscroll = function() {scrollFunction()};

// When the user scrolls down 20px from the top of the document, show the button
function scrollFunction() {
  console.log(document.documentElement.scrollTop)
  if (window.screen.width < 576) { // small screen
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        toTopButton.style.display = "block";
      } else {
        toTopButton.style.display = "none";
      }
  } else { // big screen
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        toTopMenu.style.display = "block";
      } else {
        toTopMenu.style.display = "none";
      }
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    $('html, body').animate({ scrollTop: '+0'   }, 1200);
}