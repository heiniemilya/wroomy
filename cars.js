
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
      browseBtn.disabled = true;
      browseBtn.textContent = "Ladataan...";

      const randomPage = Math.floor(Math.random() * 50) + 1; // satunnainen sivu 1–50
      const response = await fetch(`https://cars-database-with-image.p.rapidapi.com/api/search?q=&page=${randomPage}`, options);
      const data = await response.json();

      if (!data.results?.length) {
        titleEl.innerText = "Uusia autoja ei saatavilla juuri nyt";
        browseBtn.textContent = "Selaa";
        browseBtn.disabled = false;
        return;
      }

      const placeholder = "https://www.auto-data.net/img/no.jpg";
      const seen = new Set();

      //autojen filtteröinti niin ettei samat toistuisi
      cars = data.results.filter(car => {
        const baseModel = car.title?.split('(')[0].trim();
        if (!car.image || car.image === placeholder || seen.has(baseModel)) return false;
        seen.add(baseModel);
        return true;
      });

      if (!cars.length) {
        titleEl.innerText = "Sopivia autoja ei löytynyt";
        browseBtn.textContent = "Selaa";
        browseBtn.disabled = false;
        return;
      }

      currentIndex = Math.floor(Math.random() * cars.length);
      showCar(currentIndex);
    } catch (error) {
      console.error("Virhe haettaessa autoja:", error);
      titleEl.innerText = "Autojen tietoja ei saatu ladattua";
    } finally {
      browseBtn.textContent = "Selaa";
      browseBtn.disabled = false;
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
    browseBtn.disabled = true;
    browseBtn.textContent = "Ladataan...";
  
    // Haetaan satunnainen auto
    await fetchRandomCars();
  
    // Odotetaan, että kuva latautuu
    imgEl.onload = () => {
      browseBtn.style.display = "none";      // piilotetaan “Näytä seuraava” nappi
      carDisplay.style.display = "block";    // näytetään edellinen/seuraava-napit
      imgEl.onload = null;                   // estetään moninkertainen triggeröinti
    };
  });
  

 // edellinen-nappi
prevBtn.addEventListener('click', () => {
  if (!cars.length) return;

  prevBtn.disabled = true;
  nextBtn.disabled = true;         
  prevBtn.style.opacity = "0.5";
  nextBtn.style.opacity = "0.5";

  const newIndex = (currentIndex - 1 + cars.length) % cars.length;
  imgEl.onload = () => {
    currentIndex = newIndex;
    showCar(currentIndex); 
    prevBtn.style.opacity = "1";
    nextBtn.style.opacity = "1";
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    imgEl.onload = null;
  };

  imgEl.src = cars[newIndex].image;          
});

// seuraava-nappi
nextBtn.addEventListener('click', () => {
  if (!cars.length) return;

  prevBtn.disabled = true;
  nextBtn.disabled = true;
  prevBtn.style.opacity = "0.5";
  nextBtn.style.opacity = "0.5";

  const newIndex = (currentIndex + 1) % cars.length;
  imgEl.onload = () => {
    currentIndex = newIndex;
    showCar(currentIndex); 
    prevBtn.style.opacity = "1";
    nextBtn.style.opacity = "1";
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    imgEl.onload = null;
  };

  imgEl.src = cars[newIndex].image;
});


////////////////////// SATUNNAISET AUTOT /////////////////////