/// <reference path="node_modules/@types/dialogflow/index.d.ts" />
import * as dialogflow from "dialogflow"

// Imports the Dialogflow library
//const dialogflow = require("dialogflow")

// Instantiates a session client
const sessionClient: dialogflow.SessionsClient = new dialogflow.SessionsClient({
  keyFilename: "./jokes-ad7b4-d6b277a4558d.json"
})

/* *** */
/* *** */
/* *** */

const projectId = "jokes-ad7b4"
const sessionId = "1"
const languageCode = "en"

const queries: string[] = []
queries.push("How are you?")

/* *** */
/* *** */
/* *** */

// if (!queries || !queries.length) {
//   return
// }

// The path to identify the agent that owns the created intent.
const sessionPath: string = sessionClient.sessionPath(projectId, sessionId)

let promise

// Detects the intent of the queries.
for (const query of queries) {
  // The text query request.
  const request: dialogflow.DetectIntentRequest = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode
      }
    }
  }

  if (!promise) {
    // First query.
    console.log(`Sending query "${query}"`)
    promise = sessionClient.detectIntent(request)
  } else {
    promise = promise.then(responses => {
      console.log("Detected intent")
      const response = responses[0]
      //logQueryResult(sessionClient, response.queryResult)
      //console.log([sessionClient, response.queryResult])

      // Use output contexts as input contexts for the next query.
      response.queryResult.outputContexts.forEach(context => {
        // There is a bug in gRPC that the returned google.protobuf.Struct
        // value contains fields with value of null, which causes error
        // when encoding it back. Converting to JSON and back to proto
        // removes those values.
        //context.parameters = struct.encode(struct.decode(context.parameters))
        context.parameters = context.parameters
      })
      request.queryParams = {
        contexts: response.queryResult.outputContexts
      }

      console.log(`Sending query "${query}"`)
      return sessionClient.detectIntent(request)
    })
  }
}

promise
  .then(responses => {
    console.log("Detected intent")
    //logQueryResult(sessionClient, responses[0].queryResult)
    //console.log([sessionClient, responses[0].queryResult])
    console.log(responses[0].queryResult)
  })
  .catch(err => {
    console.error("ERROR:", err)
  })
