![DiscordBotTS]

# 🌌 DiscordBotTS
Advanced Discord Application with **levelling** and **activity tracking** utilities. 

## 📦 Used Packages
| 📦 Package  | 📋 Reasons |
| ------------- | ------------- |
| TypeScript  | Type safety  |
| discord.js  | Discord bot baseline |
| Mongoose  | Storing data  |
| i18n  | Internationalisation-framework  |
| Dotenv  | Environment variables  |
| Nodemon  | Development  |
| node-html-to-image  | Messages with HTML & CSS  |
| Tailwind CSS  | CSS Framework  |
| discord-logs | Extended discord events |
| moment | Time formatting |
| node-vibrant | Cool looking embed colors |
| canvas | Image processing |
| node-cron | scheduling |

## 🚀 Running
Get MongoDB instance running for storing data
```
git clone https://github.com/Lee1387/DiscordBotTS
cd discordbotts
npm install 
```
Set up your .env file with your bot token, application id, and MongoDB connection string.

Run Development Server
```
npm run dev
```
Or
Run Production Build
```
npm run build
```

## 🚧 TODO
* Experience system
    * Level formula
    * Level up notification sent in current voice text channel
    * Daily reward notification sent in current voice text channel
    * Events
        * userLeveledUp(user, guild) ✅
        * userRecievedDailyReward(user, guild)

        
* User profiles
    * Week activity graph
    * Statistics ✅
        * Clear day, week, month statistics using cron jobs ✅
        
* Server statistics notifications
    * Daily activity graph
    * Monthly activity graph
* Games
    * Commands
        * /skin invite @user
        * /skill invite @user
    * List
        * League of Legends skin puzzle
        * League of Legends skill
    * Caching
        * Caching skin/skill images to reduce API calls
* User activity tracking
    * Track user presence
        * Events
            * guildMemberOnline
            * guildMemberOffline
    * Track user voice activity and streaming state
        * Events
            * voiceChannelJoin
            * voiceChannelLeave
            * voiceChannelSwitch
            * voiceChannelDeaf
            * voiceChannelUndeaf
            * voiceStreamingStart
            * voiceStreamingStop

        