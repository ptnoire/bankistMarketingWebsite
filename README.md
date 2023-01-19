**EDIT: JANUARY 17TH, 2023: Completely revamped this website, better upload for publishing and my 'bankist' project, which is a mock banking app is now linked to this marketing website so you can view both features through this. Seperate repositories just for clarity.**

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

[Welcome!]
This time I am properly doing a readme to my project files.
This readme is broken up into the order of things I've implemented to the website.

I will attempt to format the readme to:
## This is the title of the section I am working on
**This is the purpose of this specific line/s  of code**
_This will be my explaination_

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

# Bankist Marketing Website 
[this] [works] [like] [that]

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

## Defining Some HTML Elements to Use Later
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    const btnCloseModal = document.querySelector('.btn--close-modal');
    const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
[code:lines-6-9]
_We use querySelectorAll on btnsOpenModal because there are multiple instances of the same button function, which is 'open account'_

[code:line-22] **Open and Close Windows**

    const openModal = function (e) {
      e.preventDefault()
      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');
    };

    const closeModal = function () {
      modal.classList.add('hidden');
      overlay.classList.add('hidden');
    };

_The preventDefault() is for preventing the page from jerking back to the top. These are just adding and removing a class from these elements. Makes them invisible or visible._

//////////////////////////////////////////////////////////////////////////////////////////////////
## Adding an Event Listener to Each Button of Similar Nature
[code:line-33] **Open Account Buttons**

    btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

_This works because the querySelectorAll attached to the DOM element returns a node list, which can work like an array, and because of that we can run a forEach loop on it to add this eventListener to each version that we use, will be useful just incase we add it anymore to our DOM later as well_

**Note: I improve upon this idea later** [readme:line-84]

//////////////////////////////////////////////////////////////////////////////////////////////////
## Adding Event Listeners to Close Windows
[code:line-34] **These use the functions we defined earlier**

    btnCloseModal.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

_Straight forward addEventListeners_

[code:line-37] **If you press the esc key, you can also close the windows**

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

_Quality of Life features!_

//////////////////////////////////////////////////////////////////////////////////////////////////
## Implementing Smooth Scrolling
[code:line-10] **Define the button and section of our website we are going to:**

    const btnScrollTo = document.querySelector('.btn--scroll-to');
    const section1 = document.querySelector('#section--1');

[code:line-43] **Implement the event listener to scroll to the section when clicked**

    btnScrollTo.addEventListener('click', function(e) {
      section1.scrollIntoView({behavior: 'smooth'});
    })

_.scrollIntoView({behavior: 'smooth'}) works for modern browsers and is a simple line of code to effectively do what we want to do which is when we click on the learn more button, it drags the screen smoothly to the section we want the user to view_

//////////////////////////////////////////////////////////////////////////////////////////////////
## Improving my Smooth Scrolling Function & forEach Loop Replacement
_So there are two features I implemented seperately before that I will now combine together for a smoother process: 1. Gathering multiple buttons and 2. Attaching functions to them for smooth scrolling_ [readme:line-45-&-71]

[code:line-51] **Query Selector All but not really**

    document.querySelector('.nav__links').addEventListener('click', function(e) {
      e.preventDefault();
      if(e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: 'smooth'});
      }
    })

_I start by preventing the default which is instantly moves the page to the hashtag since I want to do that myself with the function I wrote. My thought process here is before I ran a forEach loop on every instance of the button I needed to grab but if I have a lot of these buttons it maybe kind of taxing to rewrite all that code for each button so instead I'm going to use a process I learned called Event Delegation_

_Simply put because when you click on this button, the event of the click will travel through the child nodes of the parent nav links and then back up, I want to catch the event whenever it happens within this parent node and execute the code if it sees the event and only if it happens on certain elements of the parent node._

_I add an event listener to the parent node 'nav links' and then set a if statement that if e.target contains the class 'nav link' then it will run the code: I define a variable that gets the attribute of the event's target which should be an href that will get a position of the element, then set the [.scrollIntoView] call to a template literal shortly after._

_Long explaination but a cool feature I think can be very useful in the future for projects that have massive amounts of instances that need features like this, we could possibly minimize 1000s of lines of code to just 5 or so._

//////////////////////////////////////////////////////////////////////////////////////////////////
## 'Operations' Tabs
[code:line-13] **Defining More DOM Elements in the Global Scope**

    const operaTabs = document.querySelectorAll('.operations__tab');
    const operaTabsContainer = document.querySelector('.operations__tab-container')
    const operaTabsContent = document.querySelectorAll('.operations__content');

[code:line-84] **Finding What Tab the User Clicked and Displaying the Content**

    operaTabsContainer.addEventListener('click', function(e) {
      e.preventDefault();
      const clicked = e.target.closest('.operations__tab')
      if (!clicked) return;
      operaTabs.forEach(cl => cl.classList.remove('operations__tab--active'))
      clicked.classList.add('operations__tab--active');

      operaTabsContent.forEach(cl => cl.classList.remove('operations__content--active'))
      document.querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
    })

_In the global scope, I defined the [operaTabsContainer] to the parent div class that contains all of this section's content, using a similar tactic that I used for the improved smooth scrolling feature, if you click a specific button within this section the code will return the target's dataset (defined in the HTML) and use that to add the CSS style 'active' to correct tab / content window._

_[clicked] is defined from the event's target, then I used the closest call to find it's nearest operations tab parent node, this assures that we are only looking for content that is within the scope we defined. I will also later use this variable's [dataset.tab] value to dynamically change the content that is active._

_To make sure only one is active at a time, each function will remove the active CSS from all of the child nodes, then add it to the target's element using a forEach loop._

  _If you're wondering why I'm using a forEach loop here even though the previous section said to not write that code to each array/node element it is simply because these forEach loops are not adding a function to every element within the target's list, it is simply modifying them with add/remove calls._

_You will notice a [if-(!clicked)-return] guard clause to make sure that the delegation doesn't return an error if anything but the intended target within the container is clicked_

//////////////////////////////////////////////////////////////////////////////////////////////////
## Hover Over Opacity Change (Nav Bar)
[code:line-63] **Clever use of the bind call to pass in mouse events**
*The navbar fading in and out depending on what you're hovering over*

    const hoverHandle = function(e){
      if(e.target.classList.contains('nav__link')){
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');
        siblings.forEach(el => {
          if(el !== link){
            el.style.opacity = this;
          }
        })
        logo.style.opacity = this;
      }
    }

    nav.addEventListener('mouseover', hoverHandle.bind(0.5))
    nav.addEventListener('mouseout', hoverHandle.bind(1))
_Because of the thought process of don't repeat yourself, I wanted to use this function to change the opacity of the nav bar links (and the logo) whenever you hover over things or hover out of things. So I coded one function that would handle the opacity change then made it so we would pass in a different opacity depending on the event_

_If you look at the addEventListener section, you will see that I used the .bind() call for this process, this is because I needed to pass in the event as an argument but I can't get that variable anywhere else since it's already coded into JavaScript, so by using the bind I am not technically calling another argument I am setting where the function's 'this' keyword will point to, therefore only one argument is being passed in which is what preceeds the function call in the event listener._

_Just to clarify for myself, technically the function call inside the eventlistener looks like this hoverHandle(event) {this=0.5 or 1 depending on event} and event will = e inside the function._

//////////////////////////////////////////////////////////////////////////////////////////////////
## Sticky Navigation Bar
[code:line-99] **Defining some of the DOM things we will need**

    const header = document.querySelector('header')
    const navHeight = nav.getBoundingClientRect().height;

[code:line-102] **The function we call when the Observer meets it's target requirements**

    const stickyNav = function(entries) {
      const [entry] = entries;
      if(!entry.isIntersecting) nav.classList.add('sticky');
      else nav.classList.remove('sticky');
      console.log('fired off')
    }

_When the observer returns a 'isIntersecting' boolean of true, it will remove the sticky CSS and of course if it returns false then it will add the sticky CSS, long story short if you can see the NavBar then it would be intersecting so it doesn't need a sticky, if you can't see it then it does.I destructured the object that is returned from the observer and just read the one entry that I needed for this to work._

[code:line-108] **Creating the Observer**

    const headerObserver = new IntersectionObserver(stickyNav, {
      root: null,
      threshold: 0,
      rootMargin: `-${navHeight}px`,
    });
    headerObserver.observe(header);

_I defined the options inside the observer just to make it clean. We want to dynamically update the margins of where the sticky begins by taking in the navHeight and using a template literal. Then I set the target of our observer to be the header._

//////////////////////////////////////////////////////////////////////////////////////////////////
## Revealing Elements as the User Scrolls into Them
[code:line-119] **Similar function as the sticky nav but with multiple things being observed**

    const allSections = document.querySelectorAll('.section');

[code:line-120] **Finding the target & isIntersecting values then using them**

    const revealEle = function (entries, observer) {
      const [entry] = entries;
      const target = entry.target
      if(!entry.isIntersecting) return
      target.classList.remove('section--hidden')
      observer.unobserve(entry.target)
    }
_Added a guard clause here to make sure none of the elements reveal too soon, and after the function works on a specific target, we remove the observer so the performance is better and isn't firing off each time it happens._

[code:line-128] **The Observer Creation**

    const elementObserver = new IntersectionObserver(revealEle, {
      root: null,
      threshold: 0.3,
      rootMargin: '50px'
    })

[code:line-134] **Looping over the results and adding the hidden CSS & the observer**

    allSections.forEach(sect => {
      sect.classList.add('section--hidden')
      elementObserver.observe(sect)
    })

//////////////////////////////////////////////////////////////////////////////////////////////////
## Lazy Loading the Stock Images
[code:line-143] **Similar concept as the reveal elements as they come into view**

    const imgTargets = document.querySelectorAll('img[data-src]');

_Pulling only the img tags from the HTML that contain the data-src attribute_

    const loadImg = function(entries, observer) {
      const [entry] = entries;
      if(!entry.isIntersecting) return
      entry.target.src = entry.target.dataset.src;
      entry.target.addEventListener('load', function() {
        entry.target.classList.remove('lazy-img')
      })
      observer.unobserve(entry.target);
    }
_Here we have in our HTML a src that is set to a low resolution version of the photo we want to show then we hide the high resoluton one in the dataset attribute on the HTML element. We apply a CSS filter over the low resolution photo so you can't see it, wait for the image to come into view via the observer, then wait to see that the high resolution image has loaded before removing the CSS blur effect, this works really well for users with slow internet so that they don't have to wait for the high resolution images to load for the page to work._

    const imgObserver = new IntersectionObserver(loadImg, {
      root: null,
      threshold: 0.3,
    })
    imgTargets.forEach(img=> imgObserver.observe(img));

_If we wanted to make it so this lazy loading happens before the user sees it, we could add a rootmargin of something like +200px, but I rather like the effect of the blur coming in._

//////////////////////////////////////////////////////////////////////////////////////////////////
## Slide Functionality
[code:line-167] **Defining Some Things**

    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left')
    const btnRight = document.querySelector('.slider__btn--right')
    const dotContainer = document.querySelector('.dots')

**Keeping a Current Slide Variable Active**

    let curSlide = 0;

**Max Length**

    const maxSlide = slides.length;

[code:line-174] **Getting the position on the DOM correct for each slide**

    const slideActivate = function(slide) {
      slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i-slide)}%)`)
    }
_I have overflow hidden, so only the slide at 0 will appear, I took the index from the array and used it to calculate a position for each slide. Everytime this is called it will also take in the argument of the current slide._

[code:line-190] **Forward and Backwards + Resetting the position**

    const nextSlide = function(){
      if(curSlide === maxSlide - 1) {
        curSlide = 0;
      }else{  curSlide++
      }
      slideActivate(curSlide);
      activateDot(curSlide);
    }
_Minus 1 because it's zero based._

    const prevSlide = function(){
      if(curSlide === 0) {
        curSlide = maxSlide -1;
      } else{  curSlide--;
      }
      slideActivate(curSlide);
      activateDot(curSlide);
    }

        const startUp = function () {
            createDots();
            activateDot(0)
            slideActivate(0);
        }

        startUp();
          btnRight.addEventListener('click', nextSlide)
          btnLeft.addEventListener('click', prevSlide)
          
_Default call so the slides position themselves_

[code:line-218] **So you can use the arrow keys as well**

    document.addEventListener('keydown', function (e) {
      e.key === 'ArrowRight' && nextSlide();
      e.key === 'ArrowLeft' && prevSlide();
    })
_Short circuiting cause I like it, you could also just use an if statement_

[code:line-178] **Adding and Using the Dots below the slider to show the current position**

    const createDots = function() {
      slides.forEach(function(_, i) {
        dotContainer.insertAdjacentHTML('beforeend', 
        `<button class="dots__dot" data-slide="${i}"</button>`)
      })
    }
_For each slide we get, we are going to insert some HTML and add a data set with a specific index so we can call it later. This is how we will create our dots, no matter how many slides we have._
[code:line-185] 

    const activateDot = function(slide) {
      document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
      document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    }

_This is how we show our active dot, just a darker color dot against the white background._

_This functionality can be called on all of our other functions as well._
[code:line-223] 

    dotContainer.addEventListener('click', function(e) {
      if(e.target.classList.contains('dots__dot')) {
        const {slide} = e.target.dataset;
        slideActivate(slide);
        activateDot(curSlide);
      }
    })

_Using event delegation, we are checking to see which dot was clicked and we will process what it does based off of that, clicking the first dot goes to slide one etc.._

[code:line-166] **Note: At the end, I coupled this entire function in it's own function as to not pollute the global naming space, then called the function shortly after.**

//////////////////////////////////////////////////////////////////////////////////////////////////
