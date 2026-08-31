const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('quoteForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const values = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    product: document.getElementById('product').value,
    quantity: document.getElementById('quantity').value,
    needBy: document.getElementById('needBy').value,
    details: document.getElementById('details').value.trim()
  };

  const body = [
    "NEW QUOTE REQUEST",
    "",
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email || "Not provided"}`,
    `Product: ${values.product}`,
    `Quantity: ${values.quantity}`,
    `Needed By: ${values.needBy || "Not specified"}`,
    "",
    "Order Details:",
    values.details || "No additional details."
  ].join("\n");

  const subject = encodeURIComponent(`Website Quote Request - ${values.name}`);
  const encodedBody = encodeURIComponent(body);

  // Replace the email address below once Joe chooses the email inbox to receive quote requests.
  const targetEmail = "YOUR-EMAIL-HERE@example.com";
  document.getElementById('formMessage').textContent =
    "The quote form is built. We just need to connect your business email before launch.";

  // Uncomment after adding the business email:
  // window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${encodedBody}`;
});
