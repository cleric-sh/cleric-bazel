export function registerGracefulShutdown(dispose: () => Promise<void>) {

    let isDisposing = false;

    async function disposer() {
        if (!isDisposing) {
            isDisposing = true;
            await dispose();
            process.exit(0);
        }
    }

    // This will handle process.exit():
    process.on('exit', disposer);

// This will handle kill commands, such as CTRL+C:
    process.on('SIGINT', disposer);
    process.on('SIGTERM', disposer);

// This will prevent dirty exit on code-fault crashes:
    process.on('uncaughtException', disposer);

    process.on('beforeExit', disposer)
}