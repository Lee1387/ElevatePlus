![DiscordBotTS]

# DiscordBotTS
discord.js & typescript bot with **levelling** and **activity tracking** utilities. 

## 📦 Main Technologies
| Package  | Utility |
| ------------- | ------------- |
| typescript  | type safety  |
| discord.js  | discord bot baseline |
| mongoose  | storing data  |
| i18n  | internationalisation-framework  |
| dotenv  | environment variables  |
| nodemon  | development  |
| node-html-to-image  | messages with html & css  |
| Tailwind CSS  | css framework  |



## 🚀 Running
```
git clone https://github.com/Lee1387/DiscordBotTS
cd discordbotts
npm install 
```
Set up your .env file
```
npm run dev
```

## 🚧 TODO
* Handle user actions
    * Show profile
    * Leaderboard

* Server activity tracking
    * Watching channels (schemas/VoiceActivity.ts)
    * Watching presence (schemas/PresenceActivity.ts)
    * Watching chat (distinct image from text message) (schemas/User.ts)
    * Watching streams (streaming will pay off)

* Custom events
    * Answering event in event message thread.
    * Events
        * Skill (League of Legends)
        * Skin (puzzle) (League of Legends)

        