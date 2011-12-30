TestCase("CookieJarTest", {

   "test cookies can be added as an HTTP Cookie string": function() {
      var cookieJar = new CookieJar();
      cookieJar.add( anHttpCookieString('id', 'value') );

      assertEquals(1, cookieJar.count());
      assertNotNull(cookieJar.get('id'));
   },

   "test expired cookies are not added": function() {
      var cookie = Cookie.build( anExpiredHttpCookieString('id', 'value') ),
         cookieJar = new CookieJar();

      cookieJar.add( anExpiredHttpCookieString('id', 'value') );
      assertNull(cookieJar.get('id'));

      cookieJar.add(cookie);
      assertNull(cookieJar.get('id'));

      cookieJar.add( anHttpCookieString('id', 'value') );
      assertNotNull(cookieJar.get('id'));
   },

   "test expired cookies delete existing ones of the same name": function() {
      var stale_cookie = Cookie.build( anExpiredHttpCookieString('id', 'value') ),
          fresh_cookie = Cookie.build( anHttpCookieString('id', 'value') ),
          cookieJar = new CookieJar();

      cookieJar.add( fresh_cookie );
      assertEquals(fresh_cookie, cookieJar.get('id'));

      cookieJar.add( stale_cookie );
      assertNull(cookieJar.get('id'));

      cookieJar.add( fresh_cookie );
      assertEquals(fresh_cookie, cookieJar.get('id'));
   },

   "test cookies can be added as Cookie instances": function() {
      var cookie = Cookie.build( anHttpCookieString('id', 'value') ),
          cookieJar = new CookieJar();

      cookieJar.add( cookie );

      assertEquals(1, cookieJar.count());
      assertEquals(cookie, cookieJar.get('id'));
   },

   "test stored cookies can be retrieved":function () {
      var cookie = Cookie.build( anHttpCookieString('id', 'value') ),
         cookieJar = new CookieJar();

      cookieJar.add( cookie );
      assertEquals(cookie, cookieJar.get('id'));
   },

   "test duplicate cookies overwrite each other":function () {
      var cookie_a = Cookie.build( anHttpCookieString('id', 'value') ),
         cookie_b = Cookie.build( anHttpCookieString('id', 'value') ),
         cookie_c = Cookie.build( anHttpCookieString('newId', 'value') ),
         cookieJar = new CookieJar();

      cookieJar.add( cookie_a );
      cookieJar.add( cookie_b );
      cookieJar.add( cookie_c );
      assertEquals(cookie_b, cookieJar.get('id'));
      assertEquals(cookie_c, cookieJar.get('newId'));
   },

   "test toString will create a valid HTTP header":function () {
      var cookie_a = Cookie.build( anHttpCookieString('foo', 'foofoo') ),
         cookie_b = Cookie.build( anHttpCookieString('bar', 'barbar') ),
         cookie_c = Cookie.build( anHttpCookieString('wibble', 'plop') ),
         cookieJar = new CookieJar();

      cookieJar.add( cookie_a );
      cookieJar.add( cookie_b );
      cookieJar.add( cookie_c );

      assertEquals('foo=foofoo; bar=barbar; wibble=plop', cookieJar.getHeaderStringForPath('google.co.uk', '/'));

      cookieJar.add( anExpiredHttpCookieString('bar') );
      assertEquals('foo=foofoo; wibble=plop', cookieJar.getHeaderStringForPath('google.co.uk', '/'));
   }

});