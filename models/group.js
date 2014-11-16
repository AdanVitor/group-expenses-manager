module.exports = function (app){
	var Schema = require("mongoose").Schema;
	var balance = Schema({
		userID: {type:String},
		userName: {type:String},
		balance:{type: Number}
	});
	var group = Schema({
		name: {type: String, required: true},
		description: {type: String, required: true},
		userIDs: [String],
		usersBalance: [balance]
	});
	
	return db.model("group", group);
};