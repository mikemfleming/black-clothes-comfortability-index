(function () {
  // var host = 'https://ba9wnfs0b3.execute-api.us-east-1.amazonaws.com/dev';
  const host = 'http://localhost:3000';


  const app = document.getElementById('dark-sky-response');
  const indexContainer = document.getElementById('index');
  const indexTitle = document.getElementById('index-title');

  getLocation()
    .then(({ latitude, longitude }) => {
      fetch(`${host}/weather?lat=${latitude}&lng=${longitude}`)
        .then(res => res.json())
        .then(({ currentConditions, index }) => {
          indexTitle.classList.remove('loading');
          indexContainer.innerHTML = index;
          app.innerHTML = JSON.stringify(currentConditions, null, 4);
        });
    });

  // TODO: handle errors here
  function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve(coords)
      );
    });
  }
})();
