# 📚 Conceptual Overview

Podium is a library for building [micro frontends](https://micro-frontends.org/). Micro frontends is based on a concept that instead of putting all functionallity needed to generate a web page into one monolithic application one separate parts of the functionallity into smaller independent servers being responsible for serving individual parts, fragments or components if you want, of the page and then composing them together into a whole page in a separate layer. The composition is done by requesting each independent fragment over http and putting each fragment into a html page's structure.

A simple example is the following where a web page has a header, footer, side bar and a main content area. Each of these can be separate fragments joind together in a structure which is the page layout.

[ illustration ]

In a micro frontend architecture the application overview can look something like this:

[ illustration ]

The advantages of such an architecture is that:

 * Each individual fragment of a page can be built on different technologies and by independent teams.
 * Each individual fragment can fail without the whole page being affected.
 * Each individual fragment can be processed and build in paralell where each individual fragment can be scaled independently.
 * Each individual fragment can be reused in multiple pages and when updated, each page including it is instantly updated.


 ## Podium overview

 Podium consits of two main parts:

### Podlet

A Podlet is a single fragment of a whole html page. One can think of this as a component or a fragment but in Podium we have chosen to call it a Podlet.

A Podlet is defined by a manifest, defined in json, which hold references to:

 * a http endpoint to the podlets main content
 * a http endpoint to a possible fallback for use in scenarios where the main content can not be read
 * a http endpoint to a belonging javascript file
 * a http endpoint to a belonging css file
 * http endpoints which should be made publicy available

In its simplest form a Podlet can be a manifest file pointing to a html file served by a static http server. In Podium the @podium/podlet module is a module to help fasilitate the process of building Podlets.

### Layout

A Layout is responsible for holding the structure of a html page and insert each Podlet in its representative spot in the structure. The Layout is also responsible for generating and appending a context which is passed on to the requests to each Podlet. The context is a set of http headers containing request contextual information from the Layout server to the Podlet which the Podlet can use to generate dynamic content from depending on which Layout which is requesting it.

In Podium the @podium/layout module is a module to help fasilitate the process of building Layouts.
