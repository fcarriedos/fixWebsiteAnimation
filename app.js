/*��������������������������
Rising Dev Bot connecting Skype to Watson. 
��������������������������*/

var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure');
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
require('dotenv').config({silent: true});

// Table storage
var tableName = "BotTable"; // You define
var storageName = "rising"; // Obtain from Azure Portal
var storageKey = "gdFbASTbAn0H6+tIScsnZDj19PncUJaab67EZyfzkS5uqV7PyYTb6l+qfR3rhtzbJLNOuaHPIFlmecnxxOc48A=="; // Obtain from Azure Portal
var azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
var tableStorage = new azure.AzureBotStorage({gzipData: false}, azureTableClient);


var contexts;
var workspace=process.env.WORKSPACE_ID || '<workspace-id>';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
console.log('%s listening to %s', server.name, server.url); 
});

// Create the service wrapper
var conversation = new Conversation({
// If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
// After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
// username: '<username>',
// password: '<password>',
url: 'https://gateway.watsonplatform.net/conversation/api',
version_date: Conversation.VERSION_DATE_2017_04_21
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
appId: process.env.MICROSOFT_APP_ID,
appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and fire to Watson for response
var bot = new builder.UniversalBot(connector, function (session) {

var payload = {
workspace_id: workspace,
context:'',
input: { text: session.message.text}
};
var conversationContext = findOrCreateContext(session.message.address.conversation.id); 
if (!conversationContext) conversationContext = {};
payload.context = conversationContext.watsonContext;
conversation.message(payload, function(err, response) {
if (err) {
session.send(err);
} else {
console.log(JSON.stringify(response, null, 2));
session.send(response.output.text);
session.send("Data Tests x3:");
session.send(session.message.user.id);
session.send(session.message.user.name);
session.send(session.message.address.channelId);
conversationContext.watsonContext = response.context;
}
});
})
.set('storage', tableStorage);



function findOrCreateContext (convId){
// Let's see if we already have a session for the user convId
if (!contexts)
contexts = [];
if (!contexts[convId]) {
// No session found for user convId, let's create a new one
//with Michelin concervsation workspace by default
contexts[convId] = {workspaceId: workspace, watsonContext: {}};
//console.log (�new session : " + convId);
}
return contexts[convId];
}