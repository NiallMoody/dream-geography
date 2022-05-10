const path = require("path");
const fs = require("fs");

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  logger: false
});


// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

//Require handlebars so we can use it in our own page generation.
const handlebars = require("handlebars");

//Used to sanitise our wikilinks page names.
function sanitisePageNames(name) {
  let sanitised = sanitize(name).split(" ").join("-").toLowerCase();
  return sanitised;
}

//Load our markdown renderer.
var md = require("markdown-it")();
//...and the plugin to support wikilinks.
const wikilinks = require("markdown-it-wikilinks")({ postProcessPageName:sanitisePageNames });

//Make sure we can sanitise filenames.
var sanitize = require("sanitize-filename");

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var lastModifiedPlaces = JSON.parse(fs.readFileSync('last-modified.json', 'utf8'));
var updatedLastModified = false;
var handlebarTemplate = null;

try {
  //First get all the files in our root places directory.
  let places = fs.readdirSync(`places`);
  for(let index in places) {
    let markdownFile = places[index];
    let placeName = markdownFile.substring(0, markdownFile.length - 3);
    
    //Get the last modified time of this place.
    let fileStats = fs.statSync(`places/${markdownFile}`);
    
    //If we already have a record of it in last-modified.json, check if the most
    //recent last-modified time is newer than the last one we stored in
    //last-modified.json.
    if(markdownFile in lastModifiedPlaces) {
      let lastDate = new Date(lastModifiedPlaces[markdownFile]);
      
      if(fileStats.mtime > lastDate) {
        console.log(`places/${markdownFile} has been modified.`);
        
        lastModifiedPlaces[markdownFile] = fileStats.mtime;
      
        updatedLastModified = true;
      }
    }
    //If we don't have a record of it in last-modified.json, add it.
    else {
      console.log(`places/${markdownFile} is a new file.`);
      
      lastModifiedPlaces[markdownFile] = fileStats.mtime;
      
      updatedLastModified = true;
    }
    
    //Only parse the file if it's new or has been updated.
    if(updatedLastModified) {
      console.log(`Reading places/${markdownFile}...`);
      try {
        let data = fs.readFileSync(`places/${markdownFile}`, {encoding: `utf-8`});
        let filename = sanitisePageNames(placeName) + `.html`;

        //Render our markdown to html.
        let renderedMarkdown = md.use(wikilinks).render(`# ${placeName} \n ${data}`);
        
        //Compile our handlebars template if necessary.
        if(handlebarTemplate == null) {
          handlebarTemplate = handlebars.compile(`src/pages/placeTemplate.hbs`);
        }
        
        //Generate our full html page.
        let fullPage = handlebarTemplate({ "renderedMarkdown" : renderedMarkdown });

        try {
          console.log(`Writing public/places/${filename}...`);
          fs.writeFileSync(`public/places/${filename}`, fullPage);
        }
        catch (err) {
          console.log(`Could not write public/places/${filename}. Error: ${err}`);
        }
      }
      catch (err) {
        console.log(`Could not read places/${markdownFile}. Error: ${err}`);
      }
    }
  }
}
catch (err) {
  console.log(`Could not read places dir. Error: ${err}`);
}

if(updatedLastModified) {
  //Write any changes to last-modified.json.
  console.log(`Updating last-modified.json...`);
  fs.writeFileSync(`last-modified.json`, JSON.stringify(lastModifiedPlaces));
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//Our home page route
fastify.get(`/`, (request, reply) => {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };
  
  // The Handlebars code will be able to access the parameter values and build them into the page
  reply.view(`/src/pages/index.hbs`, params);
});

//Displays individual pages from the public/places directory.
fastify.get(`/places/*`, (request, reply) => {
  return reply.sendFile(request.url);
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, `0.0.0.0`, (err, address) => {
  if (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
