import messageBroker from "../src/message-broker";

describe("messageBroker tests", () => {
    let mockFn = jest.fn((a => 2 * a));
    messageBroker.subscribe("test", mockFn);

    test("publish a message and test number of mock function calls", () => {
        messageBroker.publish("test", 3);
        expect(mockFn.mock.calls).toHaveLength(1);
    });

    test("publish a message and test first argument of that mock function call", () => {
        messageBroker.publish("test", 2);
        expect(mockFn.mock.calls[1][0]).toBe(2);
    });

    test("publish a message and test return value of that mock function call", () => {
        messageBroker.publish("test", 2);
        expect(mockFn.mock.results[2].value).toBe(4);
    });

    test("unsubscribe function, publish message again and test if function was not executed anymore", () => {
        messageBroker.unsubscribe("test", mockFn);
        messageBroker.publish("test", 3);
        expect(mockFn.mock.calls).toHaveLength(3);
    })
})
