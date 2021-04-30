window.addEventListener('load', () => {

  // get DOM elements short helper
  let get_el = (selector, single = true) => {
    if (selector != '' || selector != undefined) {
      return single ? document.querySelector(selector) : document.querySelectorAll(selector);
    } else {
      return null
    }
    
  }

  // try wrapper for correct working all script
  let try_fn = fn => {
    let callback = fn || function() {};
    try {
      callback();
    }
    catch(e){
      console.log(`error in module: ** ${callback.name} **, with message: ${e.message}`);
    }
  }

  // all modules list
  let modules = [
    base
  ];

  // call all modules
  modules.forEach(fn => {
    try_fn(fn);
  })







  /*
  ***** Modules begin
  */



  /*
  *** Base for all pages
  */

  function base() {
    const drop_btn = get_el('.dropdown__btn', false);
    
    drop_btn.forEach(el => {
      el.addEventListener('click', () => {
        let parent = el.closest('.dropdown');
        let inner = parent.querySelector('.dropdown__inner');
        inner.classList.toggle('dropdown__inner--open');
      });
    });
  }














});