
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
        'x-rapidapi-key': '8d4fd8fef3msh863adeb8b473c81p1bae23jsndf9c89073076',
        'x-rapidapi-host': 'cars-database-with-image.p.rapidapi.com'
      }
    };
  
    // --- SATUNNAINEN AUTOSIVU HAKU ---
    async function fetchRandomCars() {
      try {
        const randomPage = Math.floor(Math.random() * 50) + 1; // satunnainen sivu 1–50
        const response = await fetch(`https://cars-database-with-image.p.rapidapi.com/api/search?q=&page=${randomPage}`, options);
        const data = await response.json();
  
        if (!data.results?.length) {
          titleEl.innerText = "Uusia autoja ei saatavilla juuri nyt";
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
          titleEl.innerText = "Sopivia autoja ei löytynyt";
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
  
    // --- PAINIKKEIDEN TOIMINNOT ---
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