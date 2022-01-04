const http = require('http'), //This module provides the HTTP server functionalities
      path = require('path'), //The path module provides utilites for working with file and directory paths.
      express = require('express'), //This module allows this app to respond to HTTP requests, defines routing and renders back the required content
      fs = require('fs'), //This module allows to work with the file system: read and write files back
      xmlParse = require('xslt-processor').xmlParse, //This module allows to work with XML files
      xsltProcess = require('xslt-processor').xsltProcess, // The same module allows us to utilise XSL Transformations
      xml2js = require('xml2js'); //This module does XML <-> JSON conversion
      
const router = express(), //This module create a router for our applications
      server = http.createServer(router); //Instantiating the server

router.get('/get/html', function(req, res) { //The router take the request and response

    res.writeHead(200, {'Content-Type' : 'text/html'}); //This tells the browser which format are serving

    let xml = fs.readFileSync('TeddsShop.xml', 'utf8'), //This variable uses for read in the XML file
        xsl = fs.readFileSync('TeddsShop.xsl', 'utf8'); //This variable uses for read in the XSL file

    let doc = xmlParse(xml), //This is for parse the XML file
        stylesheet = xmlParse(xsl); //This is for parse the XSL file
    
    let result = xsltProcess(doc, stylesheet); //The result applies the doc and stysheet

    res.end(result.toString()); // The serve response to result and convert back to the string 
      
});

server.listen(process.env.PORT || 3000, process.env.IP ||"O.0.0.0", function() {//This module tells the server to listening to the request.
    const addr = server.address(); //This module will take the address from the actually server
    console.log("Server listenig at", addr.address + ":" + addr.port)
});