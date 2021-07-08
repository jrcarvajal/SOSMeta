export const Urls = name => {
    const username = name.toLowerCase().trim();
    return fetch('http://190.60.95.14/wsnotas/testU2.php?codigo=' + username, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((response) => response.json())    
      .catch(error => console.warn(error));
  }//Fin funcion 