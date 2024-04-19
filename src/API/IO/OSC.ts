import { sendToServer, type OSCMessage } from "../../IO/OSC";
import { Editor } from "../../main";
import { oscMessages } from "../../IO/OSC";

export const osc = (app: Editor) => (address: string, port: number, ...args: any[]): void => {
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

export const getOSC = () => (address?: string): any[] => {
  /**
   * Retrieves incoming OSC messages. Filters by address if provided.
   */
  if (address) {
    let messages = oscMessages.filter((msg: { address: string; }) => msg.address === address);
    messages = messages.map((msg: { data: any; }) => msg.data);
    return messages;
  } else {
    return oscMessages;
  }
};
