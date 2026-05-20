const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/me',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + require('jsonwebtoken').sign({ id: '4f528003-7835-4c7b-9bfd-0304a7ff0a68', role: 'student' }, process.env.JWT_SECRET || 'supersecretkey')
  }
}, res => {
  let data = '';
  res.on('data', c => data+=c);
  res.on('end', () => console.log('Resp:', data));
});
req.write(JSON.stringify({ phone: '', university: '' }));
req.end();
