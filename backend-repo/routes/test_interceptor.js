const fs = require('fs');
const originalPut = require('./userRoutes').stack.find(r => r.route && r.route.path === '/me' && r.route.methods.put).route.stack.find(h => h.name !== 'verifyToken').handle;

module.exports = function overrideRoute() {
  const router = require('./userRoutes');
  const route = router.stack.find(r => r.route && r.route.path === '/me' && r.route.methods.put).route;
  const originalHandle = route.stack[route.stack.length - 1].handle;
  route.stack[route.stack.length - 1].handle = async (req, res, next) => {
    fs.appendFileSync(__dirname + '/put_log.txt', JSON.stringify({ body: req.body, user: req.user }) + '\n');
    return originalHandle(req, res, next);
  };
}
