import * as _ from 'Lodash';
import { Board } from './Board';
import { Informer } from './Informer';
import { Interface } from './Interface';

export class View {
    constructor(model) {
        this.model = model;
        this.app = document.querySelector('#app');
        this.board = new Board(this.model);
        this.informer = new Informer(this.model);
        this.interface = new Interface(this.board, this.model);
        this.createButton = this.interface.button.create;
    }

    init() {
        this.interface.init();
    }
    
}