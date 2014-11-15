module.exports = function (app){
	var Schema = require("mongoose").Schema;
	var user = Schema({
		name: {type: String, required: true},
		email: {type: String, required: true, index: {unique: true}},
		contacts: [String],
		groupIDs:[String]
	});
return db.model("users", user);
};