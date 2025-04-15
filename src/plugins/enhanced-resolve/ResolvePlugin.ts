class ResolvePlugin {

    constructor() {}

    apply(resolver) {
        resolver.getHook('resolve').tapAsync('ResolvePlugin', (request, context, callback) => {
            console.log('ResolvePlugin resolved');
            callback();
        });
    }
}

module.exports = ResolvePlugin;