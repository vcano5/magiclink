import * as THREE from "three";

var scene, camera, renderer, clock, deltaTime, totalTime;
	var arToolkitSource, arToolkitContext;
	var markerRoot1;
	var mesh1;

	initialize();
	animate();

	function initialize() {
		scene = new THREE.Scene();
		let ambientLight = new THREE.AmbientLight( 0xcccccc, 1.0 );
		scene.add( ambientLight );
		camera = new THREE.Camera();
		scene.add(camera);
		renderer = new THREE.WebGLRenderer({
			antialias : true,
			alpha: true
		});
		renderer.setClearColor(new THREE.Color('lightgrey'), 0)
		renderer.setSize( 640, 480 );
		renderer.domElement.style.position = 'absolute'
		renderer.domElement.style.top = '0px'
		renderer.domElement.style.left = '0px'
		document.body.appendChild( renderer.domElement );
		clock = new THREE.Clock();
		deltaTime = 0;
		totalTime = 0;

		arToolkitSource = new THREEx.ArToolkitSource({
			sourceType : 'webcam',
		});

		function onResize() {
			arToolkitSource.onResize()	
			arToolkitSource.copySizeTo(renderer.domElement)	
			if ( arToolkitContext.arController !== null ) {
				arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
			}	
		}

		arToolkitSource.init(onReady = () => {
			onResize()
		});
		
		window.addEventListener('resize', () => {
			onResize()
		});
		
		arToolkitContext = new THREEx.ArToolkitContext({
			cameraParametersUrl: 'data/camera_para.dat',
			detectionMode: 'mono'
		});
		
		arToolkitContext.init( function onCompleted(){
			camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
		});

		markerRoot1 = new THREE.Group();
		markerRoot1.name = 'marker1';
		scene.add(markerRoot1);
		let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
			type : 'pattern',
			patternUrl : "data/hiro.patt",
		})

		// const loader = new GLTFLoader();
		// let material1 = loader.load("whopper/source/whopper.glb", (gltf) => {
		// 	scene.add(gltf.scene);
		// }, undefined, (err) => {
		// 	console.error(err);
		// })

		let geometry1	= new THREE.CubeGeometry(2,2,2);
		let loader = new THREE.TextureLoader();
		let texture = loader.load( "%= image %>", render );
		let material1	= new THREE.MeshLambertMaterial({
			transparent : true,
			map: texture,
			side: THREE.BackSide
		}); 
		
		mesh1 = new THREE.Mesh( geometry1, material1 );
		mesh1.position.y = -1;
		
		markerRoot1.add( mesh1 );
		
		let geometry0 = new THREE.PlaneGeometry(18,18, 9,9);
		geometry0.faces.splice(80, 2);
		geometry0.faceVertexUvs[0].splice(80, 2);
		
		let material0 = new THREE.MeshBasicMaterial({
			map: loader.load( 'images/color-grid.png' ),
			colorWrite: false
		});
		
		let mesh0 = new THREE.Mesh( geometry0, material0 );
		
		mesh0.rotation.x = -Math.PI/2;
		markerRoot1.add(mesh0);	
	}


	function update() {
		if ( arToolkitSource.ready !== false )
			arToolkitContext.update( arToolkitSource.domElement );
	}


	function render() {
		renderer.render( scene, camera );
	}


	function animate() {
		requestAnimationFrame(animate);
		deltaTime = clock.getDelta();
		totalTime += deltaTime;
		update();
		render();
	}

    function onReady() {

    }