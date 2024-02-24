const dotenv = require("dotenv");
dotenv.config();
const prefix = "l."
const Session = require("../Training/Session.js");
const channel = require("discord.js");


/* MODULES */

module.exports = {
  event: "messageCreate",
  receive: async (client, message) => {
    if (message.author.bot) return;
    if (
      message.member.roles.cache.find((r) => r.id == (process.env.roles["Pending"]))
    )
      return;
    if (message.content.startsWith(prefix)) {
      // Command Variables
      let Env = {
        client: this,
        message: message,
        args: message.content
          .substr(prefix.length)
          .toLowerCase()
          .split(" "),
      };



      // Executor
      for (let Command of client.commands) {
        if (Command.names.includes(Env.args[0])) return Command.execute(Env);
      };
    }

    if (channel.name.toLowerCase() == "training") {
      Session.receive(message);
    };
  },
};

module.exports = {
    event: "messageCreate",
    receive: async (client, message) => { // Pass client as an argument
      // Your existing code here
    },
  };