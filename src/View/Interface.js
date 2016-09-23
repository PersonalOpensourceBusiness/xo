import * as _ from 'Lodash';

export class Interface {
    constructor(board, model) {
        this.board = board;
        this.app = document.querySelector('#app');
        this.button = {}
        this.table;
        this.newGameButton;
        this.model = model;
    }
    init() {
        this.renderStartScreen();
    }

    renderStartScreen() {
        var tpl = _.template(document.querySelector('#start-screen').innerHTML);
        this.app.innerHTML = tpl({title: 'XO-unlimited'});

        this.button = {
            create: document.querySelector('#create'),
            join: document.querySelector('#join')
        }
    }

    renderSettingsScreen() {
        var tpl = _.template(document.querySelector('#settings-screen').innerHTML);
        this.app.innerHTML = tpl({title: 'XO-unlimited'});
        
        this.form = document.querySelector('form');
    }
    setConfig() {
        this.model.config = {
            size: document.querySelector('#size') ? document.querySelector('#size').value : '',
            cellSize: document.querySelector('#cellSize') ? document.querySelector('#cellSize').value : ''
        }
    }
    renderGameScreen(config) {
        var tmpl = _.template(document.querySelector('#game-screen').innerHTML);
        this.app.innerHTML = tmpl({
            title: 'XO',
            cellSize: config.cellSize * config.size,
            size: config.size,
            firstPlayer: {
                nick: '',
            },
            secondPlayer: {
                nick: '',
            }
        });
        this.board.board = document.querySelector('#board');
    }
    renderGameListScreen(data, cb) {
        var tmpl = _.template(document.querySelector('#list-screen').innerHTML);
        this.model.socket.getSize();

        this.model.socket.socket.on('size', (size) => {
            this.app.innerHTML = tmpl({
                rooms: data.data.rooms,
                size: size
            });
            this.button.create = document.querySelector('#create');
            this.table = document.querySelector('.js-list-screen-table');
            cb();
        })
        
    }
    
    renderFinishScreen(data) {
        var tmpl = _.template(document.querySelector('#end-screen').innerHTML);
        this.app.innerHTML = tmpl({
            title: 'Победили ' + data.win
        });
        this.newGameButton = document.querySelector('#end-screen-play');
    }
}