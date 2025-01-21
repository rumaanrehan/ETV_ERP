export function localStorageBackUp() {
  let styleId = document.querySelector('#style');

  let html = document.querySelector('html');
  //Theme Color Mode:
  if (localStorage.getItem('ynexHeader') == 'dark') {
    if (localStorage.getItem('ynexdarktheme')) {
      const type: any = localStorage.getItem('ynexdarktheme');
      html?.setAttribute('data-theme-mode', type);
    }
    if (localStorage.getItem('ynexdarktheme') == 'light') {
      const type: any = localStorage.getItem('ynexdarktheme');
      html?.setAttribute('data-theme-mode', type);
    }
  }

  //Directions:
  if (localStorage.getItem('dir') !== null) {
    html?.setAttribute('dir', 'rtl');
  } else if (localStorage.getItem('dir') === 'ltr') {
    html?.removeAttribute('dir');
  }

  //Navigation Styles:
  if (localStorage.getItem('ynexlayout') == 'horizontal') {
    const type: any = localStorage.getItem('ynexlayout');
    html?.setAttribute('data-nav-layout', type);
    
    html?.setAttribute('data-nav-style', 'menu-click');
  } else {
    html?.removeAttribute('data-nav-style');
  }

  let body = document.querySelector('body');
  if (
    localStorage.getItem('dir') == 'rtl' ||
    localStorage.getItem('ynex-width-mode') == 'boxed'
  ) {
    document.querySelector('body')?.classList.add('rtl');
  }

  if (localStorage.getItem('ynexMenu')) {
    const type: any = localStorage.getItem('ynexMenu');
    html?.setAttribute('data-menu-styles', type);
  }

  if (localStorage.getItem('ynexHeader')) {
    const type: any = localStorage.getItem('ynexHeader');
    html?.setAttribute('data-header-styles', type);
  }

  // Vertical & Horizontal Menu Styles:
  if (localStorage.getItem('ynexnavstyles')) {
    const type1: any = localStorage.getItem('ynexnavstyles');
    html?.setAttribute('data-nav-style', type1);
    html?.setAttribute('data-menu-position', 'scrollable');
    html?.setAttribute('data-toggled', type1 + '-closed');
  }

  //Sidemenu Layout Styles
  if (localStorage.getItem('ynexverticalstyles')) {
    const type1: any = localStorage.getItem('ynexverticalstyles');
    document.querySelector('html')?.setAttribute('data-vertical-style', type1);
    const type: any = localStorage.getItem('ynexverticalstyles-toggled');
    document.querySelector('html')?.setAttribute('data-toggled', type);

    if (localStorage.getItem('data-vertical-style') == type1) {
      html?.setAttribute('data-toggled', type);
    } else {
      // const type1: any = localStorage.getItem('ynexverticalstyles-toggled');
      // document.querySelector('html')?.setAttribute('data-toggled', document.querySelector(".slide.open")?.classList.contains("has-sub") ? type1 : 'double-menu-close');
    }
  }

  //Page Styles:
  if (localStorage.getItem('ynex-page-mode')) {
    const type: any = localStorage.getItem('ynex-page-mode');
    html?.setAttribute('data-page-style', type);
  }

  // /Layout Width Styles:
  if (localStorage.getItem('ynex-width-mode')) {
    const type: any = localStorage.getItem('ynex-width-mode');
    html?.setAttribute('data-width', type);
  }

  //Menu Positions:
  if (localStorage.getItem('ynex-menu-position')) {
    const type: any = localStorage.getItem('ynex-menu-position');
    html?.setAttribute('data-menu-position', type);
  }

  //Header Positions:
  if (localStorage.getItem('ynex-header-position')) {
    const type: any = localStorage.getItem('ynex-header-position');
    html?.setAttribute('data-header-position', type);
  }

  // Theme Primary Color storage
  if (localStorage.getItem('primaryRGB')) {
    const type: any = localStorage.getItem('primaryRGB');
    html?.style.setProperty('--primary-rgb', type);
  }

  //bgtheme change
  if (localStorage.getItem('bodyBgRGB')) {
    const bodytype: any = localStorage.getItem('bodyBgRGB');
    const darktype: any = localStorage.getItem('bodylightRGB');
    const type1: any = localStorage.getItem('ynex-theme-mode');
    html?.style.setProperty('--body-bg-rgb', bodytype);
    html?.style.setProperty('--body-bg-rgb2', darktype);
    html?.style.setProperty('--light-rgb', darktype);
    html?.style.setProperty('--form-control-bg', darktype);
    html?.style.setProperty('--input-border', 'rgba(255,255,255,0.1)');
    html?.setAttribute('data-theme-mode', 'dark');
  

    if (localStorage.getItem('ynexdarktheme') == 'light') {
      const type: any = localStorage.getItem('ynexdarktheme');
      html?.setAttribute('data-theme-mode', type);
      html?.setAttribute('data-header-styles', type);
      html?.removeAttribute('style');
    }
  }

  // Menu With BG Image storage
  if (localStorage.getItem('bgimg')) {
    const type: any = localStorage.getItem('bgimg');
    html?.setAttribute('data-bg-img', type);
  }
}

export function handleThemeUpdate(cssVars: any) {
  const root: any = document.querySelector(':root');
  const keys = Object.keys(cssVars);

  keys.forEach((key) => {
    root.style.setProperty(key, cssVars[key]);
  });
}
// to check the value is hexa or not
const isValidHex = (hexValue: any) =>
  /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hexValue);

const getChunksFromString = (st: any, chunkSize: any) =>
  st.match(new RegExp(`.{${chunkSize}}`, 'g'));
// convert hex value to 256
const convertHexUnitTo256 = (hexStr: any) =>
  parseInt(hexStr.repeat(2 / hexStr.length), 16);
// get alpha value is equal to 1 if there was no value is asigned to alpha in function
const getAlphafloat = (a: any, alpha: any) => {
  if (typeof a !== 'undefined') {
    return a / 255;
  }
  if (typeof alpha != 'number' || alpha < 0 || alpha > 1) {
    return 1;
  }
  return alpha;
};

// convertion of hex code to rgba code
export function hexToRgba(hexValue: any, alpha = 1) {
  if (!isValidHex(hexValue)) {
    return null;
  }
  const chunkSize = Math.floor((hexValue.length - 1) / 3);
  const hexArr = getChunksFromString(hexValue.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return `${r}, ${g}, ${b}`;
}

export function hexToRgba2(hexValue: any, alpha = 1) {
  if (!isValidHex(hexValue)) {
    return null;
  }
  const chunkSize = Math.floor((hexValue.length - 1) / 3);
  const hexArr = getChunksFromString(hexValue.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return `${r - 14}, ${g - 14}, ${b - 14}`;
}

//light Primary theme change
export function dynamicLightPrimaryColor(primaryColor: any, color: any) {
  primaryColor.forEach((item: any) => {
    const cssPropName = `--primary-${item.getAttribute('data-id')}`;

    handleThemeUpdate({
      [cssPropName]: hexToRgba(color),
    });
  });
}

//background theme change
let html = document.querySelector('html');
export function dynamicBgTrasnsparentPrimaryColor(
  primaryColor: any,
  color: any
) {
  primaryColor.forEach((item: any) => {
    const cssPropName1 = `--body-bg-rgb`;
    const cssPropName2 = `--body-bg-rgb2`;
    const cssPropName = `--light-rgb`;
    const cssPropName3 = ` --form-control-bg`;

    handleThemeUpdate({
      [cssPropName1]: hexToRgba2(color),
      [cssPropName2]: hexToRgba(color),
      [cssPropName]: hexToRgba(color),
      [cssPropName3]: hexToRgba2(color),
    });
    html?.style.setProperty('--form-control-bg', hexToRgba2(color));
    html?.style.setProperty('--body-bg-rgb2', hexToRgba(color));
    localStorage.setItem('data-theme-mode', 'dark');
    localStorage.setItem('data-header-styles', 'dark');
  });
}

export function removeForTransparent() {
  if (document.querySelector('body')?.classList.contains('header-light')) {
    document.querySelector('body')?.classList.remove('header-light');
  }
  // color header
  if (document.querySelector('body')?.classList.contains('color-header')) {
    document.querySelector('body')?.classList.remove('color-header');
  }
  // gradient header
  if (document.querySelector('body')?.classList.contains('gradient-header')) {
    document.querySelector('body')?.classList.remove('gradient-header');
  }
  // dark header
  if (document.querySelector('body')?.classList.contains('dark-header')) {
    document.querySelector('body')?.classList.remove('dark-header');
  }

  // light menu
  if (document.querySelector('body')?.classList.contains('light-menu')) {
    document.querySelector('body')?.classList.remove('light-menu');
  }
  // color menu
  if (document.querySelector('body')?.classList.contains('color-menu')) {
    document.querySelector('body')?.classList.remove('color-menu');
  }
  // gradient menu
  if (document.querySelector('body')?.classList.contains('gradient-menu')) {
    document.querySelector('body')?.classList.remove('gradient-menu');
  }
  // dark menu
  if (document.querySelector('body')?.classList.contains('dark-menu')) {
    document.querySelector('body')?.classList.remove('dark-menu');
  }
}
