//npm modules
const express = require('express');  

// create the server
const app = express();

 
// create the homepage route at '/'
app.get('/', (req, res) => {
  res.send(`You hit home page!.<br/> Usage: <baseurl>/siteinfo?siteurl=fully_qualified_URL_to_check. <br/> Example:  <baseurl>/siteinfo?siteurl=https://www.blackberry.com/us/en`)

})

app.get('/siteinfo', (req, res) => {
  if (Object.keys(req.query).length === 0 || !req.query.siteurl)
    res.status(400).send("Invalid Input Parameters. Please pass siteurl to check. <br/> Usage: <baseurl>/siteinfo?siteurl=https://www.blackberry.com/us/en")
  else{
    let siteURL = req.query.siteurl;
    const { exec } = require('child_process');
    exec('node src/drivers/npm/cli.js ' + siteURL, (err, stdout, stderr) => {
      if (err) {
        res.status(500).send(`Server Error. \n ${err}`) 
        return;
      }

      let format = req.query.format;
      if (!format){
        res.status(200).send(`${stdout}`)
      }
      else{
        console.log(jsonResult)
        var jsonResult = `${stdout}`;
        var obj = JSON.parse(jsonResult);
        var htmlcontent = "<html><body><table><tr><th>Type</th><th>Technology</th><th>Confidence</th><th>Version</th></tr>"
        for (var i = 0; i < obj.technologies.length; i++){ 
          htmlcontent += "<tr> <td>" + obj.technologies[i].categories[0].name +  "</td><td>" + obj.technologies[i].name + "</td><td>" + obj.technologies[i].confidence +  "%</td><td>" + obj.technologies[i].version +  "</td></tr>"
          console.log(obj.technologies[i].name +  " " + obj.technologies[i].categories[0].name + " " + obj.technologies[i].confidence + " " + obj.technologies[i].version )
        }
        htmlcontent += "</table></body></html>";
        res.status(200).send(htmlcontent)
      }
      
    });

  }

})

// tell the server what port to listen on
app.listen(3001, () => {
  console.log('Listening on localhost:3000')
})
