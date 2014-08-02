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

  StickyTable.prototype.add_wrapper = function(div, content) {
    if(content) {
      content = '<div class="' + this.settings.inner_class + '">';
    }
    div.wrapInner(content);
    return div.children();
  };

  StickyTable.prototype.setupInnerDivs = function() {
    var self = this;
    self.thead.children().each(function() {
      var thead_row = $(this);
      thead_row.children().each(function(index) {
        var heading = $(this);
        var heading_wrapper = self.add_wrapper(heading);

        var columns = self.tbody.children('tr').children('td:nth-child('+(index+1)+')');
        var column_wrappers = self.add_wrapper(columns);

        var width = column_wrappers.width();
        heading_wrapper.width(width);
        column_wrappers.width(width);
      });
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
    if($(window).scrollTop() > this.table.offset().top) {
      var maxScroll = $(document).width() - $(window).width();
      var scrollLeft = Math.min(Math.max(0, $(window).scrollLeft()), maxScroll);

      this.column_headings.show();
      this.column_headings.css({
        'left': this.table.offset().left-scrollLeft,
      });
    } else {
      this.column_headings.hide();
    }
  };

  StickyTable.prototype.scrollRowNames = function() {
    if($(window).scrollLeft() > (this.thead.position().left)) {
      var maxScroll = $(document).height() - $(window).height();
      var scrollTop = Math.min(Math.max(0, $(window).scrollTop()), maxScroll);

      this.row_names.show();
      this.row_names.css({
        'top': this.thead.offset().top + this.thead.height() - scrollTop
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
