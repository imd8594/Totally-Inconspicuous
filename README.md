# Totally-Inconspicuous

Discord bot with whatever features we can think of. 
 
## Commands
**Weather**
 `!ti weather <now, today, or forecast> <any location>`
  Displays the weather for a given location in a hourly (now), daily (today), or weekly (forecast) format
 
 **Reddit**
`!ti sr <any subreddit> [q <search query>]`
Gets a random image from specified subreddit. You can optionally specify `q <search query>` to get results related to that query
 
 **Roll Die**
`!ti roll <number 1> [<number 2>]`
If number 1 and number 2 are specified it will roll a random number between them. If only number 1 is specifed, it will roll a number between 0 and number 1

**Magic Conch**
`!ti conch <your question for the magic conch>`
Ask the all knowing Magic Conch any question and it will give you an answer

**Event Scheduler**
`!ti events schedule <event-name> <mm/dd/yyyy> <hh:mm am/pm>`
Schedule a new event with you as the host

`!ti events sub <eventId>`
Subscribe to someone elses event

`!ti events unsub <eventId>`
Unsubscribe from someone elses event

`!ti events cancel <eventId>`
Cancel event that you are hosting (Must be event host)

`!ti events list [<eventId>]`
List all events, or specify eventId to list details for that one event

**Help**
`!ti help`
Display all commands you can get information about

`!ti help <command>`
You can see more information about the commands by specifying any of the following for `<command>`
``events`` ``weather`` ``sr`` ``roll`` ``conch`` ``help`` ``config``


## Admin Commands
  
**Admin Configuration**
`!ti config nsfw <on/off> or <true/false>`
Will turn on or off the NSFW filter for the sr command
    
