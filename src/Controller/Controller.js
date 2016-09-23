export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.rooms;
        this.room;
    }
    
    init() {
        this.view.init();
        this.events();
    }

    events() {
        this.onInit();
        this.watchers();
        this.model.socket.moveWathcers.call(this, this.model.config)
    }

    onInit() {
        this.view.interface.button.create.addEventListener('click', () => this.onStartScreen());
        this.view.interface.button.join.addEventListener('click', () => this.onGameListScreen(this.model.socket.config));
    }
    watchers() {
        this.model.socket.socket.on('update', (data) => {
            this.model.socket.informer = this.view.informer;
            let result = [];
            let rooms = Object.keys(data).filter(item=>item.includes('room'));
            rooms.map(item=>result.push({
                id: item, 
                socket: Object.keys(data[item].sockets)[0].substring(2),
                players: Object.keys(data[item].sockets).length
            }))
            this.rooms = result;
        });

        this.model.socket.socket.on('win', (data) => {
            this.view.interface.renderFinishScreen(data);
            this.view.interface.newGameButton.addEventListener('click', () => {
                this.model.matrix.matrix = this.model.matrix.generateMatrix(data.config.size);
                this.view.interface.renderGameScreen(data.config);
                this.model.settings.init(data.config);
                this.view.board.initBoard(data.config);
                this.model.socket.socket.emit('game:reNew', {win: data.win, config: data.config, room: data.room, who: this.model.socket.who});
                this.view.board.board.addEventListener('mousemove', (e) => this.model.game.handleMove(e, data.config));
                this.view.board.board.addEventListener('click', (e) => {
                if(this.model.socket.who === this.model.game.who && this.model.game.inGame) {
                    this.model.game.handleClick(e, this.view.board, data.config, this.model.socket, this.room)
                }
                });
            });
        });
    }
    onGameListScreen(config) {
        this.view.interface.renderGameListScreen({
            data: {
                rooms: this.rooms,
                size: config.size    
            }
        }, ()=>{
            this.view.interface.table.addEventListener('click', e=>{
                if(!e.target.parentNode.classList.contains('js-list-screen-row')) return;
                this.room = e.target.parentNode.dataset.room;
                
                this.model.socket.gameWatchers.call(this)
                this.model.socket.joinGame(e.target.parentNode.dataset.room);
            })
            this.view.interface.button.create.addEventListener('click', () => this.onStartScreen());
        });
        
        
    }
    
    onStartScreen() {
        this.view.interface.renderSettingsScreen();
        this.model.game.setConfig();
        this.view.interface.form.addEventListener('submit', (e) => this.onSettingsScreen(e));
    }

    onSettingsScreen(e) {
        e.preventDefault();
        this.model.game.setConfig();
        this.model.matrix.matrix = this.model.matrix.generateMatrix(this.model.game.config.size);
        this.model.socket.newGame(this.view.informer, this.model.game.config);
        this.view.interface.renderGameScreen(this.model.game.config);
        this.model.settings.init(this.model.game.config);
        this.view.board.initBoard(this.model.game.config);
        this.view.board.board.addEventListener('mousemove', (e) => this.model.game.handleMove(e, this.model.game.config));
        this.view.board.board.addEventListener('click', (e) => {
            
            if(this.model.socket.who === this.model.game.who && this.model.game.inGame) {
                this.model.game.handleClick(e, this.view.board, this.model.game.config, this.model.socket, this.room);
            }
        });
    }

    
    
}