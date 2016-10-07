import * as _ from 'Lodash';
import io from 'socket.io-client';

export class Socket {
    constructor(matrix, game, config) {
        this.socket = io('http://localhost:5000');
        this.matrix = matrix;
        this.game = game;
        this.config = config;
        this.who;
        this.room;
        this.informer;
        this.rooms;
        this.size;
    }

    init() {
        this.socket.on('connect', () => {
           this.socket.emit('user-connect', this.socket.io.engine.id);
        });
        
        this.socket.on('disconnect', () => {
           this.socket.emit('user-disconnect', 'DISCONNECTED:' + this.socket.io.engine.id);
        })

        this.socket.on('game:init', (data) => {
            this.game.init();
            
            if(data.id.substr(2) === this.socket.id) {
               this.who = data.who === 'x' ? 'o' : 'x';
            } else {
               this.who = data.who === 'x' ? 'x' : 'o';
            }
            console.log(data, this.game.inGame);
            this.rooms = data.rooms;
            this.game.inGame = true;
            if(Object.keys(this.game.config).length) this.socket.emit('game:config', {
                config: data.config, 
                matrix: data.matrix,
                data: data.room,
                rooms: data.rooms, 
                id: data.id,
                who: data.who,
                room: data.room
            });
        })

        this.socket.on('click', ()=> {
            document.querySelector('audio').play();
        })
    }
    gameWatchers(render, config) {
        this.model.socket.socket.on('game:start', (data) => {
            this.config = data.config;
            this.view.interface.setConfig();
            this.view.interface.renderGameScreen(data.config);
            this.model.settings.init(data.config);
            this.view.board.initBoard(data.config);
            this.view.board.board.addEventListener('mousemove', (e) => this.model.game.handleMove(e, data.config));

            this.view.board.board.addEventListener('click', (e) => {
                if(this.model.socket.who === this.model.game.who && this.model.game.inGame) {
                    this.model.game.handleClick(e, this.view.board, data.config, this.model.socket, data.room)
                }
            });
        })
    }
    moveWathcers(config) {
        this.model.socket.socket.on('move', (data) => {
            this.model.game.who = data.who;
            this.model.socket.matrix.matrix = data.matrix;
            this.view.board.renderBoard(data.matrix, data.config);
        });
    }
    createRoom() {
        var room = `room${Math.floor(Math.random() * 1010001101)}`;
        return room;
    }

    newGame(informer, config) {
        var room = this.createRoom();
        this.room = room;
        this.socket.emit('game:new', { id: this.socket.id, room: room, matrix: this.matrix.matrix, config: config});
        this.socket.on('game:wait', () => {
            informer.wait();
        })
    }

    joinGame(data) {

        this.room = data;
        this.socket.emit('game:join', { 
            room: data,
            config: this.game.config
        });
    }

    move(matrix, config, room) {
        this.game.who = this.game.who === 'x' ? 'o' : 'x';
        this.socket.emit('game:move', {
            matrix: matrix,
            config: config,
            who: this.game.who, 
            room: room
        })
        console.log(this.informer.info());
    }

    getSize() {
        this.socket.emit('get:size');
    }
    
    
}