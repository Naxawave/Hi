// Modal 1
const modal1 = document.getElementById("vCasWindow");
const modalOverlay1 = document.getElementById("modalOverlay");
const openButton1 = document.getElementById("vCas");
const closeButton1 = document.querySelector(".close-button");

function openModal1() {
  modal1.classList.add("show");
  modalOverlay1.classList.add("show");
}

function closeModal1() {
  modal1.classList.remove("show");
  modalOverlay1.classList.remove("show");
}

openButton1.addEventListener("click", openModal1);
closeButton1.addEventListener("click", closeModal1);
modalOverlay1.addEventListener("click", closeModal1);

// Modal 2
const modal2 = document.getElementById("vCasVerification");
const modalOverlay2 = document.getElementById("modalOverlay2");
const openButton2 = document.getElementById("vCasV");
const closeButton2 = document.querySelector(".close-button-2");

function openModal2() {
  modal2.classList.add("show");
  modalOverlay2.classList.add("show");
}

function closeModal2() {
  modal2.classList.remove("show");
  modalOverlay2.classList.remove("show");
}

openButton2.addEventListener("click", openModal2);
closeButton2.addEventListener("click", closeModal2);
modalOverlay2.addEventListener("click", closeModal2);



const casInput = document.getElementById('casInput');
const passwordInput = document.getElementById('passwordInput');
const sendCASButton = document.getElementById('sendCAS');
const invalidCASMessage = document.getElementById('invalidCASMessage');

function validateCAS() {
  const casValue = casInput.value;
  const casRegex = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{2}-[A-Za-z0-9]{3}\/CAS$/;

  if (!casRegex.test(casValue)) {
    invalidCASMessage.style.display = 'block';
    sendCASButton.disabled = true;
  } else {
    invalidCASMessage.style.display = 'none';
    enableSubmitButton();
  }
}

function validatePassword() {
  const passwordValue = passwordInput.value;
  return passwordValue.length >= 6;
}

function enableSubmitButton() {
  const isCASValid = invalidCASMessage.style.display === 'none'; // Verificar si el mensaje de error está oculto
  const isPasswordValid = validatePassword();

  if (casInput.value && passwordInput.value && isCASValid && isPasswordValid) {
    sendCASButton.disabled = false;
  } else {
    sendCASButton.disabled = true;
  }
}

casInput.addEventListener('input', () => {
  validateCAS(); // Revalidar CAS cada vez que cambia
  enableSubmitButton(); // También habilitar el botón en base a las dos validaciones
});

passwordInput.addEventListener('input', enableSubmitButton); // Solo verificar la contraseña