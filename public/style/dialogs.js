function handleOutsideClick(event, dialog){
    event.stopPropagation();

    const dialogDimensions = dialog.getBoundingClientRect();
    if(
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
    ){
        dialog.close();
        document.removeEventListener('click', (e) => handleOutsideClick(e, dialog));
    }
}

/* ---------------------------------------------------------------------------------------------------------- */

const successIcon = '<svg class="success" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M422-297.33 704.67-580l-49.34-48.67L422-395.33l-118-118-48.67 48.66L422-297.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Z"/></svg>'
const errorIcon = '<svg class="error" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M479.99-280q15.01 0 25.18-10.15 10.16-10.16 10.16-25.17 0-15.01-10.15-25.18-10.16-10.17-25.17-10.17-15.01 0-25.18 10.16-10.16 10.15-10.16 25.17 0 15.01 10.15 25.17Q464.98-280 479.99-280Zm-31.32-155.33h66.66V-684h-66.66v248.67ZM480.18-80q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Z"/></svg>';
const warnIcon = '<svg class="warn" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="m40-120 440-760 440 760H40Zm442.78-118q14.22 0 23.72-9.62 9.5-9.61 9.5-23.83 0-14.22-9.62-23.72-9.61-9.5-23.83-9.5-14.22 0-23.72 9.62-9.5 9.62-9.5 23.83 0 14.22 9.62 23.72 9.62 9.5 23.83 9.5Zm-33.45-114H516v-216h-66.67v216Z"/></svg>'
const noteIcon = '<svg class="note" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M480-80q-33.67 0-57.17-23.5t-23.5-57.17h161.34q0 33.67-23.5 57.17T480-80ZM318.67-215.33V-282h322.66v66.67H318.67ZM325.33-336q-67-42.33-106.16-108.33-39.17-66-39.17-147 0-123 88.5-211.5t211.5-88.5q123 0 211.5 88.5t88.5 211.5q0 81-38.83 147-38.84 66-106.5 108.33H325.33Z"/></svg>';
const defaultIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M448.67-280h66.66v-240h-66.66v240Zm31.32-316q15.01 0 25.18-9.97 10.16-9.96 10.16-24.7 0-15.3-10.15-25.65-10.16-10.35-25.17-10.35-15.01 0-25.18 10.35-10.16 10.35-10.16 25.65 0 14.74 10.15 24.7 10.16 9.97 25.17 9.97Zm.19 516q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Zm.15-66.67q139 0 236-97.33t97-236.33q0-139-96.87-236-96.88-97-236.46-97-138.67 0-236 96.87-97.33 96.88-97.33 236.46 0 138.67 97.33 236 97.33 97.33 236.33 97.33ZM480-480Z"/></svg>';
const alertDialog = document.querySelector('dialog.alert');

window._alert = function (type, message, details){
    alertDialog.querySelector(".subtitle").innerHTML = message;
    alertDialog.querySelector(".text").innerHTML = details;
    switch(type){
        case "success":
            alertDialog.querySelector(".type").innerHTML = successIcon;
        break;
        case "error":
            alertDialog.querySelector(".type").innerHTML = errorIcon;
        break;
        case "warn":
            alertDialog.querySelector(".type").innerHTML = warnIcon;
        break;
        case "note":
            alertDialog.querySelector(".type").innerHTML = noteIcon;
        break;
        default:
            alertDialog.querySelector(".type").innerHTML = defaultIcon;
    }
    alertDialog.showModal();
    alertDialog.addEventListener("click", e => {
        handleOutsideClick(e, alertDialog);
    });
    setTimeout(() => {
        alertDialog.close();
    }, 7000);
}

/* ---------------------------------------------------------------------------------------------------------- */

function createInput(type, name, placeholder, value = ""){
    let input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.value = value;
    return input;
}

function createLabel(text){
    let label = document.createElement('label');
    label.innerHTML = text;
    label.classList.add('text');
    return label;
}

const promptDialog = document.querySelector("dialog.prompt");
const promptForm = document.querySelector("dialog.prompt form");
const promptInputs = document.querySelector("dialog.prompt .inputs");
const submitPrompt = document.querySelector("dialog.prompt button.submit");
const cancelPrompt = document.querySelector("dialog.prompt button.cancel");

window._prompt = function (name, inputs){
    return new Promise((resolve, reject) => {
        // Clear previous inputs and set dialog title
        promptDialog.querySelector(".title").innerHTML = name;
        promptInputs.innerHTML = "";

        // Normalize inputs to an array if it is a single object
        if (!Array.isArray(inputs)){
            inputs = [inputs]; // Convert object to array of one object
        }

        // Create inputs and labels
        for (let input of inputs){
            promptInputs.appendChild(createLabel(input.label));
            promptInputs.appendChild(createInput(input.type, input.name, input.placeholder, input.value));
        }

        // Show the prompt dialog
        promptDialog.showModal();

        // Remove any previous form submit event listeners
        promptForm.onsubmit = (e) => {
            e.preventDefault(); // Prevent the default form submission behavior

            const formData = new FormData(promptForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            promptDialog.close(); // Close the dialog
            resolve(data); // Resolve the promise with form data
        };

        // Handle clicking outside to close the dialog
        promptDialog.addEventListener("click", (e) => {
            handleOutsideClick(e, promptDialog);
        });

        // Handle cancel button
        cancelPrompt.addEventListener("click", () => {
            promptDialog.close();
            reject("Prompt canceled");
        });
    });
}

// Example usage:
/*document.querySelector("#logo img").addEventListener("click", async () => {
    try{
        const multiInputResult = await _prompt("Test Multiple Inputs", [
            { type: "email", label: "Email", name: "email", placeholder: "Email" },
            { type: "password", label: "Password", name: "password", placeholder: "Password" }
        ]);
        console.log(multiInputResult); // Use the form data
    }catch (error){
        console.error(error); // Handle if prompt is canceled or closed
    }
});*/

