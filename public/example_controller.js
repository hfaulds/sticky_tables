function ExampleController($scope) {
  $scope.headings = 'abcdefghijklmnopqrstuvwxyz'.split('');
  $scope.rows = _(51).times(function(n) { return n });
  $scope.columns = _(51).times(function(n) { return n });
  $(function() {
    $('table').sticky_table();
  });
}
