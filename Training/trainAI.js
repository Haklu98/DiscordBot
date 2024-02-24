const Fs = require("fs");
const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");

const trainAI = async () => {
  let data = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));
  let trainingData = [];

  for (let [key, value] of Object.entries(data)) {
    value.patterns.forEach((msg) => {
      trainingData.push({ type: key, message: msg });
    });
  }

  let sentenceEncoder = await use.load();
  let sentences = trainingData.map((t) => t.message.toLowerCase());
  let xTrain = await sentenceEncoder.embed(sentences);
  let yTrain = tf.tensor2d(
    trainingData.map((t) => [
      t.type == "greeting" ? 1 : 0,
      t.type == "goodbye" ? 1 : 0,
      t.type == "insult" ? 1 : 0,
      t.type == "compliment" ? 1 : 0,
      t.type == "question" ? 1 : 0
    ])
  );

  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [xTrain.shape[1]],
      activation: "softmax",
      units: 5
    })
  )

  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: tf.train.adam(0.001),
    metrics: ["accuracy"]
  });

  const onBatchEnd = (batch, logs) => {
    console.log('Accuracy', logs.acc);
  }

  // Train model

  await model.fit(xTrain, yTrain, {
    batchSize: 32,
    validationSplit: 0.2,
    shuffle: true,
    epochs: 300,
    callbacks: {
        onBatchEnd
    }

  }).then(info => {
    console.lof('Final accuracy', info.history.acc);
  })
  return model;
};

module.exports = trainAI;