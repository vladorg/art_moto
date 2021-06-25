"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

window.addEventListener('load', function () {
  /*
  *** Intro
  */
  // get DOM elements short helper
  var get_el = function get_el(selector) {
    var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (selector != '' || selector != undefined) {
      return single ? document.querySelector(selector) : document.querySelectorAll(selector);
    } else {
      return null;
    }
  }; // try wrapper for correct working all script


  var try_fn = function try_fn(fn) {
    var callback = fn || function () {};

    try {
      callback();
    } catch (e) {
      console.warn("error in module: ** ".concat(callback.name, " **, with message: ").concat(e.message));
    }
  }; // hide/show elems like a jQuery slideToggle()


  var slide = function slide(item, parent, class_opened, item_height) {
    if (parent.classList.contains(class_opened)) {
      parent.classList.remove(class_opened);
      item.removeAttribute('style');
    } else {
      parent.classList.add(class_opened);
      item.style.height = "".concat(item_height, "px");
    }
  };
  /*
  *** Global variables
  */


  var menu_button = get_el('.menu__btn', false);
  var menu = get_el('.menuContent');
  var drops = get_el('.dropdown', false);
  var color_picker = get_el('.color-picker', false);
  var isMobile = window.innerWidth <= 768 ? true : false;

  var getCoords = function getCoords(elem) {
    return elem.getBoundingClientRect().top + pageYOffset;
  };

  var accordion_opened = get_el('.accordion--opened', false);
  var header_height = get_el('.header').scrollHeight;
  var products_custom_slider_params = {
    slidesPerView: 3,
    speed: 200,
    effect: 'slide',
    watchSlidesVisibility: true,
    observer: true,
    observeParents: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    slideVisibleClass: 'swiper-slide-visible',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
      renderBullet: function renderBullet(index, className) {
        return "<div class=\"".concat(className, " bullet\"></div>");
      }
    },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      },
      1224: {
        slidesPerView: 3
      }
    }
  };

  var products_default_slider_params = _objectSpread({}, products_custom_slider_params);

  products_default_slider_params.slidesPerView = 4;
  products_default_slider_params.breakpoints = {
    320: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 2
    },
    992: {
      slidesPerView: 3
    },
    1440: {
      slidesPerView: 4
    }
  };
  /* *** all modules list *** */

  var modules = [base, header, index, catalog, product_big, product, footer];
  /* *** call all modules *** */

  modules.forEach(function (fn) {
    try_fn(fn);
  });
  /*
  ***** Modules begin *****
  */

  /*
  *** Base
  */

  function base() {
    var drop_btn = get_el('.dropdown__btn', false);
    var accordion_btn = get_el('.accordion__btn', false);
    var seo_btn = get_el('.seo__more', false);
    var products_custom_row = get_el('.productsListCustom', false);
    var products_default_row = get_el('.productsListDefault', false);
    var throttle_call = 1;
    var throttle_delay = 300;
    var quantity_input = get_el('.quantity__value', false);
    var quantity_minus_time;
    var quantity_plus_time;
    drop_btn.forEach(function (el) {
      el.addEventListener('click', function (e) {
        el.closest('.dropdown').classList.toggle('dropdown--opened');
      });
    });
    /* init opened accordions */

    accordion_opened.forEach(function (el) {
      setTimeout(function () {
        var t = el.querySelector('.accordion__content');
        var h = t.scrollHeight;
        t.style.height = "".concat(h, "px");
      }, 0);
    });
    /* *** */

    accordion_btn.forEach(function (el) {
      el.addEventListener('click', function (e) {
        var parent = el.closest('.accordion');
        var list = parent.querySelector('.accordion__content');
        var list_height = list.scrollHeight;
        slide(list, parent, 'accordion--opened', list_height);
      });
    });
    seo_btn.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var parent = el.closest('.seo');
        var list = parent.querySelector('.seo__content');
        var list_height = list.scrollHeight;
        slide(list, parent, 'seo--opened', list_height);
      });
    });
    quantity_input.forEach(function (input) {
      var f = quantity.bind(input);
      input.addEventListener('change', f);
    });
    document.addEventListener('click', function (e) {
      var t = e.target;
      var t_c = t.classList; // main menu

      if (!t_c.contains('menuContent') && !t_c.contains('menu__btn') && !menu.contains(t)) {
        menu.classList.remove('menuContent--opened');
      }

      if (t_c.contains('menuContent__close')) {
        menu.classList.remove('menuContent--opened');
      } // drops


      if (!t_c.contains('dropdown__inner') && !t_c.contains('dropdown__btn')) {
        drops.forEach(function (el) {
          el.classList.remove('dropdown--opened');
        });
      } // color_picker


      if (t_c.contains('color-picker')) {
        !t_c.contains('active') ? colorPicker.call(t) : null;
      } // tabs


      if (t_c.contains('tabs__btn')) {
        !t_c.contains('tabs__btn--active') ? tabs.call(t) : null;
      } // preview compare


      if (t_c.contains('preview__compare') || t.parentNode.classList.contains('preview__compare')) {
        if (t.parentNode.classList.contains('preview__compare')) {
          t.parentNode.disabled = true;
          t.parentNode.classList.add('preview__compare--added');
        } else {
          t.disabled = true;
          t.classList.add('preview__compare--added');
        }
      } // preview wishlist


      if (t_c.contains('preview__wishlist') || t.parentNode.classList.contains('preview__wishlist')) {
        if (t.parentNode.classList.contains('preview__wishlist')) {
          t.parentNode.disabled = true;
          t.parentNode.classList.add('preview__wishlist--added');
        } else {
          t.disabled = true;
          t.classList.add('preview__wishlist--added');
        }
      } // preview buy


      if (t_c.contains('preview__buy') || t.parentNode.classList.contains('preview__buy')) {
        if (t.parentNode.classList.contains('preview__buy')) {
          t.parentNode.disabled = true;
          t.parentNode.classList.add('preview__buy--added');
        } else {
          t.disabled = true;
          t.classList.add('preview__buy--added');
        }
      } // anchors


      if (t_c.contains('anchor')) {
        anchor.call(t);
      } // quantity


      if (t_c.contains('quantity__minus')) {
        clearTimeout(quantity_minus_time);
        quantity_minus_time = setTimeout(function () {
          quantity.call(t, 'minus');
        }, 200);
      }

      if (t_c.contains('quantity__plus')) {
        clearTimeout(quantity_plus_time);
        quantity_plus_time = setTimeout(function () {
          quantity.call(t, 'plus');
        }, 200);
      }
    });
    document.addEventListener('scroll', function (e) {
      var throtte_current = Date.now(); // throttle scroll

      if (throtte_current > throttle_call + throttle_delay) {
        /* hide/show menu on scroll */
        if (window.pageYOffset > menu.clientHeight) {
          menu.classList.remove('menuContent--opened');
        }
        /* update anchors active status */


        updateAnchors();
        /* update throttle (don't touch)*/

        throttle_call = throtte_current;
      }
    });
    products_custom_row.forEach(function (products) {
      var products_custom_slider = new Swiper(products, products_custom_slider_params);
    });
    products_default_row.forEach(function (products) {
      var products_default_slider = new Swiper(products, products_default_slider_params);
    });

    function colorPicker() {
      var code = this.dataset.color;
      var others;
      var images;

      if (this.closest('.preview__colors')) {
        others = this.closest('.preview__colors').querySelectorAll('.color-picker');
        images = this.closest('.preview__caption').querySelectorAll('.preview__images img');
      } else if (this.closest('.productBigMain__pickers')) {
        others = this.closest('.productBigMain__pickers').querySelectorAll('.color-picker');
        images = this.closest('.productBigMain').querySelectorAll('.productBigMain__images');
      } else if (this.closest('.productMainInfoOptions__content')) {
        others = this.closest('.productMainInfoOptions__content').querySelectorAll('.color-picker');
        images = null;
      } else {
        return;
      }

      others.forEach(function (el) {
        el.classList.remove('active');
      });

      if (images) {
        images.forEach(function (el) {
          if (el.dataset.color == code) {
            el.classList.remove('hidden');
            el.classList.add('visible');
          } else {
            el.classList.remove('visible');
            el.classList.add('hidden');
          }
        });
      }

      this.classList.add('active');
    }

    function tabs() {
      var tab_code = this.dataset.tab;
      var parent = this.closest('.tabs');
      var tab_buttons = parent.querySelectorAll('.tabs__btn');
      var tabs = parent.querySelectorAll('.tabs__content');
      tab_buttons.forEach(function (el) {
        el.classList.remove('tabs__btn--active');
      });
      tabs.forEach(function (el) {
        if (el.dataset.tab == tab_code) {
          el.classList.add('tabs__content--active');
        } else {
          el.classList.remove('tabs__content--active');
        }
      });
      this.classList.add('tabs__btn--active');
    }

    function anchor() {
      var _this = this;

      var data = this.dataset.section;
      var sections = get_el('.anchor-section', false);
      var buttons = this.parentNode.querySelectorAll('.anchor');
      buttons.forEach(function (btn) {
        setTimeout(function () {
          btn.classList.remove('active');
        }, 400);
      });
      sections.forEach(function (section) {
        if (section.dataset.section == data) {
          window.scrollTo({
            top: getCoords(section),
            behavior: 'smooth'
          });
        }
      });
      setTimeout(function () {
        _this.classList.add('active');
      }, 400);
    }

    function updateAnchors() {
      var scroll_top = window.pageYOffset;
      var sections = get_el('.anchor-section', false);
      var anchors = get_el('.anchor', false);
      var dead_line = get_el('.productsIntDefault') || get_el('.feedback') || get_el('.footer');
      sections.forEach(function (section) {
        var section_offset = getCoords(section) - 200;
        var section_data = section.dataset.section;

        if (scroll_top > section_offset) {
          anchors.forEach(function (anchor) {
            if (anchor.dataset.section == section_data) {
              anchors.forEach(function (el) {
                el.classList.remove('active');
              });
              anchor.classList.add('active');
            }
          });
        }

        if (scroll_top > getCoords(dead_line) - 200) {
          anchors.forEach(function (anchor) {
            anchor.classList.remove('active');
          });
        }
      });
    }

    function quantity(action) {
      var parent = this.closest('.quantity');
      var input = parent.querySelector('.quantity__value');

      switch (action) {
        case 'minus':
          input.value != 1 ? input.value = parseInt(input.value) - 1 : null;
          break;

        case 'plus':
          if (input.value.length > 3 || input.value == 999) {
            input.value = 999;
          } else {
            input.value = parseInt(input.value) + 1;
          }

          break;

        default:
          if (this.classList.contains('quantity__value')) {
            var _quantity = this.value;

            if (isNaN(+_quantity) || _quantity[0] == "-") {
              this.value = 1;
            } else {
              if (_quantity == "" || _quantity == 0) {
                this.value = 1;
              }

              if (_quantity.length > 3) {
                this.value = _quantity.slice(0, 3);
              }
            }
          } else {
            return;
          }

      }
    }
  }
  /*
  *** Header
  */


  function header() {
    menu_button.forEach(function (el) {
      el.addEventListener('click', function (e) {
        menu.classList.toggle('menuContent--opened');
      });
    });
  }
  /*
  *** Main page
  */


  function index() {
    var banner = get_el('.banner__slider');
    var popular_buttons = get_el('.populars__buttons');
    var popular_products = get_el('.populars__tab', false);
    var equipment_buttons = get_el('.equipments__buttons');
    var equipment_products = get_el('.equipments__tab', false);
    var brands_items = get_el('.brands__wrap .container');
    var blog_articles = get_el('.blog .blog__inner');
    var tabs_buttons_slider_params = {
      slidesPerView: 4,
      init: false,
      speed: 200,
      effect: 'slide',
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      slideVisibleClass: 'swiper-slide-visible',
      breakpoints: {
        320: {
          slidesPerView: 3
        },
        768: {
          slidesPerView: 4
        }
      }
    };
    /* *** main screen slider *** */

    var main_slider = new Swiper(banner, {
      slidesPerView: 1,
      slidesPerColumn: 1,
      loop: false,
      autoHeight: false,
      speed: 600,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 20001111,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return "<div class=\"".concat(className, " bullet\"></div>");
        }
      }
    });
    /* *** end *** */

    /* *** popular products slider *** */

    var popular_buttons_slider = new Swiper(popular_buttons, tabs_buttons_slider_params);
    isMobile ? popular_buttons_slider.init() : null;
    /* *** end *** */

    /* *** equipment products slider *** */

    var equipment_buttons_slider = new Swiper(equipment_buttons, tabs_buttons_slider_params);
    isMobile ? equipment_buttons_slider.init() : null;
    /* *** end *** */

    /* *** brands slider *** */

    var brands_items_slider = new Swiper(brands_items, {
      slidesPerView: 2,
      slidesPerColumn: 2,
      slidesPerColumnFill: 'row',
      init: false,
      speed: 200,
      effect: 'slide',
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      slideVisibleClass: 'swiper-slide-visible',
      spaceBetween: 24,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return "<div class=\"".concat(className, " bullet\"></div>");
        }
      }
    });
    isMobile ? brands_items_slider.init() : null;
    /* *** end *** */

    /* *** blog articles slider *** */

    var blog_articles_slider = new Swiper(blog_articles, {
      slidesPerView: 3,
      loop: false,
      speed: 200,
      effect: 'slide',
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      slideVisibleClass: 'swiper-slide-visible',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return "<div class=\"".concat(className, " bullet\"></div>");
        }
      },
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        600: {
          slidesPerView: 2
        },
        1440: {
          slidesPerView: 3
        }
      }
    });
    /* *** end *** */

    /* *** animation on scroll *** */

    /*
      * enabled on a desktop only
      * if mobile - don't init
      * if error script - remove style from DOM & throw error to try_fn wrapper
      * styles don't working in screens less than 768px    
    */

    try {
      !isMobile ? AOS.init() : null;
    } catch (e) {
      get_el('link', false).forEach(function (link) {
        if (link.dataset.style == 'aos') {
          link.remove();
          console.log('aos style link has been removed');
        }
      });
      throw new Error('aos is not defined...');
    }
    /* *** end *** */

  }
  /*
  *** Catalog page
  */


  function catalog() {
    var ui_slider = get_el('#ui_slider');
    var _ui_slider$dataset = ui_slider.dataset,
        ui_max = _ui_slider$dataset.max,
        ui_min = _ui_slider$dataset.min,
        ui_step = _ui_slider$dataset.step;
    var ui_subs = [get_el('.filter__priceSubMin'), get_el('.filter__priceSubMax')];
    var ui_vals = [get_el('.filter__min'), get_el('.filter__max')];
    noUiSlider.create(ui_slider, {
      start: [+ui_min, +ui_max],
      step: +ui_step,
      connect: true,
      range: {
        'min': +ui_min,
        'max': +ui_max
      },
      format: {
        to: function to(value) {
          return parseInt(value);
        },
        from: function from(value) {
          return parseInt(value);
        }
      }
    });
    ui_slider.noUiSlider.on('update', function (values, handle) {
      ui_subs[handle].innerText = values[handle];
      ui_vals[handle].value = values[handle];
    });
    ui_vals.forEach(function (el, handle) {
      el.addEventListener('change', function () {
        ui_slider.noUiSlider.setHandle(handle, this.value);
      });
    });
  }
  /*
  *** Product pages
  */


  function product_big() {
    var adv_photos = get_el('.productPresentSlider');
    var payment_delivery = get_el('.productDelivery__content');
    var slot = get_el('.productBigSlot');
    var feedback = get_el('.feedback');
    var footer = get_el('.footer');
    var nav_opener = get_el('.productBigNav__btn');
    var present_images = get_el('.productPresentInfo__images'); // slider for product advanced advantages

    var adv_timer;
    var adv_slider = new Swiper(adv_photos, {
      slidesPerView: 5,
      loop: true,
      autoHeight: false,
      speed: 400,
      init: false,
      spaceBetween: 24,
      centeredSlides: true,
      watchSlidesVisibility: true,
      observer: true,
      observeParents: true,
      slideVisibleClass: 'swiper-slide-visible',
      autoplay: {
        delay: 4022200,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return "<div class=\"".concat(className, " bullet\"></div>");
        }
      },
      on: {
        init: function init() {
          caption_debounce.call(this);
        },
        slideChangeTransitionStart: function slideChangeTransitionStart() {
          caption_debounce.call(this);
        },
        sliderMove: function sliderMove() {
          caption_debounce.call(this);
        }
      },
      breakpoints: {
        1440: {
          slidesPerView: 5
        },
        1224: {
          slidesPerView: 3
        },
        320: {
          slidesPerView: 3
        }
      }
    });
    adv_slider.init();

    function caption_debounce() {
      var f = updateCaption.bind(this);
      clearTimeout(adv_timer);
      adv_timer = setTimeout(f, 200);
    }

    function updateCaption() {
      var caption = this.$el[0].querySelector('.productPresentSlider__caption');
      var caption_title = caption.querySelector('.productPresentSlider__title');
      var caption_content = caption.querySelector('.productPresentSlider__content');
      var slide = this.slides[this.activeIndex];
      var title = slide.querySelector('.title').innerText;
      var content = slide.querySelector('.content').innerText;
      var caption_anim = caption.animate([{
        opacity: '1'
      }, {
        opacity: '0'
      }], {
        duration: 200
      });
      caption_anim.addEventListener('finish', function () {
        caption_title.innerText = title;
        caption_content.innerText = content;
        caption.animate([{
          opacity: '0'
        }, {
          opacity: '1'
        }], {
          duration: 200
        });
      });
    } // end advantages slider


    var payment_delivery_slider = new Swiper(payment_delivery, {
      slidesPerView: 1,
      loop: false,
      autoHeight: false,
      speed: 200,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 20001111,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return "<div class=\"".concat(className, " bullet\"></div>");
        }
      }
    });
    var present_images_slider = new Swiper(present_images, {
      slidesPerView: 1,
      loop: true,
      autoHeight: false,
      init: false,
      speed: 200,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 20001111,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return "<div class=\"".concat(className, " bullet\"></div>");
        }
      }
    });
    isMobile ? present_images_slider.init() : null; // init 360 view

    window.CI360.init();
    /* hide/show slot on scroll */

    window.addEventListener('scroll', function (e) {
      try {
        window.pageYOffset > header_height ? slot.classList.add('productBigSlot--show') : null;

        if (feedback) {
          var feedback_offset = getCoords(feedback) - feedback.scrollHeight;
          window.pageYOffset > feedback_offset ? slot.classList.remove('productBigSlot--show') : null;
        } else {
          var footer_offset = getCoords(footer) - footer.scrollHeight;
          window.pageYOffset > footer_offset ? slot.classList.remove('productBigSlot--show') : null;
        }
      } catch (e) {}
    });
    /* hide/show navigation */

    nav_opener.addEventListener('click', function () {
      this.closest('.productBigNav').classList.toggle('productBigNav--opened');
    });
  }

  function product() {
    var _Swiper;

    /* product images gallery */
    var product_nav = new Swiper('.productMainImages__nav', (_Swiper = {
      spaceBetween: 8,
      slidesPerView: 5
    }, _defineProperty(_Swiper, "spaceBetween", 55), _defineProperty(_Swiper, "freeMode", true), _defineProperty(_Swiper, "watchSlidesVisibility", true), _defineProperty(_Swiper, "watchSlidesProgress", true), _defineProperty(_Swiper, "breakpoints", {
      768: {
        slidesPerView: 5
      },
      320: {
        slidesPerView: 3
      }
    }), _Swiper));
    var product_thumb = new Swiper('.productMainImages__thumb', {
      thumbs: {
        swiper: product_nav
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      }
    });
    /* product delivery tab */

    var payment_delivery_product = get_el('.productDelivery__content');
    var payment_delivery_product_slider = new Swiper(payment_delivery_product, {
      slidesPerView: 1,
      speed: 200,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      observer: true,
      observeParents: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function renderBullet(index, className) {
          return "<div class=\"".concat(className, " bullet\"></div>");
        }
      }
    });
    /* product review anchor */

    var goto_reviews = get_el('.goto_reviews');
    var tab = get_el('.productReviews');
    var rev_tab_btn = get_el('.productTabs__btn--reviews');
    goto_reviews.addEventListener('click', function (e) {
      if (tab && rev_tab_btn) {
        rev_tab_btn.click();
        window.scrollTo({
          top: getCoords(tab),
          behavior: 'smooth'
        });
      }
    });
  }
  /*
  *** Footer
  */


  function footer() {
    var menu_opener = get_el('.footer__opener', false);
    menu_opener.forEach(function (el) {
      el.addEventListener('click', function (e) {
        var parent = el.closest('.footer__col');
        var list = parent.querySelector('.footer__list');
        var list_height = list.scrollHeight;
        slide(list, parent, 'footer__col--opened', list_height);
      });
    });
  }
});