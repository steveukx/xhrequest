
(function() {
   TestCase("Session", {

      setUp: function() {
         sinon.spy(MockTransport, 'request');
      },

      tearDown: function() {
         MockTransport.request.restore();
      },

      "test sends request immediately":function () {
         var session = aSession();
         assertEquals(1, MockTransport.request.callCount);
      },

      'test headers are maintained':function() {
         var session = aSessionWithConfig({
            headers: {
               'Custom-Header': 'foo'
            }
         });

         var args = MockTransport.request.getCall(0).args;
         assertEquals('foo', args[0].headers['Custom-Header']);
      },

      'test cookies are maintained from a header':function() {
         var session = aSessionWithConfig({
            headers: {
               'Cookie': 'name=value; othername=othervalue'
            }
         });

         var args = MockTransport.request.getCall(0).args;
         assertEquals('name=value; othername=othervalue', args[0].headers['Cookie']);
      },

      'test cookies are maintained from a cookies map':function() {
         var session = aSessionWithConfig({
            cookies: {
               name: 'value',
               othername: 'othervalue'
            }
         });

         var args = MockTransport.request.getCall(0).args;
         assertEquals('name=value; othername=othervalue', args[0].headers['Cookie']);
      },

      'test cookies are maintained from a CookieJar':function() {
         var cookieJar = new CookieJar();
         cookieJar.add(new Cookie('name', 'value'));
         cookieJar.add(new Cookie('othername', 'othervalue'));

         var session = aSessionWithConfig({
            cookies: cookieJar
         });

         var args = MockTransport.request.getCall(0).args;
         assertEquals('name=value; othername=othervalue', args[0].headers['Cookie']);
      }

   });

   function aSession(uri) {
      return aSessionWithConfig({}, uri);
   }

   function aSessionWithConfig(config, uri) {
      return new Session(url.parse(uri || 'http://google.com/search'), config || {}, MockTransport);
   }

}());