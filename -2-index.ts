/// <reference path="node_modules/@types/dialogflow/index.d.ts" />

import {
  SessionsClient,
  DetectIntentRequest,
  DetectIntentResponse
} from "dialogflow"
const dialogflow = require("dialogflow")

const projectId = "jokes-ad7b4"
const sessionId = "1"
const languageCode = "en"
const sessionClient: SessionsClient = new dialogflow.SessionsClient({
  keyFilename: "./jokes-ad7b4-d6b277a4558d.json"
})

const queries: string[] = []
//queries.push("How are you?")
queries.push("hi")

const sessionPath: string = sessionClient.sessionPath(projectId, sessionId)
let promise: Promise<DetectIntentResponse[]>

for (const query of queries) {
  const request: DetectIntentRequest = {
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
      console.log("SECOND Detected intent")
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
  //.then(responses: DetectIntentResponse[] => {
  .then(responses => {
    console.log("Detected intent")
    //logQueryResult(sessionClient, responses[0].queryResult)
    //console.log([sessionClient, responses[0].queryResult])
    console.log(responses[0].queryResult.fulfillmentText)
  })
  .catch(err => {
    console.error("ERROR:", err)
  })
