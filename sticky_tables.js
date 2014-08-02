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
    if (this.settings.sticky_column_headings) {
      this.setupColumnHeadings();
    }
    if (this.settings.sticky_row_names) {
      this.setupRowHeadings();
    }
  };

  StickyTable.prototype.setStickyDivSizes = function(targets, sources) {
    var wrapperHtml = '<div class="' + this.settings.inner_class + '">';
    targets.each(function(index) {
      var target = $(this).wrapInner(wrapperHtml).children().first();
      var source = sources.eq(index);
      var sourceInner = source.wrapInner(wrapperHtml).children().first();

      var width = source.width();
      target.width(width);
      sourceInner.width(width);

      var height = source.height();
      target.height(height);
      sourceInner.height(height);
    });
  };

  StickyTable.prototype.setupColumnHeadings = function() {
    this.column_headings = this.thead.clone();
    this.setStickyDivSizes(this.column_headings.find('th'), this.thead.find('th'));

    this.column_headings.hide();
    this.column_headings.css({
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
    this.setStickyDivSizes(this.row_names.find('td'), this.tbody.find('tr td:first-child'));

    this.row_names.hide();
    this.row_names.css({
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

  StickyTable.prototype.scrollTop = function() {
    var maxScroll = $(document).height() - $(window).height();
    return Math.min(Math.max(0, $(window).scrollTop()), maxScroll);
  };

  StickyTable.prototype.scrollLeft = function() {
    var maxScroll = $(document).width() - $(window).width();
    return Math.min(Math.max(0, $(window).scrollLeft()), maxScroll);
  };

  StickyTable.prototype.scrollColumnHeadings = function() {
    var scrollTop = this.scrollTop();
    var scrollLeft = this.scrollLeft();
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
    var scrollTop = this.scrollTop();
    var scrollLeft = this.scrollLeft();
    var left_of_table = this.table.offset().left;
    var right_of_table = left_of_table + this.table.width();

    if(scrollLeft > left_of_table && scrollLeft < right_of_table) {
      this.row_names.show();
      this.row_names.css({
        'left': Math.min(right_of_table - this.row_names.width() - scrollLeft, 0),
        'top': this.tbody.offset().top - scrollTop,
      });
    } else {
      this.row_names.hide();
    }
  };

  $.fn.sticky_table = function(settings) {
    var tables = this;
    $(window).load(function() {
      tables.each(function() {
        var table = new StickyTable($(this), settings);
        table.init();
        $(window).scroll($.proxy(table.scroll, table));
      });
    });
  };
})(jQuery);
