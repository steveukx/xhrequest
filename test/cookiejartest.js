TestCase("CookieJarTest", {

   "test cookies can be added as an HTTP Cookie string": function() {
      var cookieJar = new CookieJar();
      cookieJar.add( anHttpCookieString('someid', 'somevalue') );

      assertEquals(1, cookieJar.count());
   },

   "test expired cookies strings are not added": function() {
      var cookieJar = new CookieJar();
      cookieJar.add( anExpiredHttpCookieString('someid', 'somevalue') );

      assertEquals(0, cookieJar.count());
   },

   "test cookies can be added as Cookie instances": function() {
      var cookie = Cookie.build( anHttpCookieString('id', 'value') ),
          cookieJar = new CookieJar();

      cookieJar.add( cookie );

      assertEquals(1, cookieJar.count());
   },

   "test stored cookies can be retrieved":function () {
      var cookie = Cookie.build( anHttpCookieString('id', 'value') ),
         cookieJar = new CookieJar();

      cookieJar.add( cookie );
      assertEquals(cookie, cookieJar.get('id'));
   }

});