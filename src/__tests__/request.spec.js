import { stringify as toQueryString } from 'querystringify';
import Deferred from './deferred';
import * as request from '../request';

describe('request', () => {
  let context;

  beforeEach(function () {
    context = {};
    context.deferred = new Deferred();
    context.fetchSpy = spyOn(window, 'fetch').and.returnValue(context.deferred);
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
      context.action = () => request.fetch('/foo', 'hello-world', params);
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
      expect(context.fetchSpy).toHaveBeenCalledWith(`/foo?${expectedUrlParams}`, {
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
      context.action = () => request.destroy('/foo/666', 'auth-token');
    });

    it('executes a fetch', function () {
      context.action();
      expect(context.fetchSpy).toHaveBeenCalledWith('/foo/666', {
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
      context.action = () => request.create('/foobars', 'auth-token', 'foobar', { disposition: 'lucky' }, { anotherParam: 665 });
    });

    it('executes a fetch', function () {
      context.action();
      expect(context.fetchSpy).toHaveBeenCalledWith('/foobars', {
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
      context.action = () => request.update('/foobars', 'auth-token', 'foobar', { mood: 'happy' }, { anotherParam: 666 });
    });

    it('executes a fetch', function () {
      context.action();
      expect(context.fetchSpy).toHaveBeenCalledWith('/foobars', {
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
