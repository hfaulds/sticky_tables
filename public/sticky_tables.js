(function($) {
  function StickyTable(table, settings) {
    var default_settings = {
      inner_class: 'stick-table-fix-width',
      sticky_column_headings: true,
      sticky_row_names: true
    };
    this.table = table;
    this.thead = table.find('thead');
    this.tbody = table.find('tbody');
    this.first_row = this.tbody.find('tr td:first-child');

    this.settings = _.extend(default_settings, settings);
  }

  StickyTable.prototype.init = function() {
    if (this.settings.sticky_column_headings || this.settings.stick_row_names) {
      this.setupInnerDivs();
    }
    if (this.settings.sticky_column_headings) {
      this.setupColumnHeadings();
    }
    if (this.settings.sticky_row_names) {
      this.setupRowHeadings();
    }
  };

  StickyTable.prototype.setupInnerDivs = function() {
    var self = this;
    this.table.find('td,th').wrapInner('<div class="' + this.settings.inner_class + '">');

    _(this.thead.children().eq(0).children().size()).times(function(index) {
      var column = self.table.find('tr').find('.' + self.settings.inner_class+':eq('+index+')');
      column.width(column.width());
    });

    this.tbody.find('tr').each(function() {
      var row = $(this).find('.' + self.settings.inner_class);
      row.height($(this).height());
    });
  };

  StickyTable.prototype.setupColumnHeadings = function() {
    this.column_headings = this.thead.clone();
    this.column_headings.hide();
    this.column_headings.css({
      'top': 0,
      'left': this.thead.position().left,
      'position': 'fixed',
      'z-index': 5
    });
    this.thead.before(this.column_headings);
    this.scrollColumnHeadings();
  };

  StickyTable.prototype.setupRowHeadings = function() {
    var self = this;

    this.row_names = this.tbody.clone();
    this.row_names.find('tr td:not(:first-child)').remove();

    this.row_names.hide();
    this.row_names.css({
      'top': this.thead.position().top + this.thead.height(),
      'left': 0,
      'position': 'fixed',
      'z-index': 4
    });
    this.tbody.before(this.row_names);
    this.scrollRowNames();
  };

  StickyTable.prototype.scroll = function() {
    if(this.settings.sticky_column_headings) {
      this.scrollColumnHeadings();
    }
    if(this.settings.sticky_row_names) {
      this.scrollRowNames();
    }
  };

  StickyTable.prototype.scrollColumnHeadings = function() {
    var scrollTop = $(window).scrollTop();
    var scrollLeft = $(window).scrollLeft();
    var top_of_table = this.table.offset().top;
    var bottom_of_table = top_of_table + this.table.height();

    if(scrollTop > top_of_table && scrollTop < bottom_of_table) {
      this.column_headings.show();
      this.column_headings.css({
        'top': Math.min(bottom_of_table - this.column_headings.height() - scrollTop, 0),
        'left': this.table.offset().left - scrollLeft,
      });
    } else {
      this.column_headings.hide();
    }
  };

  StickyTable.prototype.scrollRowNames = function() {
    var scrollTop = $(window).scrollTop();
    var scrollLeft = $(window).scrollLeft();
    var left_of_table = this.table.offset().left;
    var right_of_table = left_of_table + this.table.width();

    if(scrollLeft > left_of_table && scrollLeft < right_of_table) {
      this.row_names.show();
      this.row_names.css({
        'left': Math.min(right_of_table - this.row_names.width() - scrollLeft, 0),
        'top': this.thead.offset().top + this.thead.height() - scrollTop,
      });
    } else {
      this.row_names.hide();
    }
  };

  $.fn.sticky_table = function(settings) {
    var table = new StickyTable(this, settings);
    table.init();
    $(window).scroll($.proxy(table.scroll, table));
  };
})(jQuery);
