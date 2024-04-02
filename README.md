![Example bot setup.](https://i.imgur.com/JGDEuIP.png)

## About

This bot will update its status message with the current price of the desired cryptocurrency.

Is based on [Minecraft Player Count Discord Bot](https://github.com/SpencerTorres/Minecraft-Player-Count-Discord-Bot) by Spencer Torres

## Features

- Sets the price of the desired cryptocurrency in the Discord bot status.
- It is updated at the desired time interval.
- Adds more information in the bot status and in its biography.
- See config file for more customizations.

## How to use

This bot is **really easy to use**.

Just follow these steps:
1. Have [Node.JS](https://nodejs.org) installed.
2. Clone this repository to a folder on your computer.
3. Open a terminal in that folder, and install the packages with `npm install`
4. **Duplicate and rename the `.env-template` file** and configure it to your liking.

Ensure to **enable server member intent** on the Discord developer page 
![Server member intent](https://i.imgur.com/X7kmpIL.png)

For information on getting a bot token, follow the steps on [the Discord developer documentation.](https://discordapp.com/developers/docs/intro)

## Extra Info

This was created for my Discord server, but I wanted to share it with added flexibility for anyone to use.

This relies on the API hosted at https://api.coingecko.com

Coin ID list: https://api.coingecko.com/api/v3/coins/list
