export const get_messages = () => {
    fetch('https://acutelinkapi.azurewebsites.net/api/chat/receive?clientId=' + this.client_id, {
        method: 'GET',
        mode: 'cors',
        headers: {
         'Accept': 'text/plain',
         'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    	}).then((response) => {
          console.log(response); // log data
			 if (response['statusText'] == 'OK') {
				// we have data
				response.json().then((jsonData) => {
					this.setState({messages: jsonData[0]['messages']});
				})
			 }          
      })
    	.catch((error) => {
    	// handle your errors here
    	console.error(error)
    	})
  }