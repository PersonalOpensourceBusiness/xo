import * as _ from 'Lodash';

export class Board {
    constructor(model) {
        this.board;
        this.ctx;
        this.model = model;
    }
    
    initBoard(config) {
        this.ctx = this.board.getContext('2d');
        this.ctx.clearRect(0,0,this.board.width, this.board.height);
        this.ctx.beginPath();
        this.drowBoard(config);
    }

    renderBoard(matrix, config) {
        var ctx = this.ctx;
        ctx = this.board.getContext('2d');
        ctx.clearRect(0,0,this.board.width, this.board.height);
        ctx.beginPath();
        this.drowBoard(config);
        for(let n = 0; n < matrix.length; n++) {
            for(let m = 0; m < matrix[n].length; m++) {
                if(matrix[n][m] === 'x') {
                    this.renderX(n, m, config);
                } else if(matrix[n][m] === 'o') {
                    this.renderO(n, m, config);
                }
            }    
        }
    }
    drowBoard(config) {
        var ctx = this.ctx;
        
         for(let i = 0; i <= config.size; i++) {
            ctx.moveTo(config.cellSize * i, 0);
            ctx.lineTo(config.cellSize * i, config.cellSize * config.size);
        }
        for(let j = 0; j <= config.size; j++) {
            ctx.moveTo(0, config.cellSize * j);
            ctx.lineTo(config.cellSize * config.size, config.cellSize * j);
        }
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#9E9E9E"
        ctx.stroke();
        
        
    }
    renderO(n, m, config) {
        var ctx = this.ctx;
        var cell = config.cellSize;
        var halfCell = config.cellSize / 2;
        var mCell = m * cell;
        var nCell = n * cell;

        ctx.beginPath();
        ctx.arc(mCell + halfCell, nCell + halfCell, halfCell - 3, 0, Math.PI * 2);
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#EF5350';
        ctx.stroke();
    }
    
    renderX(n, m, config) {
        var ctx = this.ctx;
        var cell = +config.cellSize;
        var mCell = m * cell;
        var nCell = n * cell;
        ctx.beginPath();
        ctx.moveTo(mCell + 3, nCell + 3);
        ctx.lineTo(mCell + cell - 3, (nCell + cell) - 3);
        ctx.moveTo(mCell + cell - 3, nCell + 3);
        ctx.lineTo(mCell + 3, nCell + cell - 3);
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#009688';
        ctx.stroke();
    }
}

