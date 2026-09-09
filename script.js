const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const quoteForm = document.getElementById('quoteForm');
const artworkFile = document.getElementById('artworkFile');
const fileStatus = document.getElementById('fileStatus');
const removeFileBtn = document.getElementById('removeFileBtn');
const quoteSubmitBtn = document.getElementById('quoteSubmitBtn');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes) {
  if (!bytes) return '0 MB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function clearArtworkFile() {
  if (!artworkFile) return;
  artworkFile.value = '';
  if (fileStatus) {
    fileStatus.textContent = 'No file selected. Maximum file size: 10 MB.';
    fileStatus.classList.remove('error', 'success');
  }
  if (removeFileBtn) removeFileBtn.hidden = true;
  if (quoteSubmitBtn) quoteSubmitBtn.disabled = false;
}

artworkFile?.addEventListener('change', () => {
  const file = artworkFile.files?.[0];

  if (!file) {
    clearArtworkFile();
    return;
  }

  if (removeFileBtn) removeFileBtn.hidden = false;

  if (file.size > MAX_FILE_SIZE) {
    if (fileStatus) {
      fileStatus.textContent =
        `That file is ${formatBytes(file.size)}. Please choose a file under 10 MB or remove it.`;
      fileStatus.classList.add('error');
      fileStatus.classList.remove('success');
    }
    if (quoteSubmitBtn) quoteSubmitBtn.disabled = true;
    return;
  }

  if (fileStatus) {
    fileStatus.textContent =
      `Selected: ${file.name} (${formatBytes(file.size)}) — ready to upload.`;
    fileStatus.classList.add('success');
    fileStatus.classList.remove('error');
  }
  if (quoteSubmitBtn) quoteSubmitBtn.disabled = false;
});

removeFileBtn?.addEventListener('click', clearArtworkFile);

quoteForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const file = artworkFile?.files?.[0];

  // Stop files larger than 10 MB
  if (file && file.size > MAX_FILE_SIZE) {
    if (fileStatus) {
      fileStatus.textContent =
        'Please remove the oversized file or choose one under 10 MB before submitting.';
      fileStatus.classList.add('error');
      fileStatus.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
    return;
  }

  if (quoteSubmitBtn) {
    quoteSubmitBtn.disabled = true;
    quoteSubmitBtn.textContent = 'Sending Quote...';
  }

  try {
    const formData = new FormData(quoteForm);

    // Build sizes
    const sizes = [];

    const sizeFields = [
      ['XS', 'Size XS'],
      ['S', 'Size S'],
      ['M', 'Size M'],
      ['L', 'Size L'],
      ['XL', 'Size XL'],
      ['2XL', 'Size 2XL'],
      ['3XL', 'Size 3XL'],
      ['4XL', 'Size 4XL'],
      ['Youth', 'Youth Sizes Qty']
    ];

    sizeFields.forEach(([label, field]) => {
      const qty = formData.get(field);

      if (qty && Number(qty) > 0) {
        sizes.push(`${label}: ${qty}`);
      }
    });

    // Build print locations
    const printLocations = formData.getAll('Print Location');

    // Data for Joe's Manager
    const quoteData = {
      customer_name: formData.get('Customer Name') || '',
      phone: formData.get('Phone Number') || '',
      email: formData.get('email') || '',
      product: formData.get('Product') || '',
      quantity: Number(formData.get('Total Quantity') || 0),
      sizes: sizes.join(', '),
      color: formData.get('Color') || '',
      needed_by: formData.get('Needed By') || '',
      rush_order: formData.get('Rush Order') || '',
      print_locations: printLocations.join(', '),
      notes:
        formData.get('Project Details') ||
        formData.get('Notes') ||
        ''
    };

    console.log('Sending quote to manager:', quoteData);

    const managerResponse = await fetch(
      'https://joes-unique-creations-manager.onrender.com/api/website-quote',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteData)
      }
    );

    const managerText = await managerResponse.text();

    console.log(
      'Manager response:',
      managerResponse.status,
      managerText
    );

    if (!managerResponse.ok) {
      throw new Error(
        `Manager returned ${managerResponse.status}: ${managerText}`
      );
    }

    // Manager received it.
    // Now submit the original form to FormSubmit for email,
    // attachment and thank-you page.
    quoteForm.submit();

  } catch (error) {
    console.error('QUOTE SUBMISSION ERROR:', error);

    // IMPORTANT:
    // Even if the manager has a problem,
    // still send the customer's quote through FormSubmit.
    quoteForm.submit();
  }
});
