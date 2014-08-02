function ExampleController($scope) {
  $scope.column_names = _.flatten(_(2).times(function() {
    return _.union('abcdefghijklmnopqrstuvwxyz'.split(''))
  }));
  $scope.column_names[3] = 'long heading';

  $scope.row_names = 'abcdefghijklmnopqrstuvwxyz'.split('');

  $scope.column_vals = _(51).times(function(n) { return n });
  $scope.column_vals[6] = 'long column';

  $(function() {
    $('table').sticky_table();
  });
}
