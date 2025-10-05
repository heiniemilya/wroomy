const container = document.getElementById("car-container");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let cachedCars = [];
let currentIndex = 0;
let currentPage = 1;
const fetchedDetailsCache = {}; // lisätiedot ja lisäkuvat tallessa

// Kovakoodatut aloitusautot
const initialImages = [
  { id:"man1", title:"Kia Niro", image:"img/cars/kia-niro-hyundai-motor-group-AoqTa019vFw-unsplash.jpg", info:{"Valmistettu":"2023", "Korimalli":"SUV", Ovia:5, Istuimia:5}, extraImages:[] },
  { id:"man2", title:"Opel Astra", image:"img/cars/opel-astra-youssef-d-DkGUn0Y1VzA-unsplash.webp", info:{ "Valmistettu":"2022","Korimalli":"Hatchback", Ovia:5, Istuimia:5}, extraImages:[] },
  { id:"man3", title:"Volkswagen Passat", image:"img/cars/passat-pexels-esmihel-15256362.jpg", info:{  "Valmistettu":"2021","Korimalli":"Sedan", Ovia:5, Istuimia:5}, extraImages:[] },
  { id:"man4", title:"Toyota Yaris", image:"img/cars/yaris-heri-susilo-kwgTG2TETPs-unsplash.webp", info:{ "Valmistettu":"2020","Korimalli":"Hatchback",  Ovia:5, Istuimia:5}, extraImages:[] }
];

// Luo kortti
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
  initialImages.forEach(car => container.appendChild(createCarCard(car)));
}

// Hae autoja API:sta
async function fetchCarsFromAPI(){
  const bodyTypes=["Sedan","Hatchback","Fastback","Liftback"];
  const randomBodyCount=Math.floor(Math.random()*2)+1;
  const selectedBodies=[];
  while(selectedBodies.length<randomBodyCount){
    const r=bodyTypes[Math.floor(Math.random()*bodyTypes.length)];
    if(!selectedBodies.includes(r)) selectedBodies.push(r);
  }

  const options={
    method:"GET",
    headers:{
      "x-rapidapi-key":"b43b477174msh880f765341251b6p1fa2b0jsnf445753a6ca4",
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
        // suodata placeholder-kuvat
        if(car.image && car.image!==placeholder){
          const key = `${car.title}|${car.image}`; // yksi kortti per malli
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

function showNextCars(count=4){
  const nextBatch=cachedCars.slice(currentIndex,currentIndex+count);
  nextBatch.forEach(car=>container.appendChild(createCarCard(car)));
  currentIndex+=nextBatch.length;
  if(currentIndex>=cachedCars.length){
    loadMoreBtn.disabled=false;
    loadMoreBtn.textContent="Hae lisää autoja";
  }
}

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

// Modaali
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
  // Manuaaliset autot
  const infoHTML=Object.entries(car.info).map(([k,v])=>`<b>${k}:</b> ${v}`).join("<br>");
  modalInfo.innerHTML=infoHTML;
} else {
  if(!fetchedDetailsCache[car.id]){
    const options={
      method:"GET",
      headers:{
        "x-rapidapi-key":"b43b477174msh880f765341251b6p1fa2b0jsnf445753a6ca4",
        "x-rapidapi-host":"cars-database-with-image.p.rapidapi.com"
      }
    };
    try{
      const res=await fetch(`https://cars-database-with-image.p.rapidapi.com/api/car/${car.id}`,options);
      const data=await res.json();
      const general=data.specifications.general_information || {};

      // Poimitaan vuosiluvut Start/End
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

// Zoom
const zoomBtn=document.getElementById("zoomBtn");
const modalMainImage=document.getElementById("modalMainImage");
zoomBtn.addEventListener("click",()=>modalMainImage.classList.toggle("zoomed"));
modalMainImage.addEventListener("click",()=>modalMainImage.classList.toggle("zoomed"));

displayInitialImages();
loadMoreBtn.addEventListener("click",handleLoadMore);