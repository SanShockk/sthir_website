const word1 = document.getElementById("word1");
const word2 = document.getElementById("word2");

const wordPairs = [
["Apatheia", "Stoic"],
["Upekkha", "Buddhism"],
["Sakina", "Islam"],
["Hishtavut", "Hebrew"],
["Euthymia", "Ancient Greek"],
["Ataraxia", "Epicurean"],
["Aequanimitas", "Christian"],
["Stillness", "English"]
];

let index = 0;
setInterval(() => {
// fade out
word1.style.opacity = 0;
word2.style.opacity = 0;

setTimeout(() => {
    // swap words
    const [w1, w2] = wordPairs[index];
    word1.textContent = w1;
    word2.textContent = w2;
    
    // fade in
    word1.style.opacity = 1;
    word2.style.opacity = 1;

    index = (index + 1) % wordPairs.length;
}, 600); // matches CSS transition
}, 2000); // every 2 seconds
