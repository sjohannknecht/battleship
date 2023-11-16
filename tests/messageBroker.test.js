import messageBroker from "../src/messageBroker";

describe("messageBroker tests", () => {

    let mockFn = jest.fn((a => 2 * a));
    messageBroker.subscribe("test", mockFn);

    test("publish a message, execute mock function and test number of calls", () => {
        messageBroker.publish("test", 3);
        expect(mockFn.mock.calls).toHaveLength(1);
    });

    test("publish a message, execute mock function and test argument", () => {
        messageBroker.publish("test", 2);
        expect(mockFn.mock.calls[1][0]).toBe(2);
    });

    test("publish a message, execute mock function and test return value", () => {
        messageBroker.publish("test", 2);
        expect(mockFn.mock.results[2].value).toBe(4);
    });

    test("unsubscribe function, publish message again and test if function was not executed anymore", () => {
        messageBroker.unsubscribe("test", mockFn);
        messageBroker.publish("test", 3);
        expect(mockFn.mock.calls).toHaveLength(3);
    })
})
