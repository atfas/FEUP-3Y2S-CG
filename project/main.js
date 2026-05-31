
import {CGFapplication} from '../lib/CGF.js';
import { MyScene } from './MyScene.js';
import { MyInterface } from './MyInterface.js';

/**
 * Entry point. Creates the CGF application, attaches the scene and GUI
 * interface, then starts the render loop.
 */
function main()
{
    var app = new CGFapplication(document.body);
    var myScene = new MyScene();
    var myInterface = new MyInterface();

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

    app.run();
}

main();
