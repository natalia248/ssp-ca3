const http = require('http'), //This module provides the HTTP server functionalities
      path = require('path'), //The path module provides utilites for working with file and directory paths.
      express = require('express'), //This module allows this app to respond to HTTP requests, defines routing and renders back the required content
      fs = require('fs'), //This module allows to work with the file system: read and write files back
      xmlParse = require('xslt-processor').xmlParse, //This module allows to work with XML files
      xsltProcess = require('xslt-processor').xsltProcess, // The same module allows us to utilise XSL Transformations
      xml2js = require('xml2js'); //This module does XML <-> JSON conversion
      
const router = express(), //This module create a router for our applications
      server = http.createServer(router); //Instantiating the server

    router.use(express.static(path.resolve(__dirname,'views'))); //We serve static content from "views" folder
    router.use(express.urlencoded({extended: true})); //We allow the data sent from the client to be encoded in a URL targeting our end point
    router.use(express.json()); //We include support for JSON

    // Function to read in XML file and convert it to JSON
function XMLtoJSON(filename, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function(err, xmlStr) {
      if (err) throw (err);
      xml2js.parseString(xmlStr, {}, cb);
    });
};
  
  //Function to convert JSON to XML and save it
function JSONtoXML(filename, obj, cb) {
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};

router.get('/get/html', function(req, res) { //The router take the request and response

    res.writeHead(200, {'Content-Type' : 'text/html'}); //This tells the browser which format are serving

    let xml = fs.readFileSync('TeddsShop.xml', 'utf8'), //This variable uses for read in the XML file
        xsl = fs.readFileSync('TeddsShop.xsl', 'utf8'); //This variable uses for read in the XSL file

        console.log(xml);
        console.log(xsl);

    let doc = xmlParse(xml), //This is for parse the XML file
        stylesheet = xmlParse(xsl); //This is for parse the XSL file
    
    console.log(doc);
    console.log(stylesheet);
    
    let result = xsltProcess(doc, stylesheet); //The result applies the doc and stysheet
    
    console.log(result);

    res.end(result.toString()); //The serve response to result and convert back to the string 
      
});

router.post('/post/json', function (req, res) {

    function appendJSON(obj) {

        console.log(obj)

        XMLtoJSON('TeddsShop.xml', function (err, result) {
            if (err) throw (err);
            
            result.menu.section[obj.sec_n].entry.push({'item': obj.item, 'price': obj.price});

            console.log(JSON.stringify(result, null, "  "));

            JSONtoXML('TeddsShop.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    appendJSON(req.body);

    res.redirect('back');

});

router.post('/post/delete', function (req, res) {

    function deleteJSON(obj) {

        console.log(obj)

        XMLtoJSON('TeddsShop.xml', function (err, result) {
            if (err) throw (err);
            
            delete result.menu.section[obj.section].entry[obj.entree];

            console.log(JSON.stringify(result, null, "  "));

            JSONtoXML('TeddsShop.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    deleteJSON(req.body);

    res.redirect('back');

});

server.listen(process.env.PORT || 3000, process.env.IP || "O.0.0.0", function() {//This module tells the server to listening to the request.
    const addr = server.address(); //This module will take the address from the actually server
    console.log("Server listenig at", addr.address + ":" + addr.port)
});