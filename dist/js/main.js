window.addEventListener('load', () => {


  /*
  *** Intro
  */

  // get DOM elements short helper
  const get_el = (selector, single = true) => {
    if (selector != '' || selector != undefined) {
      return single ? document.querySelector(selector) : document.querySelectorAll(selector);
    } else {
      return null
    }
    
  }
  

  // try wrapper for correct working all script
  const try_fn = fn => {
    let callback = fn || function() {};
    try {
      callback();
    }
    catch(e){
      console.warn(`error in module: ** ${callback.name} **, with message: ${e.message}`);
    }
  }

  // hide/show elems like a jQuery slideToggle()
  const slide = (item, parent, class_opened, item_height) => {
    if (parent.classList.contains(class_opened)) {
      parent.classList.remove(class_opened);
      item.removeAttribute('style');
    } else {
      parent.classList.add(class_opened);
      item.style.height = `${item_height}px`;
    }
  }



  /*
  *** Global variables
  */

  const menu_button = get_el('.menu__btn', false);
  const menu = get_el('.menuContent');
  const drops = get_el('.dropdown', false);
  const color_picker = get_el('.color-picker', false);
  const isMobile = window.innerWidth <= 768 ? true : false;
  const getCoords = elem => elem.getBoundingClientRect().top + pageYOffset;
  const accordion_opened = get_el('.accordion--opened', false);
  const header_height = get_el('.header').scrollHeight;
  let products_custom_slider_params = {
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
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
      renderBullet: function (index, className) {
        return `<div class="${className} bullet"></div>`;
      },
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
  let products_default_slider_params = {...products_custom_slider_params};
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
  const modules = [
    base,
    header,
    index,
    catalog,
    product_big,
    product,
    footer
  ];

  /* *** call all modules *** */
  modules.forEach(fn => {
    try_fn(fn);
  })







  /*
  ***** Modules begin *****
  */

  /*
  *** Base
  */

  function base() {
    const drop_btn = get_el('.dropdown__btn', false);
    const accordion_btn = get_el('.accordion__btn', false);
    const seo_btn = get_el('.seo__more', false);
    const products_custom_row = get_el('.productsListCustom', false);
    const products_default_row = get_el('.productsListDefault', false);
    let throttle_call = 1;
    const throttle_delay = 300;
    const quantity_input = get_el('.quantity__value', false);
    let quantity_minus_time;
    let quantity_plus_time;
    
    
    drop_btn.forEach(el => {
      el.addEventListener('click', e => {
        el.closest('.dropdown').classList.toggle('dropdown--opened');
      });
    });

    /* init opened accordions */
    accordion_opened.forEach(el => {
      setTimeout(() => {
        let t = el.querySelector('.accordion__content');
        let h = t.scrollHeight;
        t.style.height = `${h}px`;
      }, 0);
    })
    /* *** */

    accordion_btn.forEach(el => {
      el.addEventListener('click', e => {
        let parent = el.closest('.accordion');
        let list = parent.querySelector('.accordion__content');
        let list_height = list.scrollHeight;

        slide(list, parent, 'accordion--opened', list_height);

      });
    });

    seo_btn.forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        let parent = el.closest('.seo');
        let list = parent.querySelector('.seo__content');
        let list_height = list.scrollHeight;

        slide(list, parent, 'seo--opened', list_height);
      });
    });

    quantity_input.forEach(input => {
      const f = quantity.bind(input);
      input.addEventListener('change', f);
    });

    document.addEventListener('click', e => {
      const t = e.target;
      const t_c = t.classList;

      // main menu
      if (!t_c.contains('menuContent') && !t_c.contains('menu__btn') && !menu.contains(t)) {
        menu.classList.remove('menuContent--opened');
      }
      if (t_c.contains('menuContent__close')) {
        menu.classList.remove('menuContent--opened');
      }

      // drops
      if (!t_c.contains('dropdown__inner') && !t_c.contains('dropdown__btn')) {
        drops.forEach(el => {
          el.classList.remove('dropdown--opened');
        })
      }

      // color_picker
      if (t_c.contains('color-picker')) {
        !t_c.contains('active') ? colorPicker.call(t) : null;
      }

      // tabs
      if (t_c.contains('tabs__btn')) {
        !t_c.contains('tabs__btn--active') ? tabs.call(t) : null;
      }

      // preview compare
      if (t_c.contains('preview__compare') || t.parentNode.classList.contains('preview__compare')) {
        if (t.parentNode.classList.contains('preview__compare')) {
          t.parentNode.disabled = true;
          t.parentNode.classList.add('preview__compare--added');
        } else {
          t.disabled = true;
          t.classList.add('preview__compare--added');
        }
      }

      // preview wishlist
      if (t_c.contains('preview__wishlist') || t.parentNode.classList.contains('preview__wishlist')) {
        if (t.parentNode.classList.contains('preview__wishlist')) {
          t.parentNode.disabled = true;
          t.parentNode.classList.add('preview__wishlist--added');
        } else {
          t.disabled = true;        
          t.classList.add('preview__wishlist--added');
        }        
      }

      // preview buy
      if (t_c.contains('preview__buy') || t.parentNode.classList.contains('preview__buy')) {
        if (t.parentNode.classList.contains('preview__buy')) {
          t.parentNode.disabled = true;
          t.parentNode.classList.add('preview__buy--added');
        } else {
          t.disabled = true;        
          t.classList.add('preview__buy--added');
        }        
      }

      // anchors
      if (t_c.contains('anchor')) {
        anchor.call(t);
      }

      // quantity
      if (t_c.contains('quantity__minus')) {
        clearTimeout(quantity_minus_time);
        quantity_minus_time = setTimeout(() => {
          quantity.call(t, 'minus');
        }, 200);
      }
      if (t_c.contains('quantity__plus')) {
        clearTimeout(quantity_plus_time);
        quantity_plus_time = setTimeout(() => {
          quantity.call(t, 'plus');
        }, 200);
      }


    })
    
    document.addEventListener('scroll', e => {
      const throtte_current = Date.now();
      
      // throttle scroll
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

    products_custom_row.forEach(products => {
      let products_custom_slider = new Swiper(products, products_custom_slider_params);
    });

    products_default_row.forEach(products => {
      let products_default_slider = new Swiper(products, products_default_slider_params);
    });

    function colorPicker() {
      let code = this.dataset.color;
      let others;
      let images;
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
        return
      }

      others.forEach(el => {
        el.classList.remove('active');
      });
      if (images) {
        images.forEach(el => {
          if (el.dataset.color == code) {
            el.classList.remove('hidden');
            el.classList.add('visible');
          } else {
            el.classList.remove('visible')
            el.classList.add('hidden');
          }
        });
      }
      
      this.classList.add('active');
    }

    function tabs() {
      let tab_code = this.dataset.tab;
      let parent = this.closest('.tabs');
      let tab_buttons = parent.querySelectorAll('.tabs__btn');
      let tabs = parent.querySelectorAll('.tabs__content');

      tab_buttons.forEach(el => {
        el.classList.remove('tabs__btn--active');
      });
      tabs.forEach(el => {
        if (el.dataset.tab == tab_code) {
          el.classList.add('tabs__content--active');
        } else {
          el.classList.remove('tabs__content--active')
        }
      });
      this.classList.add('tabs__btn--active');
    }

    function anchor() {
      let data = this.dataset.section;
      let sections = get_el('.anchor-section', false);
      let buttons = this.parentNode.querySelectorAll('.anchor');
      buttons.forEach(btn => {
        setTimeout(() => {
          btn.classList.remove('active');
        }, 400);        
      });
      sections.forEach(section => {
        if (section.dataset.section == data) {
          window.scrollTo({ top: getCoords(section), behavior: 'smooth' });
        }
      });
      setTimeout(() => {
        this.classList.add('active');
      }, 400);
      
    }

    function updateAnchors() {
      const scroll_top = window.pageYOffset;
      const sections = get_el('.anchor-section', false);
      const anchors = get_el('.anchor', false);
      const dead_line = get_el('.productsIntDefault') || get_el('.feedback') || get_el('.footer')

      sections.forEach(section => {
        const section_offset = getCoords(section) - 200;
        const section_data = section.dataset.section;
        if (scroll_top > section_offset) {
          anchors.forEach(anchor => {
            if (anchor.dataset.section == section_data) {
              anchors.forEach(el => {
                el.classList.remove('active');
              });
              anchor.classList.add('active');
            }
          });
        }
        if (scroll_top > getCoords(dead_line) - 200) {
          anchors.forEach(anchor => {
            anchor.classList.remove('active');
          });
        }
      });
    }

    function quantity(action) {
      const parent = this.closest('.quantity');
      const input = parent.querySelector('.quantity__value');

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
            let quantity = this.value;
            if (isNaN(+quantity) || quantity[0] == "-") {
              this.value = 1
            } else {
              if (quantity == "" || quantity == 0) {
                this.value = 1;
              }
              if (quantity.length > 3) {
                this.value = quantity.slice(0, 3);
              }
            }
          } else {
            return
          }
      }
    }

  }







  /*
  *** Header
  */

  function header() {

    menu_button.forEach(el => {
      el.addEventListener('click', e => {
        menu.classList.toggle('menuContent--opened');
      })
    })

  }







  /*
  *** Main page
  */

  function index() {

    const banner = get_el('.banner__slider');
    const popular_buttons = get_el('.populars__buttons');
    const popular_products = get_el('.populars__tab', false);
    const equipment_buttons = get_el('.equipments__buttons');
    const equipment_products = get_el('.equipments__tab', false);
    const brands_items = get_el('.brands__wrap .container');
    const blog_articles = get_el('.blog .blog__inner');
    let tabs_buttons_slider_params = {
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

    let main_slider = new Swiper(banner, {
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
        renderBullet: function (index, className) {
          return `<div class="${className} bullet"></div>`;
        },
      },
    });

    /* *** end *** */



    /* *** popular products slider *** */

    let popular_buttons_slider = new Swiper(popular_buttons, tabs_buttons_slider_params);
    isMobile ? popular_buttons_slider.init() : null;

    /* *** end *** */



    /* *** equipment products slider *** */

    let equipment_buttons_slider = new Swiper(equipment_buttons, tabs_buttons_slider_params);
    isMobile ? equipment_buttons_slider.init() : null;

    /* *** end *** */



    /* *** brands slider *** */    

    let brands_items_slider = new Swiper(brands_items, {
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
        renderBullet: function (index, className) {
          return `<div class="${className} bullet"></div>`;
        },
      },
    });
    isMobile ? brands_items_slider.init() : null;

    /* *** end *** */



    /* *** blog articles slider *** */  

    let blog_articles_slider = new Swiper(blog_articles, {
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
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        renderBullet: function (index, className) {
          return `<div class="${className} bullet"></div>`;
        },
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
    }
    catch(e) {
      get_el('link', false).forEach(link => {
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
    const ui_slider = get_el('#ui_slider');
    let {max: ui_max,min: ui_min,step: ui_step} = ui_slider.dataset;
    let ui_subs = [
      get_el('.filter__priceSubMin'), 
      get_el('.filter__priceSubMax')
    ];
    let ui_vals = [
      get_el('.filter__min'), 
      get_el('.filter__max')
    ];

    noUiSlider.create(ui_slider, {
        start: [+ui_min, +ui_max],
        step: +ui_step,
        connect: true,
        range: {
            'min': +ui_min,
            'max': +ui_max
        },
        format: {
          to: function (value) {
            return parseInt(value)
          },
          from: function (value) {
            return parseInt(value)
          }
        }
    });

    ui_slider.noUiSlider.on('update', function (values, handle) {
      ui_subs[handle].innerText = values[handle];
      ui_vals[handle].value = values[handle];
    });


    ui_vals.forEach((el, handle) => {
      el.addEventListener('change', function () {
        ui_slider.noUiSlider.setHandle(handle, this.value);
      });
    });
    
  }





  /*
  *** Product pages
  */

  function product_big() {

    const adv_photos = get_el('.productPresentSlider');
    const payment_delivery = get_el('.productDelivery__content');
    const slot = get_el('.productBigSlot');
    const feedback = get_el('.feedback');
    const footer = get_el('.footer');
    const nav_opener = get_el('.productBigNav__btn');
    const present_images = get_el('.productPresentInfo__images');

    // slider for product advanced advantages
    let adv_timer;
    let adv_slider = new Swiper(adv_photos, {
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
        renderBullet: function (index, className) {
          return `<div class="${className} bullet"></div>`;
        },
      },
      on: {
        init: function () { caption_debounce.call(this) },
        slideChangeTransitionStart: function () { caption_debounce.call(this) },
        sliderMove: function () { caption_debounce.call(this) }
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
      let f = updateCaption.bind(this);
      clearTimeout(adv_timer);
		  adv_timer = setTimeout(f, 200);
    }

    function updateCaption() {
      let caption = this.$el[0].querySelector('.productPresentSlider__caption');
      let caption_title = caption.querySelector('.productPresentSlider__title');
      let caption_content = caption.querySelector('.productPresentSlider__content');
      let slide = this.slides[this.activeIndex];
      let title = slide.querySelector('.title').innerText;
      let content = slide.querySelector('.content').innerText;
      
      let caption_anim = caption.animate([{ opacity: '1' },{ opacity: '0' }], {duration: 200});
      caption_anim.addEventListener('finish', () => {
        caption_title.innerText = title;
        caption_content.innerText = content;
        caption.animate([{ opacity: '0' },{ opacity: '1' }], {duration: 200});
      });      
    }
    // end advantages slider

    let payment_delivery_slider = new Swiper(payment_delivery, {
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
        renderBullet: function (index, className) {
          return `<div class="${className} bullet"></div>`;
        },
      }
    });

    let present_images_slider = new Swiper(present_images, {
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
        renderBullet: function (index, className) {
          return `<div class="${className} bullet"></div>`;
        },
      }
    });

    isMobile ? present_images_slider.init() : null;


    // init 360 view
    window.CI360.init();


    /* hide/show slot on scroll */
    window.addEventListener('scroll', e => {
      try {      
        window.pageYOffset > header_height ? slot.classList.add('productBigSlot--show') : null;
        if (feedback) {
          const feedback_offset = getCoords(feedback) - feedback.scrollHeight;
          window.pageYOffset > feedback_offset ? slot.classList.remove('productBigSlot--show') : null;
        } else {
          const footer_offset = getCoords(footer) - footer.scrollHeight;
          window.pageYOffset > footer_offset ? slot.classList.remove('productBigSlot--show') : null;
        }
      }
      catch(e) {}
    });

    /* hide/show navigation */
    nav_opener.addEventListener('click', function() {
      this.closest('.productBigNav').classList.toggle('productBigNav--opened');
    }); 

  }

  

  function product() {

    /* product images gallery */
    const product_nav = new Swiper('.productMainImages__nav', {
      spaceBetween: 8,
      slidesPerView: 5,
      spaceBetween: 55,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      breakpoints: {
        768: {
          slidesPerView: 5
        },
        320: {
          slidesPerView: 3
        }

      }
    });
    const product_thumb = new Swiper('.productMainImages__thumb', {
      thumbs: {
        swiper: product_nav
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
    });

    /* product delivery tab */
    const payment_delivery_product = get_el('.productDelivery__content');
    let payment_delivery_product_slider = new Swiper(payment_delivery_product, {
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
        renderBullet: function (index, className) {
          return `<div class="${className} bullet"></div>`;
        },
      }
    });

    /* product review anchor */
    const goto_reviews = get_el('.goto_reviews');
    const tab = get_el('.productReviews');
    const rev_tab_btn = get_el('.productTabs__btn--reviews');
    goto_reviews.addEventListener('click', e => {
      if (tab && rev_tab_btn) {
        rev_tab_btn.click();
        window.scrollTo({ top: getCoords(tab), behavior: 'smooth' });
      }      
    });
  }







  /*
  *** Footer
  */

  function footer() {
    let menu_opener = get_el('.footer__opener', false);

    menu_opener.forEach(el => {
      el.addEventListener('click', e => {
        let parent = el.closest('.footer__col');
        let list = parent.querySelector('.footer__list');
        let list_height = list.scrollHeight;

        slide(list, parent, 'footer__col--opened', list_height);
      });
    });
  }

















});