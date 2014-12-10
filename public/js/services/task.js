angular.module("restful", []).factory("Task", function($resource) {
  return $resource("/task/:id", {}, {
    'update': { method:'PUT', params: { id: "@id"} }
  });
});