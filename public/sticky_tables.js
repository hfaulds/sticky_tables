(function($) {
  function StickyTable(table, settings) {
    var default_settings = {
      inner_class: 'stick-table-fix-width',
      sticky_column_headings: true
    };
    this.table = table;
    this.thead = table.find('thead');
    this.tbody = table.find('tbody');

    this.settings = _.extend(default_settings, settings);
    if (this.settings.sticky_column_headings) {
      this.setupColumnHeadings();
    }
  }

  StickyTable.prototype.add_wrapper = function(div) {
    div.wrapInner('<div class="' + this.settings.inner_class + '">');
    return div.children();
  };

  StickyTable.prototype.setupColumnHeadings = function() {
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

  StickyTable.prototype.scroll = function() {
    if(this.settings.sticky_column_headings) {
      this.scrollColumnHeadings();
    }
    //handle sticky row names
  };

  StickyTable.prototype.scrollColumnHeadings = function() {
    if($(window).scrollTop() > this.table.offset().top) {
      // handle scrolling past
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

  $.fn.sticky_table = function(settings) {
    var table = new StickyTable(this, settings)
    $(window).scroll($.proxy(table.scroll, table));
  };
})(jQuery);
