import { sendToServer, type OSCMessage } from "../IO/OSC";

export const osc = (app: any) => (address: string, port: number, ...args: any[]): void => {
    /**
     * Sends an OSC message to the server.
     */
    sendToServer({
        address: address,
        port: port,
        args: args,
        timetag: Math.round(Date.now() + (app.clock.nudge - app.clock.deviation)),
    } as OSCMessage);
};

export const getOSC = (app: any) => (address?: string): any[] => {
    /**
     * Retrieves incoming OSC messages. Filters by address if provided.
     */
    let oscMessages = app.oscMessages; // Assuming `oscMessages` is stored in `app`
    if (address) {
        let messages = oscMessages.filter((msg: { address: string; }) => msg.address === address);
        messages = messages.map((msg: { data: any; }) => msg.data);
        return messages;
    } else {
        return oscMessages;
    }
};