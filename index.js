const dotenv = require("dotenv");
const Discord = require("discord.js");
const Fs = require("fs");
const messageModule = require("./Events/message.js");
const { GatewayIntentBits } = require("discord.js");
const prefix = "l.";

dotenv.config();

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

/* HANDLERS */

client.commands = [];

Fs.readdir("./Commands", (err, files) => {
  if (err) throw new Error(err);

  files.forEach((file) => {
    const command = require(`./Commands/${file}`);
    client.commands.push(command);
  });
});

Fs.readdir("./Events", (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    let data = require(`./Events/${file}`);
    client.on(data.event, data.receive.bind(client));
  });
});

client.on("messageCreate", (message) => {
  console.log(`Message from ${message.author.username}: ${message.content}`);

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.find((cmd) =>
      cmd.names.includes(commandName)
    );
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);

    if (command === "help") {
      channel.send(
        `You can use the following commands: \n${client.commands
          .map((c) => c.names[0])
          .join("\n")}`
      );
    }

    if (!command) return; // Command not found

    try {
        // Call the execute function from the command module with the Env object
        command.execute({ message: message, client: client, args: args });
      } catch (error) {
        console.error(error);
        message.reply("There was an error executing that command!");
      }

    
  }
  messageModule.receive(client, message);
});

client.once("ready", () => {
  console.log("Bot is online!");
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (channel) {
    channel.send(
      'Wussup mofos. Type "l." followed by a command to get started!'
    );
  } else {
    console.log("Channel not found");
  }
  
});



client.login(process.env.BOT_TOKEN);
