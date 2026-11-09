async function getLLMResponse(question,solution,errorMessage) {

    const cleanCode = solution.map(line => line.trim()).filter(line => line !== '');
    const fullCode = cleanCode.join('\n');
    console.log('Received content - ',question,fullCode )
    try {
      const response = await fetch('SERVER URL', {
      method: 'POST',
      headers: {
              'Content-Type': 'application/json',
              'Authorization': ''
      },
      body: JSON.stringify({
        "body":{
        "question": question,
        "fullCode": fullCode
        }
      })
      });
      console.log('Server response :-',response)
      if (!response.ok) {
        throw new Error('Error communicating with server:- ',response.status);
      }
      else{
        const data = await response.json();
        return data.message;
      }

    } catch (error) {
      console.error("Error communicating with server:", error);
    }
  }

