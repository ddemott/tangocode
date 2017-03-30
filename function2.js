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

var updateClient = function (client, id, connection) {
    return new Promise(function (resolve, reject) {
        var query = 'UPDATE Clients SET ? WHERE id = ?';
        connection.query(query, [client, id], function (error, results, callback) {
            if (error) {
                connection.close();
                callback(null, {
                    statusCode: 500,
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify(error)
                });
            } else {
                connection.close();
                callback(null, {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify(results)
                });
            }
        });
    });
};

module.exports = {
    update : function (event, context, callback) {
        if (!event.pathParameters.id) {
            callback(null, {
                statusCode: 500,
                statusText: "event.pathParameters.id was null."
            });
        } else if (!event.pathParameters.body){
            callback(null, {
                statusCode: 500,
                statusText: "event.pathParameters.body was null."
            });
        } else if (!event.stageVariables){
            callback(null, {
                statusCode: 500,
                statusText: "event.stageVariables was null."
            });
        }
        else {
            this.body = JSON.parse(event.body);
            this.connection = db.connect(event.stageVariables);
            updateClient(this.body, event.pathParameters.id, this.connection)
                .then(function (results) {
                    db.close(this.connection);
                    callback(null, {
                        statusCode: 201,
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        body: JSON.stringify(results)
                    });
                })
                .catch(function (error) {
                    console.log('error ', error);
                    db.close(this.connection);
                    callback(null, {
                        statusCode: 500,
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        body: JSON.stringify(error)
                    });
                });
        }
    }
};