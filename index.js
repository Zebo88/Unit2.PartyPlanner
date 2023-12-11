const COHORT = "2309-ft-et-web-pt";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();

/**
 * Update state with parties from API
 */
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render parties from state
 */
function renderParties() {
  // Check if the parties array is populated:
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No parties.<li/>";
    return;
  }

  //CREATE PARTY SECTION:
  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${party.name}<h2/>
      <p>${party.description}<p/>
      <p>${party.date}<p/>
      <p>${party.location}<p/>
    `;

    //UPDATE PARTY SECTION:
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update Party";
    li.append(updateBtn);
    
    updateBtn.addEventListener(
      "click", 
      () => { 
        //Need to get user input to know what to change the values to, then
        //store those values in variables that can be used to send as arguments
        //to the updateParty function.
        //Maybe add styling to make the buttons spaced out and organized better.
        const nameUpdate = prompt("Update party name:");
        const descriptionUpdate = prompt("Update party description:");
        const dateUpdate = prompt("Update party date:");
        const locationUpdate = prompt("Update party location:");

        updateParty(party.id, nameUpdate, descriptionUpdate, dateUpdate, locationUpdate) }
    );

    //DELETE PARTY SECTION:
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Party";
    li.append(deleteBtn);
    
    deleteBtn.addEventListener(
      "click", 
      () => { deleteParty(party.id) }
    );

    return li;
  });

  partyList.replaceChildren(...partyCards);

}

/**
 * Ask the API to create a new party based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date: addPartyForm.date.value,
        location: addPartyForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();

    addPartyForm.reset();

  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to update an existing party and rerender.
 * Not a requirement for this workshop, but I wanted to try it out.
 */
async function updateParty(id, name, description, date, location) {
debugger
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, date, location }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();

  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask the API to remove an artist after delete button is clicked
 */
async function deleteParty(id) {

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })

    //Check if request was successful:
    if (!response.ok){
      throw new Error("Party could not be deleted.");
    }

    render();

  } catch (error) {
    console.error(error);
  }
  
}