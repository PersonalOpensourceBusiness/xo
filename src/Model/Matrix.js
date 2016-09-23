import * as _ from 'Lodash';

export class Matrix {
    constructor() {
        this.matrix = [];
        this.defaultSize = 15;
    }

    init() {
        this.generateMatrix(this.defaultSize);
    }

    generateMatrix(size) {
        var matrix = [];
        for (let i = 0; i < size; i++) {
            matrix[i] = [];
            for (let j = 0; j < size; j++) {
                matrix[i][j] = 0;
            }
        }
        this.matrix = matrix;
        return matrix;
    }
    
}