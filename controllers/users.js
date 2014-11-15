module.exports = function(app) {
	var User = app.models.user;
	var Group = app.models.group;
	var UsersController = {
		add_contact: function (req,res) {
			var userId = req.session.user._id;
			var idToAdd = req.body.contact.id;
			User.findById(userId, function(erro, user) {
				var contacts =  user.contacts;
				contacts.push(idToAdd);
				user.save();
				User.findById(idToAdd, function(erro, userToAdd) {
					var toAddContacts =  userToAdd.contacts;
					toAddContacts.push(userId);
					userToAdd.save();
					res.redirect("/show_contact");
				});

			});
		},
		show_contact: function (req,res) {
			var id = req.session.user._id;
			User.findById(id , function (erro,user){
				if(user){
					var contacts = user.contacts;
					contacts.push(id);
					console.log("contacts: ");
					console.log(contacts);
					User.find({}, function(erro, user) {
						var possible_contacts = [];
						for(var i = 0 ; i < user.length ; i++){
							var found = false;
							for(var j = 0 ; j < contacts.length;j++){
								if(user[i]._id == contacts[j]){
									found = true;
									break;
								}
							}
							if(!found){
								possible_contacts.push(user[i]);
							}
						}
						res.render("contacts/add_contact",{possible_contacts: possible_contacts});
					});
				}
			});

			
		}		
	};
	return UsersController;
};
