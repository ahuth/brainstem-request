import { stringify as toQueryString } from 'querystringify';
import * as request from '../request';

class Deferred extends Promise {
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

describe('request', () => {
  let context;

  beforeEach(function () {
    context = {};
    context.deferred = new Deferred();
    context.fetchMock = jest.fn(() => context.deferred);
  });

  describe('fetch', () => {
    beforeEach(function () {
      const params = {
        include: ['users', 'stories'],
        only: [5, 6],
        order: 'name:desc',
        page: 2,
        perPage: 50,
        search: 'hello there',
        filters: {
          creator: [50, 51],
        },
      };
      context.action = () => request.fetch(context.fetchMock, '/foo', 'hello-world', params);
    });

    it('executes a fetch', function () {
      const expectedUrlParams = toQueryString({
        include: 'users,stories',
        only: '5,6',
        order: 'name:desc',
        page: 2,
        per_page: 50,
        search: 'hello there',
        creator: [50, 51],
      });

      context.action();
      expect(context.fetchMock.mock.calls[0][0]).toEqual(`/foo?${expectedUrlParams}`);
      expect(context.fetchMock.mock.calls[0][1]).toEqual({
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'hello-world',
        },
      });
    });

    it('returns a promise that resolves when the fetch is successful', function (done) {
      context.action().then((result) => {
        expect(result).toEqual([1, 2, 3, 4]);
        done();
      });
      context.deferred.resolve({
        ok: true,
        json: () => Promise.resolve([1, 2, 3, 4]),
      });
    });

    it('returns a promise that rejects when the fetch is unsuccessful', function (done) {
      context.action().catch((result) => {
        expect(result).toEqual('uh oh!');
        done();
      });
      context.deferred.resolve({
        ok: false,
        json: () => Promise.resolve('uh oh!'),
      });
    });
  });

  describe('destroy', () => {
    beforeEach(function () {
      context.action = () => request.destroy(context.fetchMock, '/foo/666', 'auth-token');
    });

    it('executes a fetch', function () {
      context.action();
      expect(context.fetchMock.mock.calls[0][0]).toEqual('/foo/666');
      expect(context.fetchMock.mock.calls[0][1]).toEqual({
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'auth-token',
        },
      });
    });

    it('returns a promise that resolves when the fetch is successful', function (done) {
      context.action().then((result) => {
        expect(result).toBeUndefined();
        done();
      });
      context.deferred.resolve({
        ok: true,
        json: () => { },
      });
    });

    it('returns a promise that rejects when the fetch is unsuccessful', function (done) {
      context.action().catch((result) => {
        expect(result).toEqual('you do not have permission, buddy');
        done();
      });
      context.deferred.resolve({
        ok: false,
        json: () => Promise.resolve('you do not have permission, buddy'),
      });
    });
  });

  describe('create', () => {
    beforeEach(function () {
      context.action = () => request.create(context.fetchMock, '/foobars', 'auth-token', 'foobar', { disposition: 'lucky' }, { anotherParam: 665 });
    });

    it('executes a fetch', function () {
      context.action();
      expect(context.fetchMock.mock.calls[0][0]).toEqual('/foobars');
      expect(context.fetchMock.mock.calls[0][1]).toEqual({
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'auth-token',
        },
        body: JSON.stringify({
          foobar: {
            disposition: 'lucky',
          },
          anotherParam: 665,
        }),
      });
    });

    it('returns a promise that resolves when the fetch is successful', function (done) {
      context.action().then((result) => {
        expect(result).toEqual('created!');
        done();
      });
      context.deferred.resolve({
        ok: true,
        json: () => 'created!',
      });
    });

    it('returns a promise that rejects when the fetch is unsuccessful', function (done) {
      context.action().catch((result) => {
        expect(result).toEqual('you do not have permission, buddy');
        done();
      });
      context.deferred.resolve({
        ok: false,
        json: () => Promise.resolve('you do not have permission, buddy'),
      });
    });
  });

  describe('update', () => {
    beforeEach(function () {
      context.action = () => request.update(context.fetchMock, '/foobars', 'auth-token', 'foobar', { mood: 'happy' }, { anotherParam: 666 });
    });

    it('executes a fetch', function () {
      context.action();
      expect(context.fetchMock.mock.calls[0][0]).toEqual('/foobars');
      expect(context.fetchMock.mock.calls[0][1]).toEqual({
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'auth-token',
        },
        body: JSON.stringify({
          foobar: {
            mood: 'happy',
          },
          anotherParam: 666,
        }),
      })
    });

    it('returns a promise that resolves when the fetch is successful', function (done) {
      context.action().then((result) => {
        expect(result).toEqual('created!');
        done();
      });
      context.deferred.resolve({
        ok: true,
        json: () => 'created!',
      });
    });

    it('returns a promise that rejects when the fetch is unsuccessful', function (done) {
      context.action().catch((result) => {
        expect(result).toEqual('generic error message');
        done();
      });
      context.deferred.resolve({
        ok: false,
        json: () => Promise.resolve('generic error message'),
      });
    });
  });
});
