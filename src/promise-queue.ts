export class PromiseQueue {
  private queue: (() => Promise<void>)[] = [];
  private running: boolean = false;

  async enqueue(task: () => Promise<void>): Promise<void> {
    const completionPromise = new Promise<void>((resolve, reject) => {
      const wrapped = async () => {
        try {
          await task();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      this.queue.push(wrapped);
    });

    this.runQueue();
    return completionPromise;
  }

  private async runQueue(): Promise<void> {
    if (this.running) return;

    this.running = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
      }

      await Promise.resolve();
    }

    this.running = false;
  }
}
