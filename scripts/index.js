//Initialize Scene
const scene = new THREE.Scene();
const canvas = document.getElementById("homeCanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Load Textures
const textureLoader = new THREE.TextureLoader();
const moonMap = textureLoader.load(`./static/textures/moon.jpg`);
const particle = textureLoader.load(`./static/images/particle.png`);

//Resize background Canvas on window resize
window.addEventListener('resize', () =>
{
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//Create Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 2;

//Create central moon
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
const material = new THREE.MeshStandardMaterial( { 
    metalness: 0.9,
    roughness: 0.2,
    normalMap: moonMap,
    color: 0x292929 } );
const shape = new THREE.Mesh( geometry, material );
scene.add( shape );

//Create Lights 
const pointLightWhite = new THREE.PointLight(0xffffff, 0.1);
pointLightWhite.position.set(2,3,4);
scene.add(pointLightWhite);

const pointLightRed = new THREE.PointLight(0xff0000, 10);
pointLightRed.position.set(-1.86,1,-1.65);
scene.add(pointLightRed);

const pointLightBlue = new THREE.PointLight(0x96ff, 10);
pointLightBlue.position.set(1.6,-1.52,-1.6);
scene.add(pointLightBlue);

//Record mouse position
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let lastTargetX = targetX;
let lastTargetY = targetY;
function onDocumentMouseMove(event){
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}
document.addEventListener("mousemove", onDocumentMouseMove)

//Example Scroll Interactivity
//  Moves central moon during scroll
const updateSphere = (event) => {
    shape.position.y = -window.scrollY*0.001;

}
window.addEventListener("scroll", updateSphere)


//Generate Star Background particle system
function getParticleBuffer(particleCount){
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i] = THREE.MathUtils.randFloatSpread(15);
    }
    return pos;
};
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(getParticleBuffer(10000),3));
const particleMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.15,
    map: particle,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
});
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

//Animate background
const clock = new THREE.Clock();
const animate = function () {
    // Determine frametime
    const elapsedTime = clock.getDelta();

    // Provide Natural Rotation
    shape.rotation.y += 0.1 * elapsedTime;
    particleSystem.rotation.y -= 0.1 * elapsedTime;

    
    // Provided additional mouse rotation
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    const deltaY = (Math.abs(targetY - lastTargetY) < 0.1) ? (targetY - lastTargetY): 0;
    const deltaX = (Math.abs(targetX - lastTargetX) < 0.1) ? (targetX - lastTargetX): 0;
    shape.rotation.x += 50*elapsedTime*deltaY;
    shape.rotation.x %= 360;
    shape.rotation.y += 50*elapsedTime*deltaX;
    shape.rotation.y %= 360;
    shape.position.z += 10*elapsedTime*deltaY;

    // Render
    renderer.render(scene, camera);

    // Call again on the next frame
    lastTargetX = targetX;
    lastTargetY = targetY;
    window.requestAnimationFrame(animate);
};
animate();