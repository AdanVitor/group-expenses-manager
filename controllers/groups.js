module.exports = function(app) {
	var User = app.models.user;
	var Group = app.models.group;
	var GroupsController = {
		index: function(req, res) {
			var _id = req.session.user._id; 
			console.log(typeof _id);
			User.findById(_id, function(erro, user) {
				var contacts =  user.contacts;
				var groupIDs = user.groupIDs;
				console.log(groupIDs);
				// acha todos os elementos em 'groupIDs' e retorna um array
				Group.find( { '_id': { $in: groupIDs} }, function(erro, matching_groups){
					console.log("grupos");
					console.log(matching_groups);
					var resultado = { contacts: contacts , user: req.session.user, groups: matching_groups};
					res.render("groups/index", resultado);
				});
			});
		},
		create_group: function(req, res) {
			/*recuperando os contacts desse cliente no banco de dados*/
			var _id = req.session.user._id; /*Lembrando que o usuário, recuperado do banco de dados, agora tem um id*/
			User.findById(_id, function(erro, user) {
				var resultado = { user: req.session.user};
				res.render("groups/create_group", resultado);
			});
		},
		save_group: function(req, res) {
			var _id = req.session.user._id;
			var newGroup = req.body.group;
			Group.create(newGroup,function (erro,group){
				if(group){
					var userIds = group.userIDs;
					userIds.push(_id);
					group.save();
					/*Adding the idGroup in the user*/
					User.findById(_id, function(erro,user){
						var groupIDs = user.groupIDs;
						groupIDs.push(group._id);
						user.save();
						console.log("user");
						console.log(user);
					});
					res.redirect("/groups");
				}else{
					console.log("erro ao criar grupo");
				}

			});
		},
		create: function(req, res) {
			var _id = req.session.user._id;
			var client;

			User.findById(_id, function(erro, user) {
				var contact = req.body.contact;
				var contacts = user.contacts;
				contacts.push(contact);
				user.save();
				client = user.toJSON();
				console.log("cliente: " + client);

				/*criando o contact a ser adicionado em B*/
				var contact = {};
				contact.name = client.name;
				contact.email = client.email;
				/*anteriormente adicionou-se o contact B para o usuário A
				agora adicioando A como contact do usuário do B - relação
				reflexiva*/
				var query = {email: req.body.contact.email};
				User.findOne(query).select().exec(function(erro,userB){
					if(userB){
						console.log("userB:" + userB);
						var contacts = userB.contacts;
						contacts.push(contact);
						userB.save(function(){
							res.redirect("/contacts");
						});
						
					}
					else{
						console.log("User nao existente");
					}

				});

			});
		},
		show: function(req, res) {
			var _id = req.session.user._id;
			User.findById(_id, function(erro, user) {
				var contactID = req.params.id;
				var contact = user.contacts.id(contactID);
				var resultado = { contact: contact };
				res.render("contacts/show", resultado);
			});
		},
		edit: function(req, res) {
			var _id = req.session.user._id;
			User.findById(_id, function(erro, user) {
				var contactID = req.params.id;
				var contact = user.contacts.id(contactID);
				var resultado = {contact: contact};
				res.render("contacts/edit", resultado);
			});
		},

		update: function(req, res) {
		var _id = req.session.user._id;
			User.findById(_id, function(erro, user) {
				var contactID = req.params.id;
				var contact = user.contacts.id(contactID);
				contact.name = req.body.contact.name;
				contact.email = req.body.contact.email;
				/*Função save pra atualizar o usuário no banco de dados*/
				user.save(function() {
					res.redirect("/contacts");
				});
			});
		},
		destroy: function(req, res) {
			var _id = req.session.user._id;
			User.findById(_id, function(erro, user) {
				var contactID = req.params.id;
				user.contacts.id(contactID).remove();
				user.save(function() {
				res.redirect("/contacts");
				});
			});
		},
		get_group: function(req, res) {
			var _id = req.session.user._id;
			User.findById(_id, function(erro, user) {
				res.json(user.contacts)
			});
		}
	};
	return GroupsController;
};