document.addEventListener('DOMContentLoaded', () => {
  loadSavedCards();
});

function loadSavedCards() {
  const savedCardContainer = document.getElementById('savedCardContainer');
  const savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

  if (savedCards.length === 0) {
    savedCardContainer.innerHTML = '<p>No has guardado ninguna tarjeta.</p>';
    return;
  }

  const allCardsData = JSON.parse(localStorage.getItem('cardData')) || [];

  savedCards.forEach(cardCode => {
    const cardData = allCardsData.find(card => card.cardCode === cardCode);
    if (cardData) {
      const cardElement = createCard(cardData);
      savedCardContainer.appendChild(cardElement);
    }
  });
}

function createCard(cardData) {
  const card = document.createElement('div');
  card.classList.add('card_tutorial');
  card.innerHTML = `
    <div class="card_img">
      <img id="videoMiniature" src="${cardData.cardThumbnail}">
    </div>
    <div class="card_tutorial_info">
      <div class="card_channel_img">
        <img src="${cardData.cardChannelImg}">
      </div>
      <h3 class="card_title">${cardData.cardTitle}</h3>
      <div class="card_area_button">
        <div class="card_button">
          <span class="card_open" data-url="${cardData.cardLinkPage}">Ver video</span>
          <button type="button" class="showDropDown" data-thumbnail="${cardData.cardThumbnail}" data-code="${cardData.cardCode}">
            <i class="ri-arrow-drop-down-line"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  // Asignar el evento para abrir el about
  card.addEventListener('click', showAboutSection);

  return card;
}

// Mostrar sección de About cuando se hace clic en una tarjeta
function showAboutSection(event) {
  const button = event.target.closest('.showDropDown');
  if (button) {
    const thumbnail = button.getAttribute('data-thumbnail');
    const code = button.getAttribute('data-code');
    const aboutSection = document.getElementById('aboutTutorial');
    const aboutImage = document.getElementById('aboutVideoMiniature');
    const title = document.getElementById('cardTitle');
    const author = document.getElementById('authorCard');
    const duration = document.getElementById('duration');
    const description = document.querySelector('.card_description');
    const cardCode = document.getElementById('cardCode');
    const linkContainer = document.getElementById('LinkContainer');
    const html = document.documentElement;

    aboutSection.classList.add('show');
    html.classList.add('no_scroll');

    const allCardsData = JSON.parse(localStorage.getItem('cardData')) || [];
    const cardData = allCardsData.find(data => data.cardCode === code);

    if (cardData) {
      title.textContent = cardData.cardTitle;
      author.textContent = cardData.cardAuthor || 'Autor desconocido';
      duration.textContent = cardData.cardDuration || 'Duración desconocida';
      description.textContent = cardData.cardDescription || 'Sin descripción disponible.';
      cardCode.textContent = cardData.cardCode || 'Sin código';

      aboutImage.src = cardData.cardThumbnail;

      // Llenar el contenedor de enlaces
      linkContainer.innerHTML = ''; // Limpiar los enlaces anteriores
      if (cardData.links) {
        cardData.links.forEach(link => {
          const linkDiv = document.createElement('div');
          linkDiv.classList.add('link_card');
          linkDiv.innerHTML = `
            <div class="link_page_icon">
              <img src="${getFavicon(link)}">
            </div>
            <div class="link_page_url">
              <h5>${link}</h5>
            </div>
          `;
          linkDiv.addEventListener('click', () => {
            window.location.href = link;
          });
          linkContainer.appendChild(linkDiv);
        });
      }

      // Asignar el evento para guardar la tarjeta (modificado para evitar duplicados)
      const saveButton = document.querySelector('.save_button_click');
      saveButton.onclick = () => saveCardHandler(cardData); // Usamos `onclick` para asignar solo una vez el evento

      // Asignar el evento para copiar el CardCode
      const copyButton = document.getElementById('copyCardCode');
      copyButton.onclick = () => copyCardCodeHandler(cardData);

      // Asignar el evento para cerrar el About
      const closeButton = document.getElementById('closeAbout');
      closeButton.addEventListener('click', closeAboutSection);

      // Cambiar el estado del botón de guardar según si la tarjeta ya está guardada
      updateSaveButtonState(cardData);
    }
  }

  const span = event.target.closest('.card_open');
  if (span) {
    const url = span.getAttribute('data-url');
    window.location.href = url;
  }
}

// Función para actualizar el estado del botón de guardar con el icono adecuado
function updateSaveButtonState(cardData) {
  const saveButton = document.querySelector('.save_button_click');
  const savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

  if (savedCards.includes(cardData.cardCode)) {
    saveButton.innerHTML = ' <i class="ri-heart-fill"></i>'; // Icono lleno a la derecha del texto "Eliminar"
  } else {
    saveButton.innerHTML = ' <i class="ri-heart-line"></i>'; // Icono vacío a la derecha del texto "Guardar"
  }
}

// Función para alternar el guardado de una tarjeta
function saveCardHandler(cardData) {
  let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];
  const cardIndex = savedCards.indexOf(cardData.cardCode);

  if (cardIndex === -1) {
    // Agregar tarjeta a los guardados
    savedCards.push(cardData.cardCode);
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
  } else {
    // Eliminar tarjeta de los guardados
    savedCards.splice(cardIndex, 1);
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
  }

  // Actualizar el estado del botón de guardar (icono y texto)
  updateSaveButtonState(cardData);
}

// Función para copiar el CardCode al portapapeles
function copyCardCodeHandler(cardData) {
  const cardCode = cardData.cardCode;
  navigator.clipboard.writeText(cardCode).then(() => {
    // Se eliminan las alertas según la solicitud anterior
  });
}

// Función para cerrar la sección "About"
function closeAboutSection() {
  const aboutSection = document.getElementById('aboutTutorial');
  const html = document.documentElement;

  aboutSection.classList.remove('show');
  html.classList.remove('no_scroll');
}

function getDomain(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function getFavicon(url) {
  return `https://www.google.com/s2/favicons?domain=${getDomain(url)}`;
}