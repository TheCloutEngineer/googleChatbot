const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://emberbase-3a18e.firebaseio.com"
});

const { SessionsClient } = require('dialogflow');

exports.dialogflowGateway = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const { queryInput, sessionId } = req.body;

        const sessionClient = new SessionsClient({ credential: serviceAccount });
        const session = sessionClient.sessionPath('ember-base', sessionId);

        const responses = await sessionClient.detectIntent({ session, queryInput});

        const result = responses[0].queryResult;

        res.send(result);
    })
})