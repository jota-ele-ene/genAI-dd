export async function handleSubmit(e) {

    const searchInput = document.getElementById('searchInput');
    const searchLink = document.getElementById('searchLink');
    const searchBanner = document.getElementById('searchBanner');
    const responseArea = document.getElementById('responseArea');
    const responseContent = document.getElementById('responseContent');
    const progressBarContainer = document.getElementById('progressBarContainer');
  
    const API_URL = '/api/ask-bot';
  
    if (e) e.preventDefault();
  
    const question = searchInput.value.trim();
    if (!question) return;
  
    progressBarContainer.classList.add('active');
    searchBanner.innerHTML =
        'Buscando información en las fuentes relevantes';
    searchBanner.classList.add('active');
  
    searchInput.value = '';
    searchLink.classList.add('disabled');
  
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    });
  
    const data = await response.json();
    console.log(data);
  
    let answerText = '';
    if (data && data.answer) {
        answerText = data.answer;
    } else if (data && data.response) {
        answerText = data.response;
    } else if (data && data.message) {
        answerText = data.message;
    } else {
        answerText = 'No se recibió respuesta del asistente.';
    }
  
    const renderer = {
      link(token) {
        const href = token.href || '';
        const originalText = token.text || href;
  
        let display = originalText;
        try {
            const url = new URL(href);
            let domain = url.hostname;
            const parts = domain.split('.');
            if (parts.length > 2) {
            domain = parts.slice(-2).join('.');
            }
            display = domain;
        } catch (e) {}
  
        const rawTitle = token.title ?? href;
        const safeTitle = String(rawTitle).replace(/"/g, '&quot;');
  
        return `<a href="${href}" title="${safeTitle}" target="_blank" rel="noopener noreferrer">${display}</a>`;
      },
    };
  
    marked.use({ renderer });
  
    const formattedAnswer = await marked.parse(answerText, {
        async: true,
    });
    const wrapper = document.createElement('div');
    wrapper.className = 'bloque-nuevo';
  
    const previous = responseContent.innerHTML;
    if (previous.length > 0) {
        wrapper.innerHTML = '<br>' + formattedAnswer;
    } else {
        wrapper.innerHTML = formattedAnswer;
    }
  
    responseContent.appendChild(wrapper);
    responseArea.classList.add('active');
  
    wrapper.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
  
    progressBarContainer.classList.remove('active');
    searchLink.classList.remove('disabled');
    searchBanner.innerHTML =
        'Sigue preguntando sobre derechos digitales a nuestro <em>asistente inteligente</em>.';
    searchBanner.classList.add('active');
  }
  
  export function setEvents() {
  
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchLink = document.getElementById('searchLink');
    const closeButton = document.getElementById('searchButton');
    const flyingBanner = document.querySelector('.flying-banner');
  
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleSubmit();
    });
  
    searchForm.addEventListener('submit', handleSubmit);
  
    searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      progressBarContainer.classList.remove('active');
    }
    });
  
    closeButton.addEventListener('click', () => {
      flyingBanner.style.display = 'none';
    });
  
  }