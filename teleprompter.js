var isPlaying = false;
var isFlipped = false;
var isBeingEdited = false;
var baseFontSize = $('.prompter').css('font-size');
var editFontSize = 50;
var speed = 0;
var startSpeed = 4;
var savedSpeed = 0;
var baseTime = 40;
var pageJump = 600;

function stop() {
  savedSpeed = speed;
  speed = 0;
  isPlaying = false;
  $('body').removeClass('playing');
  updateSpeed();
  if ( isBeingEdited ) {
    return;
  }
}

function play() {
  if ( isBeingEdited ) {
    return;
  }
  if ( ! isPlaying ) {
    launchFullscreen();
    speed = savedSpeed || startSpeed;
    isPlaying = true;
    $('body').addClass('playing');
    updateSpeed();
    pageScroll();
  }
}

function updateSpeed() {
  if ( speed < -20 ) {
    speed = -20;
  } else if ( speed > 20 ) {
    speed = 20;
  }

  $('.speed').text(speed);
  if (speed > 0) {
    $('.speed').addClass('running')
  } else {
    $('.speed').removeClass('running');
  }
}


function pageScroll() { 
  var direction;

  if ( speed < 0 ) {
    direction = -1;
  } else if ( speed > 0 ) {
    direction = 1;
  }  
  window.scrollBy(0, direction);
  if ( $(document).scrollTop() === 0 && speed <= 0) {
    stop();
  }
  if ( $(window).scrollTop() + $(window).height() === $(document).height()  && speed >= 0) {
    stop();
  };

  if (isPlaying) {
    scrolldelay = setTimeout('pageScroll()', baseTime / Math.abs(speed/2));
  } 
}



/* bind keyboard events */

/* stop keys from working normally
   for example, make sure space doesn't jump down the page
   and down arrow doesn't affect scrolling.
   But, if in edit mode let keys work normally so you can type
 */
$(document).on('keydown', function(e) {
  if (! isBeingEdited) {
    e.preventDefault();
    updateSpeed();
  }
});

// start and stop with the space key
$(document).on('keydown',null,'space', function(e) {
  if (! isPlaying) {
      play();
    } else {
      stop();
    }
});

// up arrow: slow down (reverse)
$(document).on('keydown',null,'up', function(e) {
  speed -= 1;
  play();
});

// shift+up arrow : scroll up a bunch 
$(document).on('keydown',null,'shift+up', function(e) {
  window.scrollBy(0, - pageJump);
});

// down arrow: speedup scroll down
$(document).on('keydown',null,'down', function(e) {
  speed += 1;
  play();
});

// shift+down arrow: scroll down a bunch
$(document).on('keydown',null,'shift+down', function(e) {
  window.scrollBy(0, pageJump);
});

// left arrow: jump to top 
$(document).on('keydown',null,'left', function(e) {
  $(window).scrollTop(0);
    if (speed < 0) {
      speed = 0;
    }
});

// right arrow: jump to bottom
$(document).on('keydown',null,'right', function(e) {
  $('html,body').scrollTop( $(document).height() );
});

// increase font size
$(document).on('keydown',null,'shift+=', function(e) {
  setFontSize('+=5');
});

// decrease font size
$(document).on('keydown',null,'shift+-', function(e) {
  setFontSize('-=5');
});
 
// reset font size to 
$(document).on('keydown',null,'shift+0', function(e) {
  setFontSize(baseFontSize);
});

// toggle page flip when clicking the flip button
$('.flip').click( function(evt) {
  $(this).add('.prompter, .toolbar, .edit').toggleClass('mirror');
  isFlipped = ! isFlipped;
  evt.stopPropagation();
});

/* toggle full screen when clicking the page
   but only if you're not editing and the 
   teleprompter isn't playing
*/
$('body').click(function() {
  if ( ! isBeingEdited && ! isPlaying) {
    toggleFullScreen();
  }
});

/* make arrow draggable along the side
   thanks jQuery UI
*/
$('.arrow').draggable({ axis: "y" });

// prompter properties 
function setFontSize( amt ) {
  $('.prompter').css('font-size', amt);
}

// make page editable
$('.edit').click(function (evt) {
  stop();
  evt.stopPropagation();
  isBeingEdited = ! isBeingEdited;
  if (isBeingEdited) {
    currentFontSize = $('.prompter').css('font-size');
    isPlaying = false;
    setFontSize(50);
    $('.prompter').prop('contentEditable',true).selectText();
    $('body').addClass('editing');
    $(this).text('Done');
  } else {
    setFontSize(baseFontSize);
    $('.prompter').prop('contentEditable',false);
    $('body').removeClass('editing');
    $(this).text('Edit');
  }
});
