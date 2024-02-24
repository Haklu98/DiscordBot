const Discord = require("discord.js");
const Session = require("../Training/Session.js");
const Fs = require("fs");

module.exports = {
  names: ["train", "teach"],

  async execute(Env) {
    const message = Env.message;
    const args = Env.args;

    console.log("Command arguments:", args); 

    if (message.channel.name.toLowerCase() !== "training") {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**ERROR**")
        .setDescription(
          "You may only use this command in the training channel"
        );
      return message.channel.send({ embeds: [ErrorEmbed] });
    }

    if (!args[0]) {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**ERROR**")
        .setDescription(
          "Specify the type of message\n(greeting, goodbye, insult, compliment, question)"
        );
      return message.channel.send({ embeds: [ErrorEmbed] });
    }

    if (
      !["greeting", "goodbye", "insult", "compliment", "question"].includes(
        args[0]
      )
    ) {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**ERROR**")
        .setDescription(
          "Not a valid category. Valid categories are\n(greeting, goodbye, insult, compliment, question)"
        );
      return message.channel.send({ embeds: [ErrorEmbed] });
    }

    let TrainEmbed;
    let Meta = JSON.parse(Fs.readFileSync("./Training/Meta.json"));

    if (Meta.blacklisted.includes(message.author.id)) {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**ERROR**")
        .setDescription("You have been blacklisted from training");
      return message.channel.send({ embeds: [ErrorEmbed] });
    }

    if (Meta.type === "pattern") {
      TrainEmbed = new Discord.EmbedBuilder()
        .setTitle("**TRAIN**")
        .setDescription(
          "Type endsess to stop training. As of now, type messages that pertain to " +
            args[0]
        );
    } else {
      let Dataset = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"))[
        args[0]
      ];

      // Check if the category exists and has patterns
      if (Dataset && Dataset.patterns && Dataset.patterns.length >= 0) {
        let Response =
          Dataset.patterns[Math.floor(Math.random() * Dataset.patterns.length)];
        TrainEmbed = new Discord.EmbedBuilder()
          .setTitle("**TRAIN**")
          .setDescription(`**Respond to:**\n${Response}`);
        Session.addResponse(message.author.id, "response", Dataset, Response);
      } else {
        // Handle case where patterns are empty or category doesn't exist
        const ErrorEmbed = new Discord.EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("**ERROR**")
          .setDescription(
            "The specified category either doesn't exist or has no training patterns."
          );
        return message.channel.send({ embeds: [ErrorEmbed] });
      }
    }

    message.channel.send({ embeds: [TrainEmbed] });
  },
};
