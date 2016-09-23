import * as _ from 'Lodash';
import { Matrix } from './Matrix';
import { Game } from './Game';
import { Settings } from './Settings';
import { Socket } from './Socket';

export class Model {
    constructor() {
        this.config = {};
        this.matrix = new Matrix();
        this.game = new Game(this.matrix, this.config);
        this.settings = new Settings(this.matrix, this.config);
        this.socket = new Socket(this.matrix, this.game, this.config);
    }

    init() {
        this.matrix.init();
        this.socket.init();
    }
    
}