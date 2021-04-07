export async function race<T>(promises: Promise<T>[]) {
    const wrappedPromises = promises.map(async (promise, index) => {

        const result = await promise.catch(error => {
            // If the browser window closes (e.g. due to task finished) before the wait times out,
            // it will throw an error. Swallow this, because it's not a problem.
            if (error.message === `Protocol error (Runtime.callFunctionOn): Target closed.`) return;
            throw error;
        });
        return [index, result] as const;
    })
    return await Promise.race(wrappedPromises);
}