# groa-router

Router middleware for Groa gRPC framework.

[![NPM](https://nodei.co/npm/groa-router.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/groa-router/)

## Requirement

Node.js v7.6+ is required, the middleware system of Gora is based on async function.

## Installation

Install via NPM:

```shell
npm install groa-router --save
```

## Usage

Create a router to manage your gRPC service and corresponding methods:

```javascript
const Groa = require('groa');
const Router = require('groa-router');

const app = new Groa();
const router = new Router();

// Add proto file
app.addProto(__dirname + '/example.proto');

// package: example.foo
// service: Example1
// method: echo
router.rpc('/example.foo.Example1/Echo', async (ctx) => {

	console.log('Echo');
	ctx.body = ctx.req.body;
});

// Add router middleware
app.use(router.routes());

app.listen(50051, () => {
	console.log('Listening on port 50051');
});
```

__example.proto__

```proto
syntax = "proto3";

package example.foo;

service Example1 {
	rpc Ping(Echo) returns (Echo) {}
	rpc Echo(Echo) returns (Echo) {}
	rpc Hello(Hello) returns (Hello) {}
}

message Echo {
	string content = 1;
}

message Hello {
	string msg = 1;
}
```

## Router Prefixes

Route paths can be prefixed at the router level:

```javascript
// package: example.foo
// service: Example1
const router = new Router({
	prefix: 'example.foo.Example1'
});

// method: echo
router.rpc('echo', async (ctx) => {

	console.log('Echo');
	ctx.body = ctx.req.body;
});
```

## License
Licensed under the MIT License
 
## Authors
Copyright(c) 2017 Fred Chien（錢逢祥） <<cfsghost@gmail.com>>
