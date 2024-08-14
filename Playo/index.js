// script.js
document.addEventListener("DOMContentLoaded", () => {
  const venuesData = [
    {
      name: "Nex Arena @ Abids",
      rating: "4.73",
      distance: "0.95 Kms",
      imgSrc: "./image/Venues-image/nexarena.jpg",
    },
    {
      name: "Nex Arena @ Kachiguda",
      rating: "4.00",
      distance: "1.20 Kms",
      imgSrc: "./image/Venues-image/NexArenaKachiguda.heic",
    },
    {
      name: "HighBall",
      rating: "5.00",
      distance: "2.51 Kms",
      imgSrc: "./image/Venues-image/HighBall.jpeg",
    },
    {
      name: "Rays Arena",
      rating: "3.67",
      distance: "0.80 Kms",
      imgSrc: "./image/Venues-image/RaysArena.png",
    },
    {
      name: "The Box @ YMCA",
      rating: "4.15",
      distance: "1.25 Kms",
      imgSrc: "./image/Venues-image/TheBoxYMCA.jpeg",
    },
  ];

  const venuesGrid = document.querySelector(".venues-grid");

  venuesData.forEach((venue) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src="${venue.imgSrc}" alt="${venue.name}">
            <div class="details">
                <h3>${venue.name}</h3>
                <p>Rating: ${venue.rating}</p>
                <p>Distance: ${venue.distance}</p>
            </div>
        `;
    venuesGrid.appendChild(card);
  });
});

function scrollContainerLeft(containerClass) {
  console.log(123);
  const container = document.querySelector(`.${containerClass}`);
  if (container) {
    container.scrollLeft -= 300; // Adjusting scroll left
  }
}

function scrollContainerRight(containerClass) {
  console.log(321);
  const container = document.querySelector(`.${containerClass}`);
  if (container) {
    container.scrollRight += 300; // Adjusting scroll right
  }
}
