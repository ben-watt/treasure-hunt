
const aws = require('aws-sdk')
const { Configuration, OpenAIApi } = require("openai");

const generate = async (req) => {
    const { Parameters } = await (new aws.SSM())
    .getParameters({
        Names: ["gpt3_api_key"].map(secretName => process.env[secretName]),
        WithDecryption: true,
    }).promise();
    
    const configuration = new Configuration({
      apiKey: Parameters[0].Value,
    });
    
    const openai = new OpenAIApi(configuration);

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
        Comfy cosy a place to sit, the clue lies behind this bit
        
        User:
        `


    for(let item of req.body) {
        body += item.description + "\n"
    }

    body += "TreasureHuntBot:\n"

    console.log(body)
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: body,
        max_tokens: 200,
        temperature: 0.5,
      });

    if(response.status === 200) {
        return response.data.map(x => x.text);
    } else {
        console.error(response.statusText)
        throw new Error("Error sending request to generate treasure hunt")
    }
}
    

module.exports = generate