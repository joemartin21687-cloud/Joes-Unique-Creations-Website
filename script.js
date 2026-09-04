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
    const file = artworkFile?.files?.[0];

    // Keep your existing 10 MB protection
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
  
