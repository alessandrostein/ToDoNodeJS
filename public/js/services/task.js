angular.module("restful", []).factory("Task", function($resource) {
  return $resource("/task/:id");
});