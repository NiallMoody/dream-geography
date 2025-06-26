const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 10000;

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//Require the fastify framework and instantiate it
const fastify = require("fastify")({
  logger: false
});


//Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
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
const wikilinks = require("@gardeners/markdown-it-wikilinks")({ postProcessPageName:sanitisePageNames, uriSuffix:`` });

//Make sure we can sanitise filenames.
var sanitize = require("sanitize-filename");

//Load and parse SEO data
/*const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}*/

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var lastModifiedPlaces = JSON.parse(fs.readFileSync('last-modified.json', 'utf8'));
var updatedLastModified = false;
var handlebarTemplate = null;

var lastSiteUpdate = new Date(lastModifiedPlaces["lastSiteUpdate"]);
delete lastModifiedPlaces["lastSiteUpdate"];

//Our available place URLs.
var placesUrls = [];

//Our background image assets.
var backImages = [`/images/back00.jpg`,
                  `/images/back01.jpg`,
                  `/images/back02.jpg`,
                  `/images/back03.jpg`,
                  `/images/back04.jpg`,
                  `/images/back05.jpg`,
                  `/images/back06.jpg`,
                  `/images/back07.jpg`,
                  `/images/back08.jpg`,
                  `/images/back09.jpg`,
                  `/images/back10.jpg`,
                  `/images/back11.jpg`,
                  `/images/back12.jpg`,
                  `/images/back13.jpg`];

//------------------------------------------------------------------------------
//Set to true to regenerate *ALL* pages when the server restarts.
var regenerate = false;
//------------------------------------------------------------------------------

try {
  //First get all the files in our root places directory.
  let placesFiles = fs.readdirSync(`places`);
  for(let index in placesFiles) {
    let markdownFile = placesFiles[index];
    let placeName = markdownFile.substring(0, markdownFile.length - 3);
    
    placesUrls.push(`places/${sanitisePageNames(placeName)}`);
    
    //Get the last modified time of this place.
    let fileStats = fs.statSync(`places/${markdownFile}`);
    
    //If we already have a record of it in last-modified.json, check if the most
    //recent last-modified time is newer than the last one we stored in
    //last-modified.json.
    if((markdownFile in lastModifiedPlaces) && !regenerate) {
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
          try {
            console.log(`Reading src/pages/placeTemplate.hbs`);
            
            let templateContents = fs.readFileSync(`src/pages/placeTemplate.hbs`, {encoding: `utf-8`});
            handlebarTemplate = handlebars.compile(templateContents, {noEscape: true});
          }
          catch (err) {
            console.log(`Could not read placeTemplate.hbs. Error: ${err}`);
          }
        }
        
        //Generate our full html page.
        let fullPage = handlebarTemplate({ "renderedMarkdown" : renderedMarkdown, "placeName" : placeName, "backImage": getImage(placeName) });

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
  
  lastModifiedPlaces["lastSiteUpdate"] = new Date();
  fs.writeFileSync(`last-modified.json`, JSON.stringify(lastModifiedPlaces));
  
  delete lastModifiedPlaces["lastSiteUpdate"];
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//Random number generator, taken from this stackoverflow answer:
//https://stackoverflow.com/a/47593316
function mulberry32(a) {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0);
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//Select a background image for the passed-in place name.
function getImage(placeName) {
  let val = 0;
  
  for(let i=0;i<placeName.length;++i) {
    val += placeName.charCodeAt(i);
  }
  
  return backImages[val % backImages.length];
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//Our home page route
fastify.get(`/`, (request, reply) => {
  let dateObject = new Date();
  let dateInteger = dateObject.getFullYear() + dateObject.getMonth() + dateObject.getDate();
  let mapLink = '';
  
  if((dateObject.getHours() == (dateObject.getMonth()+1)) && (dateObject.getDate() == (dateObject.getMonth()+1))) {
    mapLink = `
<p class="entryLink">
  <a href="/map">secret map</a>
</p>`;
  }
  
  reply.view(`/src/pages/index.hbs`, { "backImage" : backImages[dateInteger % backImages.length], mapLink: mapLink });
});

//Our about page.
fastify.get(`/about`, (request, reply) => {
  let dateObject = new Date();
  let dateInteger = dateObject.getFullYear() + dateObject.getMonth() + dateObject.getDate();
  
  reply.view(`/src/pages/about.hbs`, { "backImage" : backImages[(dateInteger + 3) % backImages.length], "lastUpdated" : lastSiteUpdate.toString() });
});

//We use this to ensure we serve the same random page for everyone who views the
//site on any given day of the year.
fastify.get(`/todays-dream`, (request, reply) => {
  let dateObject = new Date();
  let dateInteger = dateObject.getFullYear() + dateObject.getMonth() + dateObject.getDate();
  let index = (mulberry32(dateInteger) % placesUrls.length);
  
  reply.redirect(placesUrls[index]);
});

//Our map page.
fastify.get(`/map`, (request, reply) => {
  let dateObject = new Date();
  let dateInteger = dateObject.getFullYear() + dateObject.getMonth() + dateObject.getDate();
  
  if((dateObject.getHours() == (dateObject.getMonth()+1)) && (dateObject.getDate() == (dateObject.getMonth()+1)))
    reply.view(`/src/pages/map.hbs`, { "backImage" : backImages[(dateInteger + 3) % backImages.length] });
  else 
    reply.redirect('/');
});

//Secret map link, for when we need to test it's working.
fastify.get(`/secret-map-ssh`, (request, reply) => {
  let dateObject = new Date();
  let dateInteger = dateObject.getFullYear() + dateObject.getMonth() + dateObject.getDate();
  
  reply.view(`/src/pages/map.hbs`, { "backImage" : backImages[(dateInteger + 3) % backImages.length] });
});

//Displays individual pages from the public/places directory.
fastify.get(`/places/*`, (request, reply) => {
  let url = request.url;
  
  if(url.length > 5) {
    if(url.substring(url.length - 5) != `.html`) {
      url += `.html`;
    }
  }
  else {
    url += `.html`;
  }
  
  return reply.sendFile(url);
});

//Serves images from the images directory.
fastify.get(`/images/*`, (request, reply) => {
	return reply.sendFile(request.url);
});

//Serves fonts from the fonts directory.
fastify.get(`/fonts/*`, (request, reply) => {
	return reply.sendFile(request.url);
});

//Run the server and report out to the logs
fastify.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
