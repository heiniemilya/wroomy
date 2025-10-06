const container = document.getElementById("car-container");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let cachedCars = [];
let currentIndex = 0;
let currentPage = 1;
const fetchedDetailsCache = {}; // lisätiedot ja lisäkuvat tallessa

// --- Sivukohtaiset bodytypet ---
const pageBodyTypesMap = {
  "henkiloautot.html": ["Sedan","Hatchback","Fastback","Liftback"],
  "maastoautot.html": ["Off-road vehicle","SUV","Crossover","SAV","SAC"],
  "pakettiautot.html": ["Minivan","MPV","Van"],
  "urheiluautot.html": ["Cabriolet","Coupe","Targa","Roadster","Coupe-Cabriolet"],
  "lava-autot.html": ["Pick-up"],
  "miniautot.html": ["Quadricycle"]
};

// --- Sivukohtaiset manuaaliset autot ---
const manualCarsMap = {
  "henkiloautot.html": [
    {id:"man1",title:"Kia Niro",image:"img/cars/kia-niro-hyundai-motor-group-AoqTa019vFw-unsplash.jpg",info:{"Valmistettu":"2023","Korimalli":"SUV",Ovia:5,Istuimia:5},extraImages:[]},
    {id:"man2",title:"Opel Astra",image:"img/cars/opel-astra-youssef-d-DkGUn0Y1VzA-unsplash.webp",info:{"Valmistettu":"2022","Korimalli":"Hatchback",Ovia:5,Istuimia:5},extraImages:[]},
    {id:"man3",title:"Volkswagen Passat",image:"img/cars/passat-pexels-esmihel-15256362.jpg",info:{"Valmistettu":"2021","Korimalli":"Sedan",Ovia:5,Istuimia:5},extraImages:[]},
    {id:"man4",title:"Toyota Yaris",image:"img/cars/yaris-heri-susilo-kwgTG2TETPs-unsplash.webp",info:{"Valmistettu":"2020","Korimalli":"Hatchback",Ovia:5,Istuimia:5},extraImages:[]}
  ],
  "pakettiautot.html": [
    {id:"man1",title:"Volkswagen Touran",image:"https://upload.wikimedia.org/wikipedia/commons/4/40/VW_Touran_Highline_Black_Style.jpg",info:{"Valmistettu":"2019","Korimalli":"MPV",Ovia:5,Istuimia:7},extraImages:[]},
    {id:"man2",title:"Ford Transit Connect",image:"https://upload.wikimedia.org/wikipedia/commons/2/2e/Ford_Transit_Connect_--_08-25-2009.jpg",info:{"Valmistettu":"2020","Korimalli":"Van",Ovia:4,Istuimia:2},extraImages:[]},
    {id:"man3",title:"Mercedes-Benz V-Class",image:"https://upload.wikimedia.org/wikipedia/commons/a/af/2011_Mercedes-Benz_Viano_%28V_639_MY12%29_Edition_125_CDI_3.0_BlueEFFICIENCY_van_%282015-07-24%29_01.jpg",info:{"Valmistettu":"2021","Korimalli":"Minivan",Ovia:5,Istuimia:8},extraImages:[]},
    {id:"man4",title:"Toyota ProAce",image:"https://upload.wikimedia.org/wikipedia/commons/e/e5/SLM_65_-_Toyota_ProAce.jpg",info:{"Valmistettu":"2022","Korimalli":"Van",Ovia:4,Istuimia:3},extraImages:[]}
  ],
  "urheiluautot.html": [
    {id:"man1",title:"Porsche 911",image:"https://upload.wikimedia.org/wikipedia/commons/1/19/2015_Porsche_911_Carrera_4S_Coupe.jpg",info:{"Valmistettu":"2022","Korimalli":"Coupe",Ovia:2,Istuimia:2},extraImages:[]},
    {id:"man2",title:"Audi R8",image:"https://upload.wikimedia.org/wikipedia/commons/3/36/2015_Audi_R8_Coup%C3%A9_5.2_FSI_quattro_%2819409896583%29.jpg",info:{"Valmistettu":"2021","Korimalli":"Coupe",Ovia:2,Istuimia:2},extraImages:[]},
    {id:"man3",title:"Ferrari Portofino",image:"https://upload.wikimedia.org/wikipedia/commons/9/99/Ferrari_Portofino_IMG_0531.jpg",info:{"Valmistettu":"2020","Korimalli":"Cabriolet",Ovia:2,Istuimia:2},extraImages:[]},
    {id:"man4",title:"Mercedes-AMG GT",image:"https://upload.wikimedia.org/wikipedia/commons/4/49/2015-2017_Mercedes-AMG_GT_%28C_190%29_S_coupe_%282017-07-15%29_01.jpg",info:{"Valmistettu":"2022","Korimalli":"Coupe",Ovia:2,Istuimia:2},extraImages:[]}
  ],
  "maastoautot.html": [
    {id:"man1",title:"Jeep Wrangler",image:"https://upload.wikimedia.org/wikipedia/commons/f/f4/2018_Jeep_Wrangler_Unlimited_Sport_4-door_front_6.10.18.jpg",info:{"Valmistettu":"2017","Korimalli":"SUV",Ovia:4,Istuimia:5},extraImages:[]},
    {id:"man2",title:"Toyota RAV4",image:"https://upload.wikimedia.org/wikipedia/commons/6/6d/2019_Toyota_RAV4_XLE_AWD%2C_front_12.31.19.jpg",info:{"Valmistettu":"2021","Korimalli":"Crossover",Ovia:5,Istuimia:5},extraImages:[]},
    {id:"man3",title:"Land Rover Discovery",image:"https://upload.wikimedia.org/wikipedia/commons/3/3b/Land_Rover_Discovery_4_HSE_2016.jpg",info:{"Valmistettu":"2019","Korimalli":"SUV",Ovia:5,Istuimia:7},extraImages:[]},
    {id:"man4",title:"Nissan X-Trail",image:"https://upload.wikimedia.org/wikipedia/commons/3/35/Nissan_X-Trail_%28T33%29_1X7A7179.jpg",info:{"Valmistettu":"2020","Korimalli":"SAV",Ovia:5,Istuimia:5},extraImages:[]}
  ],
  "lava-autot.html": [
    {id:"man1",title:"Ford Ranger",image:"https://upload.wikimedia.org/wikipedia/commons/0/02/2019_Ford_Ranger_XLT_Super_Cab_FX4_front_6.1.19.jpg",info:{"Valmistettu":"2021","Korimalli":"Pick-up",Ovia:4,Istuimia:5},extraImages:[]},
    {id:"man2",title:"Toyota Hilux",image:"https://upload.wikimedia.org/wikipedia/commons/b/ba/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Rear.jpg",info:{"Valmistettu":"2020","Korimalli":"Pick-up",Ovia:4,Istuimia:5},extraImages:[]},
    {id:"man3",title:"Nissan Navara",image:"https://upload.wikimedia.org/wikipedia/commons/2/22/Nissan_Navara_Pickup.jpg",info:{"Valmistettu":"2010","Korimalli":"Pick-up",Ovia:4,Istuimia:5},extraImages:[]},
    {id:"man4",title:"Mitsubishi L200",image:"https://upload.wikimedia.org/wikipedia/commons/7/78/Mitsubishi_L200_Dakar_HP_2021_%2852325676526%29.jpg",info:{"Valmistettu":"2021","Korimalli":"Pick-up",Ovia:4,Istuimia:5},extraImages:[]}
  ],
  "miniautot.html": [
    {id:"man1",title:"Renault Twizy",image:"https://upload.wikimedia.org/wikipedia/commons/c/c8/Renault_Twizy_electric_car.jpg",info:{"Valmistettu":"2021","Korimalli":"Quadricycle",Ovia:2,Istuimia:2},extraImages:[]},
    {id:"man2",title:"Ligier JS50",image:"https://upload.wikimedia.org/wikipedia/commons/7/70/Ligier_JS50_%28MSP15%29.JPG",info:{"Valmistettu":"2020","Korimalli":"Quadricycle",Ovia:2,Istuimia:2},extraImages:[]},
    {id:"man3",title:"Microcar M.Go",image:"https://upload.wikimedia.org/wikipedia/commons/4/42/Microcar_M.GO_Dynamic_%28MSP15%29.JPG",info:{"Valmistettu":"2022","Korimalli":"Quadricycle",Ovia:2,Istuimia:2},extraImages:[]},
    {id:"man4",title:"Aixam Mega",image:"https://upload.wikimedia.org/wikipedia/commons/e/e4/Aixam_Mega.JPG",info:{"Valmistettu":"2021","Korimalli":"Quadricycle",Ovia:2,Istuimia:2},extraImages:[]}
  ]







  // Lisää tarvittaessa muut sivut
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
  const title = document.createElement("div");
  title.className = "car-title";
  title.textContent = car.title.replace(/\s*\(.*?\)/g, '').trim() || "Tuntematon auto";
  card.appendChild(img);
  card.appendChild(title);
  card.addEventListener("click", ()=>openCarModal(car));
  return card;
}

function displayInitialImages(){
  manualCars.forEach(car => container.appendChild(createCarCard(car)));
}

// --- Hae autoja API:sta ---
async function fetchCarsFromAPI(){
  const randomBodyCount=Math.floor(Math.random()*2)+1;
  const selectedBodies=[];
  while(selectedBodies.length<randomBodyCount){
    const r=bodyTypes[Math.floor(Math.random()*bodyTypes.length)];
    if(!selectedBodies.includes(r)) selectedBodies.push(r);
  }

  const options={
    method:"GET",
    headers:{
      "x-rapidapi-key":"df8ba94c97mshb76f9c896aa0450p1ce858jsnee6b335c4888",
      "x-rapidapi-host":"cars-database-with-image.p.rapidapi.com"
    }
  };

  const placeholder="https://www.auto-data.net/img/no.jpg";
  const seenKeys = new Set();
  let allResults=[];

  for(const body of selectedBodies){
    const res = await fetch(`https://cars-database-with-image.p.rapidapi.com/api/search?q=${body}&page=${currentPage}`, options);
    const data = await res.json();
    if(data.results){
      data.results.forEach(car=>{
        if(car.image && car.image!==placeholder){
          const key = `${car.title}|${car.image}`;
          if(!seenKeys.has(key)){
            seenKeys.add(key);
            allResults.push({id:car.id,title:car.title,image:car.image});
          }
        }
      });
    }
  }

  cachedCars.push(...allResults);
  currentPage++;
}

// --- Näytä seuraavat ---
function showNextCars(count=4){
  const nextBatch=cachedCars.slice(currentIndex,currentIndex+count);
  nextBatch.forEach(car => container.appendChild(createCarCard(car)));
  currentIndex += nextBatch.length;
}


// --- Näytä lisää painike ---
async function handleLoadMore(){
  loadMoreBtn.disabled=true;
  loadMoreBtn.textContent="Ladataan...";
  if(currentIndex>=cachedCars.length){
    await fetchCarsFromAPI();
  }
  showNextCars();
  loadMoreBtn.disabled=false;
  loadMoreBtn.textContent="Näytä lisää";
}

// --- Modaali ---
async function openCarModal(car){
  const modalTitle=document.getElementById("carModalLabel");
  const modalMainImage=document.getElementById("modalMainImage");
  const modalExtraImages=document.getElementById("modalExtraImages");
  const modalInfo=document.getElementById("modalInfo");

  modalTitle.textContent = car.title.replace(/\s*\(.*?\)/g, '').trim();
  modalMainImage.src=car.image;
  modalExtraImages.innerHTML="";
  modalInfo.innerHTML="";

  if(car.id.startsWith("man")){
    const infoHTML=Object.entries(car.info).map(([k,v])=>`<b>${k}:</b> ${v}`).join("<br>");
    modalInfo.innerHTML=infoHTML;
  } else {
    if(!fetchedDetailsCache[car.id]){
      const options={
        method:"GET",
        headers:{
          "x-rapidapi-key":"df8ba94c97mshb76f9c896aa0450p1ce858jsnee6b335c4888",
          "x-rapidapi-host":"cars-database-with-image.p.rapidapi.com"
        }
      };
      try{
        const res=await fetch(`https://cars-database-with-image.p.rapidapi.com/api/car/${car.id}`,options);
        const data=await res.json();
        const general=data.specifications.general_information || {};

        // Poimitaan vuodet Start/End
        const startMatch = general["Start of production"]?.match(/\d{4}/);
        const endMatch = general["End of production"]?.match(/\d{4}/);
        const production = startMatch ? (endMatch ? `${startMatch[0]} – ${endMatch[0]}` : startMatch[0]) : "Ei tietoa";

        const info={
          "Valmistettu": production,
          "Korimalli": general["Body type"] || "Ei tietoa",
          Ovia: general.Doors || "Ei tietoa",
          Istuimia: general.Seats || "Ei tietoa"
        };

        const extraImages=(data.other_images||[]).slice(0,6).map(img=>img.src);
        fetchedDetailsCache[car.id]={info,extraImages};
      }catch(e){
        console.error("Virhe haettaessa lisätietoja",e);
        fetchedDetailsCache[car.id]={info:{},extraImages:[]};
      }
    }

    const {info, extraImages}=fetchedDetailsCache[car.id];
    extraImages.forEach(src=>{
      const thumb=document.createElement("img");
      thumb.src=src;
      thumb.className="img-thumbnail";
      thumb.style.width="80px";
      thumb.style.cursor="pointer";
      thumb.addEventListener("click",()=>modalMainImage.src=src);
      modalExtraImages.appendChild(thumb);
    });

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
