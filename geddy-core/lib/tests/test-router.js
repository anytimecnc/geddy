var sys       = require ('sys');
var assert    = require('assert');
var gRouter   = require('../router');

//Load util libraries
GLOBAL.util = {};
GLOBAL.util.meta = require('geddy-util/lib/meta');
GLOBAL.util.string = require('geddy-util/lib/string');

RouterTests = {
  //pass and fail messages to be used in reporting success or failure
  pass : 'Pass',
  fail : 'Failed',
  
  //basic test setup
  setup : function(opts) {
    return function() {
      router = new gRouter.Router();
    }();
  },

  //tear down must be run at the completion of every test
  teardown : function(test) {
    sys.puts('PASSED  ::  ' + test);
    return function() {
      process.addListener("exit", function () {
        assert.equal(0, exitStatus);
      })();
    }
  },

  
  testCreateRouter : function() {
    assert.ok(router !== undefined, this.fail);
  },


  // create a simple route
  testCreateSimpleRoute : function() {
    var route = router.match('/:controller/:action/:id');
    assert.ok(route, this.fail);
  },

  // create a route with optional segments
  testCreateOptionalRoute : function() {
    var route = router.match('/:controller/:action/:id(.:format)')
    assert.ok(route, this.fail)
  },

  // create a route with multiple optional segments
  testCreateMultipleOptionalRoute : function() {
    var route = router.match('/:controller/:id(/:action)(.:format)')
    assert.ok(route, this.fail)
  },

  // create a resource
  testCreateResource : function() {
    var routes = router.resource('SnowDogs');
    assert.ok(routes.length === 7, this.fail)
    for ( var i in routes ) {
      assert.ok(route, this.fail)
    }
  },

  // create a static route with fixed params 
  testRouteWithParams : function() {
    var route = router.match('/hello/there').to( { controller:'Application', action: 'index' } );
    assert.ok(route, this.fail)
  },

  // create a static route with extra fixed params 
  testRouteWithExtraParams : function() {
    var route = router.match('/hello/there').to( { controller:'Application', action: 'index', language: 'english' } );
    assert.ok(route, this.fail)
  },

  // create a static route with a specific request method 
  testRouteWithMethod : function() {
    var route = router.match('/:controller/:action', 'GET');
    assert.ok(route, this.fail)
  },

  // create a static route with key regex match reqirements
  testRouteWithRegexReqs : function() {
    var route = router.match('/:controller/:action/:id', { id: /\d+/ } );
    assert.ok(route, this.fail)
  },

  // create a static route with key match reqirements as a regex string
  testRouteWithStringRegexReqs : function() {
    var route = router.match('/:controller/:action/:id', { id: '\\d+' } );
    assert.ok(route, this.fail)
  },

  // create a static route with key match reqirements AND a method
  testRouteWithReqsAndMethod : function() {
    var route = router.match('/:controller/:action/:id', 'GET', { id: /\d+/ } );
    assert.ok(route, this.fail)
  },

  // create a static route with key match reqirements AND a method in reverse order
  testRouteWithReqsAndMethodReversed : function() {
    var route = router.match('/:controller/:action/:id', { id: /\d+/ }, 'GET' );
    assert.ok(route, this.fail)
  },

  // create a static route with key match reqirements AND a method in reverse order
  testRouteWithName : function() {
    var route = router.match('/:controller/:action/:id', { id: /\d+/ }, 'GET' ).name('aweosme');
    assert.ok(route, this.fail)
  },


// ok - let's start doing things with thes routes

  // test that the router matches a URL
  testSimpleRouteParses : function() {
    var route = router.match('/:controller/:action/:id');
    var params = router.first('/products/show/1','GET');
    assert.ok(params, this.fail);
    assert.equal(params.controller, 'Products', this.fail);
    assert.equal(params.action, 'show', this.fail);
    assert.equal(params.id, 1, this.fail);
    assert.equal(params.method, 'GET', this.fail);
  },

  // test that the router matches a URL
  testSimpleRouteParsesWithOptionalSegment : function() {
    var route = router.match('/:controller/:action/:id(.:format)');
    var params = router.first('/products/show/1.html','GET');
    assert.ok(params, this.fail);
    assert.equal(params.controller, 'Products', this.fail);
    assert.equal(params.action, 'show', this.fail);
    assert.equal(params.id, 1, this.fail);
    assert.equal(params.method, 'GET', this.fail);
    assert.equal(params.format, 'html', this.fail);
  },

  testSimpleRouteParsesWithOptionalSegmentMissing : function() {
    var route = router.match('/:controller/:action/:id(.:format)','GET');
    var params = router.first('/products/show/1','GET');
    assert.ok(params, this.fail);
    assert.equal(params.controller, 'Products', this.fail);
    assert.equal(params.action, 'show', this.fail);
    assert.equal(params.id, 1, this.fail);
    assert.equal(params.method, 'GET', this.fail);
    assert.equal(typeof(params.format), 'undefined', this.fail);
  },

  testSimpleRouteFailingDueToBadMethod : function() {
    var route = router.match('/:controller/:action/:id(.:format)','GET');
    var params = router.first('/products/show/1','POST');
    assert.equal(params, false, this.fail);
  },

  testSimpleRouteWithTwoOptionalSegments : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)','GET');
    var params = router.first('/products/show','GET');
    assert.ok(params, this.fail);
    assert.equal(params.controller, 'Products', this.fail);
    assert.equal(params.action, 'show', this.fail);
    assert.equal(typeof(params.id), 'undefined', this.fail);
    assert.equal(typeof(params.format), 'undefined', this.fail);
    assert.equal(params.method, 'GET', this.fail);
  },

  testSimpleRouteWithTwoOptionalSegmentsWithFirstUsed : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)','GET');
    var params = router.first('/products/show/1','GET');
    assert.ok(params, this.fail);
    assert.equal(params.controller, 'Products', this.fail);
    assert.equal(params.action, 'show', this.fail);
    assert.equal(params.id, 1, this.fail);
    assert.equal(typeof(params.format), 'undefined', this.fail);
    assert.equal(params.method, 'GET', this.fail);
  },

  testSimpleRouteWithTwoOptionalSegmentsWithSecondUsed : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)','GET');
    var params = router.first('/products/show.html','GET');
    assert.ok(params, this.fail);
    assert.equal(params.controller, 'Products', this.fail);
    assert.equal(params.action, 'show', this.fail);
    assert.equal(typeof(params.id), 'undefined', this.fail);
    assert.equal(params.format, 'html', this.fail);
    assert.equal(params.method, 'GET', this.fail);
  },

  testSimpleRouteWithTwoOptionalSegmentsWithBothUsed : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)','GET');
    var params = router.first('/products/show/1.html','GET');
    assert.ok(params, this.fail);
    assert.equal(params.controller, 'Products', this.fail);
    assert.equal(params.action, 'show', this.fail);
    assert.equal(params.id, 1, this.fail);
    assert.equal(params.format, 'html', this.fail);
    assert.equal(params.method, 'GET', this.fail);
  },

// fuck, how repetitive. how about methods for a bit?
  
  testGET : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)','GET');
    var params = router.first('/products/show/1.html','GET');
    assert.ok(params, this.fail);
    assert.equal(params.method, 'GET', this.fail);
  },
  
  testPOST : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)','POST');
    var params = router.first('/products/show/1.html','POST');
    assert.ok(params, this.fail);
    assert.equal(params.method, 'POST', this.fail);
  },
  
  testPUT : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)','PUT');
    var params = router.first('/products/show/1.html','PUT');
    assert.ok(params, this.fail);
    assert.equal(params.method, 'PUT', this.fail);
  },
  
  testDELETE : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)','DELETE');
    var params = router.first('/products/show/1.html','DELETE');
    assert.ok(params, this.fail);
    assert.equal(params.method, 'DELETE', this.fail);
  },
  
// that was fun. Let's do a little resource testing
  
  testResourceMatches : function() {
    var routes = router.resource('SnowDogs');
    // index
    assert.ok( router.first('/snow_dogs','GET'), this.fail);
    assert.ok( router.first('/snow_dogs.html','GET'), this.fail);
    assert.equal( router.first('/snow_dogs','GET').action, 'index', this.fail);
    // show
    assert.ok( router.first('/snow_dogs/1','GET'), this.fail);
    assert.ok( router.first('/snow_dogs/1.html','GET'), this.fail);
    assert.equal( router.first('/snow_dogs/1','GET').action, 'show', this.fail);
    // add form
    assert.ok( router.first('/snow_dogs/add','GET'), this.fail);
    assert.ok( router.first('/snow_dogs/add.html','GET'), this.fail);
    assert.equal( router.first('/snow_dogs/add','GET').action, 'add', this.fail);
    // edit form
    assert.ok( router.first('/snow_dogs/1/edit','GET'), this.fail);
    assert.ok( router.first('/snow_dogs/1/edit.html','GET'), this.fail);
    assert.equal( router.first('/snow_dogs/1/edit','GET').action, 'edit', this.fail);
    // create
    assert.ok( router.first('/snow_dogs','POST'), this.fail);
    assert.ok( router.first('/snow_dogs.html','POST'), this.fail);
    assert.equal( router.first('/snow_dogs','POST').action, 'create', this.fail);
    // update
    assert.ok( router.first('/snow_dogs/1','PUT'), this.fail);
    assert.ok( router.first('/snow_dogs/1.html','PUT'), this.fail);
    assert.equal( router.first('/snow_dogs/1','PUT').action, 'update', this.fail);
    // delete
    assert.ok( router.first('/snow_dogs/1','DELETE'), this.fail);
    assert.ok( router.first('/snow_dogs/1.html','DELETE'), this.fail);
    assert.equal( router.first('/snow_dogs/1','DELETE').action, 'remove', this.fail);
  },

// url generation tiem nao

  testResourceUrlGeneration : function() {
    var routes = router.resource('SnowDogs');
    // index
    assert.equal( router.url( { controller:'SnowDogs', action:'index' } ), '/snow_dogs', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'index', format: 'html' } ), '/snow_dogs.html', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'index', format: 'json' } ), '/snow_dogs.json', this.fail);
    // show
    assert.equal( router.url( { controller:'SnowDogs', action:'show', id:1 } ), '/snow_dogs/1', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'show', id:1, format: 'html' } ), '/snow_dogs/1.html', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'show', id:1, format: 'json' } ), '/snow_dogs/1.json', this.fail);
    // add form
    assert.equal( router.url( { controller:'SnowDogs', action:'add' } ), '/snow_dogs/add', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'add', format: 'html' } ), '/snow_dogs/add.html', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'add', format: 'json' } ), '/snow_dogs/add.json', this.fail);
    // edit form
    assert.equal( router.url( { controller:'SnowDogs', action:'edit', id:1 } ), '/snow_dogs/1/edit', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'edit', id:1, format: 'html' } ), '/snow_dogs/1/edit.html', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'edit', id:1, format: 'json' } ), '/snow_dogs/1/edit.json', this.fail);
    // create
    assert.equal( router.url( { controller:'SnowDogs', action:'create' } ), '/snow_dogs', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'create', format: 'html' } ), '/snow_dogs.html', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'create', format: 'json' } ), '/snow_dogs.json', this.fail);
    // update
    assert.equal( router.url( { controller:'SnowDogs', action:'update', id:1 } ), '/snow_dogs/1', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'update', id:1, format: 'html' } ), '/snow_dogs/1.html', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'update', id:1, format: 'json' } ), '/snow_dogs/1.json', this.fail);
    // delete
    assert.equal( router.url( { controller:'SnowDogs', action:'remove', id:1 } ), '/snow_dogs/1', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'remove', id:1, format: 'html' } ), '/snow_dogs/1.html', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'remove', id:1, format: 'json' } ), '/snow_dogs/1.json', this.fail);

  },

  testRouteUrlGeneration : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)');
    assert.equal( router.url( { controller:'SnowDogs', action:'pet' } ), '/snow_dogs/pet', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'pet', id:5 } ), '/snow_dogs/pet/5', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'pet', id:5, format:'html' } ), '/snow_dogs/pet/5.html', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'pet', id:5, format:'json' } ), '/snow_dogs/pet/5.json', this.fail);
    assert.equal( router.url( { controller:'SnowDogs', action:'pet', format:'html' } ), '/snow_dogs/pet.html', this.fail);

  },

  testDefaultValues : function() {
    var route = router.match('/:controller/:action(/:id)(.:format)');
    assert.equal( router.url(), '/application/index', this.fail);
  }
  
}

for(e in RouterTests) {
  if (e.match(/test/)) {
    RouterTests.fail = "FAILED  :: " + e; 
    RouterTests.setup();
    RouterTests[e]();
    RouterTests.teardown(e)
  }
}