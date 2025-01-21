import { fromEvent } from 'rxjs';


export function checkHoriMenu() {
  let menuNav = document.querySelector(".main-menu") as HTMLElement;
  let mainContainer1 = document.querySelector(".main-sidebar") as HTMLElement;
  let slideLeft = document.querySelector(".slide-left") as HTMLElement;
  let slideRight = document.querySelector(".slide-right") as HTMLElement;
  let marginLeftValue = Math.ceil(
    Number(window.getComputedStyle(menuNav).marginLeft.split("px")[0])
  );
  let marginRightValue = Math.ceil(
    Number(window.getComputedStyle(menuNav).marginRight.split("px")[0])
  );
  let check = menuNav.scrollWidth - mainContainer1.offsetWidth;
  // Show/Hide the arrows
  if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
    slideRight.classList.remove("d-none");
    slideLeft.classList.add("d-none");
  } else {
    slideRight.classList.add("d-none");
    slideLeft.classList.add("d-none");
    menuNav.style.marginLeft = "0px";
    menuNav.style.marginRight = "0px";
  }
  if (!(document.querySelector("html")?.getAttribute("dir") === "rtl")) {
    // LTR check the width and adjust the menu in screen
    if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
      if (Math.abs(check) < Math.abs(marginLeftValue)) {
        menuNav.style.marginLeft = -check + "px";
        slideLeft.classList.remove("d-none");
        slideRight.classList.add("d-none");
      }
    }
    if (marginLeftValue == 0) {
      slideLeft.classList.add("d-none");
    } else {
      slideLeft.classList.remove("d-none");
    }
  } else {
    // RTL check the width and adjust the menu in screen
    if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
      if (Math.abs(check) < Math.abs(marginRightValue)) {
        menuNav.style.marginRight = -check + "px";
        slideLeft.classList.remove("d-none");
        slideRight.classList.add("d-none");
      }
    }
    if (marginRightValue == 0) {
      slideLeft.classList.add("d-none");
    } else {
      slideLeft.classList.remove("d-none");
    }
  }
  if (marginLeftValue != 0 || marginRightValue != 0) {
    slideLeft.classList.remove("d-none");
  }


}
