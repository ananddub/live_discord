import { connect, NatsConnection, StringCodec } from "nats";
import { CONFIG } from "../src/config/config";
import { AuthNats } from "../src/enum/nats.enum";

const sc = StringCodec();
let nc: NatsConnection | null = null;

export async function natsConnection() {
    if (nc) {
        return nc;
    }
    nc = await connect({
        servers: CONFIG.NATS_URL,
        user: CONFIG.NATS_USER,
        pass: CONFIG.NATS_PASSWORD,
    });
    return nc;
}

export async function publishToNats(topic: string, payload: any) {
    try {
        const nc = await natsConnection();
        const js = nc.jetstream();

        const message =
            typeof payload === "string" ? payload : JSON.stringify(payload);
        for (let i = 0; i < 100; i++) {
            const pubAck = await js.publish(topic, sc.encode(`value #${i}`));
            console.log(`📤 Message published to "${topic}" with value #${i}`);
        }
        await nc.drain();
    } catch (err) {
        console.error("❌ Failed to publish message:", err);
    }
}

// 🚀 Example call
publishToNats(AuthNats.USER_CREATED, {
    id: "user_12345",
    name: "John Doe",
    email: "john@example.com",
});
