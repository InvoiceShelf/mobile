<img height="150px" src="https://res.cloudinary.com/bytefury/image/upload/v1574149856/Invoice Shelf/invoiceshelfframe.png">

## Introduction

Invoice Shelf is an open-source web & mobile app that helps you track expenses, payments & create professional invoices & estimates.

This repository contains the source code for the mobile app clients for [Invoice Shelf](https://invoiceshelf.com).

Its built with Expo (React Native).

_Please note:_ To use this app on your mobile device, you need to have the invoiceshelf app installed on your server. Once the app is installed and configured on your server. You can simply input your endpoint URL and use your app login credentials to log into your account. See [here](#web) to know more about the web version.

# Table of Contents

1. [Installation](#installation)
2. [Web Version Link](#web)
3. [Mobile App Links](#mobile-app-links)
4. [Credits](#credits)
5. [License](#license)

## Prerequisite

- Node.js: `14 LTS`
- Java Development Kit (JDK): `8 (1.8.0_422)`

Ensure you have the correct versions installed before starting development.

## Installation

Below are the steps for starting up the invoiceshelf app locally for development. If you aren't looking to customise or contribute to mobile apps then you can ignore the steps below and use the Invoice Shelf [IOS & Android Apps](#mobile-app-links) directly.

- Clone this repository
- Install Expo CLI : `npm install -g expo-cli`
- Change your current working directly in terminal to the cloned folder: `cd invoiceshelf`
- run command: `npm start`

## Web

- [Repository Link](https://github.com/invoiceshelf-invoice/invoiceshelf)
- [Download Link](https://invoiceshelf.com/downloads)

## Mobile App Links

- [Android](https://play.google.com/store/apps/details?id=com.invoiceshelf.com.app)
- [IOS](https://apps.apple.com/app/id1489169767)

## Copyright

© 2021 Crater Invoice, Inc.

## License

Invoice Shelf is released under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3.
See [LICENSE](LICENSE) for details.

## Release Channels:

- development
- staging
- production
- production-4

Example: expo build:ios --release-channel staging

expo build:android -t app-bundle --release-channel staging
