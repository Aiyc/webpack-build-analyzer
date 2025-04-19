// class ResolvePlugin {
//
//     constructor() {}
//
//     apply(resolver) {
//         // resolver.getHook('resolve').tapAsync('ResolvePlugin', (request, context, callback) => {
//         //     console.log(request, context);
//         //     callback();
//         // });
//         // resolver.getHook('result').tapAsync('ResolvePlugin', (result, context, callback) => {
//         //     console.log(result, context);
//         //     callback();
//         // });
//         resolver.getHook('resolved').tapAsync('ResolvePlugin', (request, context, callback) => {
//             console.log('resolved', request.descriptionFilePath);
//             callback();
//         });
//     }
// }
//
// module.exports = ResolvePlugin;
