---
id: introduction
title: Introduction
---

Podium is a library for building [micro frontends](https://micro-frontends.org/).

Micro frontends is a concept that advocates letting go of the monolith. Pages are split into smaller independent servers, each server responsible for individual parts of the page in isolation (page fragments). These fragments are then composed to a whole page in a separate layer.

## Runtime composition

In Podium the composition is done at runtime. One server handles the incoming request by fetching each independent fragment over HTTP before returning the finished page back to the user.

![](/img/finn-fragments.jpg)

The example above shows a web page which has four fragments indicated by the red dotted lines:

- a header
- a footer
- a sidebar
- a main content area.

In Podium each of these four fragments could be separate servers. A fifth server would be responsible for handling incoming requests, fetching fragments and composing them to a whole page.

## Advantages of runtime composition

The advantages of Podium's architectural approach are:

- Each individual fragment of a page can be built with different technologies and by independent teams.
- Each individual fragment can fail without the whole page being affected.
- Each individual fragment can be processed and built in parallel and each individual fragment can be scaled independently.
- Each individual fragment can be reused in multiple pages and when the fragment is updated, each page that includes it is instantly updated.

## Runtime composition with Podium

Podium mainly consists of two different types of servers:

- Podlets serving page fragments
- Layouts composing podlets to finished pages

### Podlets

A podlet serves a fragment of a whole page. You might think of this as a component running as a service.

### Layouts

A layout is what handles incoming requests from site visitors.

The layout provides the structure of an HTML page. It fetches the contents of podlets and inserts each podlet's response into the appropriate location in the page before serving the finished page to the visitor.
