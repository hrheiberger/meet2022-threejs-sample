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
    if (Flashcard.existingCards.length === 0){
        cardType.textContent = "No Flashcards Found";
        cardContent.textContent = "Use the below tools to add new cards!";
    } 
    else{
        const currentCard = Flashcard.existingCards[currentIndex];
        if (currentCard.isFlipped){
            cardType.textContent = "Back";
            cardContent.textContent = currentCard.back;
        }
        else{
            cardType.textContent = "Front";
            cardContent.textContent = currentCard.front;
        }
    }
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
        cardType.textContent = "Back";
        cardContent.textContent = currentCard.back;
    }
    else{
        currentCard.isFlipped = false;
        cardType.textContent = "Front";
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
                if (flashCard.front === undefined || flashCard.back === undefined){
                    throw new Error("Improper Flashcard formatting");
                }
                Flashcard.make(flashCard.front, flashCard.back);
            }
            refreshFlashcards();
        }
        catch (error) {
            cardType.textContent = "Upload Failed";
            cardContent.textContent = "Please try uploading again or use the Add Flashcard tool to add cards";
            Flashcard.existingCards = oldCards;
        }
    }
    fileReader.readAsText(files.item(0));
    uploadInput.value = "";

}
uploadButton.addEventListener("click", uploadCards);