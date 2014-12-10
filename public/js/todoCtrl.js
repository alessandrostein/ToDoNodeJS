/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todo')
	.controller('TodoCtrl', function TodoCtrl($scope, $filter, todoStorage, $resource, Task, $http) {
		'use strict';

		var todos = [];
		// var task = new Task();

		Task.query(function(result){
			todos = $scope.todos = result;
		});

		$scope.newTodo = '';
		$scope.editedTodo = null;

		$scope.$watch('todos', function (newValue, oldValue) {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
			if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
				todoStorage.put(todos);
			}
		}, true);

		$scope.addTodo = function ($event) {
			if ($event.which !== 13) return;
			var newTodo = $scope.newTodo.trim();
			if (!newTodo.length) {
				return;
			}

			var obj = {};

			var id = todos.push({
				id: todos.length,
				title: newTodo,
				completed: false
			});

			obj = todos[id-1];

			Task.save(obj);

			$scope.newTodo = '';
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.doneEditing = function (todo) {
			$http.put("/task/" + todo.id, todo).success(function(){
					$scope.editedTodo = null;
					todo.title = todo.title.trim();

					if (!todo.title) {
						$scope.removeTodo(todo);
					}
				});
		};

		$scope.revertEditing = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.doneEditing($scope.originalTodo);
		};

		$scope.removeTodo = function (todo) {
			Task.delete({id: todo.id}, function(){
				todos.splice(todos.indexOf(todo), 1);
			});
		};

		$scope.clearCompletedTodos = function () {
			$scope.todos = todos = todos.filter(function (val) {
				return !val.completed;
			});
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo) {
				todo.completed = !completed;
			});
		};
	});
