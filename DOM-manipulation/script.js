'use strict';

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////////////////////////////////////////////////
//Tabs
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  //console.log(clicked);
  //removibg active class from all tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  //active tab
  clicked.classList.add('operations__tab--active');
  //removibg active class fromy
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////////////
//MENU FADING ANIMATION
//function which handles the fading effect
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

// PASSING ARGUMENTS TO EVENT HANDLERS
// using bind method to pass the arguments into function call inside a event handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////
//STICKY NAVIGATION
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

///////////////////////////////////////////////////////////
//STICKY MENU USING OBSEVER INTERSECTION API
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);
const stickynavBar = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickynavBar, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
////////////////////////////////////////////////////////////
//REVEALING SECTION ON SCROLL
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});
////////////////////////////////////////////////////////////
//LAZY LOADING IMGAGES
const actualImages = document.querySelectorAll('img[data-src]');

const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //logic for replacing the lazy img with actual img
  entry.target.src = entry.target.dataset.src;

  //removing the class which blurs the img after load event occures
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const lazyLoadObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  //to img to be loaded before it comes to the viewport
  //rootMargin:'200px
});

actualImages.forEach(function (image) {
  lazyLoadObserver.observe(image);
});
/////////////////////////////////////////////////////////////////
//SLIDER ENABLING
//select the slides
const slides = document.querySelectorAll('.slide');
//select left & right arrow buttons
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

// functions
//dot creation
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

//activating dot
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    moveToNextSlide(slide);
    activateDot(slide);
  }
});
const moveToNextSlide = function (curSlide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - curSlide)}%)`;
  });
};

let curSlide = 0;
const maxSlide = slides.length;
//to start with first slide

// slides.forEach((s, i) => {
//   s.style.transform = `translateX(${100 * i}%)`;
// });

const init = function () {
  moveToNextSlide(0);
  createDots();
  activateDot(0);
};
init();

//next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  moveToNextSlide(curSlide);
  activateDot(curSlide);
};
//pre slide
const previousSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  moveToNextSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

//sliding on key press
document.addEventListener('keydown', function (e) {
  //console.log(e);
  if (e.key === 'ArrowLeft') previousSlide();
  //using short circuiting method
  e.key === 'ArrowRight' && nextSlide();
});

//sliding on clicking the dots

// const header = document.querySelector('.header');
// //console.log(header);
// //Creating an element
// const message = document.createElement('div');
// //Adding class to that elemet
// message.classList.add('cookie-message');

// //writing content inside element 7 adding a button
// message.innerHTML =
//   "We use cookies for greater user experiece <button class = 'btn btn--close--cookie'>Got it</button>";
// //insereting the element into document
// //header.insertAdjacentHTML('beforeend', message);
// header.prepend(message);
// //header.append(message.cloneNode(true));
// //header.before(message);
// //header.after(message);

// //removing the element after clicking the button
// document.querySelector('.btn--close--cookie').addEventListener('click', () => {
//   message.remove();
// });

// //altering the style of cookie message
// message.style.backgroundColor = '#373737';
// message.style.width = '120%';

// //accessing the style propeties
// //console.log(message.style.backgroundColor);
// //console.log(message.style.color); //cannot access this property because it is not an inline property as backgroundColor[all the propertied we add or alter though JS will be inline styles]
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// //to acccess the properties which acre not inline but present in class or other places
// /*console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).color);*/

// //setting propert
// //we are taking the variable name --color-property which was set in root[i.e documentElement in DOM] in css file for altering the color

// document.documentElement.style.setProperty('--color-primary', 'lightblue');

// //Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.src);
// console.log(logo.alt);
// console.log(logo.designer); //as 'designer' is not a standerd attriute

//ADDING SMOOTH SCROLLING
///////////////////////////////////////////////////
//SCROLLING ON CLICING THE "learn more &downarrow"
btnScrollTo.addEventListener('click', e => {
  //console.log(section1.getBoundingClientRect());
  //const s1coords = section1.getBoundingClientRect();

  //console.log(e.target.getBoundingClientRect());

  // console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'Height?width of viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  // to add auto scrolling after a click
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //to scroll smoothly
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //scrolling without all the above calculation
  //simple modern method
  section1.scrollIntoView({ behaviour: 'smooth' });
});

// //events
// const H1 = document.querySelector('h1');
// const alertH1 = function () {
//   alert('alert working...');
//   H1.removeEventListener('mouseenter', alertH1);
// };

// H1.addEventListener('mouseenter', alertH1);

//Event propodgation capturing & bubling
//changing the background color of nav__link & its parents nav_lnks, nav

//creating a random color
//rgb(250,250,250)

//

////////////////////////////////////////////////////////////
//PAGE NAVIGATION

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//PAGE NAVIGATION NOW BY USING EVENT DELIGATION CONCEPT
// 1. Add event listener to common parent element
// 2. Determine what element originated the event so that you can ignore the click events otside the links (in our case) but inside the parent block
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching condition (only if clicked on links)
  if (e.target.classList.contains('nav__link')) {
    //console.log('working');
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//DOM traversig practice
const h1 = document.querySelector('h1');
//console.log(h1);
//console.log(document.querySelectorAll('.highlight'));
//Downward traversing
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.firstChild);
// console.log(h1.firstElementChild);
// console.log(h1.lastChild);
// console.log(h1.lastElementChild);

//downward traversing
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //finding the closest parent using some identifier like class name etc (this will work opposite to queryselector)
// console.log(h1.closest('.header'));
// //h1.closest('.header').style.backgroundColor = 'lightblue';
// console.log(h1.closest('h1'));

//traversing sideways
