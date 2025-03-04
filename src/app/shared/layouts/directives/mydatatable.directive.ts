import { Directive, ElementRef, Input } from '@angular/core';
//import 'datatables.net-buttons-dt';
//import 'datatables.net-plugins/pagination/input.js';

@Directive({
  selector: '[appMydatatable]',
  standalone: true
})
export class MydatatableDirective {

  @Input() options: any;
  constructor(private el: ElementRef) { }

  ngOnInit() {
    const $el = $(this.el.nativeElement);
    const dataTableOptions = {
      dom: '<"top"<"clear">><rt><"bottom row"<"col-sm-4 nopadding"l><"col-sm-4 nopadding text-center"i><"col-sm-4 nopadding"p><"clear">>',
      //dom: 'Bfrtip',
      // Configure the buttons
      //buttons: [
      //  'colvis'
      //],
      aLengthMenu: [25, 50, 100, 200],
      pageLength: 25,
      serverSide: true,
      processing: true,
      stateSave: true,
      stateDuration: 10800,
      //pagingType: 'input',
      //pagingType: 'input',
      pagingType: 'input', // Set to 'custom'
      //renderer: {
      //  pageButton: function (settings: any, buttonType: any, content: any, active: any, disabled: any) {
      //    console.log('Renderer function called');
      //    // ... custom renderer function ...
      //  }
      //},
      destroy: true,
      language: {
        infoFiltered: "",
        processing: ""
      },
      ...this.options // Extend or override options
    };

    

    if ($el.hasClass('dataTable-column_filter')) {
      this.initializeColumnFilters($el, dataTableOptions);
    }

    // Initialize DataTable
    const table = $el.DataTable(dataTableOptions);

    // Custom logic like FixedColumns, checkboxes, etc.
    if ($el.hasClass('dataTable-fixedcolumn')) {
      //new $.fn.dataTable.FixedColumns(table);
    }

    //this.initializeCheckAll($el, table);

  }

  private initializeColumnFilters($el: any, dataTableOptions: any) {
    const types = $el.data('column-filter-types')?.split(',') || [];
    const position = $el.data('column-filter-position') || 'bottom';
    const dateformat = $el.data('column-filter-dateformat') || 'dd-mm-yy';

    dataTableOptions.initComplete = function () {
      const api = this.api();
      const $filterRow = $('<tr class="dataTable-col_filter"></tr>');
      const $table = $(this);

      if (position === 'top') {
        $filterRow.appendTo($table.find('thead'));
      } else {
        if ($table.find('tfoot').length === 0) {
          $('<tfoot></tfoot>').appendTo($table);
        }
        $filterRow.appendTo($table.find('tfoot'));
      }

      api.columns().indexes().flatten().each(function (i: number) {
        const column = api.column(i);
        const $filterCol = $('<th></th>').appendTo($filterRow);
        const columnHeader = api.column(i).header();

        switch (types[i]) {
          case 'select':
            const select = $('<select class="input-sm"></select>')
              .appendTo($filterCol)
              .on('change', function (e: any) {
                const target = e.target as HTMLSelectElement; // Cast to specific element type
                //const newPage = target.value ? parseInt(target.value, 10) - 1 : 0;
                const val = target.value;
                api.column(i).search(val).draw();
              });
            // Custom logic to populate select options
            break;

          case 'daterange':
            // Custom date range filter logic using datepickers
            break;

          case 'text':
            const title = $(columnHeader).text().trim();
            $('<input type="text" autocomplete="off" class="input-sm" placeholder="' + title + '" />')
              .appendTo($filterCol)
              .on('change', function (e: any) {
                const target = e.target as HTMLInputElement; // Cast to specific element type
                //const newPage = target.value ? parseInt(target.value, 10) - 1 : 0;
                const val = target.value;
                //const val = $(this).val();

                api.column(i).search(val).draw();
              });
            break;

          // Add other filter types as needed
        }
      });
    };
  }

  //private initializeCheckAll($el: any, table: any) {
  //  $el.find('.dataTable-checkall').change(function () {
  //    const $checkbox = $(this);
  //    const colIndex = $checkbox.parent().index();
  //    const nodes = table.column(colIndex, { page: 'all' }).nodes().to$();
  //    nodes.find('input[type="checkbox"]').prop('checked', $checkbox.prop('checked'));
  //  });
  //}



}
