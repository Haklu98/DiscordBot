const Fs = require("fs");
const Discord = require("discord.js");
let Sessions = {};
let model = undefined;

module.exports = {
  add: function (id, type) {
    Sessions[id] = {
      mode: "pattern",
      type: type,
      messages: [],
      lastmessage: new Date().getTime(),
    };
  },
  addResponse: function (id, type, dataset, question) {
    Sessions[id] = {
      mode: "response",
      type: type,
      messages: [],
      question: question,
      lastmessage: new Date().getTime(),
      dataset: dataset,
    };
  },
  remove: function (id) {
    delete Sessions[id];
  },
  receive: function (message) {
    if (!Sessions[message.author.id]) return;
    if (message.content.toLowerCase().startsWith("endsess")) {
      this.save(message.author.id);
      this.remove(message.author.id);
      channel.send("Your session has ended. Thank you for helping me learn!");
      return;
    }

    if (Sessions[message.author.id].mode == "pattern") {
      Sessions[message.author.id].messages.push(message.content.toLowerCase());
    } else {
      Sessions[message.author.id].messages.push({
        message: message.content.toLowerCase(),
        question: Sessions[message.author.id].question,
      });
    }
    message.react("✅");

    if (Sessions[message.author.id].mode == "response") {
      let Dataset = Sessions[message.author.id].dataset;
      let question =
    Dataset[args[0]].patterns[
      Math.floor(Math.random() * Dataset[args[1]].patterns.length)
    ];
      const Embed = new Discord.EmbedBuilder()
        .setTitle("**TRAIN**")
        .setDescription(`**Respond to:**\n${question}`);
      channel.send({ embeds: [Embed] });
      Sessions[message.author.id].question = question;
    }
  },
  save: function (id) {
    let SessData = Sessions[id];
    if (!SessData.messages.length) return;

    let Dataset = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));
    let Stats = JSON.parse(Fs.readFileSync("./Convo/Stats.json"));

    SessData.messages.forEach((msg) => {
      if (Dataset[SessData.type][SessData.mode + "s"].find((c) => c == msg))
        return;
      Stats[SessData.type]++;
      Dataset[SessData.type][SessData.mode + "s"].push(msg);

      if (!Stats.users[id]) {
        Stats.users[id] = 1;
      } else {
        Stats.users[id]++;
      }
    });

    Fs.writeFileSync("./Convo/Dataset.json", JSON.stringify(Dataset));
    Fs.writeFileSync("./Convo/Stats.json", JSON.stringify(Stats));
  },

  addModel(trainedModel) {
    model = trainedModel;
  },
  getModel() {
    return model;
  },
};
