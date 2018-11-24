import { param as toQueryString } from 'jquery';
import Deferred from 'frontend/helpers/specs/deferred';
import * as request from './request';

describe('frontend/stores/middleware/brainstem/request', () => {
  beforeEach(function () {
    this.deferred = new Deferred();
    this.fetchSpy = spyOn(window, 'fetch').and.returnValue(this.deferred);
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
      this.action = () => request.fetch('/foo', 'hello-world', params);
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

      this.action();
      expect(this.fetchSpy).toHaveBeenCalledWith(`/foo?${expectedUrlParams}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'hello-world',
        },
      });
    });

    it('returns a promise that resolves when the fetch is successful', function (done) {
      this.action().then((result) => {
        expect(result).toEqual([1, 2, 3, 4]);
        done();
      });
      this.deferred.resolve({
        ok: true,
        json: () => Promise.resolve([1, 2, 3, 4]),
      });
    });

    it('returns a promise that rejects when the fetch is unsuccessful', function (done) {
      this.action().catch((result) => {
        expect(result).toEqual('uh oh!');
        done();
      });
      this.deferred.resolve({
        ok: false,
        json: () => Promise.resolve('uh oh!'),
      });
    });
  });

  describe('destroy', () => {
    beforeEach(function () {
      this.action = () => request.destroy('/foo/666', 'auth-token');
    });

    it('executes a fetch', function () {
      this.action();
      expect(this.fetchSpy).toHaveBeenCalledWith('/foo/666', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'auth-token',
        },
      });
    });

    it('returns a promise that resolves when the fetch is successful', function (done) {
      this.action().then((result) => {
        expect(result).toBeUndefined();
        done();
      });
      this.deferred.resolve({
        ok: true,
        json: () => { },
      });
    });

    it('returns a promise that rejects when the fetch is unsuccessful', function (done) {
      this.action().catch((result) => {
        expect(result).toEqual('you do not have permission, buddy');
        done();
      });
      this.deferred.resolve({
        ok: false,
        json: () => Promise.resolve('you do not have permission, buddy'),
      });
    });
  });

  describe('create', () => {
    beforeEach(function () {
      this.action = () => request.create('/foobars', 'auth-token', 'foobar', { disposition: 'lucky' }, { anotherParam: 665 });
    });

    it('executes a fetch', function () {
      this.action();
      expect(this.fetchSpy).toHaveBeenCalledWith('/foobars', {
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
      this.action().then((result) => {
        expect(result).toEqual('created!');
        done();
      });
      this.deferred.resolve({
        ok: true,
        json: () => 'created!',
      });
    });

    it('returns a promise that rejects when the fetch is unsuccessful', function (done) {
      this.action().catch((result) => {
        expect(result).toEqual('you do not have permission, buddy');
        done();
      });
      this.deferred.resolve({
        ok: false,
        json: () => Promise.resolve('you do not have permission, buddy'),
      });
    });
  });

  describe('update', () => {
    beforeEach(function () {
      this.action = () => request.update('/foobars', 'auth-token', 'foobar', { mood: 'happy' }, { anotherParam: 666 });
    });

    it('executes a fetch', function () {
      this.action();
      expect(this.fetchSpy).toHaveBeenCalledWith('/foobars', {
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
      this.action().then((result) => {
        expect(result).toEqual('created!');
        done();
      });
      this.deferred.resolve({
        ok: true,
        json: () => 'created!',
      });
    });

    it('returns a promise that rejects when the fetch is unsuccessful', function (done) {
      this.action().catch((result) => {
        expect(result).toEqual('generic error message');
        done();
      });
      this.deferred.resolve({
        ok: false,
        json: () => Promise.resolve('generic error message'),
      });
    });
  });
});
