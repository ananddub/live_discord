import { AuthNats } from "../enum/nats.enum";
import { User } from "../models/user.modal";
import { UserNats } from "../types/user.types";
import { startNatsSubscriber } from "./nats.suscriber";

startNatsSubscriber(AuthNats.USER_CREATED, async (data) => {
    const user = JSON.parse(data) as UserNats;
    const newUser = new User({
        _id: user.id,
        name: user.name,
        bio: user.bio,
        friends: [],
        pending: [],
        reject: [],
        block: [],
    });
    await newUser.save();
});

startNatsSubscriber(AuthNats.USER_DELETED, async (data) => {});
startNatsSubscriber(AuthNats.USER_GET_ALL, async (data) => {});
startNatsSubscriber(AuthNats.USER_GET_ALL, async (data) => {});
startNatsSubscriber(AuthNats.USER_GET_SINGLE, async (data) => {});
startNatsSubscriber(AuthNats.USER_UPDATED, async (data) => {});
startNatsSubscriber(AuthNats.USER_LOGIN, async (data) => {});
startNatsSubscriber(AuthNats.USER_LOGOUT, async (data) => {});
