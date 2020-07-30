var canvas = document.getElementById("renderCanvas"); 

var engine = new BABYLON.Engine(canvas, true); 

var scene = null; 

var camera = null;

var internalBox = null;

var sleeve = null;

var textBlock = new BABYLON.GUI.TextBlock("textBlock1");

var advancedTexture = null;

var textColor = "black";

var boxIndex = 0;

var messageText = "";

var sleeveTexturePath = "";

var baseBoxTexturePath = "";

function Box( file, textWidth, textHeight, planeWidth, planeHeight, xPosition, yPosition, zPosition, textColor) {
        this.file = file;
        this.textWidth = textWidth;
        this.textHeight = textHeight;
        this.planeWidth = planeWidth;
        this.planeHeight = planeHeight;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.zPosititon = zPosition;
        this.textColor = textColor;
}

var boxes = [
    new Box('SmallBox.gltf',   700,  350, 0.25, 0.25, 0, 0.05, 0, "black"),
    new Box('MediumBox.gltf',  700,  800, 0.25, 0.25, 0, 0.051, 0, "black"),
    new Box('LargeBox.gltf',  1000, 1000, 0.25, 0.25, 0, 0.051, 0, "black")
];

function sleeveChange(){
    if (canvas != null){
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseTexture = new BABYLON.Texture(sleeveTexturePath, scene);
        myMaterial.bumpTexture = new BABYLON.Texture("Assets/cardboard.jpg", scene);
        myMaterial.bumpTexture.level = 0.15;
        myMaterial.glossiness = 1.0;
        myMaterial.metallic = 1.0;
        myMaterial.roughness = 0.0;
        myMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        sleeve.material = myMaterial
    }
}

function baseBoxChange(){
    if (canvas != null){
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseTexture = new BABYLON.Texture(baseBoxTexturePath, scene);
        myMaterial.bumpTexture = new BABYLON.Texture("Assets/cardboard.jpg", scene);
        myMaterial.bumpTexture.level = 0.15;
        myMaterial.glossiness = 0.5;
        myMaterial.metallic = 0.5;
        myMaterial.roughness = 0.5;
        myMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        internalBox.material = myMaterial    
    }
    
}



(function () {
    
   var boxFile = "";

    
   function initLoading(){
        var loadingScreenDiv = window.document.getElementById("loadingScreen");

        function customLoadingScreen() {
            console.log("customLoadingScreen creation")
        }
        customLoadingScreen.prototype.displayLoadingUI = function () {
            console.log("customLoadingScreen loading")
        //    loadingScreenDiv.innerHTML = "loading";
        };
        customLoadingScreen.prototype.hideLoadingUI = function () {
            console.log("customLoadingScreen loaded")
            loadingScreenDiv.style.display = "none";
        };
        var loadingScreen = new customLoadingScreen();
        engine.loadingScreen = loadingScreen;

        engine.displayLoadingUI();
    }

    function changeBox( value ){

        if (boxFile != value.file ){
            boxFile = value.file;

            if (scene != null){
                scene.dispose();
            }

            scene = new BABYLON.Scene(engine);
            scene.createDefaultCameraOrLight(true, true, true);

            var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 1, new BABYLON.Vector3(0, 0, 0), scene);
            scene.activeCamera.target = new BABYLON.Vector3(0, 0, 0);
            scene.activeCamera.setPosition(new BABYLON.Vector3(-0.2, 0.5, -0.2));
            scene.activeCamera.attachControl(canvas, false);

            scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            scene.ambientColor = new BABYLON.Color3(1.0, 1.0, 1.0);

            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-1, 1, -0.5), scene);
            light.intensity = 0.7;

            box = BABYLON.SceneLoader.Append("./models/", value.file, scene, () => {

                internalBox = scene.getNodeByName("InternalBox")
                sleeve = scene.getNodeByName("ExternalBox")

                internalBox.position.y = internalBox.position.y -0.05;
                sleeve.position.y = sleeve.position.y -0.05;

                createAdvancedTexture( value.textWidth, value.textHeight, value.planeWidth, value.planeHeight, value.xPosition, value.yPosition, value.zPosititon, box, scene, 0);

                baseBoxChange();
                sleeveChange();

                engine.hideLoadingUI();
            });
        }
    }




    function createAdvancedTexture(length, height, planeWidth, planeHeight, x, y, z, parent, scene, pos){

        var textBlock = createText(length.toString());
        textBlock.width = 1;
        textBlock.height = 1;


        //Create plane
        var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: planeWidth, height: planeHeight}, scene);
        plane.rotation = new BABYLON.Vector3( 1.5708, 0, 0 );

        plane.position.y = y;
        plane.position.x = x;


        var myMaterial = new BABYLON.StandardMaterial("a", scene);
        myMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        plane.material = myMaterial


        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);  
        //advancedTexture.background = "yellow";
        advancedTexture.addControl(textBlock); 

    }



    function createText(text){
        textBlock.fontFamily = "Helvetica";
        textBlock.text = text;
        textBlock.fontStyle = "bold";
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.color = "black";

        return textBlock;
    }


    function changeText( value ){

        if (advancedTexture != null){

        var textChanged = false;
        if (textBlock.text != messageText) {
            textChanged = true;
        } 
        textBlock.text = messageText;
        var ctx = advancedTexture.getContext();

        if (textChanged){
            var lines = textBlock.text.split('\n');
            var largestLine = "";
            var largestLineSize = 0
            for(var i = 0;i < lines.length;i++){
                var s = ctx.measureText(lines[i]).width;
                if (s > largestLineSize){
                    largestLineSize = s;
                    largestLine = lines[i];
                }
            }
            var i = 700;
            for(; i > 1; i = i - 0.1) {
                ctx.font = `${i}px arial`;
                var width = ctx.measureText(largestLine).width;
                var height = ( i * lines.length ) + ( (lines.length - 2) * 10 );
                if ((width < value.textWidth) && (height < value.textHeight)) {
                    break;
                }
            }
            textBlock.fontSize = i;
        }

        textBlock.color = textColor;
            

        textBlock.textWrapping = true;
        //textBlock.lineSpacing = "10px";
        }
    }


    
    if (canvas != null){
        
        initLoading();
        
        changeBox( boxes[0] );

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
            scene.render();
            changeBox( boxes[boxIndex] );
            changeText( boxes[boxIndex] );

        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
                engine.resize();
        });
    }

    

}).call(undefined);