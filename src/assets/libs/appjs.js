//$(document).ready(function () {
//  /*console.log("Appjs me hun.");*/

//});

//$.fn.DataTable.ext.pager.bootstrap_input = function (page, pages) {
//  return ['first', 'previous', 'input', 'next', 'last'];
//};


//main_pageButtonFunc = $.fn.DataTable.ext.renderer.pageButton.bootstrap

//$.fn.DataTable.ext.renderer.pageButton = $.extend(true, $.fn.DataTable.ext.renderer.pageButton,
//  {
//    //console.log('123456');
//    bootstrap: function (settings, host, idx, buttons, page, pages) {
//      console.log('1234566');
//      main_pageButtonFunc(settings, host, idx, buttons, page, pages);

//      input_html = '<div class="input-group">' +
//        '<input style="width: ' + (Math.ceil(Math.log10(pages + 1)) + 2.5) + 'em; margin-left: -1px;" ' + (pages === 1 ? 'disabled ' : '') + 'class="form-control rounded-0" type="number" min="1" max="' + pages + '">' +
//        '<span class="input-group-text rounded-0" id="basic-addon2"> of ' + pages + '</span>' +
//        '</div>'

//      let input_section = $(host).find("[data-dt-idx='input']");
//      input_section.closest("li").prop("onclick", null).off("click");
//      input_section.closest("li").prop("onkeypress", null).off("keypress");
//      input_section.replaceWith(input_html);

//      const api = new DataTable.Api(settings);

//      $(host).find("ul.pagination input").val(page + 1).on('change', function (e) {
//        api.page(Number($(e.target).val()) - 1).draw('page');
//      });
//    }
//  }
//)



//function createInputElement(settings) {
//  const pageInfo = $(settings.nTable).DataTable().page.info();
//  const $input = $('<input>', {
//    class: 'paginate_input',
//    type: 'number',
//    min: 1,
//    max: pageInfo.pages,
//  }).val(pageInfo.page + 1);
//  $input.on("change", function (e) {
//    if (this.value === '' || this.value.match(/[^0-9]/)) {
//      /* Nothing entered or non-numeric character */
//      this.value = this.value.replace(/[^\d]/g, ''); // don't even allow anything but digits
//      return;
//    }

//    const page = Number(this.value - 1);
//    $(settings.nTable).DataTable().page(page).draw(false);
//  });

//  return $input;
//}

(function ($) {
  //alert('b12');
  $.fn.DataTable.ext.renderer.pageButton.input = function (settings, host, idx, buttons, page, pages) {
    var api = new $.fn.DataTable.Api(settings);
    var classes = settings.oClasses.paging;
    var btnClasses = [classes.button];

    console.log('Custom Renderer Executed');

    // Clear existing buttons
    $(host).empty();

    // Loop through the buttons (first, previous, ellipsis, next, last)
    for (var i = 0, ien = buttons.length; i < ien; i++) {
      var buttonType = buttons[i];
      var btn;

      if (buttonType === 'ellipsis') {
        btn = $('<div>', { class: 'sp-inline' }).append($('<span>', { class: 'paginate_page' }).text('Page'))
          .append(createInputElement(settings))
          .append($('<span>', { class: 'paginate_of' }).text('of ' + $(settings.nTable).DataTable().page.info().pages))[0];
      } else {
        btn = $('<button>', {
          class: btnClasses.join(' '),
          role: 'link',
          type: 'button'
        }).html(api.i18n('paginate.' + buttonType, buttonType));
      }

      if (btn) {
        // Attach the button to the pagination container
        $(host).append(btn);
      }
    }
  };
  $.fn.DataTable.ext.pager.input = function (settings) {
    return ['first', 'previous', 'ellipsis', 'next', 'last'];
  };

  //// Extending the DataTables renderer
  //$.fn.DataTable.ext.renderer.pageButton.input = function (settings, host, idx, buttons, page, pages) {
  //  alert(123456);
  //  var api = new $.fn.DataTable.Api(settings);
  //  var classes = settings.oClasses.paging;
  //  var btnClasses = [classes.button];

  //  // Loop through the buttons (first, previous, ellipsis, next, last)
  //  for (var i = 0, ien = buttons.length; i < ien; i++) {
  //    var buttonType = buttons[i];
  //    var btn;

  //    if (buttonType === 'ellipsis') {
  //      btn = $('<div>', { class: 'sp-inline' }).append($('<span>', { class: 'paginate_page' }).text('Page'))
  //        .append(createInputElement(settings))
  //        .append($('<span>', { class: 'paginate_of' }).text('of ' + $(settings.nTable).DataTable().page.info().pages))[0];
  //    } else {
  //      btn = $('<button>', {
  //        class: btnClasses.join(' '),
  //        role: 'link',
  //        type: 'button'
  //      }).html(api.i18n('paginate.' + buttonType, buttonType));
  //    }

  //    if (btn) {
  //      // Attach the button to the pagination container
  //      $(host).append(btn);
  //    }
  //  }
  //};

  //$.fn.dataTable.ext.pager.input = function (settings, paging, draw) {
  //  var api = new $.fn.dataTable.Api(settings);
  //  var input = $('<input type="text" class="form-control" style="width: 50px; display: inline-block;">')
  //    //.val(paging.iPage + 1)
  //    .on('change', function () {
  //      api.page(parseInt($(this).val(), 10) - 1).draw(false);
  //    });

  //  return ['<span>Page </span>', input, '<span> of 12</span>'];
  //};

  //$.fn.dataTable.ext.pager.input = function (settings, paging, draw) {
  //  console.log(settings);
  //  console.log(paging);
  //  console.log(draw);
  //  var api = new $.fn.dataTable.Api(settings);
  //  var input = $('<input type="text" class="form-control" style="width: 50px; display: inline-block;">')
  //    .val(paging.iPage + 1)
  //    .on('change', function () {
  //      api.page(parseInt($(this).val(), 10) - 1).draw(false);
  //    });

  //  return ['<span>Page </span>', input, '<span> of ' + paging.iTotalPages + '</span>'];
  //};
  //$.fn.bootstrapBtn = $.fn.button.noConflict();

  //$.fn.DataTable.ext.pager.input = function () {
  //  return ['first', 'previous', 'ellipsis', 'next', 'last'];
  //};

  //$.fn.DataTable.ext.pager.input = function () {
  //  return ['first', 'previous', 'ellipsis', 'next', 'last'];
  //};

  ////$.fn.dataTable.ext.renderer.pageButton.input = function (settings, buttonType, content, active, disabled) {
  ////  // ... function definition ...
  ////  alert('abc wala');
  ////}

  ////$.fn.DataTable.render.pageButton = function (settings, buttonType, content, active, disabled) {
  ////  console.log('Renderer function called');
  ////  // ... function definition ...
  ////}

  ////$.fn.DataTable.ext.renderer.pagingButton.input = function (settings, buttonType, content, active, disabled) {
  ////  console.log('Renderer function called');
  ////  // ... rest of the function ...
  ////}

  //$.fn.DataTable.ext.renderer.pagingButton.input = function (settings, buttonType, content, active, disabled) {
  //  var classes = settings.oClasses.paging;
  //  var btnClasses = [classes.button];
  //  var btn;

  //  alert('1z');

  //  if (active) {
  //    btnClasses.push(classes.active);
  //  }

  //  if (disabled) {
  //    btnClasses.push(classes.disabled);
  //  }

  //  if (buttonType === 'ellipsis') {
  //    btn = $('<div>', { class: 'sp-inline' }).append($('<span>', { class: 'paginate_page' }).text('Page'))
  //      .append(createInputElement(settings))
  //      .append($('<span>', { class: 'paginate_of' }).text('of ' + $(settings.nTable).DataTable().page.info().pages))[0];
  //  } else {
  //    btn = $('<button>', {
  //      class: btnClasses.join(' '),
  //      role: 'link',
  //      type: 'button'
  //    }).html(content);
  //  }

  //  return {
  //    display: btn,
  //    clicker: btn
  //  }
  //};

  //$.fn.DataTable.ext.renderer.pagingButton.default = function (settings, buttonType, content, active, disabled) {
  //  alert('Default renderer working');
  //  // default rendering logic
  //};

  //$.fn.DataTable.ext.renderer.pageButton = $.extend(true, $.fn.DataTable.ext.renderer.pageButton, {
  //  input: function (settings, buttonType, content, active, disabled) {
  //    alert('Custom input renderer working');
  //    // Custom rendering logic
  //  }
  //});


  //function createInputElement(settings) {
  //  const pageInfo = $(settings.nTable).DataTable().page.info();
  //  const $input = $('<input>', {
  //    class: 'paginate_input',
  //    type: 'number',
  //    min: 1,
  //    max: pageInfo.pages,
  //  }).val(pageInfo.page + 1);
  //  $input.on("change", function (e) {
  //    if (this.value === '' || this.value.match(/[^0-9]/)) {
  //      /* Nothing entered or non-numeric character */
  //      this.value = this.value.replace(/[^\d]/g, ''); // don't even allow anything but digits
  //      return;
  //    }

  //    const page = Number(this.value - 1);
  //    $(settings.nTable).DataTable().page(page).draw(false);
  //  });

  //  return $input;
  //}

  //$.fn.DataTable.ext.pager.input = function () {
  //  console.log('1234');
  //  return ['first', 'previous', 'ellipsis', 'next', 'last'];
  //};

  //$.fn.DataTable.ext.renderer.pagingButton.input = function (settings, buttonType, content, active, disabled) {
  //  var classes = settings.oClasses.paging;
  //  var btnClasses = [classes.button];
  //  var btn;

  //  if (active) {
  //    btnClasses.push(classes.active);
  //  }

  //  if (disabled) {
  //    btnClasses.push(classes.disabled);
  //  }

  //  if (buttonType === 'ellipsis') {
  //    console.log("ellipsis m hun");
  //    btn = $('<div>', { class: 'sp-inline' }).append($('<span>', { class: 'paginate_page' }).text('Page'))
  //      .append(createInputElement(settings))
  //      .append($('<span>', { class: 'paginate_of' }).text('of ' + $(settings.nTable).DataTable().page.info().pages))[0];
  //  } else {
  //    console.log("else me hun");
  //    btn = $('<button>', {
  //      class: btnClasses.join(' '),
  //      role: 'link',
  //      type: 'button'
  //    }).html(content);
  //  }

  //  return {
  //    display: btn,
  //    clicker: btn
  //  }
  //};


  /**
 *  Plug-in offers the same functionality as `default` pagination type
 *  (see `pagingType` option) but with input field for jumping pages, for use with bootstrap theme.
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').dataTable( {
 *            "pagingType": "bootstrap_input"
 *        } );
 *    } );
 */

  //$.fn.DataTable.ext.pager.bootstrap_input = function (page, pages) {
  //  return ['first', 'previous', 'input', 'next', 'last'];
  //};


  //main_pageButtonFunc = $.fn.DataTable.ext.renderer.pageButton.bootstrap

  //$.fn.DataTable.ext.renderer.pageButton = $.extend(true, $.fn.DataTable.ext.renderer.pageButton,
  //  {
  //    //console.log('123456');
  //    bootstrap: function (settings, host, idx, buttons, page, pages) {
  //      console.log('1234566');
  //      main_pageButtonFunc(settings, host, idx, buttons, page, pages);

  //      input_html = '<div class="input-group">' +
  //        '<input style="width: ' + (Math.ceil(Math.log10(pages + 1)) + 2.5) + 'em; margin-left: -1px;" ' + (pages === 1 ? 'disabled ' : '') + 'class="form-control rounded-0" type="number" min="1" max="' + pages + '">' +
  //        '<span class="input-group-text rounded-0" id="basic-addon2"> of ' + pages + '</span>' +
  //        '</div>'

  //      let input_section = $(host).find("[data-dt-idx='input']");
  //      input_section.closest("li").prop("onclick", null).off("click");
  //      input_section.closest("li").prop("onkeypress", null).off("keypress");
  //      input_section.replaceWith(input_html);

  //      const api = new DataTable.Api(settings);

  //      $(host).find("ul.pagination input").val(page + 1).on('change', function (e) {
  //        api.page(Number($(e.target).val()) - 1).draw('page');
  //      });
  //    }
  //  }
  //)

  //function calcDisableClasses(oSettings) {
  //  var start = oSettings._iDisplayStart;
  //  var length = oSettings._iDisplayLength;
  //  var visibleRecords = oSettings.fnRecordsDisplay();
  //  var all = length === -1;

  //  // Gordey Doronin: Re-used this code from main jQuery.dataTables source code. To be consistent.
  //  var page = all ? 0 : Math.ceil(start / length);
  //  var pages = all ? 1 : Math.ceil(visibleRecords / length);

  //  var disableFirstPrevClass = (page > 0 ? '' : oSettings.oClasses.sPageButtonDisabled);
  //  var disableNextLastClass = (page < pages - 1 ? '' : oSettings.oClasses.sPageButtonDisabled);

  //  return {
  //    'first': disableFirstPrevClass,
  //    'previous': disableFirstPrevClass,
  //    'next': disableNextLastClass,
  //    'last': disableNextLastClass
  //  };
  //}

  //function calcCurrentPage(oSettings) {
  //  return Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
  //}

  //function calcPages(oSettings) {
  //  return Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength);
  //}

  //var firstClassName = 'first';
  //var previousClassName = 'previous';
  //var nextClassName = 'next';
  //var lastClassName = 'last';

  //var paginateClassName = 'paginate';
  //var paginatePageClassName = 'paginate_page';
  //var paginateInputClassName = 'paginate_input';
  //var paginateTotalClassName = 'paginate_total';

  //$.fn.dataTableExt.oPagination.input = {
  //  'fnInit': function (oSettings, nPaging, fnCallbackDraw) {
  //    var nFirst = document.createElement('span');
  //    var nPrevious = document.createElement('span');
  //    var nNext = document.createElement('span');
  //    var nLast = document.createElement('span');
  //    var nInput = document.createElement('input');
  //    var nTotal = document.createElement('span');
  //    var nInfo = document.createElement('span');

  //    var language = oSettings.oLanguage.oPaginate;
  //    var classes = oSettings.oClasses;
  //    var info = language.info || 'Page _INPUT_ of _TOTAL_';

  //    nFirst.innerHTML = language.sFirst;
  //    nPrevious.innerHTML = language.sPrevious;
  //    nNext.innerHTML = language.sNext;
  //    nLast.innerHTML = language.sLast;

  //    nFirst.className = firstClassName + ' ' + classes.sPageButton;
  //    nPrevious.className = previousClassName + ' ' + classes.sPageButton;
  //    nNext.className = nextClassName + ' ' + classes.sPageButton;
  //    nLast.className = lastClassName + ' ' + classes.sPageButton;

  //    nInput.className = paginateInputClassName;
  //    nTotal.className = paginateTotalClassName;

  //    if (oSettings.sTableId !== '') {
  //      nPaging.setAttribute('id', oSettings.sTableId + '_' + paginateClassName);
  //      nFirst.setAttribute('id', oSettings.sTableId + '_' + firstClassName);
  //      nPrevious.setAttribute('id', oSettings.sTableId + '_' + previousClassName);
  //      nNext.setAttribute('id', oSettings.sTableId + '_' + nextClassName);
  //      nLast.setAttribute('id', oSettings.sTableId + '_' + lastClassName);
  //    }

  //    nInput.type = 'text';

  //    info = info.replace(/_INPUT_/g, '</span>' + nInput.outerHTML + '<span>');
  //    info = info.replace(/_TOTAL_/g, '</span>' + nTotal.outerHTML + '<span>');
  //    nInfo.innerHTML = '<span>' + info + '</span>';

  //    nPaging.appendChild(nFirst);
  //    nPaging.appendChild(nPrevious);
  //    $(nInfo).children().each(function (i, n) {
  //      nPaging.appendChild(n);
  //    });
  //    nPaging.appendChild(nNext);
  //    nPaging.appendChild(nLast);

  //    $(nFirst).click(function () {
  //      var iCurrentPage = calcCurrentPage(oSettings);
  //      if (iCurrentPage !== 1) {
  //        oSettings.oApi._fnPageChange(oSettings, 'first');
  //        fnCallbackDraw(oSettings);
  //      }
  //    });

  //    $(nPrevious).click(function () {
  //      var iCurrentPage = calcCurrentPage(oSettings);
  //      if (iCurrentPage !== 1) {
  //        oSettings.oApi._fnPageChange(oSettings, 'previous');
  //        fnCallbackDraw(oSettings);
  //      }
  //    });

  //    $(nNext).click(function () {
  //      var iCurrentPage = calcCurrentPage(oSettings);
  //      if (iCurrentPage !== calcPages(oSettings)) {
  //        oSettings.oApi._fnPageChange(oSettings, 'next');
  //        fnCallbackDraw(oSettings);
  //      }
  //    });

  //    $(nLast).click(function () {
  //      var iCurrentPage = calcCurrentPage(oSettings);
  //      if (iCurrentPage !== calcPages(oSettings)) {
  //        oSettings.oApi._fnPageChange(oSettings, 'last');
  //        fnCallbackDraw(oSettings);
  //      }
  //    });

  //    $(nPaging).find('.' + paginateInputClassName).keyup(function (e) {
  //      // 38 = up arrow, 39 = right arrow
  //      if (e.which === 38 || e.which === 39) {
  //        this.value++;
  //      }
  //      // 37 = left arrow, 40 = down arrow
  //      else if ((e.which === 37 || e.which === 40) && this.value > 1) {
  //        this.value--;
  //      }

  //      if (this.value === '' || this.value.match(/[^0-9]/)) {
  //        /* Nothing entered or non-numeric character */
  //        this.value = this.value.replace(/[^\d]/g, ''); // don't even allow anything but digits
  //        return;
  //      }

  //      var iNewStart = oSettings._iDisplayLength * (this.value - 1);
  //      if (iNewStart < 0) {
  //        iNewStart = 0;
  //      }
  //      if (iNewStart >= oSettings.fnRecordsDisplay()) {
  //        iNewStart = (Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
  //      }

  //      oSettings._iDisplayStart = iNewStart;
  //      oSettings.oInstance.trigger("page.dt", oSettings);
  //      fnCallbackDraw(oSettings);
  //    });

  //    // Take the brutal approach to cancelling text selection.
  //    $('span', nPaging).bind('mousedown', function () { return false; });
  //    $('span', nPaging).bind('selectstart', function () { return false; });

  //    // If we can't page anyway, might as well not show it.
  //    var iPages = calcPages(oSettings);
  //    if (iPages <= 1) {
  //      $(nPaging).hide();
  //    }
  //  },

  //  'fnUpdate': function (oSettings) {
  //    if (!oSettings.aanFeatures.p) {
  //      return;
  //    }

  //    var iPages = calcPages(oSettings);
  //    var iCurrentPage = calcCurrentPage(oSettings);

  //    var an = oSettings.aanFeatures.p;
  //    if (iPages <= 1) // hide paging when we can't page
  //    {
  //      $(an).hide();
  //      return;
  //    }

  //    var disableClasses = calcDisableClasses(oSettings);

  //    $(an).show();

  //    // Enable/Disable `first` button.
  //    $(an).children('.' + firstClassName)
  //      .removeClass(oSettings.oClasses.sPageButtonDisabled)
  //      .addClass(disableClasses[firstClassName]);

  //    // Enable/Disable `prev` button.
  //    $(an).children('.' + previousClassName)
  //      .removeClass(oSettings.oClasses.sPageButtonDisabled)
  //      .addClass(disableClasses[previousClassName]);

  //    // Enable/Disable `next` button.
  //    $(an).children('.' + nextClassName)
  //      .removeClass(oSettings.oClasses.sPageButtonDisabled)
  //      .addClass(disableClasses[nextClassName]);

  //    // Enable/Disable `last` button.
  //    $(an).children('.' + lastClassName)
  //      .removeClass(oSettings.oClasses.sPageButtonDisabled)
  //      .addClass(disableClasses[lastClassName]);

  //    // Paginate of N pages text
  //    $(an).find('.' + paginateTotalClassName).html(iPages);

  //    // Current page number input value
  //    $(an).find('.' + paginateInputClassName).val(iCurrentPage);
  //  }
  //};

  //$.fn.dataTableExt.oPagination.input = {
  //  'fnInit': function (oSettings, nPaging, fnCallbackDraw) {
  //    var nFirst = document.createElement('span');
  //    var nPrevious = document.createElement('span');
  //    var nNext = document.createElement('span');
  //    var nLast = document.createElement('span');
  //    var nInput = document.createElement('input');
  //    var nPage = document.createElement('span');
  //    var nOf = document.createElement('span');

  //    var language = oSettings.oLanguage.oPaginate;
  //    var classes = oSettings.oClasses;

  //    nFirst.innerHTML = language.sFirst;
  //    nPrevious.innerHTML = language.sPrevious;
  //    nNext.innerHTML = language.sNext;
  //    nLast.innerHTML = language.sLast;

  //    nFirst.className = firstClassName + ' ' + classes.sPageButton;
  //    nPrevious.className = previousClassName + ' ' + classes.sPageButton;
  //    nNext.className = nextClassName + ' ' + classes.sPageButton;
  //    nLast.className = lastClassName + ' ' + classes.sPageButton;

  //    nOf.className = paginateOfClassName;
  //    nPage.className = paginatePageClassName;
  //    nInput.className = paginateInputClassName;

  //    if (oSettings.sTableId !== '') {
  //      nPaging.setAttribute('id', oSettings.sTableId + '_' + paginateClassName);
  //      nFirst.setAttribute('id', oSettings.sTableId + '_' + firstClassName);
  //      nPrevious.setAttribute('id', oSettings.sTableId + '_' + previousClassName);
  //      nNext.setAttribute('id', oSettings.sTableId + '_' + nextClassName);
  //      nLast.setAttribute('id', oSettings.sTableId + '_' + lastClassName);
  //    }

  //    nInput.type = 'text';
  //    nPage.innerHTML = 'Page ';

  //    nPaging.appendChild(nFirst);
  //    nPaging.appendChild(nPrevious);
  //    nPaging.appendChild(nPage);
  //    nPaging.appendChild(nInput);
  //    nPaging.appendChild(nOf);
  //    nPaging.appendChild(nNext);
  //    nPaging.appendChild(nLast);

  //    $(nFirst).click(function () {
  //      var iCurrentPage = calcCurrentPage(oSettings);
  //      if (iCurrentPage !== 1) {
  //        oSettings.oApi._fnPageChange(oSettings, 'first');
  //        fnCallbackDraw(oSettings);
  //      }
  //    });

  //    $(nPrevious).click(function () {
  //      var iCurrentPage = calcCurrentPage(oSettings);
  //      if (iCurrentPage !== 1) {
  //        oSettings.oApi._fnPageChange(oSettings, 'previous');
  //        fnCallbackDraw(oSettings);
  //      }
  //    });

  //    $(nNext).click(function () {
  //      var iCurrentPage = calcCurrentPage(oSettings);
  //      if (iCurrentPage !== calcPages(oSettings)) {
  //        oSettings.oApi._fnPageChange(oSettings, 'next');
  //        fnCallbackDraw(oSettings);
  //      }
  //    });

  //    $(nLast).click(function () {
  //      var iCurrentPage = calcCurrentPage(oSettings);
  //      if (iCurrentPage !== calcPages(oSettings)) {
  //        oSettings.oApi._fnPageChange(oSettings, 'last');
  //        fnCallbackDraw(oSettings);
  //      }
  //    });

  //    $(nInput).keyup(function (e) {
  //      // 38 = up arrow, 39 = right arrow
  //      if (e.which === 38 || e.which === 39) {
  //        this.value++;
  //      }
  //      // 37 = left arrow, 40 = down arrow
  //      else if ((e.which === 37 || e.which === 40) && this.value > 1) {
  //        this.value--;
  //      }

  //      if (this.value === '' || this.value.match(/[^0-9]/)) {
  //        /* Nothing entered or non-numeric character */
  //        this.value = this.value.replace(/[^\d]/g, ''); // don't even allow anything but digits
  //        return;
  //      }

  //      var iNewStart = oSettings._iDisplayLength * (this.value - 1);
  //      if (iNewStart < 0) {
  //        iNewStart = 0;
  //      }
  //      if (iNewStart >= oSettings.fnRecordsDisplay()) {
  //        iNewStart = (Math.ceil((oSettings.fnRecordsDisplay() - 1) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
  //      }

  //      oSettings._iDisplayStart = iNewStart;
  //      fnCallbackDraw(oSettings);
  //    });

  //    // Take the brutal approach to cancelling text selection.
  //    $('span', nPaging).bind('mousedown', function () { return false; });
  //    $('span', nPaging).bind('selectstart', function () { return false; });

  //    // If we can't page anyway, might as well not show it.
  //    var iPages = calcPages(oSettings);
  //    if (iPages <= 1) {
  //      $(nPaging).hide();
  //    }
  //  },

  //  'fnUpdate': function (oSettings) {
  //    if (!oSettings.aanFeatures.p) {
  //      return;
  //    }

  //    var iPages = calcPages(oSettings);
  //    var iCurrentPage = calcCurrentPage(oSettings);

  //    var an = oSettings.aanFeatures.p;
  //    if (iPages <= 1) // hide paging when we can't page
  //    {
  //      $(an).hide();
  //      return;
  //    }

  //    var disableClasses = calcDisableClasses(oSettings);

  //    $(an).show();

  //    // Enable/Disable `first` button.
  //    $(an).children('.' + firstClassName)
  //      .removeClass(oSettings.oClasses.sPageButtonDisabled)
  //      .addClass(disableClasses[firstClassName]);

  //    // Enable/Disable `prev` button.
  //    $(an).children('.' + previousClassName)
  //      .removeClass(oSettings.oClasses.sPageButtonDisabled)
  //      .addClass(disableClasses[previousClassName]);

  //    // Enable/Disable `next` button.
  //    $(an).children('.' + nextClassName)
  //      .removeClass(oSettings.oClasses.sPageButtonDisabled)
  //      .addClass(disableClasses[nextClassName]);

  //    // Enable/Disable `last` button.
  //    $(an).children('.' + lastClassName)
  //      .removeClass(oSettings.oClasses.sPageButtonDisabled)
  //      .addClass(disableClasses[lastClassName]);

  //    // Paginate of N pages text
  //    $(an).children('.' + paginateOfClassName).html(' of ' + iPages);

  //    // Current page numer input value
  //    $(an).children('.' + paginateInputClassName).val(iCurrentPage);
  //  }
  //}

})(jQuery);
