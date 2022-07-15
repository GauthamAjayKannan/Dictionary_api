const form = document.getElementById("word-search");
const warn_msg = document.getElementById("warning");
const highlight = document.querySelector(".highlight");
const section = document.querySelector(".content");
const msg = document.createElement("p");
const res = document.createElement("p");

const dataLoad = (e) => {
  warn_msg.textContent = "";
  e.preventDefault();
  const formdata = new FormData(e.target);
  const word = formdata.get("search").trim();
  console.log(word);
  if (!isNaN(word) || !word) {
    warn_msg.textContent =
      "Please enter a valid word inorder to serach for its meaning";
    return;
  }
  getData(word);
};

const getData = async (word) => {
  section.innerHTML = "";
  const highlight = document.createElement("h1");
  highlight.classList.add("highlight");
  section.appendChild(highlight);
  highlight.textContent = "Loading...";
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await response.json();
    console.log("sddd", data, typeof data);
    if ("title" in data) {
      highlight.textContent = data["title"];
      msg.textContent = data["message"];
      msg.classList.add("msgcntr");
      section.appendChild(msg);
      res.textContent = data["resolution"];
      res.classList.add("msgcntr");
      section.appendChild(res);
      return;
    } else {
      let d = data[0];
      highlight.textContent = word;
      msg.remove();
      res.remove();
      const meaningSection = document.createElement("div");
      const meaningHeading = document.createElement("h4");
      meaningHeading.textContent = "MEANING";
      meaningHeading.classList.add("meaninghead");
      meaningSection.appendChild(meaningHeading);
      const meaningList = document.createElement("ul");
      meaningList.classList.add("meaning");
      meaningSection.appendChild(meaningList);
      const meaningArray = d["meanings"];
      console.log(meaningArray);
      for (let meaning of meaningArray) {
        let partsOfSpeechSection = document.createElement("li");
        meaningList.appendChild(partsOfSpeechSection);
        let hori = document.createElement("hr");
        meaningList.appendChild(hori);
        let partsOfSpeechHeading = document.createElement("h4");
        partsOfSpeechHeading.innerHTML = `Parts of Speech : <b>${
          meaning.partOfSpeech[0].toUpperCase() +
          meaning.partOfSpeech.substring(1)
        }</b>`;
        partsOfSpeechSection.appendChild(partsOfSpeechHeading);
        if (meaning["synonyms"].length > 0) {
          let synonymElement = document.createElement("p");
          synonymElement.innerHTML =
            "<b>Synonyms</b> : " + meaning["synonyms"].join(", ");
          partsOfSpeechSection.appendChild(synonymElement);
        }
        let definitionsSection = document.createElement("ul");
        definitionsSection.classList.add("definitionList");
        partsOfSpeechSection.appendChild(definitionsSection);
        let definitionList = document.createElement("ul");
        let definitions = meaning.definitions;
        for (let definition of definitions) {
          let definitionListElement = document.createElement("li");
          definitionListElement.textContent = `${definition.definition}`;

          if ("example" in definition) {
            let exampleElement = document.createElement("p");
            exampleElement.classList.add("example");
            exampleElement.innerHTML = `<b>Example :</b> ${definition["example"]}`;
            definitionListElement.appendChild(exampleElement);
          }
          definitionList.appendChild(definitionListElement);
        }
        definitionsSection.appendChild(definitionList);
      }
      section.appendChild(meaningSection);
    }
  } catch (e) {
    console.log("eeee", e);
  }
};

form.addEventListener("submit", dataLoad);
