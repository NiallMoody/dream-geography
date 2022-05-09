const path = require("path");
const fs = require("fs");

console.log("huh?");

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

//Load our markdown renderer.
var md = require("markdown-it")();
//...and the plugin to support wikilinks.
const wikilinks = require("markdown-it-wikilinks")();

//Make sure we can sanitise filenames.
var sanitize = require("sanitize-filename");

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

console.log("huh??");

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
/*fs.readdir("./", (err, files) => {
  console.log(err);
  console.log(`Contents of places dir: ${files}`);
  if(!err) {
    for(let file of files) {
      console.log(`About to read ${file}`);
      fs.readFile(`places/${file}`, {encoding: 'utf-8'}, (err,data) => {
        console.log(`Read ${file}`);
        if(!err) {
          let renderedContents = md.use(wikilinks).render(data);
          let filename = sanitize(file.substring(0, file.length - 3));
          console.log(filename);
          
          //fs.writeFile(`public/places/`)
        }
        else {
          console.log(`Could not read places/${file}. Error: ${err}`);
        }
      });
      
    }
  }
  else {
    console.log(`Could not read places dir. Error: ${err}`);
  }
});*/

try {
  var places = fs.readdirSync("places");
  for(let place in places) {
    console.log(`Reading ${place}`);
    try {
      const data = fs.readFileSync(`places/${place}`, {encoding: 'utf-8'});
    }
    catch (err) {
      console.log(`Could not read ${place}. Error: ${err}`);
    }
  }
}
catch (err) {
  console.log(`Could not read places dir. Error: ${err}`);
}

console.log("huh???");


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//Our home page route
fastify.get("/", (request, reply) => {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };
  
  // The Handlebars code will be able to access the parameter values and build them into the page
  reply.view("/src/pages/index.hbs", params);
});

console.log("huh????");

// Run the server and report out to the logs
fastify.listen(process.env.PORT, '0.0.0.0', (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
