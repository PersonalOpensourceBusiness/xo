import * as _ from 'Lodash';
var getMousePos;

export class Game {
    constructor(matrix, config) {
        this.matrix = matrix;
        this.x;
        this.y;
        this.pos;
        this.who = 'x';
        this.config = config;
        this.inGame = false;
        getMousePos = (canvas, evt) => {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    }
    init() {
        
    }
    setConfig() {
        this.config = {
            size: document.querySelector('#size').value,
            cellSize: document.querySelector('#cellSize').value
        }
    }

    handleClick(e, board, config, socket, room, informer) {
        var result = 0;
        socket.socket.emit('audio:click');
        
        this.cells = config.size * config.size;
        if(!this.matrix.matrix[this.y][this.x]) {
            this.matrix.matrix[this.y][this.x] = this.who;
            socket.move(socket.matrix.matrix, config, room);
            this.matrix.matrix.map( arr => {
                result += arr.filter((item) =>  (this.who === 'x' ? 'o' : 'x') === item).length;
            })
            this.checkWin(socket, result);
        }
        
        
    }
    handleMove(e, config) {
        this.pos = getMousePos(e.target, e);
        this.x = Math.floor(this.pos.x / config.cellSize);
        this.y = Math.floor(this.pos.y / config.cellSize);
    }

    checkWin(socket, result) {
        let winLine = ['', '', '', ''];
        let fromRight = Math.min(this.matrix.matrix[this.y].length - this.x - 1, 4);
        let fromLeft = Math.min(this.x, 4);
        let fromTop = Math.min(this.y, 4);
        let fromBottom = Math.min(this.matrix.matrix.length - this.y - 1, 4);
        for(let i = this.x - fromLeft; i <= this.x + fromRight; i++)
            winLine[0] += this.matrix.matrix[this.y][i];

        for(let i = this.y - fromTop; i <= this.y + fromBottom; i++)
            winLine[1] += this.matrix.matrix[i][this.x];

        for(let i = -Math.min(fromTop, fromLeft); i <= Math.min(fromBottom, fromRight); i++)
            winLine[2] += this.matrix.matrix[this.y + i][this.x + i];

        for(let i = -Math.min(fromBottom, fromLeft); i <= Math.min(fromTop, fromRight); i++)
            winLine[3] += this.matrix.matrix[this.y - i][this.x + i];
            
        for(let i = 0; i < winLine.length; i++) {
            if(winLine[i].search('xxxxx') >= 0) {
                socket.socket.emit('game:win', 'x');
            } else if(winLine[i].search('ooooo') >= 0) {
                socket.socket.emit('game:win', 'o');
                
            } else if(result >= this.cells/2) {
                socket.socket.emit('game:win', 'xo');
            }
        }
        
    }
    
}