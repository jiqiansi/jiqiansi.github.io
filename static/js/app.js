// Template Name: Asrto
// Template URL: https://techpedia.co.uk/template/astro
// Description: astro Infinty
// Version: 1.0.0
(function (window, document, $, undefined) {
  "use strict";
  var Init = {
    i: function (e) {
      Init.s();
      Init.methods();
    },
    s: function (e) {
      (this._window = $(window)),
        (this._document = $(document)),
        (this._body = $("body")),
        (this._html = $("html"));
    },
    methods: function (e) {
      Init.w();
      Init.BackToTop();
      Init.preloader();
      Init.intializeSlick();
      Init.formValidation();
      Init.contactForm();
      Init.customSlector();
      Init.bar();
    },
    w: function (e) {
      this._window.on("load", Init.l).on("scroll", Init.res);
    },
    BackToTop: function () {
      var btn = $("#backto-top");
      $(window).on("scroll", function () {
        if ($(window).scrollTop() > 300) {
          btn.addClass("show");
        } else {
          btn.removeClass("show");
        }
      });
      btn.on("click", function (e) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          "300"
        );
      });
    },
    preloader: function () {
      setTimeout(function () { $('#preloader').hide('slow') }, 2000);
    },
    intializeSlick: function (e) {
      if ($(".horoscope-slider").length) {
        $(".horoscope-slider").slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
          centerPadding: '0px',
          centerMode: true,
          autoplay: true,
          cssEase: 'linear',
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 1650,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 6,
              },
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 4,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 3,
                arrows: false
              },
            },
            {
              breakpoint: 492,
              settings: {
                slidesToShow: 2,
                arrows: false,
              },
            },
          ],
        });
      }
      if ($(".client-slider").length) {
        $(".client-slider").slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          centerPadding: '0px',
          centerMode: true,
          autoplay: false,
          dots: true,
          cssEase: 'linear',
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                arrows: false,
              },
            },
          ],
        });
      }
      if ($(".blog-slider").length) {
        $(".blog-slider").slick({
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          centerPadding: '0px',
          centerMode: true,
          dots: false,
          autoplay: false,
          cssEase: 'linear',
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 1199,
              settings: {
                autoplay: true,
                arrows: false,
                slidesToShow: 1,
              },
            },
          ],
        });
      }

    },
    formValidation: function () {
      if ($(".contact-form").length) {
        $(".contact-form").validate();
      }
    },
    contactForm: function () {
      $(".contact-form").on("submit", function (e) {
        e.preventDefault();
        if ($(".contact-form").valid()) {
          var _self = $(this);
          _self
            .closest("div")
            .find('button[type="submit"]')
            .attr("disabled", "disabled");
          var data = $(this).serialize();
          $.ajax({
            url: "./assets/mail/contact.php",
            type: "post",
            dataType: "json",
            data: data,
            success: function (data) {
              $(".contact-form").trigger("reset");
              _self.find('button[type="submit"]').removeAttr("disabled");
              if (data.success) {
                document.getElementById("message").innerHTML =
                  "<h3 class='bg-primary text-white p-3 mt-3 rounded'>Email Sent Successfully</h3>";
              } else {
                document.getElementById("message").innerHTML =
                  "<h3 class='bg-primary text-white p-3 mt-3 rounded'>There is an error</h3>";
              }
              $("#message").show("slow");
              $("#message").slideDown("slow");
              setTimeout(function () {
                $("#message").slideUp("hide");
                $("#message").hide("slow");
              }, 3000);
            },
          });
        } else {
          return false;
        }
      });
    },
    customSlector: function(){
      let cs = $('.custom_select');
      let csMenu = $('.select_menu');
      let csMenuOpt = $('.select_menu li')

      cs.click(function() {
        $(this).attr('tabindex', 1).focus();
        $(this).toggleClass('active');
        $(this).children('.select_menu').slideToggle(300);
      })
      cs.focusout(function() {
        $(this).removeClass('active');
        $(this).children('.select_menu').slideUp(300);
      })
      csMenuOpt.click(function() {
        var div = $(this).html();
        $('.selected').children().replaceWith(div)
      })
    },
    bar: function () {
      const progress = $(".progress-done");
      if (progress.length) {
        progress.css("width", progress.attr("data-done") + "%");
        progress.css("opacity", 1);
      }
    },
  }
  Init.i();
})(window, document, jQuery);
