const promoSection = document.querySelector(".promo");
const picSlider = promoSection.querySelector(".slider__list");
const textSlider = promoSection.querySelector(".slider-text__list");
const buttonPrev = promoSection.querySelector(".slider__control--prev");
const buttonNext = promoSection.querySelector(".slider__control--next");
const buttonsDots = promoSection.querySelectorAll(".slider-dots__control");

let picSlides = picSlider.children;
let textSlides = textSlider.children;

/* MAKING CLONES */
const addClonesToEnd = (clonesNumber, itemsList) => {
  for (i = 0; i < clonesNumber; i++) {
    let cloneItem = itemsList[i].cloneNode(true);
    cloneItem.classList.remove("current");
    itemsList[i].parentNode.appendChild(cloneItem);
  }
};
addClonesToEnd(3, picSlides);
addClonesToEnd(1, textSlides);

/* DEFAULT INDEXES */
let lastSlideIndex = textSlides.length - 1;
let currentSlideIndex = 0;
let nextSlideIndex = 1;

/* CHANGEBLE ELEMENTS */
let textItem = textSlides[currentSlideIndex];
let picItem = picSlides[currentSlideIndex];
let picItemImg = picItem.children[0];
let picItemSpan = picItem.children[1];

let nextTextItem = textSlides[nextSlideIndex];
let nextPicItem = picSlides[nextSlideIndex];
let nextPicItemImg = nextPicItem.children[0];
let nextPicItemSpan = nextPicItem.children[1];

/* GET PTOPORTIES FOR ANIMATIONS */
const wantedTextItemProps = ["width", "transform", "opacity"];
const wantedPicItemProps = ["width", "height", "opacity", "marginRight"];

const getElementProps = (element, keys) => {
  elementStyles = getComputedStyle(element);
  return keys.reduce(
    (props, key) => {
      return (key in elementStyles && (props[key] = elementStyles[key]), props)
    }, {}
  )
};

/* ELEMENTS WANTED PROPERTIES */
const currentTextItemProps = getElementProps(textItem, wantedTextItemProps);
const currentPicItemProps = getElementProps(picItem, wantedPicItemProps);
const currentPicItemImgProps = getElementProps(picItemImg, wantedPicItemProps);
const currentPicItemSpanProps = getElementProps(picItemSpan, wantedPicItemProps);

const defaultTextItemProps = getElementProps(nextTextItem, wantedTextItemProps);
const defaultPicItemProps = getElementProps(nextPicItem, wantedPicItemProps);
const defaultPicItemImgProps = getElementProps(nextPicItemImg, wantedPicItemProps);
const defaultPicItemSpanProps = getElementProps(nextPicItemSpan, wantedPicItemProps);

const textSlideOffset = parseInt(defaultTextItemProps.width);
const picSlideOffset = parseInt(defaultPicItemProps.width) + parseInt(defaultPicItemProps.marginRight);

/* ANIMATIONS DATA */
const moveContainer = (offset) => {
  return [
    {transform: `translateX(-${currentSlideIndex * offset}px)`},
    {transform: `translateX(-${nextSlideIndex * offset}px)`}
  ]
};

const textItemIncrease = [defaultTextItemProps, currentTextItemProps];
const textItemDecrease = [currentTextItemProps, defaultTextItemProps];

const picItemOpacityOn = [defaultPicItemProps, currentPicItemProps];
const picItemOpacityOff = [currentPicItemProps, defaultPicItemProps];

const picItemImgIncrease = [defaultPicItemImgProps, currentPicItemImgProps];
const picItemImgDecrease = [currentPicItemImgProps, defaultPicItemImgProps];

const picItemSpanIncrease = [defaultPicItemSpanProps, currentPicItemSpanProps];
const picItemSpanDecrease = [currentPicItemSpanProps, defaultPicItemSpanProps];

const instant = {duration: 0, fill: "forwards"};
const ease500 = {duration: 500, easing: "ease-out", fill: "forwards"};

/* FUNCTIONS FOR CLICK EVENT */
const getItemsByIndex = () => {
  textItem = textSlides[currentSlideIndex];
  picItem = picSlides[currentSlideIndex];
  picItemImg = picItem.children[0];
  picItemSpan = picItem.children[1];

  nextTextItem = textSlides[nextSlideIndex];
  nextPicItem = picSlides[nextSlideIndex];
  nextPicItemImg = nextPicItem.children[0];
  nextPicItemSpan = nextPicItem.children[1];
};

const itemsAnimation = (timing) => {
  textSlider.animate(moveContainer(textSlideOffset), timing);
  picSlider.animate(moveContainer(picSlideOffset), timing);

  textItem.animate(textItemDecrease, timing);
  picItem.animate(picItemOpacityOff, timing);
  picItemImg.animate(picItemImgDecrease, timing);
  picItemSpan.animate(picItemSpanDecrease, timing);

  nextTextItem.animate(textItemIncrease, timing);
  nextPicItem.animate(picItemOpacityOn, timing);
  nextPicItemImg.animate(picItemImgIncrease, timing);
  nextPicItemSpan.animate(picItemSpanIncrease, timing);
};

const switchClasses = () => {
  /* Switch current item */
  textItem.classList.remove("current");
  picItem.classList.remove("current");
  nextTextItem.classList.add("current");
  nextPicItem.classList.add("current");

  /* Switch dot pagination */
  if (currentSlideIndex === lastSlideIndex) {
    buttonsDots[0].classList.remove("current");
  } else {
    buttonsDots[currentSlideIndex].classList.remove("current");
  }
  if (nextSlideIndex === lastSlideIndex) {
    buttonsDots[0].classList.add("current");
  } else {
    buttonsDots[nextSlideIndex].classList.add("current");
  }

  /* Switch body style */
  if (nextSlideIndex === 0 || nextSlideIndex % lastSlideIndex === 0) {
    document.body.classList.remove("page-body--blue", "page-body--yellow")
  } else if (nextSlideIndex === 1 || nextSlideIndex % lastSlideIndex === 1) {
    document.body.classList.add("page-body--blue");
    document.body.classList.remove("page-body--yellow")
  } else if (nextSlideIndex === 2 || nextSlideIndex % lastSlideIndex === 2) {
    document.body.classList.add("page-body--yellow")
    document.body.classList.remove("page-body--blue");
  }
};

/* MAIN SLIDING FUCNTIONS */
const swapSlides = () => {
  nextSlideIndex = (nextSlideIndex < 0) ? lastSlideIndex : 0;

  getItemsByIndex();
  itemsAnimation(instant);
  switchClasses();

  currentSlideIndex = nextSlideIndex;
  return currentSlideIndex;
};

const moveSlider = () => {
  getItemsByIndex();
  itemsAnimation(ease500);
  switchClasses();
};

/* BUTTONS LISTENERS */
buttonNext.addEventListener("click", () => {
  nextSlideIndex = currentSlideIndex + 1;

  if (nextSlideIndex < 0 || nextSlideIndex > lastSlideIndex) {
    swapSlides();
    nextSlideIndex = currentSlideIndex + 1;
  };
  moveSlider();

  currentSlideIndex = nextSlideIndex;
});

buttonPrev.addEventListener("click", () => {
  nextSlideIndex = currentSlideIndex - 1;

  if (nextSlideIndex < 0 || nextSlideIndex > lastSlideIndex) {
    swapSlides();
    nextSlideIndex = currentSlideIndex - 1;
  };
  moveSlider();

  currentSlideIndex = nextSlideIndex;
});

for (let i = 0; i < buttonsDots.length; i++) {
  buttonsDots[i].addEventListener("click", () => {
    nextSlideIndex = i;
    if (currentSlideIndex === lastSlideIndex) {
      nextSlideIndex = currentSlideIndex + 1;
      swapSlides();
      nextSlideIndex = i;
    }
    moveSlider();
    currentSlideIndex = nextSlideIndex;
  })
}
