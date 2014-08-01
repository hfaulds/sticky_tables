(function($) {
  function StickyTable(table, settings) {
    var default_settings = {
      inner_class: 'stick-table-fix-width'
    };
    this.table = table;
    this.thead = table.find('thead');
    this.tbody = table.find('tbody');

    this.settings = _.extend(default_settings, settings);
  }

  StickyTable.prototype.add_wrapper = function(div) {
    div.wrapInner('<div class="' + this.settings.inner_class + '">');
    return div.children();
  };

  StickyTable.prototype.init = function() {
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

    this.thead_clone = this.thead.clone();
    this.thead_clone.hide();
    this.thead.before(this.thead_clone);
    this.thead_clone.css({
      'top': 0,
      'left': this.thead.position().left,
      'position': 'fixed',
      'z-index': 5
    });
    this.scroll();
  };

  StickyTable.prototype.scroll = function() {
    if($(window).scrollTop() > this.table.offset().top) {
      var maxScroll = $(document).width() - $(window).width();
      var scrollLeft = Math.min(Math.max(0, $(window).scrollLeft()), maxScroll);

      this.thead_clone.show();
      this.thead_clone.css({
        'left': this.table.offset().left-scrollLeft,
      });
    } else {
      this.thead_clone.hide();
    }
  };


  $.fn.sticky_table = function(settings) {
    var table = new StickyTable(this, settings)
    table.init();
    $(window).scroll($.proxy(table.scroll, table));
  };
})(jQuery);
