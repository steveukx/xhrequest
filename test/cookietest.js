
var module = {};

TestCase("CookieTest", {

   'test reads valid cookie': function() {
      var cookie = Cookie.build('PREF=ID=3bda468c998e6d4d:FF=0:TM=1324881665:LM=1324881665:S=B-PvMd5huxfc9WPP; expires=Wed, 25-Dec-2013 06:41:05 GMT; path=/; domain=.google.co.uk');
      assertTrue(cookie !== null);
      assertEquals(+new Date('Wed, 25-Dec-2013 06:41:05 GMT'), +cookie.expires);
      assertEquals('ID=3bda468c998e6d4d:FF=0:TM=1324881665:LM=1324881665:S=B-PvMd5huxfc9WPP', cookie.value);
   }

});


