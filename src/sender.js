const amqplib = require("amqplib");
const conf = require("../conf/config");

const channel = amqplib.connect(conf.URL, conf.OPTS).then((conn) => conn.createChannel());

const Sender = {
  send: function (topic, msg) {
    channel
      .then((ch) =>
        ch.publish(`cpds.${conf.APP.appid}.sender`, "", Buffer.from(msg), {
          headers: { from: conf.APP.appid, topic: topic },
        })
      )
      .catch(console.warn);
  },
};

module.exports = Sender;
