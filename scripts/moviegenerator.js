/* STORY DATA */
const pronouns = {
    femme: {
      possessive: "her",
      subject: "she",
      object: "her",
    },
    masc: {
      possessive: "his",
      subject: "he",
      object: "him",
    },
    nb: {
      possessive: "their",
      subject: "they",
      object: "them",
    },
};
const nameActors = [
    {
      name: "Mary (Aubrey Plaza)",
      identity: "femme",
    },
    {
      name: "Dean (Timothee Chalamet)",
      identity: "masc",
    },
    {
      name: "Moira (Kristen Stewart)",
      identity: "nb",
    },
];
const adjectives = [
    "dysfunctional",
    "cold but needy",
    "humble",
    "brilliant but lonely",
];
const occupations = [
    "chess prodigy",
    "Buzzfeed journalist",
    "mail carrier",
    "podcaster",
    "dating app consultant",
];
const occupationsLong = [
    "an Instagram photographer sacrificing {possessive} art for followers to afford gifts for {possessive} nieces and nephews",
    "a dieting food stylist trying to maintain {possessive} waistline while getting the season's Tasty videos out in time",
    "a down-on-{possessive} luck SoundCloud rapper who is counting on {possessive} new Christmas album to revive {possessive} career",
    "a craft beer maker whose special Christmas brew is the talk of the town",
    "a Peloton trainer who is trying to help people stay healthy this holiday season"
]
const situations = [
    "wants to impress {possessive} mom with a thriving indoor spearmint garden",
    "can't seem to find the right girl on Hinge and settle down",
    "just wants to have the best holiday display for {possessive} kids",
    "is having trouble getting {possessive} savory popcorn brand off the ground",
];
const tjItems = [
      "half-baked baguette",
      "orange chicken",
];
const classDict = {
adjective: adjectives,
nameActor: nameActors,
occupation: occupations,
occupationLong: occupationsLong,
situation: situations,
tjItem: tjItems,
};

/* GENERATOR */

let storyInfo = {};

const charLimit = 2;

const randomizable = document.getElementsByClassName("randomize");
const theyMeet = document.getElementById("they_meet_replace");

let used = [];

/* FUNCTIONS */

var getRandomArrayValue = (arr) => {
return arr[Math.floor(Math.random() * arr.length)];
};

var getUniqueRandomArrayValue = (arr) => {
let value = getRandomArrayValue(arr);
while (used.includes(value)) {
    value = getRandomArrayValue(arr);
}

used.push(value);

return value;
}

var addCorrectPronouns = (str, pnouns) => {
str = str.replaceAll("{possessive}", pnouns.possessive);
str = str.replaceAll("{subject}", pnouns.subject);
return str.replaceAll("{object}", pnouns.object);
}

var replaceTheyMeet = (identity) => {
let value = "";
switch(identity) {
    case "femme":
        value = "she meets";
        break;
    case "masc":
        value = "he meets";
        break;
    case "nb":
    default:
        value = "they meet";
        break;
}

theyMeet.innerHTML = value;
}

var generateMovie = () => {
    if (Object.keys(storyInfo).length === 0) {
        return;
    }

    used = [];

    let characters = [];
    for (let i = 0; i < charLimit; i++) {
        characters[i] = getUniqueRandomArrayValue(storyInfo.nameactor);
        characters[i].pronouns = pronouns[characters[i].identity];
    }

    for (const element of randomizable) {
        let type = element.dataset.type;
        let charNum = element.dataset.character ?? 0;

        if (type == "nameactor") {
            element.innerHTML = characters[charNum].name;
            continue;
        }
    
        let arr = storyInfo[type];
        if (arr) {
            let value = getUniqueRandomArrayValue(arr); 
            
            if (typeof value === "string") {
                value = addCorrectPronouns(value, characters[charNum].pronouns);
            }

            if (element.classList.contains("sentence_start")) {
                value = value[0].toUpperCase() + value.substring(1);
            }

            element.innerHTML = value;
        }
    }

    // Special case for the "they meet..." phrase, 
    // which isn't randomizable but needs specific pronounds
    replaceTheyMeet(characters[0].identity);
};

d3.json('./data/story.json')
    .then(function(data){
        storyInfo = data;
        generateMovie();
    })
    .catch(function(error) {
        console.error(error);
    });