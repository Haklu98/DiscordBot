const Discord = require("discord.js");
const trainAI = require("../Training/trainAI.js");
const Session = require("../Training/Session.js");

module.exports = {
  names: ["tftrain"],
  async execute(Env) {
    const message = Env.message;

    if (message.author.id != "294208407899209728") {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**Insufficient Permission**")
        .setDescription("No");
      return message.channel.send({embeds: [ErrorEmbed]});
    }
    message.channel.send("Please wait... Model is being trained");
    let Model = await trainAI();
    Model.save("../Models");
    Session.addModel(Model);
    message.channel.send("AI Succcessfully trained");
  },
};
