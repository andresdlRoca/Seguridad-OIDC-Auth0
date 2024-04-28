import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";
import axios from 'axios';

function App() {
  const { 
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
   } = useAuth0();

   function callApi() {
    //Calls /
    axios.get('http://localhost:4000/')
    .then(response => {
      console.log(response.data);
      alert(response.data);
    })
    .catch(error => console.log(error.message))
   }

   async function callProtectedApi() {
    try {
      // Se manda el token en el header
      const token = await getAccessTokenSilently();
      console.log("Access_token: " + token);
      await axios.get('http://localhost:4000/protected', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        console.log(response.data);
        alert("Hola desde la ruta protegida");
      });
      // console.log(response.data);
    } catch (error) {
      console.error(error);
      const error_string = "Error: " + error.message;
      alert(error_string);
    }
   }

  if (isLoading) {
    return <h1>Cargando...</h1>
  }

  return (
    <div className="App">
      <h1>Auth0 Example</h1>

      <button onClick={loginWithPopup} disabled={isAuthenticated}>Login con Popup</button>
      <br></br>
      <button onClick={loginWithRedirect} disabled={isAuthenticated}>Login con redirect</button>
      <br></br>
      <button onClick={logout} disabled={!isAuthenticated}>Logout</button>
      <br></br>
      <button onClick={callApi}>Llamar API Route</button>
      <br></br>
      <button onClick={callProtectedApi}>Llamar Protect API Route / Verificacion JWT</button>


      <h3>El usuario {isAuthenticated ? "esta autenticado" : "no esta autenticado"}</h3>
      { isAuthenticated && (
        <Profile />
      )}
    </div>
  );
}

export default App;
 