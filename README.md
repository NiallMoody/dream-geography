# dream geography

## What is this?

[I](https://www.niallmoody.com) tend to have (somewhat intermittently) recurring
dreams, and I realised a while ago that the landscapes and places in my dreams
seem to be consistent across entirely separate dreams. i.e. I have visited
places in one dream that I previously visited in a different dream. And in the
course of a single dream I have even travelled from locations I visited in that
dream to locations I previously visited in an entirely separate dream.

On top of this, all my dreams seem to take place in Scotland, with cities and
towns that mirror cities and towns from the waking world. Only, the 
of these places vary from being very similar to their waking counterparts, to
**very** different from their waking counterparts.

The strange sense I get that my dreams exhibit a consistent, shared geography,
one that mirrors the waking world according to a logic I don't understand, led
me to start recording the places I have visited in my dreams.

This site is a record of those places I have visited in my dreams, with
hyperlinks to document the connections between different places. The
[today's dream](https://dream-geography.glitch.me/todays-dream) link will serve
up a page chosen randomly based on the current date.

## Technical details

I've been documenting my dreams as markdown files in
[Obsidian](https://obsidian.md/), stored locally on my harddrive (and mirrored
to my phone using [SyncThing](https://syncthing.net/)). This site is effectively
a custom static site generator written in node.js that generates html pages for
each markdown file. The idea is that updating this site should be as easy as
just uploading a new markdown file whenever I document a new place.

## License

**dream geography** was created (and will be sporadically updated) by
[Niall Moody](https://www.niallmoody.com)

The game and its source code is released under the Anti-Capitalist Software
License. You can read the full text of the license and its rationale
[here](https://anticapitalist.software/), but if you're looking for a summary,
the important part is:

```
This is anti-capitalist software, released for free use by individuals and
organizations that do not operate by capitalist principles.
```


You can view the
[source code for this site on glitch](https://glitch.com/edit/#!/dream-geography)

## Infrastructure Credits

dream geography is built on the following platforms, frameworks, libraries, and
fonts:

- [Glitch](https://glitch.com/) - The web hosting platform the site runs on
- [Node.js](https://nodejs.org/en/) - Javascript runtime running on glitch
- [Fastify](https://www.fastify.io/) - Web framework to serve pages from glitch
- [fastify-static](https://github.com/fastify/fastify-static) - Fastify plugin to serve static pages
- [Handlebars](https://handlebarsjs.com/) - Web page template engine
- [point-of-view](https://github.com/fastify/point-of-view) - Fastify plugin to support template engines like Handlebars
- [markdown-it](https://github.com/markdown-it/markdown-it) - Javascript library to render markdown as html
- [markdown-it-wikilinks](https://github.com/jsepia/markdown-it-wikilinks) - Addon for markdown-it to support wiki-style links, as used in Obsidian
- [sanitize-filename](https://github.com/parshap/node-sanitize-filename) - Used to transform the markdown places names into a URL-friendly format
- [Alike Angular](https://fonts.google.com/specimen/Alike+Angular) - Site font.
