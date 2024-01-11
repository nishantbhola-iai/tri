const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const request = require("request");
const https = require("https");
const OPENAI_API_KEY = "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";
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

const  { Configuration, OpenAIApi } =  require("openai");
const configuration = new Configuration({
    apiKey:OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/',(req,response)=>{

    response.render("body");     
});

app.post("/",(req,response)=>{
    const entry = req.body.entry;
    
    const data = JSON.stringify({
        prompt: entry,
        max_tokens: 3000,
        n: 1
      });
    
    const url = "https://api.openai.com/v1/engines/text-davinci-003/completions"
    const option =  {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
    };
   
    const requ = https.request(url, option, (res) => {

        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

    res.on('end', () => {
      let answer = [];
      answer.push(JSON.parse(data).choices[0].text)
      const answer1 =answer.toString().split('\n');
      response.render("ans", {answer: answer1, prompt:entry})
    });    
    
    });
    
    requ.write(data);
    requ.end();
   
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log("listening to port 3000")
});
