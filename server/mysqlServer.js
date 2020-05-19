const MySQLEvents = require('@rodrigogs/mysql-events');
const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs'); //used for authentication with crypted password 
const port1 = 3000; //used to get response from related query for MySql DB
const port2 = 3001; //used to get notified for changes on MySql DB

const program = async () => {
  const dbConfig = {
    host: 'ip-of-our-mysql-server',
    port: '3306',
    user: 'omercan',
    password: '1234',
    database: 'HIHTS'
  };
  
  
  
  
  // configurations of express instances

  
  
  const myInstance = new MySQLEvents(connection, {
    startAtEnd: true
  });

  await myInstance.start()
    .then(() => console.log('I\'m running!'))
    .catch(err => console.error('Something bad happened', err));

  channel.on('connection', (socket) => {
    console.log('connected for socketio');
  });

  myInstance.addTrigger({
    name: 'EMPLOYEE_PATIENT_TRIGGER',
    expression: 'HIHTS.employee_patient',
    statement: MySQLEvents.STATEMENTS.INSERT,
    onEvent: (event) => {
      let updatedData = [];
      event.affectedRows.map((data) => {
        updatedData = [...updatedData, { updatedEmployeeId: data.after.employee_id, updatedPatientId: data.after.patient_id, after: true }];
      });
      channel.emit('employee_patient_insert', { updatedData });
    }
  });
  
  
  
  // other triggers on MySql
  


  myInstance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  myInstance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

  app.get('/', (req, res) => {
    return res.send({ error: true, message: 'hello' });
  });

  app.post('/employeeForLogin/', async (req, res) => {
    let retUser = {};
    let retData = [];
    console.log('Connected!');
    const data = { username: req.body.username, password: req.body.password };
    const sql1 = `SELECT * FROM employees WHERE employee_username="${data.username}"`;
    await connection.query(sql1, (error, results) => {
      if (error) throw error;
      else {
        results.map((user) => {
          if (bcrypt.compareSync(data.password, user.employee_password)) {
            retUser = { employee_id: user.employee_id,
                        employee_personel_no: user.employee_personel_no,
                        employee_firstname: user.employee_firstname,
                        employee_lastname: user.employee_lastname,
                        employee_username: user.employee_username,
                        employee_password: user.employee_password,
                        valid: true };
            retData.push(retUser);
          }
        });
        res.send(retData);
      }
    });
  });
  
  // 397 lines of code for other routes that used by mobile app

  appServer.listen(port2, () => {
    console.log('You can get notified when data changed');
  })

  app.listen(port1, () => {
   console.log('You can see the data.');
  });
}

program()
  .then(() => console.log('Waiting for database events...'))
  .catch(console.error);
