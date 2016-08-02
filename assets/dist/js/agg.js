/**
 * Agg v ()
 * Copyright 2015-2016 Shariful
 * Licensed under the MIT license
 */
$(document).ready(function() {

  // Returns height of browser viewport
  $(window).on('resize.windowscreen', function() {
    $('.windowscreen').height($(this).height());
  });

  $(window).trigger('resize.windowscreen');

});
