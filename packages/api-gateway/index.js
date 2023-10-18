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
const router = express.Router();

const app = express();
app.use(express.json());
app.use('/', router);
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ['POST', 'GET', 'PUT'],
  credentials: true
}));
app.options('/reservationsByStatusAccept', cors());
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
      req.body.usertype
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
        req.user_type = decoded.user_type;
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
      const user_type = data[0].user_type;
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, result) => {
        if (err) return res.json({Error: "Passwords compare error"});
        if(result){
          console.log(result);
          const firstname = data[0].first_name;
          const lastname = data[0].last_name;
          const email = data[0].email;
          const token = jwt.sign({ firstname, lastname, email, user_id, user_type }, "jwt-secret-key", { expiresIn: '1d' });
          res.cookie("token", token);
          return res.json({Status: "Successfully", user_type });
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

app.get('/allReservations', verify, (req, res) => {
  const user_id = req.user_id;
  console.log('user id: ', user_id)
  const sql = `
    SELECT user.first_name,
           user.last_name,
           reserve.vehicle_reg,
           reserve.reserve_date,
           reserve.detail,
           reserve.status,
           reserve.reserve_id
    FROM reserve
    INNER JOIN user ON user.user_id = reserve.user_id
    where user.user_type not in(2,3)
  `;
  db.query(sql, (err, data) => {
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

app.put('/update-user-data', verify, (req, res) => {
  const {user_id,firstName,lastName,phone,email,street,province,district,subdistrict,zipcode} = req.body;
  const sql = `
    UPDATE garages.user
    SET first_name = ?,
        last_name = ?,
        phone = ?,
        email = ?,
        address_street = ?,
        address_province = ?,
        address_district = ?,
        address_subdistrict = ?,
        address_zipcode = ?
    WHERE user_id = ?;
  `;

  const values = [
    firstName,
    lastName,
    phone,
    email,
    street,
    province,
    district,
    subdistrict,
    zipcode,
    user_id,
  ];

  console.log('SQL Query:', sql);
  console.log('Values:', values);
  console.log(values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating user data:', err);
      return res.status(500).json({ error: 'Error updating user data' });
    } else if (result.changedRows === 0) {
      console.error('No rows were updated');
      return res.status(500).json({ error: 'No rows were updated' })
    } else {
      console.log('User data updated successfully');
      return res.status(200).json({ message: 'User data updated successfully' });
    }
  });
});

app.get('/getCustomers', verify, function (req, res) {
  const userTypeId = 2;
  const sql = "SELECT * FROM garages.user WHERE user_type = ?";
  db.query(sql, [userTypeId], (err, data) => {
    if (err) return res.json({ Error: "Error retrieving phone" });
    if (data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.json({ Error: "Phone not found" });
    }
  });
});

app.get('/repairData', verify, (req, res) => {
  const sql = `
    SELECT
      repair.repair_id,
      user.first_name,
      user.last_name,
      repair.full_service,
      repair.discount_service,
      DATE_FORMAT(repair.repair_date, '%Y-%m-%d') AS repair_date,
      repair.repair_detail,
      repair.repair_status,
      promotion.promotion_name
    FROM
      user
    INNER JOIN repair ON user.user_id = repair.user_id
    INNER JOIN promotion ON promotion.promotion_id = repair.promotion_id
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error executing the SQL query:', err);
      return res.status(500).json({ error: 'Error retrieving repair data' });
    }
    console.log('Query results:', data);
    res.status(200).json(data);
  });
});

app.put('/updateRepairData/:repairId', (req, res) => {
  const repairId = req.params.repairId;
  const { repair_status } = req.body;

  const sql = `
    UPDATE repair
    SET repair_status = ?
    WHERE repair_id = ?;
  `;

  const values = [repair_status, repairId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating repair data:', err);
      return res.status(500).json({ error: 'Error updating repair data' });
    } else if (result.changedRows === 0) {
      console.error('No rows were updated');
      return res.status(500).json({ error: 'No rows were updated' });
    } else {
      console.log('Repair data updated successfully');
      return res.status(200).json({ message: 'Repair data updated successfully' });
    }
  });
});

app.put('/updateReserveData/:reserve_id', (req, res) => {
  const reserve_id = req.params.reserve_id;
  const { status } = req.body;

  const sql = `
    UPDATE reserve
    SET status = ?
    WHERE reserve_id = ?;
  `;

  const values = [status, reserve_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating reserve data:', err);
      return res.status(500).json({ error: 'Error updating reserve data' });
    } else if (result.changedRows === 0) {
      console.error('No rows were updated');
      return res.status(500).json({ error: 'No rows were updated' });
    } else {
      console.log('reserve data updated successfully');
      return res.status(200).json({ message: 'reserve data updated successfully' });
    }
  });
});

app.get('/reservationsByStatusAccept', (req, res) => {
  const procedureName = 'GetReservationsByStatusAccept'; 

  db.query(`CALL ${procedureName}`, (err, data) => {
    if (err) {
      console.error('Error executing the stored procedure:', err);
      return res.status(500).json({ error: 'Error calling the stored procedure' });
    }
    console.log('Stored procedure results:', data);
    res.status(200).json(data[0]); 
  });
});

app.get('/getPromotions', (req, res) => {

  db.query(`SELECT promotion_id, promotion_name, promotion_detail, 
            promotion_code, money, percent, 
            DATE_FORMAT(start_date, '%d-%m-%Y') AS start_date, 
            DATE_FORMAT(end_date, '%d-%m-%Y') AS end_date, 
            promotion_status 
          FROM promotion`, (err, data) => {
    if (err) {
      console.error('Error executing the stored procedure:', err);
      return res.status(500).json({ error: 'Error calling the stored procedure' });
    }
    console.log('Stored procedure results:', data);
    res.status(200).json(data); 
  });
});

app.post('/insertPromotion', (req, res) => {
  const {
      promotion_name,
      promotion_detail,
      promotion_code,
      money,
      percent,
      start_date,
      end_date
  } = req.body;

  const insertQuery = `INSERT INTO promotion (promotion_name, promotion_detail, promotion_code, money, percent, start_date, end_date, promotion_status)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
      promotion_name,
      promotion_detail,
      promotion_code,
      money,
      percent,
      start_date,
      end_date,
      1
  ];

  db.query(insertQuery, values, (err, result) => {
      if (err) {
          console.error('Database insertion error: ' + err.message);
          res.status(500).json({ error: 'Database insertion failed' });
      } else {
          console.log('Record inserted successfully');
          res.status(200).json({ message: 'Record inserted successfully' });
      }
  });
});

app.put('/update-promotion/:promotionId', (req, res) => {
  const { promotionId } = req.params;
  const { promotionStatus } = req.body;

  const sql = `UPDATE promotion SET promotion_status = ? WHERE promotion_id IN (?)`;

  db.query(sql, [promotionStatus, promotionId], (err, result) => {
    if (err) {
      console.error('Error updating promotion status:', err);
      res.status(500).send('Error updating promotion status');
    } else {
      console.log('Promotion status updated successfully');
      res.status(200).send('Promotion status updated successfully');
    }
  });
});

app.get('/fullReports', (req, res) => {
  db.query('CALL fullReports()', (error, results) => {
    if (error) {
      console.error('เกิดข้อผิดพลาดในการเรียก Stored Procedure: ' + error);
      res.status(500).json({ error: 'พบข้อผิดพลดในการเรียก Stored Procedure' });
    } else {
      const formattedResults = results[0].map(result => ({
        ...result,
        repair_date: result.repair_date.toISOString().split('T')[0],
      }));
      res.json(formattedResults);
    }
  });
});

app.get('/fullReportsByStartEnd', (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    res.status(400).json({ error: 'โปรดระบุวันที่เริ่มต้นและวันที่สิ้นสุด' });
    return;
  }

  db.query('CALL fullReportsByStartEnd(?, ?)', [start_date, end_date], (error, results) => {
    if (error) {
      console.error('เกิดข้อผิดพลาดในการเรียก Stored Procedure: ' + error);
      res.status(500).json({ error: 'พบข้อผิดพลดในการเรียก Stored Procedure' });
    } else {
      const formattedResults = results[0].map(result => ({
        ...result,
      }));
      res.json(formattedResults);
    }
  });
});


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
