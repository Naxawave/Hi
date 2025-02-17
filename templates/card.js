const jsonFetch = 'https://naxawave.github.io/updateSystem-v1/cards_.json';

function getDomain(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function getFavicon(url) {
  return `https://www.google.com/s2/favicons?domain=${getDomain(url)}`;
}

async function fetchCardData() {
  try {
    const response = await fetch(jsonFetch);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    const msgErr = document.getElementById('msgTutorials');
    msgErr.classList.add('show');
    console.error('Error al cargar el JSON:', error);
    return [];
  }
}

function createCard(cardData, isSaved = false) {
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
          <span class="card_open" data-url="${cardData.cardLinkPage}">Ver ahora</span>
          <button type="button" class="showDropDown" data-thumbnail="${cardData.cardThumbnail}" data-code="${cardData.cardCode}">
            <i class="ri-arrow-drop-down-line"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  return card;
}

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

    // Update the save button state
    const saveButton = document.querySelector('.save_button_click');
    if (isCardSaved(code)) {
      saveButton.innerHTML = ' <i class="ri-bookmark-fill"></i>';
    } else {
      saveButton.innerHTML = ' <i class="ri-bookmark-line"></i>';
    }

    // Set the card code for the copy functionality
    const copyButton = document.getElementById('copyCardCode');
    copyButton.setAttribute('data-code', code);

    // Populate the about section with card data
    const allCardsData = JSON.parse(localStorage.getItem('cardData')) || [];
    const cardData = allCardsData.find(data => data.cardCode === code);

    if (cardData) {
      title.textContent = cardData.cardTitle;
      author.textContent = cardData.cardAuthor || 'Unknown Author'; // Adjust as needed
      duration.textContent = cardData.cardDuration || 'Unknown Duration'; // Adjust as needed
      description.textContent = cardData.cardDescription || 'No description available.';
      cardCode.textContent = cardData.cardCode || 'No card code';

      aboutImage.src = cardData.cardThumbnail;

      // Populate link container
      linkContainer.innerHTML = ''; // Clear previous links
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
    }
  }

  const span = event.target.closest('.card_open');
  if (span) {
    const url = span.getAttribute('data-url');
    window.location.href = url;
  }
}

function closeAboutSection() {
  const aboutSection = document.getElementById('aboutTutorial');
  const html = document.documentElement;

  aboutSection.classList.remove('show');
  html.classList.remove('no_scroll');
}

function toggleSaveCard() {
  const saveButton = document.querySelector('.save_button_click');
  const cardCode = document.getElementById('cardCode').textContent;

  if (isCardSaved(cardCode)) {
    removeCardFromSaved(cardCode);
    saveButton.innerHTML = ' <i class="ri-bookmark-line"></i>';
  } else {
    saveCardToLocalStorage(cardCode);
    saveButton.innerHTML = ' <i class="ri-bookmark-fill"></i>';
  }

  updateSavedCardsDisplay();
}

function saveCardToLocalStorage(cardCode) {
  const savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

  // Avoid duplicates
  if (!savedCards.includes(cardCode)) {
    savedCards.push(cardCode);
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
  }
}

function removeCardFromSaved(cardCode) {
  let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];
  savedCards = savedCards.filter(code => code !== cardCode);
  localStorage.setItem('savedCards', JSON.stringify(savedCards));
}

function isCardSaved(cardCode) {
  const savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];
  return savedCards.includes(cardCode);
}

async function updateSavedCardsDisplay() {
  const savedCardContainer = document.getElementById('savedCardTutorials');
  savedCardContainer.innerHTML = '';

  const savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];
  const allCardsData = JSON.parse(localStorage.getItem('cardData')) || [];

  if (savedCards.length === 0) {
    const msgErr = document.createElement('div');
    msgErr.classList.add('msg_err');
    msgErr.innerHTML = '<p>No haz guardado ningun tutorial.</p>';
    savedCardContainer.appendChild(msgErr);
  } else {
    savedCards.forEach(savedCardCode => {
      const cardData = allCardsData.find(data => data.cardCode === savedCardCode);
      if (cardData) {
        const card = createCard(cardData, true); // Set isSaved to true
        // Remove bookmark icon from the saved card
        const bookmarkIcon = card.querySelector('.card_button i.ri-bookmark-line');
        if (bookmarkIcon) bookmarkIcon.remove();
        savedCardContainer.appendChild(card);
      }
    });
  }

  // Add event listener to the saved cards for showing about section
  savedCardContainer.addEventListener('click', showAboutSection);
}

async function loadCards() {
  const cardContainer = document.getElementById('homeCardContainer');
  const recentContentContainer = document.getElementById('recent_content');
  const cardsData = await fetchCardData();

  // Guardar datos de las tarjetas en localStorage
  localStorage.setItem('cardData', JSON.stringify(cardsData));

  // Mostrar la primera tarjeta del JSON en `recent_content`
  if (cardsData.length > 0) {
    const firstCard = createCard(cardsData[0]);
    recentContentContainer.appendChild(firstCard);
  }

  // Mezclar las tarjetas aleatoriamente para `homeCardContainer`
  const shuffledCardsData = cardsData.sort(() => Math.random() - 0.5);

  shuffledCardsData.forEach(cardData => {
    const card = createCard(cardData);
    cardContainer.appendChild(card);
  });

  // Añadir manejador de eventos para el contenedor de tarjetas principales
  cardContainer.addEventListener('click', showAboutSection);

  // Añadir manejador de eventos para el contenedor de contenido reciente
  recentContentContainer.addEventListener('click', showAboutSection);

  document.getElementById('closeAbout').addEventListener('click', closeAboutSection);
  document.getElementById('copyCardCode').addEventListener('click', copyCardCodeToClipboard);
  document.querySelector('.save_button_click').addEventListener('click', toggleSaveCard);
}

async function updateSavedCardsDisplay() {
  const savedThumbnails = JSON.parse(localStorage.getItem('savedCards')) || [];
  const allCardsData = JSON.parse(localStorage.getItem('cardData')) || [];

  if (savedThumbnails.length === 0) {
    const msgErr = document.createElement('div');
    msgErr.classList.add('msg_err');
    msgErr.innerHTML = '<p>No has guardado ningun tutorial.</p>';
    // Aquí podrías agregar un lugar donde mostrar el mensaje, dependiendo de tu estructura
    console.log(msgErr.innerHTML); // O mostrarlo en algún contenedor específico si lo necesitas
  } else {
    savedThumbnails.forEach(thumbnail => {
      const cardData = allCardsData.find(data => data.cardThumbnail === thumbnail);
      if (cardData) {
        const card = createCard(cardData, true); // Set isSaved to true
        // Eliminar el icono de marcador de la tarjeta guardada
        const bookmarkIcon = card.querySelector('.card_button i.ri-bookmark-line');
        if (bookmarkIcon) bookmarkIcon.remove();
        // Aquí agregarías la tarjeta en el lugar que desees mostrarla
        console.log(card); // O agregarla a un contenedor si lo necesitas
      }
    });
  }

  // Eliminar cualquier otro comportamiento relacionado con el contenedor 'savedCardTutorials' que ya no necesites
}

function copyCardCodeToClipboard() {
  const copyButton = document.getElementById('copyCardCode');
  const cardCode = copyButton.getAttribute('data-code');
  const cardCodeAlert = document.getElementById('cardCodeSection');

  navigator.clipboard.writeText(cardCode).then(() => {
    cardCodeAlert.classList.add('show');

    setTimeout(() => {
      cardCodeAlert.classList.remove('show');
    }, 1500);

  }).catch(err => {
    console.error('Error al copiar el Card Code: ', err);
  });
}

document.addEventListener('DOMContentLoaded', loadCards);