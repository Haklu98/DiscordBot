const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["mode"],

    execute(Env){
        const message = Env.message;
        const args = Env.args;

        if (message.author.id != "294208407899209728") {
            const ErrorEmbed = new Discord.EmbedBuilder()
                .setTitle("**Insufficient Permission**")
                .setDescription("No");
            return message.channel.send({embeds: [ErrorEmbed]});
        }

        if (!args[1]){
            const ErrorEmbed = new Discord.EmbedBuilder()
                .setTitle("**ERROR**")
                .setDescription("Specify mode [pattern, response]");
            return message.channel.send({embeds: [ErrorEmbed]});
        }
        if (!["pattern", "response"].includes(args[1])) {
            const ErrorEmbed = new Discord.EmbedBuilder()
                .setTitle("**ERROR**")
                .setDescription("mode can only be [pattern, response]");
            return message.channel.send({embeds: [ErrorEmbed]});
        }

        let Meta = JSON.parse(Fs.readFileSync("./Training/Meta.json"));
        Meta.type = args[1];
        Fs.writeFileSync("./Training/Meta.json", JSON.stringify(Meta));
        const Embed = new Discord.EmbedBuilder()
            .setTitle("**SUCCESS**")
            .setDescription("Mode has been set to " + args[1]);
        message.channel.send({embeds: [Embed]});
    }
}