require("dotenv").config(); // Load .env file
const axios = require("axios");
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

function getPrices() {
  // API for price data.
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${process.env.PREFERRED_CURRENCY}&ids=${process.env.COIN_ID}&price_change_percentage=1h,24h,7d,14d,30d`
    )
    .then((res) => {
      // If we got a valid response
      if (
        res.data &&
        res.data[0].current_price &&
        res.data[0].price_change_percentage_24h
      ) {
        let avatar = res.data[0].image || "";
        let currentPrice = res.data[0].current_price || 0; // Default to zero
        let priceChange = res.data[0].price_change_percentage_24h || 0;
        let priceChange1h =
          res.data[0].price_change_percentage_1h_in_currency || 0;
        let priceChange7d =
          res.data[0].price_change_percentage_7d_in_currency || 0;
        let priceChange14d =
          res.data[0].price_change_percentage_14d_in_currency || 0;
        let priceChange30d =
          res.data[0].price_change_percentage_30d_in_currency || 0;
        let symbol = res.data[0].symbol || "?";
        let marketCap = res.data[0].market_cap || 0;
        let priceSymbol = (priceChange) => (priceChange >= 0 ? "+" : "-");
        let arrow = (priceChange) => (priceChange >= 0 ? "▲" : "▼");
        let numberWithCommas = (number) =>
          number
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, process.env.THOUSAND_SEPARATOR);

        client.user.setPresence({
          activities: [
            {
              name: `${process.env.COIN_ID.toUpperCase()} ${priceSymbol(
                priceChange
              )}${priceChange.toFixed(2)}%  ${arrow(priceChange)} `,
              type: 3,
            },
          ],
          status: "online",
        });
        if (runOnce === 0) {
          client.user.setAvatar(avatar); // Sets the avatar
          runOnce = 1;
        }

        // If the currency symbol is before
        if (process.env.CURRENCY_DISPLAY === "before") {
          // Change nickname with the price and symbol
          client.guilds.cache.forEach((guild) => {
            guild.members.me.setNickname(
              `${process.env.CURRENCY_SYMBOL}${numberWithCommas(currentPrice)}`
            );
          });
          // The same but symbol after
        } else {
          client.guilds.cache.forEach((guild) => {
            guild.members.me.setNickname(
              `${numberWithCommas(currentPrice)}${process.env.CURRENCY_SYMBOL}`
            );
          });
        }

        // Set new description
        client.application.edit({
          description: `**${
            process.env.COIN_ID.charAt(0).toUpperCase() +
            process.env.COIN_ID.slice(1)
          }** (${symbol}) price changes.\n${priceSymbol(
            priceChange1h
          )}${priceChange1h.toFixed(2)}% (1h) ${arrow(
            priceChange1h
          )}\n${priceSymbol(priceChange)}${priceChange.toFixed(
            2
          )}% (24h) ${arrow(priceChange)}\n${priceSymbol(
            priceChange7d
          )}${priceChange7d.toFixed(2)}% (7d) ${arrow(
            priceChange7d
          )}\n${priceSymbol(priceChange30d)}${priceChange30d.toFixed(
            2
          )}% (1m) ${arrow(priceChange30d)}\nMarket cap: ${numberWithCommas(
            marketCap
          )} ${process.env.PREFERRED_CURRENCY.toUpperCase()}`,
        });

        console.log("Updated price to", currentPrice);
      } else
        console.log(
          "Could not load player count data for",
          process.env.COIN_ID
        );
    })
    .catch((err) => console.log("Error at api.coingecko.com data:", err));
}
let runOnce = 0; // Only change avatar on fist run

// Runs when client connects to Discord.
client.on("ready", () => {
  //   client.application.fetch().edit({ description: "New About Me Here" });
  console.log("Logged in as", client.user.tag);

  client.user.setAvatar();
  getPrices(); // Ping server once on startup
  // Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
  setInterval(
    getPrices,
    Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000
  );
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
