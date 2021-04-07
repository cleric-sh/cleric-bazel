import {UserBrowserSession} from "./UserBrowserSession";

export class UserBrowserSessionManager {
    private sessions = new Map<string, UserBrowserSession>();

    getSession(user: string) {
        if (!this.sessions.has(user)) {
            const session = new UserBrowserSession(user);
            this.sessions.set(user, session);
            return session;
        }
        return this.sessions.get(user)!;
    }

    async close() {
        for (const session of this.sessions.values()) {
            await session.close();
        }
    }
}