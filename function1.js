'use strict';

console.log('Loading function');

var db = require('mysql');
var connection = db.createConnection({
    host: 'ec2-52-33-41-xxx.us-west-2.compute.amazonaws.com',
    port: 3306,
    user: '*****',
    password: '*****',
    database: '*****'
});
connection.connect(function(err) {
    if (!err) {
        console.log("Database is connected ... ");
    } else {
        console.log("Error connecting database ... ");
    }
});

exports.getAll = function(event, context, callback) {
    if (event === null){
        console.log("Error:event object is null.");
        return;
    }
    if (event.stageVariables === null){
        console.log("Error:event.stageVariables object is null");
        return;
    }
    if (event.stageVariables === null){
        console.log("Error:event.stage object is null");
        return;
    }
    if (event.queryStringParameters === null){
        console.log("Error:event.queryStringParameters object is null");
        return;
    }
    if (typeof event.queryStringParameters==="string" && (event.queryStringParameters.toUpperCase() != 'ASC' || event.queryStringParameters.toUpperCase() != 'DESC')){
        console.log("Error:event.queryStringParameters wrong type or is null");
        return;
    }

    connection = db.connect(event.stageVariables);
    var query = 'SELECT * FROM Clients ORDER BY' + event.queryStringParameters.sort;
    connection.query(query, function(error, results, callback) {
        if (error) {
            callback(null, {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(error)
            });
        } else {
            callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(results)
            });
        }
        db.close(connection);
    });
};