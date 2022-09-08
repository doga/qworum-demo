# A Jamstack demo for Qworum

This demo shows the best practice for implementing [Qworum](https://qworum.net)-based web applications and services.

## What makes this a Jamstack demo?

This demo only uses static web pages.
It uses JavaScript to generate Qworum messages on the client
instead of dynamically generating XML Qworum messages on the server and then sending them to web browsers.

## What is this demo about?

An e-shop is implemented as a Qworum application. It uses a remote third party Qworum service for its shopping cart. The shopping cart in turn uses another third-party Qworum service that is a payment gateway.

## See this demo on the Internet

This demo is available on [https://shop.demo.qworum.net](https://shop.demo.qworum.net).

## How to run the demo on your machine

You need a web server that can serve static files. I would recommend opening this directory in Visual Studio Code, 
and then launching the following file with the `Live Server` VS Code extension:

- `build/shop.demo.qworum.net/index.html`

∎
