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

quoteForm?.addEventListener('submit', (event) => {
    const file = artworkFile?.files?.[0];

    // Keep the 10 MB file limit
    if (file && file.size > MAX_FILE_SIZE) {
        event.preventDefault();

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

    // Create an invisible iframe for the manager copy
    let iframe = document.getElementById('managerQuoteFrame');

    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'managerQuoteFrame';
        iframe.name = 'managerQuoteFrame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }

    // Create a second hidden form that sends the quote to the manager
    const managerForm = document.createElement('form');

    managerForm.method = 'POST';
    managerForm.action =
        'https://joes-unique-creations-manager.onrender.com/api/website-quote';

    managerForm.target = 'managerQuoteFrame';
    managerForm.style.display = 'none';

    const originalData = new FormData(quoteForm);

    for (const [name, value] of originalData.entries()) {

        // Artwork stays with the normal email submission for now
        if (value instanceof File) {
            continue;
        }

        // Don't copy FormSubmit's private control fields
        if (name.startsWith('_')) {
            continue;
        }

        const input = document.createElement('input');

        input.type = 'hidden';
        input.name = name;
        input.value = value;

        managerForm.appendChild(input);
    }

    document.body.appendChild(managerForm);

    // Send copy to Manager
    managerForm.submit();

    // Remove temporary form shortly afterward
    setTimeout(() => {
        managerForm.remove();
    }, 3000);

    // DO NOT preventDefault here.
    // The original form continues normally to FormSubmit.
});

        return;
    }

    // Stop FormSubmit for a moment while we send a copy to the manager
    event.preventDefault();

    if (quoteSubmitBtn) {
        quoteSubmitBtn.disabled = true;
        quoteSubmitBtn.textContent = 'Sending Quote...';
    }

    try {
        const formData = new FormData(quoteForm);
        const quoteData = {};

        // Copy all form fields except the artwork file
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                continue;
            }

            if (quoteData[key]) {
                quoteData[key] =
                    Array.isArray(quoteData[key])
                        ? [...quoteData[key], value]
                        : [quoteData[key], value];
            } else {
                quoteData[key] = value;
            }
        }

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

console.log('Manager status:', managerResponse.status);
console.log('Manager response:', managerText);

if (!managerResponse.ok) {
    throw new Error(
        `Manager returned ${managerResponse.status}: ${managerText}`
    );
}

    } catch (error) {
        console.error('Manager quote copy failed:', error);

        // IMPORTANT:
        // We still continue to FormSubmit so you do not lose the customer's email.
    }

    // Send the original form normally to FormSubmit.
    // This includes the artwork attachment and keeps your thank-you redirect.
    quoteForm.submit();
});
  
