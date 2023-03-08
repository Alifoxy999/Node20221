// -- EVENT --
// const event = require('node:events');
//
// const eventEmitter = new event();
//
// eventEmitter.on('click', ()=>{
//   console.log('Click click click');
// });
//
// eventEmitter.emit('click')
//
// eventEmitter.emit('click')
// eventEmitter.emit('click')
// eventEmitter.emit('click')
//
// eventEmitter.once('clickAndDie', ()=>{
//   console.log("I'm gonna die after being called");
// })
// console.log(eventEmitter.eventNames());
//
// eventEmitter.emit('clickAndDie');
//
// eventEmitter.emit('clickAndDie');
// eventEmitter.emit('clickAndDie');
// eventEmitter.emit('clickAndDie');
// eventEmitter.emit('clickAndDie');
//
// console.log(eventEmitter.eventNames());


// -- STREAMS --
// const fs = require('fs');
// const path = require("path");
//
// const readStream = fs.createReadStream(path.join('test', 'text3.txt'));
// const writeStream = fs.createWriteStream(path.join('test', 'text2.txt'))

// read, write, duplex, transform --- types of streams !!!

// readStream.on('data', (chunk) => {
//   writeStream.write(chunk);
// });

// const handleError = () => {
//   console.error('ERROR!!!');
//   readStream.destroy();
//   writeStream.end('ERROR WHILE READING FILE');
// }
//
// readStream
//   .on('error', handleError)
//   .pipe(writeStream)
//   .on('error', handleError);

// -- EXPRESS --

const express = require('express');
const user_service = require('./users/user_service');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get('/users', async(req, res)=>{
    const users = await user_service.reader();
    res.json(users);
});

app.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;

    const users = await user_service.reader();
    const user = users.find((user) => user.id === +userId);

    if (!user) {
        res.status(422).json(`User with id: ${userId} not found`);
    }

    res.json(user);
});


app.post('/users', async (req, res) => {
    const { name, age, gender } = req.body;

    if (!name || name.length < 2) {
        res.status(400).json('Wrong name');
    }
    if (!age || !Number.isInteger(age) || Number.isNaN(age)) {
        res.status(400).json('Wrong age');
    }
    if (!gender || (gender !== 'male' && gender !== 'female')) {
        res.status(400).json('Wrong gender');
    }

    const users = await user_service.reader();
    const newUser = { id: users[users.length - 1]?.id + 1 || 1, name, age, gender };

    users.push(newUser);
    await user_service.writer(users);
    res.status(201).json(newUser);
});


app.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, age, gender } = req.body;

    if (name && name.length < 2) {
        res.status(400).json('Wrong name');
    }
    if (age && !Number.isInteger(age) || Number.isNaN(age)) {
        res.status(400).json('Wrong age');
    }
    if (gender && (gender !== 'male' && gender !== 'female')) {
        res.status(400).json('Wrong gender');
    }

    const users = await user_service.reader();
    const index = users.findIndex((user) => user.id === +userId);

    if (index === -1) {
        res.status(422).json(`User with id: ${userId} not found`);
    }
    users[index] = { ...users[index], ...req.body };

    await user_service.writer(users);
    res.status(201).json(users[index]);
});

app.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;

    const users = await user_service.reader();
    const index = users.findIndex((user) => user.id === +userId);
    if (index === -1) {
        res.status(422).json(`User with id: ${userId} not found`);
    }

    users.splice(index, 1);
    await user_service.writer(users);

    res.sendStatus(204);
});

app.get('/welcome', (req, res)=>{
    res.send('WELCOME');
});


// app.post()
// app.put()
// app.patch()
// app.delete()

const PORT = 5100;

app.listen(PORT, ()=>{
    console.log(`Server has started on PORT ${PORT} 🚀`);
});
