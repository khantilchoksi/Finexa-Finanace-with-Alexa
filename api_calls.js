var Promise = require("bluebird");
//var _ = require("underscore");
var request = require("request");
//var querystring = require('querystring');

var urlRoot = "https://api.trello.com";


function getUserExpenseCategory(userName)
{
    var user ={
        "user" : userName
    };

	var options = {
        url: urlRoot + "/users",
        method: 'GET',
        json: user,
		headers: {
			"content-type": "application/json",
		}
	};

	return new Promise(function (resolve, reject) 
	{
		// Send a http request to url and specify a callback that will be called upon its return.
		request(options, function (error, response, body) 
		{
            console.log("Function call!");
            console.log(body);
            //var obj = JSON.parse(body);
            console.log(" RESPONSE: ",JSON.stringify(body));
            resolve(body.amount);
		});
	});
}

// function createNewList(list_name, boardId)
// {
//     var new_list = {
// 		"name" : list_name,
// 		"idBoard" : "899698658"
//     };

// 	var options = {
//         url: urlRoot + "/1/lists",
//         method: 'POST',
//         json: new_list,
// 		headers: {
// 			"content-type": "application/json",
// 			"Authorization": token
// 		}
// 	};

// 	return new Promise(function (resolve, reject) 
// 	{
// 		// Send a http request to url and specify a callback that will be called upon its return.
// 		request(options, function (error, response, body) 
// 		{
//             console.log("Inside create new list");
//             console.log(body);
// 			//var obj = JSON.parse(body);
//             resolve(body);
// 		});
// 	});
// }

// function createNewCard(card_name, listId)
// {
//     var new_card = {
// 		"name" : card_name,
// 		"idList" : listId
//     };

// 	var options = {
//         url: urlRoot + "/1/cards",
//         method: 'POST',
//         json: new_card,
// 		headers: {
// 			"content-type": "application/json",
// 			"Authorization": token
// 		}
// 	};

// 	return new Promise(function (resolve, reject) 
// 	{
// 		// Send a http request to url and specify a callback that will be called upon its return.
// 		request(options, function (error, response, body) 
// 		{
//             console.log("Inside create new card");
//             console.log(body);
// 			//var obj = JSON.parse(body);
//             resolve(body);
// 		});
// 	});
// }

exports.getUserExpenseCategory = getUserExpenseCategory;
// exports.createNewList = createNewList;
// exports.createNewCard = createNewCard;