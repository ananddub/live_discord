import redis from "../db/redis";
import { NatsUser } from "../enum/nats.enum";
import { User } from "../models/user.modal";
import { UserNats } from "../types/user.types";
import { startNatsSubscriber } from "./nats.suscriber";

startNatsSubscriber(NatsUser.CREATED, async (data) => {
    const user = JSON.parse(data) as UserNats;
    const newUser = new User({
        _id: user.id,
        name: user.name,
        bio: user.bio,
        friends: [],
        pending: [],
        block: [],
    });
    await newUser.save();
});

startNatsSubscriber(NatsUser.FRIEND, async (data) => {});
startNatsSubscriber(NatsUser.REQUEST, async (data) => {});
startNatsSubscriber(NatsUser.BLOCK, async (data) => {});
startNatsSubscriber(NatsUser.REJECT, async (data) => {});
startNatsSubscriber(NatsUser.ONLINE, async (data) => {
    const user = JSON.parse(data) as UserNats;
    await redis.hset(`user:${user.id}`, "online");
});
startNatsSubscriber(NatsUser.OFFLINE, async (data) => {
    const user = JSON.parse(data) as UserNats;
    await redis.hdel(`user:${user.id}`, "online");
});
