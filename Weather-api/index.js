// require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempval,orgval) =>{
let temperature = tempval.replace("{%tempval%}",orgval.main.temp);
temperature =  temperature.replace("{%tempmin%}",orgval.main.temp_min);
temperature =  temperature.replace("{%tempmax%}",orgval.main.temp_max);
temperature =  temperature.replace("{%locationl%}",orgval.name);
temperature =  temperature.replace("{%country%}",orgval.sys.country);
temperature =  temperature.replace("{%tempsatus%}",orgval.weather[0].main);

return temperature;
}


const server = http.createServer((req,res) =>{
    if(req.url == "/"){

        requests("http://api.openweathermap.org/data/2.5/weather?q=karachi&appid=d119f596e093422101cde22b1ae98411",)
        .on('data', (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
        //   console.log(arrdata[0].main.temp);
        const realTimeData = arrdata.map((val) =>replaceval(homeFile,val)).join("");
           res.write(realTimeData);
        

        })
        .on('end',(err) => {
          if (err) return console.log('connection closed due to errors', err);
         res.end();
        });

    }else {
        res.end("File not found");
    }
});

server.listen(7000, "127.0.0.1");