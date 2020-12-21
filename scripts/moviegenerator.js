/* GENERATOR */
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

function scrollToTop() {
    scroll({
        top: 0,
        behavior: "smooth"
      });
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

            // Helps stop the spans from breaking up on multiple lines badly
            if (element.classList.contains("sentence_end")) {
                value = value + ".";
            }

            element.innerHTML = value;
        }
    }

    // Special case for the "they meet..." phrase, 
    // which isn't randomizable but needs specific pronounds
    replaceTheyMeet(characters[0].identity);

    scrollToTop();
};

d3.json('./data/story.json')
    .then(function(data){
        storyInfo = data;
        generateMovie();
    })
    .catch(function(error) {
        console.error(error);
    });