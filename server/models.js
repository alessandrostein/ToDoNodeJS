var mongoose = require('mongoose');
var db = mongoose.Connection;

module.exports = {
	models: {},
	init: function(next) {
		mongoose.connect('mongodb://localhost/todo');

		var Schema = mongoose.Schema,
			ObjectId = mongoose.Schema.ObjectId;

		var TaskSchema = new Schema({
			id: Number,
			title: String,
			completed: Boolean
		});

		var UserSchema = new Schema({
			id: Number,
			name: String,
			email: String,
			password: String,
			tasks: [{ type: ObjectId, ref: 'Task' }]
		});

		var Task = mongoose.model('Task', TaskSchema);
		var User = mongoose.model('User', UserSchema);
		this.models = { Task: Task, User: User };
		next(this.models);
	}
};