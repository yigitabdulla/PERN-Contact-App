const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

app.use(cors())
app.use(express.json());

app.get('/contacts/:user_id', async (req,res) => {

    const user_id = req.params.user_id

    try {
        const response = await pool.query('SELECT * FROM contacts WHERE user_id = $1 ORDER BY contact_id', [user_id])
        res.json(response.rows)
        
    } catch (error) {
        console.error(error)
    }
})

app.post('/contacts', async (req,res) => {
    const {user_id,first_name,last_name,phone} = req.body
    
    try {
        await pool.query(`INSERT INTO contacts(user_id,first_name,last_name,phone) values($1,$2,$3,$4)`,
        [user_id,first_name,last_name,phone])
        res.status(200).json('Item added!')
    } catch (error) {
        console.error(error)
    }
})

app.put("/contacts/update/:id", async (req,res) => {
    try {
        const id = req.params.id
        const updatedName = req.body.updatedName
        const updatedSurname = req.body.updatedSurname
        const updatedNumber = req.body.updatedNumber
        console.log(id,updatedName,updatedSurname,updatedNumber)
        await pool.query('UPDATE contacts SET first_name = $1, last_name = $2, phone = $3 WHERE contact_id = $4',
        [updatedName,updatedSurname,updatedNumber,id])
        res.status(200).json('Item updated');
    } catch (error) {
        res.json(error)
    }
})

app.delete("/contacts/delete/:id", async (req,res) => {
    try {
        const id = req.params.id
        await pool.query('DELETE FROM contacts WHERE contact_id = $1',[id])
        res.status(200).json('Item Deleted');
    } catch (error) {
        res.json(error)
    }
})

app.post("/auth/login", async (req,res) => {
    const {username,password} = req.body
    const users = await pool.query('SELECT * FROM users WHERE username = $1',[username])
    if(!users.rows.length) {
        return res.json({ message: "User doesn't exists" });
      }
    isPasswordValid = await bcrypt.compare(password,users.rows[0].password_hash)
    console.log(isPasswordValid)
    if(!isPasswordValid) {
        return res.json({message: "Incorrect password!"})
      }

    const token = jwt.sign({id: users.rows[0].user_id}, "secret")
    res.json({token,userID:users.rows[0].user_id})
    
})

app.post("/auth/register", async (req,res) => {
    const {username,password} = req.body
    const users = await pool.query('SELECT * FROM users WHERE username = $1',[username])
    
    if(users.rows.length) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password,10)

    try {
        await pool.query(`INSERT INTO users(username,password_hash) values($1,$2)`,
        [username,hashedPassword])
        res.status(200).json('Item added!')
    } catch (error) {
        console.error(error)
    }

})

app.listen(8000, () => console.log("Server is running on port 8000"))

