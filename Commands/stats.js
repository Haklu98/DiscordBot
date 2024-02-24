const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["stats", "stat", "s"],
    execute(Env) {
        const message = Env.message;
        let Data = JSON.parse(Fs.readFileSync("./Convo/Stats.json"));
        let StatString = "";
        for (let [key, value] of Object.entries(Data.users)) {
            StatString += `<@${key}> - ${value}\n`;
        }

        const StatEmbed = new Discord.EmbedBuilder()
            .setTitle("**DATASET CONTRIBUTIONS**");

        // Check if StatString is not empty before setting it as description
        if (StatString) {
            StatEmbed.setDescription(StatString);
            message.channel.send({ embeds: [StatEmbed] });
        } else {
            // If StatString is empty, send a message indicating no data
            message.channel.send("No dataset contributions found.");
        }
    },
};