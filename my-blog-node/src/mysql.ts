const mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chihiro123',
  database: 'blog',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('连接成功');
});
export default connection;
