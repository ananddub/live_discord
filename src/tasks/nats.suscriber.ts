import {
    connect,
    consumerOpts,
    createInbox,
    JetStreamManager,
    nanos,
    NatsConnection,
    StringCodec,
} from "nats";
import { CONFIG } from "../config/config";

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

export async function startNatsSubscriber(
    topic: string,
    callback: (data: string) => void
) {
    try {
        const nc = await natsConnection();

        console.log("✅ Connected to NATS");

        const jsm: JetStreamManager = await nc.jetstreamManager();

        try {
            await jsm.streams.info(topic);
            console.log(`ℹ️ Stream '${topic}' already exists`);
        } catch (err) {
            console.log(
                `🚀 Creating stream '${topic}' with subjects: ${topic}`
            );
            await jsm.streams.add({
                name: topic,
                subjects: [topic],
                max_age: nanos(24 * 60 * 60 * 1000),
            });
            console.log(`✅ Stream '${topic}' created`);
        }

        const js = nc.jetstream();
        const opts = consumerOpts();
        opts.durable("storage");
        opts.deliverTo(createInbox());
        opts.deliverAll();
        opts.manualAck();
        opts.ackExplicit();

        const sub = await js.subscribe(topic, opts);

        console.log(`📩 JetStream listening to ${topic} from beginning...`);

        for await (const msg of sub) {
            callback(sc.decode(msg.data));
            msg.ack();
        }

        await nc.drain();
    } catch (err) {
        console.error("❌ Error connecting to NATS:", err);
    }
}
