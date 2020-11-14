export const register = (entityId) => {
    fetch('https://acutelinkapi.azurewebsites.net/api/client/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'text/plain',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            entityId: entityId, 
            name: 'General Practioneer 1',
        })
        }).then(response => response.json())
        .then((jsonData) => {
            console.log(jsonData); // log the json response
            localStorage.setItem('clientId', jsonData['id']); // save the ID
        }).catch((error) => {
            // handle errors here
            console.error(error);
    })
}

export const get_clients = () => {
        fetch('https://acutelinkapi.azurewebsites.net/api/client/clients', {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin'
    }).then(response => response.json())
        .then((jsonData) => {
        // jsonData is parsed json object received from url
        console.log(jsonData);
    }).catch((error) => {
        // handle errors here
        console.error(error);
    })
}

export const send_alive = () => {
    console.log(JSON.stringify({
          id: this.id,
      }));
    fetch('https://acutelinkapi.azurewebsites.net/api/client/alive', {
      method: 'POST',
      mode: 'cors',
      headers: {
       'Accept': 'text/plain',
       'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
          id: this.id,
      })
  }).then((response) => {
  // we just log the respons for now
  console.log(response)})
  .catch((error) => {
  // handle your errors here
  console.error(error)
  })
}