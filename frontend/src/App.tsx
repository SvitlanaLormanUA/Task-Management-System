
import './App.css'

function App() {
  function getData() {
    fetch('http://127.0.0.1:5000')
      .then((response) => response.json())
      .then((data) => console.log(data))
  }

  return (
    <>
      <h1>React App</h1>
      <button onClick={getData}>Get Data</button>
    </>
  )
}

export default App
