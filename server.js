const path = require("path");
var fs = require("fs");

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
var md = require('markdown-it')();
//...and the plugin to support wikilinks.
const wikilinks = require('markdown-it-wikilinks')();

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
fs.readdir("places", (err, files) => {
  for(let file of files) {
    fs.readfile(`places/${file}`, {encoding: 'utf-8'}, (err,data) => {
      
    });
    let renderedContents = md.use(wikilinks).render()
  }
});


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//Our home page route
fastify.get("/", function(request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };
  
  // The Handlebars code will be able to access the parameter values and build them into the page
  reply.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, '0.0.0.0', function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
