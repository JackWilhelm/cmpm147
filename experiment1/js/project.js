// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    killer: ["clown", "masked psycho", "zombie", "werewolf", "sea monster", "ancient curse", "mother", "car", "tomato"],
    weapon: ["a knife", "a fish", "bocce balls", "a dusty laptop", "half a carton of eggs", "the souls of the dead", "a crowbar", " a tomato"],
    descriptor: ["bloodthirsty", "vicious", "terrifiying", "playful", "tiny", "cackling", "supernatural"],
    townPre: ["Smiles", "Den", "Gloom", "Har", "Bret", "Die", "Jack", "Ted", "Hang"],
    townPost: ["ville", "land", "den", "town", "ington", "vale", "hill"],
    townDes: ["sleepy", "old", "haunted", "lively", "eerie"],
    victimDes: ["up-and-coming author", "teenage hooligan", "recently-wed", "actor", "recently widowed mother", "detective", "officer", "mayor"],
    victimFirstName: ["Sarah", "Beth", "Stacy", "Diane", "Emily", "Cindy", "Sidney"],
    victimLastName: ["Bently", "Jones", "Stewart", "Hemsworth", "McDonald", "McTom"],
    victimState: ["captured", "haunted", "stalked", "followed"],
    weakness: ["fire", "peanut butter", "a lullaby", "the power of friendship", "the concentrated power of the sun", "a tomato"],
    twist: ["she's the killer", "she's blind", "she's in a submarine", "she's 90", "it's 1875", "it's 2059"]
  };
  
  const template = `Coming this summer: Deep in the $townDes town of $townPre$townPost, $victimDes $victimFirstName $victimLastName is $victimState by
  a $descriptor $killer, killing its victims with $weapon and can only be stopped with $weakness. 
  But here's the twist: 
  $twist!
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  
}

// let's get this party started - uncomment me
main();