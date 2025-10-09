const container = document.getElementById("car-container");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// --- Välimuisti ja tilamuuttujat ---
let cachedCars = [];
let currentIndex = 0;
let currentPage = 1;
const fetchedDetailsCache = {}; // lisätiedot ja lisäkuvat tallessa

// --- Sivukohtaiset korimallit ---
const pageBodyTypesMap = {
  "henkiloautot.html": ["Sedan", "Hatchback", "Fastback", "Liftback", "Crossover", "SAC", "Cabriolet", "Station wagon (estate)"],
  "maastoautot.html": ["Off-road vehicle", "SUV", "SAV"],
  "pakettiautot.html": ["Minivan", "MPV", "Van"],
  "sportti-autot.html": ["Coupe", "Roadster", "Targa", "Coupe-Cabriolet"],
  "lava-autot.html": ["Pick-up"],
  "miniautot.html": ["Quadricycle"]
};

// --- Sivukohtaiset manuaaliset autot ---
const manualCarsMap = {
  "henkiloautot.html": [
    {id:"man1", title:"Kia Niro Hybrid",
      image:"https://upload.wikimedia.org/wikipedia/commons/e/e1/2017_Kia_Niro_2_S-A_Eco_Hybrid_1.6_Rear.jpg",
      alt:"Kia Niro Hybrid, takakuva",
      info:{"Valmistettu":"2016 -","Korimalli":"Crossover", Ovia: 5, Istuimia: 5},
      extraImages:[
        {src:"https://upload.wikimedia.org/wikipedia/commons/c/cc/2022_Kia_Niro_%28facelift%29%2C_rear_5.12.22.jpg", alt:"Kia Niro Hybrid, lisäkuva 1"},
        {src:"https://upload.wikimedia.org/wikipedia/commons/7/7e/2017_Kia_Niro_Interior.jpg", alt:"Kia Niro Hybrid, lisäkuva 2"}
      ]},
    {id:"man2",title:"Opel Astra H",
      image:"https://upload.wikimedia.org/wikipedia/commons/c/c4/Opel_Astra_H_1.6_Twinport_front_20100509.jpg",
      alt:"Opel Astra H, etukuva",
      info:{"Valmistettu":"2004 – 2010 ","Korimalli":"Hatchback", Ovia:5, Istuimia:5},
      extraImages:[
        {src:"https://upload.wikimedia.org/wikipedia/commons/b/b0/Opel_Astra_H_1.6_Twinport_rear_20100509.jpg", alt:"Opel Astra H, lisäkuva 1"},
        {src:"https://upload.wikimedia.org/wikipedia/commons/b/b4/Astra2.JPG", alt:"Opel Astra H, lisäkuva 2"}
      ]},
    {id:"man3",title:"Volkswagen Passat B9",
      image:"https://upload.wikimedia.org/wikipedia/commons/6/65/Volkswagen_Passat_Variant_B9_1X7A1960.jpg",
      alt:"Volkswagen Passat B9, etukuva",
      info:{"Valmistettu":"2023 -","Korimalli":"Station wagon", Ovia:5, Istuimia:5},
      extraImages:[
        {src:"https://upload.wikimedia.org/wikipedia/commons/9/91/Volkswagen_Passat_Variant_B9_IMG_1228.jpg", alt:"Volkswagen Passat B9, lisäkuva 1"},
        {src:"https://upload.wikimedia.org/wikipedia/commons/1/13/Volkswagen_Passat_Variant_B9_Automesse_Ludwigsburg_2024_IMG_1640.jpg", alt:"Volkswagen Passat B9, lisäkuva 2"}
      ]},
    {id:"man4",title:"Toyota Yaris XP130",
      image:"https://upload.wikimedia.org/wikipedia/commons/e/e1/2017_Toyota_Yaris_%28NCP130R%29_Ascent_5-door_hatchback_%282018-10-22%29_01.jpg",
      alt:"Toyota Yaris XP130, etukuva",
      info:{"Valmistettu": "2010 - 2019", "Korimalli":"Hatchback", Ovia:3, Istuimia:5},
      extraImages:[
        {src:"https://upload.wikimedia.org/wikipedia/commons/1/10/2017_Toyota_Yaris_%28NCP130R%29_Ascent_5-door_hatchback_%282018-10-22%29_02.jpg", alt:"Toyota Yaris XP130, lisäkuva 1"}
      ]}
  ],

  "pakettiautot.html": [
    {id:"man1",title:"Volkswagen Touran",
      image:"https://upload.wikimedia.org/wikipedia/commons/4/40/VW_Touran_Highline_Black_Style.jpg",
      alt:"Volkswagen Touran, etukuva",
      info:{"Valmistettu":"2003 -","Korimalli":"MPV", Ovia:5, Istuimia:7},
      extraImages:[
        {src:"https://upload.wikimedia.org/wikipedia/commons/4/42/VW_Touran_2.0_TDI_Facelift_rear.JPG", alt:"Volkswagen Touran, lisäkuva 1"},
        {src:"https://upload.wikimedia.org/wikipedia/commons/5/5a/Volkswagen_Touran_-_wn%C4%99trze_%28MSP16%29.jpg", alt:"Volkswagen Touran, lisäkuva 2"}
      ]},
    {id:"man2",title:"Ford Tourneo Connect",
      image:"https://upload.wikimedia.org/wikipedia/commons/d/d1/Ford_Tourneo_Connect_Active_%283rd_generation%29_Leonberg_2022_1X7A0448.jpg",
      alt:"Ford Tourneo Connect, takakuva",
      info:{"Valmistettu":"2021 -","Korimalli":"Van",Ovia:5,Istuimia:7},
      extraImages:[
        {src:"https://upload.wikimedia.org/wikipedia/commons/e/ee/2025_Ford_Transit_Connect_Limited_PHEV_-_1498cc_1.5_%28150PS%29_Plug-in_Hybrid_-_Frozen_White_-_03-2025%2C_Front.jpg", alt:"Ford Tourneo Connect, lisäkuva 1"},
        {src:"https://upload.wikimedia.org/wikipedia/commons/8/81/2025_Ford_Transit_Connect_Limited_PHEV_-_1498cc_1.5_%28150PS%29_Plug-in_Hybrid_-_Frozen_White_-_03-2025%2C_Rear.jpg", alt:"Ford Tourneo Connect, lisäkuva 2"},
        {src:"https://upload.wikimedia.org/wikipedia/commons/7/70/Ford_Tourneo_Connect_Active_%283rd_generation%29_Auto_Zuerich_2021_IMG_0484.jpg", alt:"Ford Tourneo Connect, lisäkuva 3"}
      ]},
    {id:"man3",title:"Mercedes-Benz V-Class",
      image:"https://upload.wikimedia.org/wikipedia/commons/4/44/Mercedes-Benz_V_250_BlueTEC_Edition_1_Lang_%28V_447%29_%E2%80%93_Frontansicht%2C_18._Oktober_2015%2C_Ratingen.jpg",
      alt:"Mercedes-Benz V-Class, etukuva",
      info:{"Valmistettu":"2014 - ","Korimalli":"Minivan",Ovia:5,Istuimia:8},
      extraImages:[
        {src:"https://upload.wikimedia.org/wikipedia/commons/6/64/Mercedes-Benz_V_250_BlueTEC_Edition_1_Lang_%28V_447%29_%E2%80%93_Heckansicht%2C_18._Oktober_2015%2C_Ratingen.jpg", alt:"Mercedes-Benz V-Class, lisäkuva 1"}
      ]},
    {id:"man4",title:"Citroën Type H",
      image:"https://upload.wikimedia.org/wikipedia/commons/2/2e/Citro%C3%ABn_Typ_H_1981_grey_vl_TCE.jpg",
      alt:"Citroën Type H, etukuva",
      info:{"Valmistettu":"1947 – 1981","Korimalli":"Van",Ovia:3,Istuimia:2},
      extraImages:[
        {src:"https://upload.wikimedia.org/wikipedia/commons/3/34/CitroenHYInt.jpg", alt:"Citroën Type H, lisäkuva 1"}
      ]}
  ],

  "sportti-autot.html": [
    {id:"man1",title:"Porsche 911",
      image:"https://upload.wikimedia.org/wikipedia/commons/1/19/2015_Porsche_911_Carrera_4S_Coupe.jpg",
      alt:"Porsche 911, etukuva",
      info:{"Valmistettu":"2022","Korimalli":"Coupe",Ovia:2,Istuimia:2},
      extraImages:[]},
    {id:"man2",title:"Audi R8",
      image:"https://upload.wikimedia.org/wikipedia/commons/3/36/2015_Audi_R8_Coup%C3%A9_5.2_FSI_quattro_%2819409896583%29.jpg",
      alt:"Audi R8, etukuva",
      info:{"Valmistettu":"2021","Korimalli":"Coupe",Ovia:2,Istuimia:2},
      extraImages:[]},
    {id:"man3",title:"Ferrari Portofino",
      image:"https://upload.wikimedia.org/wikipedia/commons/9/99/Ferrari_Portofino_IMG_0531.jpg",
      alt:"Ferrari Portofino, etukuva",
      info:{"Valmistettu":"2020","Korimalli":"Cabriolet",Ovia:2,Istuimia:2},
      extraImages:[]},
    {id:"man4",title:"Mercedes-AMG GT",
      image:"https://upload.wikimedia.org/wikipedia/commons/4/49/2015-2017_Mercedes-AMG_GT_%28C_190%29_S_coupe_%282017-07-15%29_01.jpg",
      alt:"Mercedes-AMG GT, etukuva",
      info:{"Valmistettu":"2022","Korimalli":"Coupe",Ovia:2,Istuimia:2},
      extraImages:[]}
  ],

  "maastoautot.html": [
    {id:"man1",title:"Jeep Wrangler",
      image:"https://upload.wikimedia.org/wikipedia/commons/f/f4/2018_Jeep_Wrangler_Unlimited_Sport_4-door_front_6.10.18.jpg",
      alt:"Jeep Wrangler, etukuva",
      info:{"Valmistettu":"2017","Korimalli":"SUV",Ovia:4,Istuimia:5},
      extraImages:[]},
    {id:"man2",title:"Toyota RAV4",
      image:"https://upload.wikimedia.org/wikipedia/commons/6/6d/2019_Toyota_RAV4_XLE_AWD%2C_front_12.31.19.jpg",
      alt:"Toyota RAV4, etukuva",
      info:{"Valmistettu":"2021","Korimalli":"Crossover",Ovia:5,Istuimia:5},
      extraImages:[]},
    {id:"man3",title:"Land Rover Discovery",
      image:"https://upload.wikimedia.org/wikipedia/commons/3/3b/Land_Rover_Discovery_4_HSE_2016.jpg",
      alt:"Land Rover Discovery, etukuva",
      info:{"Valmistettu":"2019","Korimalli":"SUV",Ovia:5,Istuimia:7},
      extraImages:[]},
    {id:"man4",title:"Nissan X-Trail",
      image:"https://upload.wikimedia.org/wikipedia/commons/3/35/Nissan_X-Trail_%28T33%29_1X7A7179.jpg",
      alt:"Nissan X-Trail, etukuva",
      info:{"Valmistettu":"2020","Korimalli":"SAV",Ovia:5,Istuimia:5},
      extraImages:[]}
  ],

  "lava-autot.html": [
    {id:"man1",title:"Ford Ranger",
      image:"https://upload.wikimedia.org/wikipedia/commons/0/02/2019_Ford_Ranger_XLT_Super_Cab_FX4_front_6.1.19.jpg",
      alt:"Ford Ranger, etukuva",
      info:{"Valmistettu":"2021","Korimalli":"Pick-up",Ovia:2,Istuimia:5},
      extraImages:[]},
    {id:"man2",title:"Toyota Hilux",
      image:"https://upload.wikimedia.org/wikipedia/commons/b/ba/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Rear.jpg",
      alt:"Toyota Hilux, takakuva",
      info:{"Valmistettu":"2020","Korimalli":"Pick-up",Ovia:4,Istuimia:5},
      extraImages:[]},
    {id:"man3",title:"Nissan Navara",
      image:"https://upload.wikimedia.org/wikipedia/commons/2/22/Nissan_Navara_Pickup.jpg",
      alt:"Nissan Navara, etukuva",
      info:{"Valmistettu":"2010","Korimalli":"Pick-up",Ovia:4,Istuimia:5},
      extraImages:[]},
    {id:"man4",title:"Mitsubishi L200",
      image:"https://upload.wikimedia.org/wikipedia/commons/7/78/Mitsubishi_L200_Dakar_HP_2021_%2852325676526%29.jpg",
      alt:"Mitsubishi L200, etukuva",
      info:{"Valmistettu":"2021","Korimalli":"Pick-up",Ovia:4,Istuimia:5},
      extraImages:[]}
  ],

  "miniautot.html": [
    {id:"man1",title:"Renault Twizy",
      image:"https://upload.wikimedia.org/wikipedia/commons/c/c8/Renault_Twizy_electric_car.jpg",
      alt:"Renault Twizy, sivukuva",
      info:{"Valmistettu":"2021","Korimalli":"Quadricycle",Ovia:2,Istuimia:2},
      extraImages:[]},
    {id:"man2",title:"Ligier JS50",
      image:"https://upload.wikimedia.org/wikipedia/commons/7/70/Ligier_JS50_%28MSP15%29.JPG",
      alt:"Ligier JS50, etukuva",
      info:{"Valmistettu":"2020","Korimalli":"Quadricycle",Ovia:3,Istuimia:2},
      extraImages:[]},
    {id:"man3",title:"Microcar M.Go",
      image:"https://upload.wikimedia.org/wikipedia/commons/4/42/Microcar_M.GO_Dynamic_%28MSP15%29.JPG",
      alt:"Microcar M.Go, etukuva",
      info:{"Valmistettu":"2022","Korimalli":"Quadricycle",Ovia:3,Istuimia:4},
      extraImages:[]},
    {id:"man4",title:"Aixam Mega e-City",
      image:"https://upload.wikimedia.org/wikipedia/commons/3/3b/MegaCityCar.jpg",
      alt:"Aixam Mega e-City, etukuva",
      info:{"Valmistettu":"2021","Korimalli":"Quadricycle",Ovia:2,Istuimia:4},
      extraImages:[]}
  ]
};


// --- Hae nykyinen sivu ---
const currentPageName = window.location.pathname.split("/").pop();
const bodyTypes = pageBodyTypesMap[currentPageName] || ["Sedan","Hatchback","Fastback","Liftback"];
const manualCars = manualCarsMap[currentPageName] || [];

// --- Luo kortti ---
function createCarCard(car){
  const card = document.createElement("div");
  card.className = "car-card";
  const img = document.createElement("img");
  img.src = car.image;
  img.alt = car.alt || `${car.title}, etukuva`;
  const title = document.createElement("div");
  title.className = "car-title";
  title.textContent = car.title.replace(/\s*\(.*?\)/g, '').trim() || "Tuntematon auto";
  card.appendChild(img);
  card.appendChild(title);
  card.addEventListener("click", ()=>openCarModal(car));
  return card;
}

// --- Näytä manuaaliset aluksi ---
function displayInitialImages(){
  manualCars.forEach(car => container.appendChild(createCarCard(car)));
}

// --- Hae autoja API:sta ---
async function fetchCarsFromAPI(){
  let allResults = [];
  // Valitaan yksi satunnainen korimalli
  const selectedBody = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
  const selectedBodies = [selectedBody];

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "010924e3e5mshf6b91441d0c7055p1146c6jsn3a718c9dc7e2",
      "x-rapidapi-host": "cars-database-with-image.p.rapidapi.com"
    }
  };

  const placeholder = "https://www.auto-data.net/img/no.jpg";

  // jotta emme lisää samoja autoja kahdesti eri kutsuissa ---
  const seenKeys = new Set();
  cachedCars.forEach(car => {
    const baseTitle = (car.title || "").replace(/\s*\(.*?\)/g, '').trim().toLowerCase();
    const imageNorm = (car.image || "").split('?')[0].trim().toLowerCase();
    if (baseTitle || imageNorm) seenKeys.add(`${baseTitle}|${imageNorm}`);
  });

  // Haetaan valituilla korimalleilla 
  for(const body of selectedBodies){
    const res = await fetch(`https://cars-database-with-image.p.rapidapi.com/api/search?q=${encodeURIComponent(body)}&page=${currentPage}`, options);
    if (!res.ok) {
      if (res.status === 429) {
        const err = new Error("API quota limit reached");
        err.status = 429;
        throw err;
      } else {
        const err = new Error("Failed to fetch cars: " + res.status);
        err.status = res.status;
        throw err;
      }
    }
    const data = await res.json();

    if (data.results){
      data.results.forEach(car => {
        if (!car.image || car.image === placeholder) return; // suodatetaan placeholderit
        // Normalisoidaan kuva (poista query-string tms.)
        const imageNorm = car.image.split('?')[0].trim().toLowerCase();
        const titleNorm = (car.title || "").replace(/\s*\(.*?\)/g, '').trim().toLowerCase();
        const uniqueKey = `${titleNorm}|${imageNorm}`;

        // Tarkistetaan, ettei ole nähty (ei kaikissa aiemmissa kutsuissa eikä tässä batchissa)
        if (!seenKeys.has(uniqueKey)) {
          seenKeys.add(uniqueKey);
          allResults.push({
            id: car.id,
            title: car.title,
            image: car.image
          });
        }
      });
    }
  }

  // Lisätään välimuistiin
  cachedCars.push(...allResults);
  currentPage++;
}



// --- Näytä seuraavat 4 autoa välimuistista ---
function showNextCars(count = 4){
  const nextBatch = cachedCars.slice(currentIndex,currentIndex+count);
  nextBatch.forEach(car => container.appendChild(createCarCard(car)));
  currentIndex += nextBatch.length;
}


// --- Näytä lisää painike ---
async function handleLoadMore() {
  const errorMessage = document.getElementById("error-message");
  if (errorMessage) errorMessage.textContent = ""; // tyhjennetään vanha virhe

  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = "Ladataan...";
  loadMoreBtn.style.opacity = "0.6";

  let fetchError = null;

  try {
    // Haetaan lisää autoja apista, jos tarvitaan
    if (currentIndex >= cachedCars.length) {
      await fetchCarsFromAPI();
    }

    showNextCars();

  } catch (error) {
    fetchError = error;
    console.error("Virhe autojen latauksessa:", error);

    if (error.status === 429 || (error.message && (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("limit")))) {
      if (errorMessage) {
        errorMessage.innerHTML = `
        <span style="font-size: 35px; font-weight: bold;">Hupsista!</span><br>
        Autoja on katsottu niin ahkerasti, että kirjan sivut ovat päässeet loppumaan. <br> Palaa myöhemmin tutkimaan lisää autoja!`;
      }
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = "0.6";
      loadMoreBtn.style.backgroundColor = "gray";
      loadMoreBtn.textContent = "Sivut loppu";
      return;
    } else {
      if (errorMessage) {
        errorMessage.innerHTML = `
        <span style="font-size: 22px; font-weight: bold;">Hmmm...</span><br>
        Autot taisivat eksyä matkalla. <br> Yritä uudelleen!`;
      }
      // anna käyttäjän yrittää uudelleen
      loadMoreBtn.disabled = false;
      loadMoreBtn.style.opacity = "1";
      loadMoreBtn.textContent = "Yritä uudelleen ▶▶▶";
      return;
    }

  } finally {
    // jos ei tullut quota- tai muu virhe, palautetaan nappi normaaliin tilaan
    if (!fetchError) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.style.opacity = "1";
      loadMoreBtn.textContent = "Näytä lisää ▶▶▶";
    }
  }
}


// --- Modaali ---
async function openCarModal(car){
  // Haetaan modaalin elementit
  const modalTitle = document.getElementById("carModalLabel");
  const modalMainImage = document.getElementById("modalMainImage");
  const modalExtraImages = document.getElementById("modalExtraImages");
  const modalInfo = document.getElementById("modalInfo");
  // Tyhjennetään vanhat tiedot
  modalTitle.textContent = car.title.replace(/\s*\(.*?\)/g, '').trim();
  modalMainImage.src = car.image;
  modalExtraImages.innerHTML = "";
  modalInfo.innerHTML = "";
  modalMainImage.classList.remove("zoomed");

  // Jos manuaalinen auto, näytetään suoraan tiedot
  if(car.id.startsWith("man")){
    // tiedot
    const infoHTML = Object.entries(car.info).map(([k,v])=>`<b>${k}:</b> ${v}`).join("<br>");
    modalInfo.innerHTML = infoHTML;
  
    // Lisäkuvat
    const extraImages = car.extraImages || [];
    let activeThumb = null;
  
    if(extraImages.length > 0){
      // pääkuva pikkukuvaksi
      const mainThumb = document.createElement("img");
      mainThumb.src = modalMainImage.src;
      mainThumb.className = "img-thumbnail active-thumbnail";
      mainThumb.style.width = "100px";
      mainThumb.style.cursor = "pointer";
      activeThumb = mainThumb;
      mainThumb.addEventListener("click", () => {
        modalMainImage.src = car.image;
        if (activeThumb) activeThumb.classList.remove("active-thumbnail");
        mainThumb.classList.add("active-thumbnail");
        activeThumb = mainThumb;
      });
      modalExtraImages.appendChild(mainThumb);
  
      // muut lisäkuvat
      extraImages.forEach(src => {
        const thumb = document.createElement("img");
        thumb.src = src;
        thumb.className = "img-thumbnail";
        thumb.style.width = "100px";
        thumb.style.cursor = "pointer";
        thumb.addEventListener("click", () => {
          modalMainImage.src = src;
          if(activeThumb) activeThumb.classList.remove("active-thumbnail");
          thumb.classList.add("active-thumbnail");
          activeThumb = thumb;
        });
        modalExtraImages.appendChild(thumb);
      });
    }
  } else {
    // Muuten haetaan lisätiedot API:sta, jos ei ole jo haettu
    if(!fetchedDetailsCache[car.id]){
      const options = {
        method:"GET",
        headers:{
          "x-rapidapi-key":"010924e3e5mshf6b91441d0c7055p1146c6jsn3a718c9dc7e2",
          "x-rapidapi-host":"cars-database-with-image.p.rapidapi.com"
        }
      };
      // Haetaan tiedot
      try{
        const res = await fetch(`https://cars-database-with-image.p.rapidapi.com/api/car/${car.id}`,options);
        const data = await res.json();
        const general = data.specifications.general_information || {};

        // Poimitaan valmistusvuodet Start/End
        const startMatch = general["Start of production"]?.match(/\d{4}/);
        const endMatch = general["End of production"]?.match(/\d{4}/);
        const production = startMatch ? (endMatch ? `${startMatch[0]} – ${endMatch[0]}` : startMatch[0]) : "Ei tietoa";

        // Muut tiedot
        const info={
          "Valmistettu": production,
          "Korimalli": general["Body type"] || "Ei tietoa",
          Ovia: general.Doors || "Ei tietoa",
          Istuimia: general.Seats || "Ei tietoa"
        };

        // Poimitaan lisäkuvat (max 6)  
        const extraImages = (data.other_images||[]).slice(0,6).map(img=>img.src);
        fetchedDetailsCache[car.id] = {info,extraImages};
      }catch(error){
        console.error("Virhe haettaessa lisätietoja",error);
        fetchedDetailsCache[car.id] = {info:{},extraImages:[]};
      }
    }

    // Täytetään modaali tiedoilla
    const { info, extraImages } = fetchedDetailsCache[car.id];

    // Pidetään kirjaa aktiivisesta pikkukuvasta
    let activeThumb = null;

    // Jos lisäkuvia on, lisätään pääkuva niiden alkuun
    if (extraImages && extraImages.length > 0) {
      const mainThumb = document.createElement("img");
      mainThumb.src = modalMainImage.src; // pääkuva
      mainThumb.className = "img-thumbnail";
      mainThumb.style.width = "100px";
      mainThumb.style.cursor = "pointer";
      mainThumb.classList.add("active-thumbnail");
      activeThumb = mainThumb;

      mainThumb.addEventListener("click", () => {
        modalMainImage.src = car.image;
        if (activeThumb) activeThumb.classList.remove("active-thumbnail");
        mainThumb.classList.add("active-thumbnail");
        activeThumb = mainThumb;
      });

      modalExtraImages.appendChild(mainThumb);
    }

    // Lisäkuvat
    extraImages.forEach(src => {
      const thumb = document.createElement("img");
      thumb.src = src;
      thumb.className = "img-thumbnail";
      thumb.style.width = "100px";
      thumb.style.cursor = "pointer";
      thumb.style.border = "none"
      thumb.addEventListener("click", () => {
        modalMainImage.src = src;
        if (activeThumb) activeThumb.classList.remove("active-thumbnail");
        thumb.classList.add("active-thumbnail");
        activeThumb = thumb;
      });
      modalExtraImages.appendChild(thumb);
    });
    
    // Jos ei lisäkuvia, piilotetaan osio
    const infoHTML=Object.entries(info).map(([k,v])=>`<b>${k}:</b> ${v}`).join("<br>");
    modalInfo.innerHTML=infoHTML;
  }
  const modal=new bootstrap.Modal(document.getElementById("carModal"));
  modal.show();
}

// --- Zoom ---
const zoomBtn=document.getElementById("zoomBtn");
const modalMainImage=document.getElementById("modalMainImage");
zoomBtn.addEventListener("click",()=>modalMainImage.classList.toggle("zoomed"));
modalMainImage.addEventListener("click",()=>modalMainImage.classList.toggle("zoomed"));

displayInitialImages();
loadMoreBtn.addEventListener("click",handleLoadMore);
