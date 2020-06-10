import { ColladaLoader } from './examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from './examples/jsm/controls/OrbitControls.js';

var renderer, scene, camera,
    CANVAS_WIDTH = 500,
    CANVAS_HEIGHT = 500;

function init() {
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    var sphereGeometry = new THREE.SphereGeometry(10, 10, 10);
    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    resize();
    window.onresize = resize;
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    
    
    
    var loader = new THREE.ColladaLoader();
    loader.load( './GiftBox.dae', function ( collada ) {

        var animations = collada.animations;
        var avatar = collada.scene;

        scene.add( avatar );
        avatar.position.z = -10;

    } );
    
}

function animate() {
    var scale = document.getElementById( "scale" ).value / 100;
    scene.scale.x = scene.scale.y = scene.scale.z = scale;
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

function resize() {
    var aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
}

init();
animate();