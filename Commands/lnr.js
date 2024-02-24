const Discord = require("discord.js");
const Fs = require("fs");
const Session = require("../Training/Session.js");
const use = require("@tensorflow-models/universal-sentence-encoder");
const tf = require("@tensorflow/tfjs");
const JW = require("../Training/JaroWinkler.js");
let lastcommand = 0;

module.exports = {
  names: ["lnr", "learner"],

  async execute(Env) {
    const message = Env.message;
    const args = Env.args;
    let model = Session.getModel();
    if (!model) {
      model = await tf.loadLayersModel("../Models/model.json");
      Session.addModel(model);
    }

    let phrase = args.slice(1).join(" ");
    if (!phrase) {
      const ErrorEmbed = new Discord.MessageEmbed()
        .setTitle("**ERROR**")
        .setDescription("Please specify a phrase to test");
      return message.channel.send(ErrorEmbed);
    }

    if (new Date().getTime() - lastcommand < 1000) {
      const ErrorEmbed = new Discord.MessageEmbed()
        .setTitle("**ERROR**")
        .setDescription("Please wait a bit before consecutive requests.");
      return message.channel.send(ErrorEmbed);
    }
    lastcommand = new Date().getTime();

    message.channel.startTyping();

    const sentenceEncoder = await use.load();

    let Data = [{ message: phrase }];
    let Sentences = Data.map((t) => t.message.toLowerCase());
    const xPredict = await sentenceEncoder.embed(Sentences);
    let prediction = await model.predict(xPredict).data();
    let highest = [0, 0];
    for (let i = 0; i < prediction.length; i++) {
      if (highest[1] < prediction[i]) {
        highest[0] = i;
        highest[1] = prediction[i];
      }
    }
    let predicted = "";
    switch (highest[0]) {
      case 0:
        predicted = "Greeting";
        break;
      case 1:
        predicted = "Goodbye";
        break;
      case 2:
        predicted = "Insult";
        break;
      case 3:
        predicted = "Compliment";
        break;
      case 4:
        predicted = "Question";
        break;
    }

    let Dataset = JSON.parse(Fs.readFileSync("../Convo/Dataset.json"));
    let input = [undefined, 0];

    Dataset[predicted.toLowerCase()].patterns.forEach((msg) => {
      let weight = JW(phrase, msg);
      if (weight > input[1]) {
        input[0] = msg;
        input[1] = weight;
      }
    });

    let possibleResponses = [];
    if (input[1] > 0.5) {
      Dataset[predicted.toLowerCase()].responses.forEach((res) => {
        if (res.question == input[0]) {
          possibleResponses.push(res.message);
        }
      });
    }
    if (possibleResponses.length == 0) {
      Dataset[predicted.toLowerCase()].responses.forEach((res) => {
        if (res.question == "default") {
          possibleResponses.push(res.message);
        }
      });
    }

    message.channel.stopTyping();
    message.channel.send(
      possibleResponses[Math.floor(Math.random() * possibleResponses.length)]
    );

    let Meta = JSON.parse(Fs.readFileSync("../Training/Meta.json"));
    if (Meta.selflearning && highest[1] > 0.6) {
      if (Dataset[predicted.toLowerCase()].patterns.includes(phrase)) return;
      Dataset[predicted.toLowerCase()].patterns.push(phrase);
      Fs.writeFileSync("../Convo/Dataset.json", JSON.stringify(Dataset));
    }
  },
};
