/**
 * A singleton for aggregating messages sent between different modules. Based on the Publish-Subscribe pattern.
 * @type {{subscribe(*, *): void, unsubscribe(*, *): void, publish(*, *): void}}
 */

const messageBroker = (function () {
  const messages = {};

  return {
    subscribe(message, fn) {
      if (!messages[message]) {
        messages[message] = [];
      }
      messages[message].push(fn);
    },
    unsubscribe(message, fn) {
      if (messages[message]) {
        messages[message] = messages[message].filter((func) => func !== fn);
      }
    },
    publish(message, data) {
      if (messages[message]) {
        messages[message].forEach((fn) => fn(data));
      }
    },
  };
})();

export default messageBroker;
