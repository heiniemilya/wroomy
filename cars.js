/* const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '3b2dcd11d0msh6db74f18a0496dcp11e96fjsn291ee45372f1',
      'x-rapidapi-host': 'cars-database-with-image.p.rapidapi.com'
    }
  };
  
  ////////////////////// SATUNNAISET AUTOT /////////////////////
  // Hae satunnaiset autot (voit hakea esim. Ford tai yleiset autot)
  async function fetchRandomCars() {
    try {
      const response = await fetch(`https://cars-database-with-image.p.rapidapi.com/api/search?q=&page=1`, options);
      const data = await response.json();
  
      if (!data.results || data.results.length === 0) {
        document.getElementById('random-car-title').innerText = "Ei autoja saatavilla";
        return;
      }
  
      // Poistetaan placeholderit ja duplikaatit
      const placeholder = "https://www.auto-data.net/img/no.jpg";
      const seenImages = new Set();
      cars = data.results.filter(car => car.image && car.image !== placeholder && !seenImages.has(car.image))
                         .map(car => {
                           seenImages.add(car.image);
                           return car;
                         });
  
      // Näytetään satunnainen auto aluksi
      currentIndex = Math.floor(Math.random() * cars.length);
      showCar(currentIndex);
  
    } catch (error) {
      console.error("Virhe haettaessa autoja:", error);
      document.getElementById('random-car-title').innerText = "Autojen tietoja ei saatu ladattua";
    }
  }
  
  // Näytä auto annetulla indeksillä
  function showCar(index) {
    if (cars.length === 0) return;
    const car = cars[index];
    let title = car.title || "";
    title = title.replace(/\(.*?\)/g, '').trim(); // poista turhat tiedot
    document.getElementById('random-car-title').innerText = title;
    document.getElementById('random-car-img').src = car.image;
  }
  
  // Nappien eventit
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (cars.length === 0) return;
    currentIndex = (currentIndex - 1 + cars.length) % cars.length;
    showCar(currentIndex);
  });
  
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (cars.length === 0) return;
    currentIndex = (currentIndex + 1) % cars.length;
    showCar(currentIndex);
  });
  
  // Lataa autot sivun latauksessa
  fetchRandomCars();
////////////////////// SATUNNAISET AUTOT ///////////////////////

////////////////////// HAE AUTO TYYPIN MUKAAN ///////////////////////
 // Kuinka monta satunnaista autoa halutaan näyttää
const RANDOM_COUNT = 6;

async function fetchCarsByBodyType(bodyType) {
  const gallery = document.getElementById('car-gallery');
  gallery.innerHTML = "<p>Ladataan autoja...</p>";

  try {
    const response = await fetch(
      `https://cars-database-with-image.p.rapidapi.com/api/search/advanced?body_type[]=${encodeURIComponent(bodyType)}&page=1`,
      options
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      gallery.innerHTML = "<p>Ei löytynyt autoja.</p>";
      return;
    }

    const placeholder = "https://www.auto-data.net/img/no.jpg";
    const validCars = data.results.filter(car => car.image && car.image !== placeholder);

    if (validCars.length === 0) {
      gallery.innerHTML = "<p>Ei kuvia saatavilla.</p>";
      return;
    }

    // Otetaan satunnaiset 6 autoa
    const randomCars = validCars.sort(() => 0.5 - Math.random()).slice(0, RANDOM_COUNT);

    gallery.innerHTML = randomCars.map(car => {
      let title = car.title?.replace(/\(.*?\)/g, '').trim() || "";
      return `
        <div class="col-6 col-md-4">
          <div class="card h-100 shadow-sm">
            <img src="${car.image}" class="card-img-top" alt="${title}">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text small text-muted">${car.body_type || ""}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    gallery.innerHTML = "<p>Virhe ladattaessa autoja.</p>";
  }
}

// Käynnistetään automaattisesti, jos BODY_TYPE on määritelty
if (typeof BODY_TYPE !== 'undefined') {
  fetchCarsByBodyType(BODY_TYPE);
}
  
////////////////////// HAE AUTO TYYPIN MUKAAN /////////////////////// */


////////////////////// SATUNNAISET AUTOT /////////////////////
/* 
const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '3b2dcd11d0msh6db74f18a0496dcp11e96fjsn291ee45372f1',
      'x-rapidapi-host': 'cars-database-with-image.p.rapidapi.com'
    }
  };
  
  // --- Yleiset muuttujat ---
  let cars = [];
  let currentIndex = 0;
  
  // --- 1️⃣ SATUNNAINEN AUTO ETUSIVULLE ---
  async function fetchRandomCars() {
    // Tarkistetaan että elementit on olemassa
    const titleEl = document.getElementById('random-car-title');
    const imgEl = document.getElementById('random-car-img');
    if (!titleEl || !imgEl) return; // ei tehdä mitään jos ei olla etusivulla
  
    try {
      const response = await fetch('https://cars-database-with-image.p.rapidapi.com/api/search?q=&page=1', options);
      const data = await response.json();
  
      if (!data.results?.length) {
        titleEl.innerText = "Ei autoja ei juuri nyt saatavilla";
        return;
      }
  
      const placeholder = "https://www.auto-data.net/img/no.jpg";
      const seenImages = new Set();
      cars = data.results.filter(car =>
        car.image && car.image !== placeholder && !seenImages.has(car.image)
      ).map(car => {
        seenImages.add(car.image);
        return car;
      });
  
      currentIndex = Math.floor(Math.random() * cars.length);
      showCar(currentIndex);
    } catch (error) {
      console.error("Virhe haettaessa autoja:", error);
      titleEl.innerText = "Autojen tietoja ei saatu ladattua";
    }
  }
  
  function showCar(index) {
    if (!cars.length) return;
    const car = cars[index];
    const titleEl = document.getElementById('random-car-title');
    const imgEl = document.getElementById('random-car-img');
    if (!titleEl || !imgEl) return;
  
    let title = car.title?.replace(/\(.*?\)/g, '').trim() || "";
    titleEl.innerText = title;
    imgEl.src = car.image;
  }
  
  // Nappien eventit (vain jos napit on olemassa)
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (!cars.length) return;
      currentIndex = (currentIndex - 1 + cars.length) % cars.length;
      showCar(currentIndex);
    });
  
    nextBtn.addEventListener('click', () => {
      if (!cars.length) return;
      currentIndex = (currentIndex + 1) % cars.length;
      showCar(currentIndex);
    });
  }
  
  // --- 2️⃣ AUTOTYYPPIEN SIVUT (esim. maastoautot.html) ---
  const RANDOM_COUNT = 6;
  
  async function fetchCarsByBodyType(bodyType) {
    const gallery = document.getElementById('car-gallery');
    if (!gallery) return;
  
    gallery.innerHTML = "<p>Ladataan autoja...</p>";
  
    try {
      const response = await fetch(
        `https://cars-database-with-image.p.rapidapi.com/api/search/advanced?body_type[]=${encodeURIComponent(bodyType)}&page=1`,
        options
      );
      const data = await response.json();
  
      if (!data.results?.length) {
        gallery.innerHTML = "<p>Ei löytynyt autoja.</p>";
        return;
      }
  
      const placeholder = "https://www.auto-data.net/img/no.jpg";
      const validCars = data.results.filter(car => car.image && car.image !== placeholder);
  
      const randomCars = validCars.sort(() => 0.5 - Math.random()).slice(0, RANDOM_COUNT);
  
      gallery.innerHTML = randomCars.map(car => {
        let title = car.title?.replace(/\(.*?\)/g, '').trim() || "";
        return `
          <div class="col-6 col-md-4">
            <div class="card h-100 shadow-sm">
              <img src="${car.image}" class="card-img-top" alt="${title}">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text small text-muted">${car.body_type || ""}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      console.error(err);
      gallery.innerHTML = "<p>Virhe ladattaessa autoja.</p>";
    }
  }
  
  // --- 3️⃣ Käynnistys ---
  window.addEventListener('DOMContentLoaded', () => {
    fetchRandomCars(); // toimii vain jos ollaan etusivulla
  
    if (typeof BODY_TYPE !== 'undefined') {
      fetchCarsByBodyType(BODY_TYPE);
    }
  }); */
  


////////////////////// SATUNNAISET AUTOT /////////////////////

  const browseBtn = document.getElementById('browseCarsBtn');
    const carDisplay = document.getElementById('car-display');
    const titleEl = document.getElementById('random-car-title');
    const imgEl = document.getElementById('random-car-img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
  
    let cars = [];
    let currentIndex = 0;
  
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'b43b477174msh880f765341251b6p1fa2b0jsnf445753a6ca4',
        'x-rapidapi-host': 'cars-database-with-image.p.rapidapi.com'
      }
    };
  
    // --- 1️⃣ SATUNNAINEN AUTOSIVU HAKU ---
    async function fetchRandomCars() {
      try {
        const randomPage = Math.floor(Math.random() * 50) + 1; // satunnainen sivu 1–50
        const response = await fetch(`https://cars-database-with-image.p.rapidapi.com/api/search?q=&page=${randomPage}`, options);
        const data = await response.json();
  
        if (!data.results?.length) {
          titleEl.innerText = "Ei autoja saatavilla juuri nyt";
          return;
        }
  
        const placeholder = "https://www.auto-data.net/img/no.jpg";
        const seen = new Set();
  
        cars = data.results.filter(car => {
          // suodatetaan pois duplikaatit ja placeholder-kuvat
          const baseModel = car.title?.split('(')[0].trim();
          if (!car.image || car.image === placeholder || seen.has(baseModel)) return false;
          seen.add(baseModel);
          return true;
        });
  
        if (!cars.length) {
          titleEl.innerText = "Ei sopivia autoja löytynyt";
          return;
        }
  
        currentIndex = Math.floor(Math.random() * cars.length);
        showCar(currentIndex);
      } catch (error) {
        console.error("Virhe haettaessa autoja:", error);
        titleEl.innerText = "Autojen tietoja ei saatu ladattua";
      }
    }
  
    function showCar(index) {
      if (!cars.length) return;
      const car = cars[index];
      const title = car.title?.replace(/\(.*?\)/g, '').trim() || "Tuntematon auto";
      titleEl.innerText = title;
      imgEl.src = car.image;
    }
  
    // --- 2️⃣ PAINIKKEIDEN TOIMINNOT ---
    browseBtn.addEventListener('click', async () => {
      browseBtn.style.display = "none";   // piilotetaan selaa-nappi
      carDisplay.style.display = "block"; // näytetään autot
      await fetchRandomCars();
    });
  
    prevBtn.addEventListener('click', () => {
      if (!cars.length) return;
      currentIndex = (currentIndex - 1 + cars.length) % cars.length;
      showCar(currentIndex);
    });
  
    nextBtn.addEventListener('click', () => {
      if (!cars.length) return;
      currentIndex = (currentIndex + 1) % cars.length;
      showCar(currentIndex);
    });

////////////////////// SATUNNAISET AUTOT /////////////////////