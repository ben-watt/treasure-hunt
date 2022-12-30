/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const { forEachChild } = require('typescript')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

/****************************
* Example post method *
****************************/
const generate = async (req, res) => {
let body = `You will play the role of TreasureHuntBot, you take in a list of items and return a rhyming clue for each. The clue must not contain the item, it must be a single sentence, it must rhyme and it should be a puzzle. For example:

  User: 
  Lounge chair, in the dining room
  Under the black dining table in the kitchen
  At the back of the greenhouse under a brown pot
  
  TreasureHuntBot:
  Find a spot to sit and stop, the treasure is hidden in that spot
  Has four legs and is black, it's under that!
  Where plants are nurtured and given care, the treasure is hidden somewhere there
  
  User: 
  Behind the computer
  Under the stairs
  Behind the couch
  
  TreasureHuntBot:
  You'll find the next clue where the screen is bright and blue
  Up and down you'll search today but underneath is where it lays
  Comfy cosy a place to sit, the clue lies behind this bit\n\nUser:\n`


  for(let item in req.body) {
    body += item.description
  }
  
  
  let request = { headers: { "Authorization" : `Bearer ${apiKey}` }, method: "POST", body: body };
  let res = await fetch("https://api.openai.com/v1/completions", request);
  console.log(res)
  return res
}


app.post('/generate', async function(req, res) {
  let res = await generate(req, res)
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/generate/*', async function(req, res) {
  let res = generate(req, res)
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app