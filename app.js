let baseURL = 'http://numbersapi.com';
let favNum = 2;

// Part 1: Number Facts

// 1. Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. (Make sure you get back JSON by including the json query key, specific to this API.

axios
    .get(`${baseURL}/${favNum}?json`)
    .then(res => {
        console.log(res.data.text)
    })

// 2. Figure out how to get data on multiple numbers in a single request. Make that request and when you get the data back, put all of the number facts on the page.

axios
    .get(`${baseURL}/3,7,8,14`)
    .then(res => {
        for (fact in res.data) {
            console.log(res.data[fact]);
        }
    });


// 3. Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page. It’s okay if some of the facts are repeats.


// axios
//     .get(`${baseURL}/2?json`)
//     .then(fact1 => {
//         console.log(fact1.data.text)
//         return axios.get(`${baseURL}/2?json`)
//     })
//     .then(fact2 => {
//         console.log(fact2.data.text)
//         return axios.get(`${baseURL}/2?json`)
//     })
//     .then(fact3 => {
//         console.log(fact3.data.text)
//         return axios.get(`${baseURL}/2?json`)
//     })
//     .then(fact4 => {
//         console.log(fact4.data.text)
//         return axios.get(`${baseURL}/2?json`)
//     })
//     .catch(err => {
//         console.log(`Ummm, something broke! - ${err}`)
//     })

Promise.all(
    Array.from({ length:4 }, () => {
        return axios.get(`${baseURL}/${favNum}?json`);
    }))
    .then(facts => {
    facts.forEach(res => $("body").append(`<p>${res.data.text}</p>`));
});




// Part 2: Deck of Cards

// 1. Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”).

// Draws a single card from a new deck
let deckURL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1'

axios
    .get(`${deckURL}`)
    .then(res => {
        let value = res.data.cards[0].value
        let suit = res.data.cards[0].suit
        console.log(`You drew the ${value} of ${suit}`);
    })

// 2. Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the same deck.

// Once you have both cards, console.log the values and suits of both cards.
let card1 = null;
axios
    .get(`${deckURL}`)
    .then(res => {
        let deckID = res.data.deck_id
        card1 = `${res.data.cards[0].value.toLowerCase()} of ${res.data.cards[0].suit.toLowerCase()}`
        return axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    })
    .then(res2 => {
        let card2 = `${res2.data.cards[0].value.toLowerCase()} of ${res2.data.cards[0].suit.toLowerCase()}`
        console.log(`Card 1 is the ${card1} and Card 2 is the ${card2}`)
    })

// 3. Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.

let newDeckURL = 'https://deckofcardsapi.com/api/deck'
let deckId = null;
let $btn = $('button');
let $cardArea = $('#card-area');

$.getJSON(`${newDeckURL}/new/shuffle/`).then(data => {
    deckId = data.deck_id;
    $btn.show();
});

$btn.on('click', function() {
    $.getJSON(`${newDeckURL}/${deckId}/draw/`).then(data => {
        let cardSrc = data.cards[0].image;
        let angle = Math.random() * 90 - 45;
        let randomX = Math.random() * 40 - 20;
        let randomY = Math.random() * 40 - 20;
        $cardArea.append(
            $('<img>', {
                src: cardSrc,
                css: {
                    transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`
                }
            })
        );
        if (data.remaining === 0) $btn.remove();
    });
});
