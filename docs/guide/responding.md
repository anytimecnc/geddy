Geddy has APIs of different levels of granularity for responding to requests.
From highest-level to lowest:

 * respondWith
 * respondTo
 * respond/redirect
 * output

In general, you'll be able to use the highest-level API and expect Geddy to do
the right thing, but the lower-level APIs are there if you need to do more
specific things with your responses.

#### respondWith

The `respondWith` method is the highest-level response API. It handles
formatting your output in the correct way, but also allows more general
format-specific behaviors like doing redirects, or adding needed headers.

The best example of this is handling a response for a REST `create` request. In
the case of a request that wants back an HTML response, after creating the item
you'll want to respond with a redirect for the item's HTML page. In the case of
a request that wants back JSON, you'll want to respond with a 201/created, and
include a 'Location' header with the URL for the newly-created item.

To use `respondWith`, specify the formats your controller can use by calling
`canRespondTo` with the list of formats:

```javascript
var SnowDogs = function () {
  this.canRespondTo(['html', 'json', 'js']);
};
```

That will allow your controller to respond with the built-in response-strategies
for these formats.

Call `respondWith` with a Geddy model instance, or a collection of instances, like so:

```javascript
var SnowDogs = function () {
  this.canRespondTo(['html', 'json', 'js']);

  this.index = function (req, resp, params) {
    var self = this;
    geddy.model.SnowDog.all(function(err, snowDogs) {
      if (err) {
        throw err;
      }
      self.respondWith(snowDogs);
    });
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.SnowDog.first(params.id, function(err, snowDog) {
      if (err) {
        throw err;
      }
      if (!snowDog) {
        throw new geddy.errors.NotFoundError('SnowDog ' + params.id + ' not found.');
      }
      self.respondWith(snowDog);
    });
  };
};
```

When you `throw` an error, Geddy will still perform content-negotiation and
respond with an error of the correct format. If the requests wants a JSON
response, Geddy will respond with a nice, parseable JSON response that includes
a statusCode, statusText, message, and stack, if one is available.

#### respondTo

The `respondTo` method is the next level down in API granularity. It allows you
to specify your own response-strategies to use for the response. NOTE: calling
`respondTo` will override any formats declared using `canRespondTo`.

Call `respondTo` with an object containing the various response-strategies you want to use for the response, like so:

```javascript
var Users = function () {

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.User.first({username: 'foo'}, function (err, user) {
      self.respondTo({
        html: function () {
          self.redirect('/user/profiles?user_id=' + user.id);
        }
      , json: function () {
          self.respond(user, {format: 'json'});
        }
      });
    });
  };
};
```

Using `respondTo` also allows you to do more than simply output formatted
content. You can perform redirects, set headers, etc.

If you want to create your own specific response-strategies, you can also create
a custom responder.

#### respond and redirect

The `respond` method is a lower-level API call that simply outputs content in
the correct format for a request. The `redirect` method is exactly what it
sounds like -- a way to tell the browser to request a different URL from your
application.



