export default class Deferred extends Promise {
  constructor(executor) {
    if (executor) {
      super(executor);
      return this;
    }

    let resolveReference;
    let rejectReference;

    super((resolve, reject) => {
      resolveReference = resolve;
      rejectReference = reject;
    });

    this.resolve = (...args) => {
      resolveReference(...args);
      return this;
    };

    this.reject = (...args) => {
      rejectReference(...args);
      return this;
    };
  }
}
