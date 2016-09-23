import * as _ from 'Lodash';

export class Informer {
    constructor(model) {
        this.model = model;
        
    }

    wait() {
        var tpl = _.template(document.querySelector('#informer-wait').innerHTML);
        document.querySelector('#informer').innerHTML = tpl({
            info: {
                player: '',
                who: '',
                text: 'Ждем второго игрока...'
            }
        });
    }

    info() {
        var tpl = _.template(document.querySelector('#informer-wait').innerHTML);
        setInterval(()=>{
            document.querySelector('#informer').innerHTML = tpl({
            info: {
                player: this.model.socket.who,
                who: this.model.game.who,
                text: '' 
            }
        });
        }, 100);
    }
    
}