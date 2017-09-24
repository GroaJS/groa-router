const debug = require('debug')('groa:router');

const _next = async function(ctx, middlewares, next) {

	let i = middlewares.next();
	if (i.done == true) {
		return await next();
	}

	return await i.value(ctx, _next.bind(this, ctx, middlewares, next));
};

module.exports = class Router {

	constructor(opts = {}) {
		this.opts = opts;
		this.paths = {};

		if (this.opts.prefix && this.opts.prefix.charAt(0) !== '/') {
			this.opts.prefix = '/' + this.opts.prefix;
		}
	}

	routes() {

		// middleware
		let fn = async (ctx, next) => {

//			ctx.app.constructor.status;

			// Find path
			let middlewares = this.paths[ctx.path];
			if (middlewares === undefined) {
				// Not implemented
				return await next();
			}

			let iterator = middlewares[Symbol.iterator]();

			await _next(ctx, iterator, next);
		}

		fn.router = this;

		return fn;
	}

	use(...args) {

		if (args.length === 0)
			throw new Error('required router');

		let prefix;
		if (args[0] instanceof String) {
			prefix = args.shift();
		}

		args.forEach((fn) => {

			Object.entries(fn.router.paths).forEach(([ objPath, middlewares ]) => {
				let applyMiddlewares;

				if (prefix) {
					applyMiddlewares = this.rpc.bind(this, prefix + '/' + objPath);
				} else {
					applyMiddlewares = this.rpc.bind(this, objPath);
				}

				applyMiddlewares.apply(this, middlewares);
			});
			
		});
	}

	rpc(objPath, ...middlewares) {

		let _objPath = objPath;
		if (objPath.charAt(0) !== '/')
			_objPath = '/' + objPath;

		let _path = (this.opts.prefix) ? this.opts.prefix + _objPath : _objPath;

		debug('Add path:', _path);

		if (this.paths[_path] === undefined) {
			this.paths[_path] = middlewares;
			return;
		}

		this.paths[_path] = middlewares;
	}
};
