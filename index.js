import * as THREE from './three.js/build/three.module.js'
import {GLTFLoader} from "./three.js/examples/jsm/loaders/GLTFLoader.js"
import {OrbitControls} from "./three.js/examples/jsm/controls/OrbitControls.js"

let fpcamera, currentCamera, tpcamera;
let scene;
let camPos, plane;
let distance = 0.5;
let renderer;
let move = [];
let velocity = 0.0;
let cameraDirection = new THREE.Vector3;
let a = new THREE.Vector3;
let b = new THREE.Vector3;
const planets = [];
let planetA, planetB, planetC, planetD, sun;
let speed = 0.0;

let initBackground = () => {
    let materialArray = [];

    let texture_ft = new THREE.TextureLoader().load('./assets/skybox/px.png');
    let texture_bk = new THREE.TextureLoader().load('./assets/skybox/nx.png');
    let texture_up = new THREE.TextureLoader().load('./assets/skybox/py.png');
    let texture_dn = new THREE.TextureLoader().load('./assets/skybox/ny.png');
    let texture_lf = new THREE.TextureLoader().load('./assets/skybox/nz.png');
    let texture_rt = new THREE.TextureLoader().load('./assets/skybox/pz.png');

    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft})); 
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}));

    for(let x of materialArray){
        x.side = THREE.BackSide;
    }
        
    // Geometery
    let skyboxGeo = new THREE.BoxGeometry(500, 500, 500);
    // Mesh : Material
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);

}

let initPlanetA = () => {
    const planetA_texture = new THREE.TextureLoader().load('./assets/planets/planet a.jpg');
    const planetA_geometry = new THREE.SphereGeometry(6, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: planetA_texture
    });

    const planetA = new THREE.Mesh(
        planetA_geometry,
        material
    );

    planetA.castShadow = true;
    planetA.receiveShadow = true;   

    while(collisionPlanetChecked(planetA) == true){
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100);

        planetA.position.x = x;
        planetA.position.y = y;
        planetA.position.z = z;
    }

    return planetA;
}

let initPlanetB = () => {
    const planetB_texture = new THREE.TextureLoader().load('./assets/planets/planet b.jpg');
    const planetB_geometry = new THREE.SphereGeometry(6, 32, 32);
    const planetB_material = new THREE.MeshStandardMaterial({
        map: planetB_texture
    });

    const planetB = new THREE.Mesh(
        planetB_geometry,
        planetB_material
    )

    planetB.castShadow = true;
    planetB.receiveShadow = true; 

    while(collisionPlanetChecked(planetB) == true){
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100);

        planetB.position.x = x;
        planetB.position.y = y;
        planetB.position.z = z;
    }
    

    return planetB;
}

let initPlanetC = () => {
    const planetC_texture = new THREE.TextureLoader().load('./assets/planets/planet c.jpg');
    const planetC_geometry = new THREE.SphereGeometry(6, 32, 32);

    const planetC_material = new THREE.MeshStandardMaterial({
        map: planetC_texture
    })

    const planetC = new THREE.Mesh(
        planetC_geometry,
        planetC_material
    )

    planetC.castShadow = true;
    planetC.receiveShadow = true; 

    while(collisionPlanetChecked(planetC) == true){
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100);

        planetC.position.x = x;
        planetC.position.y = y;
        planetC.position.z = z;
    }
    
    return planetC;
}

let initPlanetD = () => {
    const planetD_texture = new THREE.TextureLoader().load('./assets/planets/planet d.png');
    const planetD_geometry = new THREE.SphereGeometry(6, 32, 32);

    const planetD_material = new THREE.MeshStandardMaterial({
        map: planetD_texture
    })

    const planetD = new THREE.Mesh(
        planetD_geometry,
        planetD_material
    )

    planetD.castShadow = true;
    planetD.receiveShadow = true; 

    while(collisionPlanetChecked(planetD) == true){
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100);

        planetD.position.x = x;
        planetD.position.y = y;
        planetD.position.z = z;
    }

    return planetD;
}

let initSun = () => {
    const sun_texture = new THREE.TextureLoader().load('./assets/planets/sun.png');
    const sun_geometry = new THREE.SphereGeometry(15, 32, 32);

    const sun_material = new THREE.MeshBasicMaterial({
        map: sun_texture
    })

    const sun = new THREE.Mesh(
        sun_geometry,
        sun_material
    )

    while(collisionPlanetChecked(sun, 15) == true){
        const x = THREE.MathUtils.randFloatSpread(100);
        const y = THREE.MathUtils.randFloatSpread(100);
        const z = THREE.MathUtils.randFloatSpread(100);

        sun.position.x = x;
        sun.position.y = y;
        sun.position.z = z;
    }

    return sun;
}

const collisionPlanetChecked = (planet, radius = 6) => {

    for(let p of planets){

        let colideDistance = 0;

        if(radius == 3){
            colideDistance = 2*radius;
        } else{
            colideDistance = radius + 5;
        }

        let distance = p.position.distanceTo(planet.position);
        if(distance <= colideDistance)
            return true;
    }

    return false;
}

let initAllPlanet = () => {
    planetA = initPlanetA();
    planets.push(planetA);
    scene.add(planetA);
    planetB = initPlanetB();
    planets.push(planetB);
    scene.add(planetB);
    planetC = initPlanetC();
    planets.push(planetC);
    scene.add(planetC);
    planetD = initPlanetD();
    planets.push(planetD);
    scene.add(planetD);
    sun = initSun();
    planets.push(sun);
    scene.add(sun);
}

let initLight = () => {

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    let directionLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    directionLight.position.set(-500, 0, 0);
    scene.add(directionLight);

    let pointLight = new THREE.PointLight(0xffb875, 1.2);
    pointLight.position.set(sun.position.x, sun.position.y, sun.position.z);
    scene.add(pointLight);
}

let rotatePlanet = () => {
    planetA.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0.9));
    planetB.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0.9));
    planetC.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0.9));
    planetD.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0.9));
}

let rotateSun = () => {
    sun.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(.45));
}

let initOrbitControls = () => {
    let controls = new OrbitControls(currentCamera, renderer.domElement);
    controls.maxDistance = 250;
    controls.addEventListener('change', () => {
        renderer.render(scene, currentCamera);
    });
}

let changeCam = (e) => {

    if(e.keyCode === 67){
        if(currentCamera == tpcamera){
            currentCamera = fpcamera;
        }
        else{
            currentCamera = tpcamera;
        }
    }
    
}

let init = () => {

    // camera
    fpcamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
    fpcamera.position.set(0, .3, 0);

    tpcamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 60000);
    tpcamera.position.set(50, 50, 50);

    currentCamera = tpcamera;
    // scene
    scene = new THREE.Scene();
    
    initAllPlanet();
    initLight();
    // plane
    let loader = new GLTFLoader();
    loader.load('./assets/plane2/model.gltf', (gltf) => {
        plane = gltf.scene.children[0];
        console.log(plane)
        plane.position.set(10, 0, 0);
        plane.scale.setScalar(0.1);
        plane.castShadow = true;
        plane.receiveShadow = true;
        scene.add(plane);
    })

    
    camPos = new THREE.Object3D;
    camPos.add(fpcamera);
    camPos.position.z = -distance;
    
    initBackground();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    initOrbitControls();

    document.addEventListener('keydown', changeCam);

    document.addEventListener('keydown', (e) => {
        move[e.key] = true;
    })

    document.addEventListener('keyup', (e) => {
        move[e.key] = false;
    })
}

let planeAreaValidate = () => {
    if( plane.position.x > 200 || 
        plane.position.x < -200 ||
        plane.position.y > 200 ||
        plane.position.y < -200 ||
        plane.position.z > 200 ||
        plane.position.z < -200) return false;
    else return true;
}

let animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, currentCamera);
    rotatePlanet();
    rotateSun();

    if(currentCamera == fpcamera){
    
        if(move[' ']){
            speed += 0.0002;
        } else if(!move[' ']){
            if(speed <= 0) speed = 0
            else speed -= 0.0008;
        }

        let angle = Math.PI/500;

        if(move['a']){
            plane.rotateY(angle);
        }
        if(move['d']){
            plane.rotateY(-angle);
        }
        if(move['w']){
            plane.rotateZ(-angle);
        }
        if(move['s']){
            plane.rotateZ(angle);
        }
        

        if(velocity >= 1) velocity = velocity;
        else velocity += (speed - velocity);

        plane.position.clamp(
            new THREE.Vector3(-200, -200, -200),
            new THREE.Vector3(200, 200, 200)
        )
        
        if(plane != undefined){
            plane.translateX(velocity);

            a.copy(plane.position);
            b.copy(camPos.position);

            cameraDirection.copy(a).sub(b).normalize();
            let dist = a.distanceTo(b) - distance;
            camPos.position.addScaledVector(cameraDirection, dist);

            fpcamera.lookAt(plane.position);
        }
    }
        
}

init();
animate();