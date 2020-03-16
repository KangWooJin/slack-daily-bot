const { WebClient } = require('@slack/web-api');
const { RTMClient } = require('@slack/rtm-api');
// Read a token from the environment variables
const token = process.env.SLACK_TOKEN || 'xoxb-1004886118934-1002246418644-a06iJCCMjeNtHNmB6ak9K6Rw';

// Initialize
const web = new WebClient(token);
const rtm = new RTMClient(token);

class SlackClient {

}


let flag = false;

rtm.on('message', async (event) => {
  try {
    if (!flag) {
      const result = await threadReply(event);
      flag = true;
    }
    console.log('Message sent successfully', event.channel);
  } catch (error) {
    console.log('An error occurred', error);
  }
});

async function threadReply(event) {
  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
  const result = await web.chat.postMessage({
    text: 'Hello world!',
    channel: event.channel,
    thread_ts: event.ts,
  });

  console.log(`Successfully send message ${event.ts} in conversation ${event.channel}`);

  return result;
}

(async () => {
  await rtm.start();
})();


console.log(token);
module.exports = SlackClient;