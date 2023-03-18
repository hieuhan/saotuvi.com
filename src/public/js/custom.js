/* Bengin sidebardefault sidebar-fixed-left sidebar-fixed-right sidebar-stacked */
	$(document).ready(function() {
    var overlay = $('.sidebar-overlay');

    $('.sidebar-toggle').on('click', function() {
        var sidebar = $('#sidebardefault');
        sidebar.toggleClass('open');
        if ((sidebar.hasClass('sidebar-fixed-left') || sidebar.hasClass('sidebar-fixed-right')) && sidebar.hasClass('open')) {
            overlay.addClass('active');
        } else {
            overlay.removeClass('active');
        }
    });
    overlay.on('click', function() {
        $(this).removeClass('active');
        $('#sidebardefault').removeClass('open');
    });

});
/* End sidebardefault sidebar-fixed-left sidebar-fixed-right sidebar-stacked */
/* Bengin menu-list */
$(function () {
    var Accordion = function (el, multiple) {
      this.el = el || {};
      // more then one submenu open?
      this.multiple = multiple || false;

      var dropdownlink = this.el.find('.menu-icon');
      dropdownlink.on('click', {
          el: this.el,
          multiple: this.multiple
        },
        this.dropdown);
    };
    Accordion.prototype.dropdown = function (e) {
      var $el = e.data.el,
        $this = $(this),
        //this is the ul.submenuItems
        $next = $this.next();
      	$next.slideToggle();
      	$this.parent().toggleClass('menu-open');
		/* show only
      		if (!e.data.multiple) {$el.find('.menu-content').not($next).slideUp().parent().removeClass('menu-open');}
	  	*/
    }

    var accordion = new Accordion($('.menu-list'), false);
  })
 /* End menu-list */
/* Bengin nav-sticky */
jQuery(function($) {
window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navsticky");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("nav-sticky")
  } else {
    navbar.classList.remove("nav-sticky");
  }
}
});
/* End nav-sticky */

/* Bengin Backtotop */
jQuery(function($) {
        $(".backtotop"); 
            var oldscrollTop = 0;
            $(window).scroll(function () {
                if ($(this).scrollTop() - oldscrollTop < 0) {
                    $(".backtotop").addClass('show_backtotop');
                } else {
                    $(".backtotop").removeClass('show_backtotop');
                }
                oldscrollTop = $(this).scrollTop();
            });
});
/* End Backtotop */


