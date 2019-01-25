# car-service-bot
Telegram bot for car service.

Platform: Node.js 

Thanks to: [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) 

## How to use the bot

* Clone/Download/Fork the repository
* ```yarn```
* Create a Bot Account 
    * Get the associated token (https://core.telegram.org/bots/#botfather)
* Remove part "-example" in config-example.js
* Edit config.js
    * Set ```YOUR_TELEGRAM_BOT_TOKEN``` with the auth token of your bot
    * Set ```MONGODB_URL``` with your MongoDB url
* Run the bot
    * ```yarn run start``` 
    * Stop it at any time with CTRL+C