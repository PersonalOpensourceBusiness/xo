import * as _ from 'Lodash';
export class Settings {
    constructor(matrix) {
        this.matrix = matrix;
    }
    init(config) {
        this.setStartSettings({
            size: config.size
        });
    }
    setStartSettings(config) {
        this.matrix.matrix = this.matrix.generateMatrix(config.size);
    }
}