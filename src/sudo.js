async function addNewMember(formData){
    fetch('https://osc-admin.netlify.app/.netlify/functions/addNewMember', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'sPassword',
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    // _alert("success", "Member Added", `${user.email} was added successfully !`);
}

window.sudoPage = function(){

    // Submit Add New Member Form
    const newMemberForm = document.querySelector(".members #addMember form");
    newMemberForm.onsubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(newMemberForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        addNewMember(data);
    };
}