import { Model } from './Model/Model';
import { View } from './View/View';
import { Controller } from './Controller/Controller';
import * as _ from 'Lodash';

var model = new Model();
var view = new View(model);
var controller = new Controller(model, view);

model.init();
controller.init();