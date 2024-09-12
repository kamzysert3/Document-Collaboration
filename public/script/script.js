const URLpath = window.location.pathname;
const fullURLpath = window.location.href;
const documentID = URLpath.split("/")[2]; 
const currentUser = JSON.parse(sessionStorage.getItem('user'));


// Initialize Quill editor
var toolbarOptions = [
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'script': 'sub'}, { 'script': 'super' }],  
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],      
    [{ 'align': [] }],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    ['blockquote', 'code-block'],
    [{ 'header': '1' }, { 'header': '2' }],
    ['clean'],
    ['undo', 'redo'],
];

var quill = new Quill('#editor-container', {
    theme: 'snow',                   
    placeholder: 'Start writing your document...',
    readOnly: false,                 
    modules: {
      toolbar: toolbarOptions,
      history: {                 
        delay: 1000,             
        maxStack: 50,         
        userOnly: true         
      }

    }
});

function format(command, value = null) {
    document.execCommand(command, true, value);
}

document.querySelectorAll('span[contenteditable]').forEach(element => {
  element.addEventListener('input', function() {
    if (this.textContent.trim() === '') {
      this.classList.add('placeholder');
    } else {
      this.classList.remove('placeholder');
    }
  });

  if (element.textContent.trim() === '') {
    element.classList.add('placeholder');
  } else {
    element.classList.remove('placeholder');
  }
});

// Share function
function shareDocument() {
    const collaborator = document.getElementById('collaborator-name').value;
    
    // Simulating generating a shareable link (implement server-side)
    fetch(`/api/share-document/${documentID}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collaborator,
          userId: currentUser.userId
        })
    })
    .then(response => response.json())
    .then(data => {
      if (data.shareLink) {
        const shareLink = `${fullURLpath}`;
        document.getElementById('share-link').value = shareLink;
        document.getElementById('share-link-container').style.display = 'block';
        document.getElementById('copy-link-button').style.display = 'block';
        document.getElementById('share-link-button').style.display = 'none';
      } else {
        closeShareModal()
        showErrorModal(data.message);
      }
    })
    .catch(error => {
        console.error('Error sharing document:', error);
    });
}

function downloadDocument() {
    const title = document.getElementById('title').textContent.trim();
    const content = quill.root.innerHTML; // Get the HTML content from the Quill editor

    // Create a container with the content to be converted into a PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.innerHTML = `<div>${content}</div>`;

    const options = {
      margin:       1,
      filename:     `${title || 'untitled'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(pdfContainer).set(options).save();
}