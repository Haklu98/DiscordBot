const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
  names: ["dataset", "data"],

  async execute(Env) {
    const message = Env.message;
    let Data = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));
    let DataStr = `Greetings - ${Data.greeting.patterns.length}\nGoodbyes - ${Data.goodbye.patterns.length}\nInsults - ${Data.insult.patterns.length}\nCompliments - ${Data.compliment.patterns.length}\nQuestion - ${Data.question.patterns.length}`;
    let Embed = new Discord.EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("**DATASET**")
      .setDescription(DataStr);
    message.channel.send({ embeds: [Embed] });
  },
};
