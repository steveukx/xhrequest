
var module = {};

TestCase("CookieTest", {

   'test reads valid cookie': function() {
      var expiryYear = (new Date).getFullYear() + 1,
          expiryString = 'Wed, 25-Dec-' + expiryYear + ' 06:41:05 GMT',
          valueString = 'ID=blah:FF=0:TM=2020202020:LM=1010101010:S=B-PcPxpPxPxxpP';

      var cookie = Cookie.build('PREF=' + valueString + '; expires=' + expiryString + '; path=/; domain=.google.co.uk');
      assertTrue(cookie !== null);
      assertEquals(+new Date(expiryString), +cookie.expires);
      assertEquals(valueString, cookie.value);
   },

   'test build returns no cookie when it should have expired': function() {
      var expiryYear = (new Date).getFullYear() - 1,
         expiryString = 'Wed, 25-Dec-' + expiryYear + ' 06:41:05 GMT',
         valueString = 'ID=blah:FF=0:TM=2020202020:LM=1010101010:S=B-PcPxpPxPxxpP';

      var cookie = Cookie.build('PREF=' + valueString + '; expires=' + expiryString + '; path=/; domain=.google.co.uk');
      assertEquals(null, cookie);
   }

});


