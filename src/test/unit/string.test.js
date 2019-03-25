/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import { removeURLs } from '../../utils/string';

describe('utils/string', function() {
  describe('removeURLs', function() {
    it('should remove the basic URLs successfully', () => {
      let string = 'https://foo.com/';
      expect(removeURLs(string)).toEqual('https://<URL>');
      string = 'http://foo.com/';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'ftp://foo.com/';
      expect(removeURLs(string)).toEqual('ftp://<URL>');
    });

    it('should remove the different kind of URLs successfully', () => {
      let string = 'http://foo.com/bar';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://foo.com/bar/';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://foo.com/bar/baz/hello/world/123';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://www.foo.com/bar/?baz=1234';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'https://www.example.com/foo/?bar=baz&inga=42&quux';
      expect(removeURLs(string)).toEqual('https://<URL>');
      string = 'http://userid@example.com/';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://userid:password@example.com/';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://userid:password@example.com:8080';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://142.42.1.1/';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://142.42.1.1:8080/';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://example.com/foo/#&bar=baz';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://foo.net/䨹';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://例子.测试';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://مثال.إختبار';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://उदाहरण.परीक्षा';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://1337.net';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://a.b-c.de';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'http://223.255.255.254';
      expect(removeURLs(string)).toEqual('http://<URL>');
      string = 'https://foo_bar.baz.com/';
      expect(removeURLs(string)).toEqual('https://<URL>');
    });

    it('should remove the URLs with texts around it successfully', () => {
      // URL with a text before it
      let string = 'Load 123: https://foo.com/';
      expect(removeURLs(string)).toEqual('Load 123: https://<URL>');

      // URL with a text after it
      string = 'https://foo.com/ bar baz';
      expect(removeURLs(string)).toEqual('https://<URL> bar baz');

      // URL with texts before and after it
      string = 'foo https://bar.com/ baz';
      expect(removeURLs(string)).toEqual('foo https://<URL> baz');
    });

    it('should remove the URL inside parentheses successfully', () => {
      const string = '(https://foo.com/)';
      expect(removeURLs(string)).toEqual('(https://<URL>)');
    });

    it('should remove the URL with file extension and multiple querystrings successfully', () => {
      const string =
        'https://px.image.com/test.gif?e=25&q=2&hp=1&kq=1&lo=1&ua=null&pk=1&wk=1&rk=1';
      expect(removeURLs(string)).toEqual('https://<URL>');
    });

    it('should remove the multiple URLs successfully', () => {
      let string = 'https://foo.com/ http://bar.com/';
      expect(removeURLs(string)).toEqual('https://<URL> http://<URL>');
      string = 'https://foo.com/ - http://bar.com - ftp://baz.com/';
      expect(removeURLs(string)).toEqual(
        'https://<URL> - http://<URL> - ftp://<URL>'
      );
      string =
        'https://www.example.com/foo/?bar=baz&inga=42&quux http://bar.com/';
      expect(removeURLs(string)).toEqual('https://<URL> http://<URL>');
    });

    it('should not remove non URLs', () => {
      let string = 'http://';
      expect(removeURLs(string)).toEqual(string);

      string = 'http://.';
      expect(removeURLs(string)).toEqual(string);

      string = 'http://../';
      expect(removeURLs(string)).toEqual(string);

      string = 'http://?';
      expect(removeURLs(string)).toEqual(string);

      string = '//';
      expect(removeURLs(string)).toEqual(string);

      string = 'http:///a';
      expect(removeURLs(string)).toEqual(string);

      string = 'foo.com';
      expect(removeURLs(string)).toEqual(string);
    });

    it('should not remove internal and self hosted URLs', () => {
      let string = 'chrome://browser/content/browser.xul';
      expect(removeURLs(string)).toEqual(string);

      string = 'some-other-protocol://foo';
      expect(removeURLs(string)).toEqual(string);

      string = 'resource://gre/modules/NewTabUtils.jsm';
      expect(removeURLs(string)).toEqual(string);

      string =
        'file:///Users/foo/gecko/browser/themes/shared/icons/customize.svg';
      expect(removeURLs(string)).toEqual(string);
    });

    it('should or should not remove moz-extension URLs depending on its parameter', () => {
      let string = 'moz-extension://foo/bar/index.js';
      expect(removeURLs(string)).toEqual('moz-extension://<URL>');

      string = 'moz-extension://foo/bar/index.js';
      expect(removeURLs(string, false)).toEqual(string);
    });
  });
});
