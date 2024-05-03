/*--===== HERO TYPING ANIMATION =========================-*/
const professions = ["Web Designer", "Web Developer", "Photographer", "Runner", "Snowboarder", "Foodie"];
let index = 0;

function typeWriter() {
  const currentProfession = professions[index];

  let charIndex = 0;

  function innerTypeWriter() {
    if (charIndex < currentProfession.length) {
      document.getElementById("typing-animation").textContent += currentProfession.charAt(charIndex);
      charIndex++;
      setTimeout(innerTypeWriter, 100);
    } else {
      setTimeout(eraseText, 1000);
    }
  }

  function eraseText() {
    if (document.getElementById("typing-animation").textContent.length > 0) {
      document.getElementById("typing-animation").textContent = document.getElementById("typing-animation").textContent.slice(0, -1);
      setTimeout(eraseText, 50);
    } else {
      index = (index + 1) % professions.length;
      setTimeout(typeWriter, 500);
    }
  }

  innerTypeWriter();
}

window.onload = function () {
  typeWriter();
};

/*===== CONTACT VALIDATION ================================*/
document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission

  // Validate form fields
  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    alert("Please fill out all fields.");
    return;
  }

  // Additional email validation (regex or other methods) can be added here

  // If all fields are filled out, submit the form
  // You can replace this with your form submission logic (e.g., using fetch to send data to server)
  alert("Form submitted successfully!");
  document.getElementById("contactForm").reset(); // Clear form fields after submission
});

/*--===== MODAL JS ======================================-*/
const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})

/*--===== SCROLL TO TOP BUTTON ==========================-*/
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

window.onscroll = function() {
  var scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
  var scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (scrollPos > 100) {
    scrollToTopBtn.classList.remove('hidden');
  } else {
    scrollToTopBtn.classList.add('hidden');
  }
};

