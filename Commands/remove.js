const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
  names: ["remove"],
  execute(Env) {
    const message = Env.message;
    const args = Env.args;

    if (message.author.id != "294208407899209728") {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**Insufficient Permission**")
        .setDescription("No");
      return message.channel.send({ embed: [ErrorEmbed] });
    }

    if (
      !["greeting", "goodbye", "insult", "compliment", "question"].includes(
        args[1]
      )
    ) {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**ERROR**")
        .setDescription(
          "Specify category [greeting, goodbye, insult, compliment, question]"
        );
      return message.channel.send({ embeds: [ErrorEmbed] });
    }

    if (!["pattern", "response"].includes(args[2])) {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**ERROR**")
        .setDescription("Specify type [pattern, response]");
      return message.channel.send({ embeds: [ErrorEmbed] });
    }

    var sentence = args.slice(3).join(" ");
    if (!sentence) {
      const ErrorEmbed = new Discord.EmbedBuilder()
        .setTitle("**ERROR**")
        .setDescription("Specify phrase to delete from dataset");
      return message.channel.send({ embeds: [ErrorEmbed] });
    }
    var Dataset = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));

    if (Dataset[args[1]][args[2] + "s"].find((e) => e == sentence)) {
      var Stats = JSON.parse(Fs.readFileSync("./Convo/Stats.json"));
      Stats[args[1]]--;
      Fs.writeFileSync("./Convo/Stats.json", JSON.stringify(Stats));
    }

    Dataset[args[1]][args[2] + "s"] = Dataset[args[1]][args[2] + "s"].filter(
      (e) => e != sentence
    );
    Fs.writeFileSync("./Convo/Dataset.json", JSON.stringify(Dataset));

    const Embed = new Discord.EmbedBuilder()
      .setTitle("**SUCCESS**")
      .setDescription(`Deleted ${sentence} from ${args[1]}-${args[2]}`);
    message.channel.send({ embeds: [Embed] });
  },
};
