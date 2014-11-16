module.exports = function (app){
	var Schema = require("mongoose").Schema;
	var expense = Schema({
		// explicit - given by user
		description: {type:String},
		cost:{type:Number},
		// implicit - retrieved by server
		date: {type:Date},
		userID: {type:String},
		groupID:{type:String},
		userName:{type:String},
	});
return db.model("expense", expense);
};