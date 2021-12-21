/**
 * Immutable type representing a flashcard
 */
class Flashcard {
    static existingCards = [];
    isFlipped = false;

    /**
     * Make a flashcard.
     * 
     * @param front the card's front side, e.g. a word
     * @param back the card's back side, e.g. a definition
     * @returns flashcard with front "front" and back "back"
     */
     static make(front, back){
        const newCard = new Flashcard(front, back);
        Flashcard.existingCards.push(newCard);
        return newCard;
        }
    

    /**
     * Creates a unique string identifier to represent a flashcard
     * @param front the card's front side, e.g. a word
     * @param back the card's back side, e.g. a definition
     * @returns the flashcard's unique string representation
     */
    static getKey(front, back){
        return JSON.stringify([front, back]);
    }

    /**
     * Creates flashcard with front "front" and back "back"
     * 
     * @param front this card's front side, e.g. a vocabulary word
     * @param back this card's back side, e.g. its definition
     */
    constructor(front, back) {
        this.front = front;
        this.back = back;
    }

    /**
     * Creates a string representation of a flashcard 
     * in the form {front}/{back}
     * 
     * @returns the flashcard's string representation
     */
    toString() {
        return this.front + "/" + this.back;
    }

}

let currentIndex = 0;

const cardType = document.getElementById("cardType");
const cardContent = document.getElementById("cardContent");
const wordInput = document.getElementById("wordInput");
const definitionInput = document.getElementById("definitionInput");
const flipButton = document.getElementById("flipButton");
const deleteButton = document.getElementById("deleteButton");
const lastButton = document.getElementById("lastButton");
const nextButton = document.getElementById("nextButton");
const addButton = document.getElementById("addFlashcard");
const uploadButton = document.getElementById("uploadFlashcards");
const uploadInput = document.getElementById("flashCardUpload");
const downloadButton = document.getElementById("downloadFlashcards");

// Refresh
function refreshFlashcards(){
    console.log(currentIndex);
    if (Flashcard.existingCards.length === 0){
        cardType.textContent = "No Flashcards Found";
        cardContent.textContent = "Use the below tools to add new cards!";
    } 
    else{
        const currentCard = Flashcard.existingCards[currentIndex];
        if (currentCard.isFlipped){
            cardType.textContent = "Definition";
            cardContent.textContent = currentCard.back;
        }
        else{
            cardType.textContent = "Word";
            cardContent.textContent = currentCard.front;
        }
    }
    console.log(JSON.parse(JSON.stringify(Flashcard.existingCards)));
}
refreshFlashcards();

// Adds new flashcard into existingCards
function addFlashcard(event){
    const word = wordInput.value;
    wordInput.value = "";
    const definition = definitionInput.value;
    definitionInput.value = "";
    if (word.length >= 1 && definition.length >= 1){
        Flashcard.make(word, definition);
    }
    refreshFlashcards();
}
addButton.addEventListener("click", addFlashcard);

// Flips the current flashcard
function flipCard(event){
    if (Flashcard.existingCards.length === 0){
        return;
    }
    const currentCard = Flashcard.existingCards[currentIndex];
    if (!currentCard.isFlipped){
        currentCard.isFlipped = true;
        cardType.textContent = "Definition";
        cardContent.textContent = currentCard.back;
    }
    else{
        currentCard.isFlipped = false;
        cardType.textContent = "Word";
        cardContent.textContent = currentCard.front;
    }
}
flipButton.addEventListener("click", flipCard);

// Deletes the current flashcard
function deleteCard(event){
    Flashcard.existingCards.splice(currentIndex, 1);
    if (Flashcard.existingCards.length !== 0){
    currentIndex %= Flashcard.existingCards.length;
    }
    else{
        currentIndex = 0;
    }
    
    refreshFlashcards();
}
deleteButton.addEventListener("click", deleteCard);

// Advances to the next flashcard
function nextCard(event){
    if (Flashcard.existingCards.length === 0){
        return;
    }
    const currentCard = Flashcard.existingCards[currentIndex];
    currentCard.isFlipped = false;
    currentIndex++;
    if (Flashcard.existingCards.length !== 0){
        currentIndex %= Flashcard.existingCards.length;
    }
    else{
        currentIndex = 0;
    }
    refreshFlashcards();
}
nextButton.addEventListener("click", nextCard);

// Advances to the previous flashcard
function lastCard(event){
    if (Flashcard.existingCards.length === 0){
        return;
    }
    const currentCard = Flashcard.existingCards[currentIndex];
    currentCard.isFlipped = false;
    if (currentIndex !== 0){
        currentIndex--;
    }
    else{
        currentIndex = Flashcard.existingCards.length - 1;
    }
    if (Flashcard.existingCards.length !== 0){
        currentIndex %= Flashcard.existingCards.length;
    }
    else{
        currentIndex = 0;
    }
    refreshFlashcards();
}
lastButton.addEventListener("click", lastCard);

// Download current flashcards
function downloadCards(event){
    const jsonCards = [JSON.stringify(Flashcard.existingCards)];
    const blobCards = new Blob(jsonCards, { type: "text/plain;charset=utf-8" });

    const isInternetExplorer = false || !!document.documentMode;
    if (isInternetExplorer){
        window.navigator.msSaveBlob(blobCards, "Flashcards.txt");
    }
    else{
        const url = window.URL || window.webkitURL;
        const link = url.createObjectURL(blobCards);
        const a = document.createElement("a");
        a.download = "Flashcards.txt";
        a.href = link;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
downloadButton.addEventListener("click", downloadCards);

//Load New Flashcards
function uploadCards(event){
    const files = uploadInput.files;
    if (files.length <= 0){
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
        const oldCards = Array.from(Flashcard.existingCards);
        try{
            Flashcard.existingCards = [];
            const result = JSON.parse(e.target.result);
            for (const flashCard of result){
                Flashcard.make(flashCard.front, flashCard.back);
            }
            refreshFlashcards();
        }
        catch (error) {
            console.log(error);
            cardType.textContent = "Upload Failed";
            cardContent.textContent = "Please try uploading again or use the Add Flashcard tool to add cards";
            Flashcard.existingCards = oldCards;
        }
    }
    fileReader.readAsText(files.item(0));
    uploadInput.value = "";

}
uploadButton.addEventListener("click", uploadCards);





//Initialize Scene
const scene = new THREE.Scene();
const canvas = document.getElementById("backgroundCanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Load Textures
const textureLoader = new THREE.TextureLoader();
const moonMap = textureLoader.load(`../static/textures/moon.jpg`);
const particle = textureLoader.load(`../static/images/particle.png`);

//Resize canvas on window resize
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

//Create Moon
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

//Setup Mouse Interactivity
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

//Setup Scroll Interactivity
const updateSphere = (event) => {
    shape.position.y = -window.scrollY*0.001;

}
window.addEventListener("scroll", updateSphere)


//Generate Star Background
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
    transparent: true
});
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

//Setup Animation
const clock = new THREE.Clock();
const animate = function () {
    // Determine frametime
    const elapsedTime = clock.getDelta();

    // Natural Rotation
    shape.rotation.y += 0.1 * elapsedTime;
    particleSystem.rotation.y -= 0.1 * elapsedTime;

    
    // Update from Interaction
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    const deltaY = (Math.abs(targetY - lastTargetY) < 0.1) ? (targetY - lastTargetY): 0;
    const deltaX = (Math.abs(targetX - lastTargetX) < 0.1) ? (targetX - lastTargetX): 0;
    shape.rotation.x += 50*elapsedTime*deltaY;
    shape.rotation.x %= 360;
    shape.rotation.y += 50*elapsedTime*deltaX;
    shape.rotation.y %= 360;
    shape.position.z += 10*elapsedTime*deltaY;
    //shape.position.z += -5*elapsedTime*(targetY - shape.rotation.x);
;

    // Render
    renderer.render(scene, camera);

    // Call again on the next frame
    lastTargetX = targetX;
    lastTargetY = targetY;
    window.requestAnimationFrame(animate);
};
animate();