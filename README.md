# car-service-bot
Telegram bot for car service.

Platform: Node.js

Thanks to: [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)

## How to use the bot

* Clone/Download/Fork the repository
* ```yarn```
* Create a Bot Account
    * Get the associated token (https://core.telegram.org/bots/#botfather)
* In folder config remove part "-example" in default-example.js
* Edit config.js
    * Set ```YOUR_URL_HERE``` with the https url for webhook
    * Set ```YOUR_TOKEN_HERE``` with the auth token of your bot
    * Set ```YOUR_MONGODB_URL_HERE``` with your MongoDB url
* Run the bot
    * ```yarn run start```
    * Stop it at any time with CTRL+C
