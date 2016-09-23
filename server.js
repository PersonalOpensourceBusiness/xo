var express = require('express');
var app = express();
var io = require('socket.io').listen(app.listen(process.env.PORT || 5000));
var rooms = [];
var ns = {}
ns.room;
ns.data = [];
ns.config = {};
ns.matrix = generateMatrix(15);
ns.who = ns.who === 'x' ? 'o' : 'x';
ns.score = {
    x: 0,
    y: 0
}
app.set('view engine', 'html');

app.get('/', function(req, res) {
    res.sendFile(__dirname, '/public');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    socket.on('user-connect', function(data) {
        socket.emit('update', socket.adapter.rooms);
    })
    
    socket.on('disconnect', function(data) {
        rooms.forEach(function(item, i) {
            for(var val in item) {
                if(item[val] === socket.id) {
                    delete rooms[i];
                }
            }
        })
    })

    socket.on('game:new', function(data) {
        socket.join(data.room);
        ns.data = data.matrix;
        rooms.push(data);
        ns.matrix = data.matrix;
        ns.config = data.config;
        socket.emit('game:wait');
        ns.who = ns.who === 'x' ? 'o' : 'x'
        ns.room = data.room;
    });

    socket.on('game:join', function(data) {
        socket.join(data.room);
        io.sockets.in(data.room).emit('game:init', {
            data: data.room,
            matrix: ns.data, 
            rooms: socket.adapter.rooms[data.room], 
            id: socket.id,
            who: ns.who,
            config: ns.config,
            room: data.room
        });
    })

    socket.on('game:config', function(data) {
        io.sockets.in(data.room).emit('game:start', data);
    })

    socket.on('game:move', function(data) {
        ns.matrix = mergeArrays(data.matrix);
        
        io.sockets.in(ns.room).emit('move', {
            matrix: ns.matrix,
            config: data.config,
            who: data.who
        });
    })
    socket.on('game:win', function(data) {
        ns.score[data]++;
        io.sockets.in(ns.room).emit('win', {
            win: data,
            config: ns.config    
        });
    })

    socket.on('game:reNew', function(data) {
        if(data.who === data.win) {
             socket.join(data.room);
            ns.matrix = generateMatrix(data.config.size);
            ns.config = data.config;
            socket.emit('game:wait');
            ns.who = ns.who === 'x' ? 'o' : 'x'
            ns.room = data.room;
        } else if(data.who !== data.win) {
             socket.join(data.room);
            io.sockets.in(data.room).emit('game:init', {
                data: data.room,
                matrix: ns.data, 
                rooms: socket.adapter.rooms[data.room], 
                id: socket.id,
                who: ns.who,
                config: ns.config,
                room: data.room
            });
        }
    });

    socket.on('get:size', function() {
        io.sockets.emit('size', ns.config.size);
    })
});

var mergeArrays = data => {
    var arr1 = data;
    var arr2 = ns.matrix;
    
    var result = [];
    for(var i = 0; i < arr1.length; i++) {
        result[i] = [];
        for(var j = 0; j < arr2.length; j++) {
            if(arr1[i][j] === arr2[i][j]) {
                result[i][j] = arr1[i][j] ? arr1[i][j] : arr2[i][j];
            } else if(arr1[i][j] !== arr2[i][j]) {
                if(!arr1[i][j]) {
                    result[i][j] = arr1[i][j] ? arr1[i][j] : arr2[i][j];
                } else {
                    result[i][j] = arr1[i][j] ? arr1[i][j] : arr2[i][j];
                }
            }
        }
    }
    return result;    
}

function generateMatrix(size) {
    var matrix = [];
    for (var i = 0; i < size; i++) {
        matrix[i] = [];
        for (var j = 0; j < size; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}