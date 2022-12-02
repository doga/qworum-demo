# A Jamstack demo for Qworum

This demo shows the best practice for implementing [Qworum](https://qworum.net)-based web applications and services.

## What makes this a Jamstack demo?

This demo uses only static files. This implies that Qworum scripts aren't dynamically generated on the server, but instead they are:

- generated inside web pages with JavaScript, or
- static XML files.

Also, this demo does not send any data to Qworum service endpoints on the server. Instead, the endpoints handle the data on the client exclusively.

## What is this demo about?

An e-shop is implemented as a Qworum application. It uses a remote third party Qworum service for its shopping cart. The shopping cart in turn uses another third-party Qworum service that is a payment gateway.

## See this demo on the Internet

This demo is available on [https://shop.demo.qworum.net](https://shop.demo.qworum.net).

## How to run the demo on your machine

You need a web server that can serve static files. I would recommend opening this directory in Visual Studio Code,
and then launching the following file with the `Live Server` VS Code extension:

- `build/shop.demo.qworum.net/index.html`

## BUGS

None.

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) ∎
