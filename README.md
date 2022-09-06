# A Jamstack demo for Qworum

This demo shows the best practice for interactive Qworum applications and services, which is to use the Jamstack architectural style.

Note that Jamstack is only suitable for interactive services, not for opaque services.

## What makes this a Jamstack demo?

This demo does not use XML messages for sending Qworum scripts to browsers, but instead uses JavaScript to generate them on the client.

## What is this demo about?

An e-commerce site is implemented as a Qworum application. It uses a remote third party Qworum service for its shopping cart. The shopping cart in turn uses another third-party Qworum service that is a payment gateway.
