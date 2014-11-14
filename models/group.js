module.exports = function (app){
	var Schema = require("mongoose").Schema;
	var group = Schema({
		name: {type: String, required: true},
		description: {type: String, required: true},
		userIDs: [String]
	});
	return db.model("group", group);
};