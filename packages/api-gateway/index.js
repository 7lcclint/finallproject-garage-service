const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const salt = 10;
const multer = require('multer');
const dayjs = require('dayjs');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ['POST', 'GET'],
  credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
  host: "34.143.179.46",
  user: "root",
  password: "1234",
  database: "garages",
  port: 3306
});

app.post('/register', function (req, res) {
  const sql = "INSERT INTO garages.user (`first_name`, `last_name`, `email`, `password`, `user_type`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({Error: "Error hashing password"});
    const VALUES = [
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      hash,
      1
    ]
    db.query(sql, [VALUES], (err, result) => {
      if (err) {
        console.log(err)
        return res.json({Error: "Error registering user"});
      }
      res.json({Status: "Successfully"});
    })
  })
})

const verify = (req, res, next) => {
  const token = req.cookies.token;
  /* console.log('token',token); */
  if(!token){
    return res.json({Error: "not authenticated."});
  }else{
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if(err){
        return res.json({Error: "Token is not valid"});
      }else{
        req.user_id = decoded.user_id;
        req.firstname = decoded.firstname;
        req.lastname = decoded.lastname;
        req.email = decoded.email;
        next();
      }
    })
  }
}

app.get('/', verify, function (req, res) {
  const sql = "SELECT * FROM garages.user WHERE email = ?";
  db.query(sql, [req.email], (err, data) => {
    if (err) return res.json({ Error: "Error retrieving phone" });
    if (data.length > 0) {
      return res.json({
        Status: 'Successfully', 
        firstname: req.firstname,
        lastname: req.lastname,
        user_id: data[0].user_id,
        email: req.email,
        phone: data[0].phone,
        profile_picture: data[0].profile_picture,
        address_street: data[0].address_street,
        address_province: data[0].address_province,
        address_district: data[0].address_district,
        address_subdistrict: data[0].address_subdistrict,
        address_zipcode: data[0].address_zipcode,
        user_type: data[0].user_type
      });
    } else {
      return res.json({ Error: "Phone not found" });
    }
  });
});

app.post('/login', function (req, res) {
  const sql = "SELECT * FROM garages.user WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) =>{
    if (err) return res.json({Error: "Login error on server"});
    if (data.length == 0) return res.json({Error: "User not found"});
    if (data.length > 0) {
      const user_id = data[0].user_id;
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, result) => {
        if (err) return res.json({Error: "Passwords compare error"});
        if(result){
          const firstname = data[0].first_name;
          const lastname = data[0].last_name;
          const email = data[0].email;
          const token = jwt.sign({ firstname, lastname, email, user_id}, "jwt-secret-key", { expiresIn: '1d' });
          res.cookie("token", token);
          return res.json({Status: "Successfully"});
        }else{
          return res.json({Error: "Passwords do not match"});
        }
      })
    }else{
      return res.json({Error: "No email exists"});
    }
  });
});

app.get('/logout', (req, res) => {
  res.clearCookie("token");
  return res.json({Status: "Successfully"});
})

app.get('/reservations', verify, (req, res) => {
  const user_id = req.user_id;
  console.log('user id: ', user_id)
  const sql = 'SELECT reserve.*, user.* FROM reserve INNER JOIN user ON user.user_id = reserve.user_id WHERE user.user_id = ?';
  db.query(sql, [user_id], (err, data) => {
    if (err) {
      console.error('Error executing the SQL query:', err);
      return res.status(500).json({ error: 'Error retrieving reservations' });
    }
    console.log('Query results:', data);
    res.status(200).json(data);
  });
});

app.post('/bookqueue', (req, res) => {
  const { user_id, vehicle_reg, reserve_date, detail } = req.body;

  const parsedDate = dayjs(reserve_date, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const sql = 'INSERT INTO reserve (user_id, vehicle_reg, reserve_date, detail) VALUES (?, ?, ?, ?)';
  const values = [user_id, vehicle_reg, parsedDate, detail];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data: ' + err.message);
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

app.put('/updateUser', (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    subdistrict,
    district,
    province,
    zipcode,
    street,
    userId, // You'll need some way to identify the user, like their user ID
  } = req.body;

  const sql = `
    UPDATE users 
    SET 
      firstName = ?,
      lastName = ?,
      phone = ?,
      subdistrict = ?,
      district = ?,
      province = ?,
      zipcode = ?,
      street = ?
    WHERE
      userId = ?
  `;

  const values = [
    firstName,
    lastName,
    phone,
    subdistrict,
    district,
    province,
    zipcode,
    street,
    userId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating user data:', err.message);
      res.status(500).json({ error: 'Error updating user data' });
    } else {
      console.log('User data updated successfully');
      res.status(200).json({ message: 'User data updated successfully' });
    }
  });

})

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.listen(3456, () => {
  console.log("Server running on port 3456");
});