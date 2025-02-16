export function _getData() {
    fetch('http://127.0.0.1:5000')
      .then((response) => response.json())
      .then((data) => console.log(data))
  }
