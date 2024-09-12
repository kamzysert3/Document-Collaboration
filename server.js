require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const document = require('./models/Documents');
const mongoose = require('mongoose');
const server = require('socket.io').Server;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000

app.use('/', require('./routes/routes'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));


const expressServer = app.listen(PORT, (err, req, res) => {
    if (err) throw err;
    console.log(`Server is running on port ${PORT}`);
})

const io = new server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5501", "http://127.0.0.1:5501"],
    },
    pingInterval: 60000,
    pingTimeout: 60000
})

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joindocument', (data) => {
        socket.join(data.documentID);
    });

    socket.on('updatecontent', async (data) => {
        await document.findOneAndUpdate({id: data.documentID}, { content: data.content }, { new: true });
        socket.to(data.documentID).emit('updatecontent', {content: data.content});
    });

    socket.on('updatetitle', async (data) => {
        await document.findOneAndUpdate({id: data.documentID}, { title: data.title }, { new: true });
        socket.to(data.documentID).emit('updatetitle', {title: data.title});
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})