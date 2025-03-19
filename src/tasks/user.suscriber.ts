import { AuthNats } from "../enum/nats.enum";
import { startNatsSubscriber } from "./nats.suscriber";

startNatsSubscriber(AuthNats.USER_CREATED, async (data) => {});
startNatsSubscriber(AuthNats.USER_DELETED, async (data) => {});
startNatsSubscriber(AuthNats.USER_GET_ALL, async (data) => {});
startNatsSubscriber(AuthNats.USER_GET_SINGLE, async (data) => {});
startNatsSubscriber(AuthNats.USER_UPDATED, async (data) => {});
startNatsSubscriber(AuthNats.USER_LOGIN, async (data) => {});
startNatsSubscriber(AuthNats.USER_LOGOUT, async (data) => {});
