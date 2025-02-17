/*=============== SHOW MENU ===============*/
const headerToggle = document.getElementById('header-toggle'),
      main = document.getElementById('main'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(headerToggle){
    headerToggle.addEventListener('click', () =>{
        main.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        main.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const main = document.getElementById('main')
    // When we click on each nav__link, we remove the show-menu class
    main.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


document.addEventListener("DOMContentLoaded", function() {
  // Crear el contenedor principal
  const section = document.createElement("section");
  section.className = "about__tutorial";
  section.id = "aboutTutorial";

  // Agregar el contenido al contenedor
  section.innerHTML = `
    <div class="about__content">
      <div class="content_area">
        <h2 class="title__card" id="cardTitle"></h2>
        <div class="subcontent_card">
          <h4 class="author_card" id="authorCard"></h4> •
          <p class="duration__card" id="duration"></p><span> Min</span>
        </div><br>
        <div class="card_img miniature">
          <img id="aboutVideoMiniature" src="https://www.testmythumbnails.com/assets/og-image.png" alt="Miniatura">
        </div>
        <div class="action_buttons">
          <span class="save_button_click"><i class="ri-heart-line"></i> </span>
          <span class="save_button_click"><i class="ri-share-line"> Compartir</i></span>
          <span class="save_button_click left" id="reportCard"> <i class="ri-error-warning-line"></i> Reportar</span>
          <span class="save_button_click right" id="closeAbout"><i class="ri-close-line"></i></span>
        </div>
        <h4 class="card_description"></h4>
        <div class="link_container" id="LinkContainer"></div>
          <div class="cardCodeContainer"  id="copyCardCode">
            <h5>CardCode: <span id="cardCode"></span></h5>
          </div><br>
      </div>
    </div>
  `;

  // Agregar la sección al DOM
  document.body.appendChild(section);
});
