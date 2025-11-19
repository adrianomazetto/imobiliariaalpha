// ✨ FUNÇÃO: Converter URLs do Google Drive
function converterUrlParaImagemDireta(url) {
    if (!url || url.trim() === '') return null;
    
    // GOOGLE DRIVE - Múltiplos formatos para tentativa automática
    if (url.includes('drive.google.com')) {
        let fileId = null;
        
        // Formato 1: /file/d/ID/view
        let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match) {
            fileId = match[1];
        }
        
        // Formato 2: id=ID (parâmetros)
        if (!fileId) {
            match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (match) {
                fileId = match[1];
            }
        }
        
        if (fileId) {
            // Retorna o formato mais robusto para visualização direta, o w600-h400-k-rw
            return `https://lh3.googleusercontent.com/d/${fileId}=w600-h400-k-rw`;
        }
    }
    // URL EXTERNA NORMAL ou local (sem alteração)
    else if (url.startsWith('http') || url.startsWith('./')) {
        return url;
    }
    
    return null;
}

// VARIÁVEIS GLOBAIS
let allListings = []; // Será preenchido com dados do Google Sheets
let favorites = JSON.parse(localStorage.getItem('alphaprime_favorites')) || [];
const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWkbGh93kfeN-Sj2LNMg9nTus2h3pwrFOXjQ7IESLwN_NpmUuHr-aZdoyum5wyFPWWcWb4iiPFvPmH/pub?gid=0&single=true&output=csv';

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// FUNÇÕES DE DADOS
/**
 * Converte uma string CSV para um array de objetos.
 * @param {string} csvText - O texto CSV.
 * @returns {Array<Object>} - O array de objetos.
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        // Lida com valores que podem conter vírgulas, dividindo a linha de forma mais segura
        const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        const obj = {};
        headers.forEach((header, index) => {
            let value = (values[index] || '').trim();
            
            // Remove uma ou mais aspas do início e do fim do valor. Ex: "value" ou """value""" -> value
            value = value.replace(/^"+|"+$/g, '');

            // Trata colunas que devem ser arrays (ex: images, features)
            if (header === 'images') {
                obj[header] = value ? value.split(';').map(item => {
                    const convertedUrl = converterUrlParaImagemDireta(item.trim());
                    // Se a conversão retornar uma URL válida, usa-a. Caso contrário, usa a original.
                    return convertedUrl || item.trim(); 
                }).filter(url => url !== null && url !== '') : []; // Remove quaisquer URLs nulas ou vazias
            } else if (header === 'features') {
                obj[header] = value ? value.split(';').map(item => item.trim()) : [];
            } 
            // Trata colunas numéricas
            else if (['id', 'price', 'bedrooms', 'bathrooms', 'area'].includes(header)) {
                obj[header] = parseFloat(value) || 0;
            }
            // Deixa nulo se o valor for 'null' ou vazio
            else if (value === 'null' || value === '') {
                obj[header] = null;
            }
            else {
                obj[header] = value;
            }
        });
        data.push(obj);
    }
    return data;
}

/**
 * Busca e processa os dados do Google Sheet.
 */
async function fetchAndProcessData() {
    try {
        const response = await fetch(googleSheetURL);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const csvText = await response.text();
        allListings = parseCSV(csvText);
        
        // Depois que os dados são carregados, renderize a aplicação
        renderInitialPage();

    } catch (error) {
        console.error('Falha ao buscar ou processar os dados:', error);
        const container = document.getElementById('listingsContainer');
        if (container) {
            container.innerHTML = '<p style="color: red; text-align: center;">Não foi possível carregar os imóveis. Tente novamente mais tarde.</p>';
        }
    }
}

function initializeApp() {
    // Carregar favoritos do localStorage
    loadFavorites();
    
    // Adicionar event listeners aos botões de navegação
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            goToPage(page);
        });
    });

    // Adicionar event listener ao logo para voltar à home
    const logoSection = document.querySelector('.logo-section');
    if (logoSection) {
        logoSection.addEventListener('click', function() {
            goToPage('home');
        });
    }

    // Busca os dados e então renderiza a página
    fetchAndProcessData();
    
    // Fechar modal ao clicar fora
    const modal = document.getElementById('detailModal');
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Adicionar event listener ao formulário de contato
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }
}

function renderInitialPage() {
    // Renderizar listagem inicial
    renderListings();
}

// NAVEGAÇÃO
function goToPage(pageName) {
    // Esconder todas as páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar página selecionada
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Atualizar botões de navegação
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageName) {
            btn.classList.add('active');
        }
    });

    // Se for favoritos, renderizar favoritos
    if (pageName === 'favoritos') {
        renderFavorites();
    }

    // Se for listings, renderizar listagens
    if (pageName === 'listings') {
        renderListings();
    }

    // Scroll para o topo
    window.scrollTo(0, 0);
}

function goToListings(transactionType) {
    goToPage('listings');
    document.getElementById('transactionFilter').value = transactionType;
    filterListings();
}

// RENDERIZAR LISTAGENS
function renderListings() {
    const container = document.getElementById('listingsContainer');
    const emptyMessage = document.getElementById('emptyMessage');
    
    let filteredListings = filterListingsData();

    if (filteredListings.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';
    container.innerHTML = '';

    filteredListings.forEach(listing => {
        const card = createListingCard(listing);
        container.appendChild(card);
    });
}

function createListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card';
    
    const isFavorite = favorites.includes(listing.id);
    const mainImage = (listing.images && listing.images.length > 0) ? listing.images[0] : 'https://via.placeholder.com/300x250?text=Sem+Imagem';
    
    let bedroomsHTML = '';
    let bathroomsHTML = '';
    let areaHTML = '';

    if (listing.bedrooms > 0) {
        bedroomsHTML = `<div class="listing-feature">🛏️ ${listing.bedrooms} Quarto(s)</div>`;
    }
    if (listing.bathrooms > 0) {
        bathroomsHTML = `<div class="listing-feature">🚿 ${listing.bathrooms} Banheiro(s)</div>`;
    }
    if (listing.area > 0) {
        areaHTML = `<div class="listing-feature">📐 ${formatArea(listing.area)}</div>`;
    }

    card.innerHTML = `
        <div class="listing-image">
            <img src="${mainImage}" alt="${listing.title}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x250?text=Erro+ao+carregar'">
            ${listing.badge ? `<div class="listing-badge">${listing.badge}</div>` : ''}
            <button class="listing-favorite ${isFavorite ? 'active' : ''}" 
                    onclick="toggleFavorite(event, ${listing.id})" 
                    title="Adicionar aos favoritos">
                ${isFavorite ? '❤️' : '🤍'}
            </button>
        </div>
        <div class="listing-info">
            <div class="listing-title">${listing.title}</div>
            <div class="listing-price">${formatPrice(listing.price)}</div>
            <div class="listing-location">📍 ${listing.location}</div>
            <div class="listing-features">
                ${bedroomsHTML}
                ${bathroomsHTML}
                ${areaHTML}
            </div>
        </div>
    `;

    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('listing-favorite')) {
            showListingDetail(listing);
        }
    });

    return card;
}


// FILTROS
function filterListingsData() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const transaction = document.getElementById('transactionFilter').value;
    const propertyType = document.getElementById('propertyTypeFilter').value;
    const minPrice = parseFloat(document.getElementById('minPriceFilter').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPriceFilter').value) || Infinity;
    const sort = document.getElementById('sortFilter').value;

    let filtered = allListings.filter(listing => {
        const title = listing.title || '';
        const location = listing.location || '';
        const matchSearch = title.toLowerCase().includes(search) || 
                           location.toLowerCase().includes(search);
        const matchTransaction = !transaction || listing.transactionType === transaction;
        const matchPropertyType = !propertyType || listing.propertyType === propertyType;
        const matchPrice = listing.price >= minPrice && listing.price <= maxPrice;

        return matchSearch && matchTransaction && matchPropertyType && matchPrice;
    });

    // Ordenação
    if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - b.price); // Correção: b.price - a.price
    } else if (sort === 'newest') {
        // A ordem do CSV já é a padrão
    }

    return filtered;
}

function filterListings() {
    renderListings();
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('transactionFilter').value = '';
    document.getElementById('propertyTypeFilter').value = '';
    document.getElementById('minPriceFilter').value = '';
    document.getElementById('maxPriceFilter').value = '';
    document.getElementById('sortFilter').value = 'newest';
    filterListings();
}

// FAVORITOS
function toggleFavorite(event, listingId) {
    event.stopPropagation();
    
    const index = favorites.indexOf(listingId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(listingId);
    }

    saveFavorites();
    
    // Atualizar UI
    const button = event.target;
    button.classList.toggle('active');
    button.textContent = button.classList.contains('active') ? '❤️' : '🤍';

    // Se estamos na página de favoritos, renderizar novamente
    if (document.getElementById('favoritos').classList.contains('active')) {
        renderFavorites();
    }
}

function saveFavorites() {
    localStorage.setItem('alphaprime_favorites', JSON.stringify(favorites));
}

function loadFavorites() {
    favorites = JSON.parse(localStorage.getItem('alphaprime_favorites')) || [];
}

function renderFavorites() {
    const container = document.getElementById('favoritesContainer');
    const emptyMessage = document.getElementById('emptyFavorites');

    const favoriteListings = allListings.filter(listing => favorites.includes(listing.id));

    if (favoriteListings.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';
    container.innerHTML = '';

    favoriteListings.forEach(listing => {
        const card = createListingCard(listing);
        container.appendChild(card);
    });
}

// MODAL DE DETALHES
function showListingDetail(listing) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const isFavorite = favorites.includes(listing.id);

    let bedroomsHTML = '';
    let bathroomsHTML = '';
    let areaHTML = '';

    if (listing.bedrooms > 0) {
        bedroomsHTML = `<div class="listing-feature">🛏️ ${listing.bedrooms} Quarto(s)</div>`;
    }
    if (listing.bathrooms > 0) {
        bathroomsHTML = `<div class="listing-feature">🚿 ${listing.bathrooms} Banheiro(s)</div>`;
    }
    if (listing.area > 0) {
        areaHTML = `<div class="listing-feature">📐 ${formatArea(listing.area)}</div>`;
    }
    
    const mainImage = (listing.images && listing.images.length > 0) ? listing.images[0] : 'https://via.placeholder.com/600x400?text=Sem+Imagem';

    let imagesHTML = '';
    if (listing.images && listing.images.length > 0) {
        imagesHTML = `
            <div class="modal-section">
                <h3>Galeria de Fotos (${listing.images.length} imagens)</h3>
                <div class="modal-gallery-main">
                    <img id="mainImage" src="${mainImage}" alt="Imagem Principal" onerror="this.onerror=null;this.src='https://via.placeholder.com/600x400?text=Erro+ao+carregar'" class="main-image">
                </div>
                <div class="modal-gallery-thumbnails">
                    ${listing.images.map((img, index) => `
                        <img 
                            src="${img}" 
                            alt="Foto ${index + 1}" 
                            class="thumbnail ${index === 0 ? 'active' : ''}" 
                            onclick="changeMainImage(this.src)"
                            onerror="this.onerror=null;this.src='https://via.placeholder.com/100?text=Erro'"
                        >
                    `).join('')}
                </div>
            </div>
        `;
    }

    let featuresHTML = '';
    if (listing.features && listing.features.length > 0 && listing.features[0]) {
        featuresHTML = `
            <div class="modal-section">
                <h3>Características</h3>
                <ul class="modal-features-list">
                    ${listing.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    let agentHTML = `
        <div class="modal-section">
            <h3>Agente Imobiliário</h3>
            <div class="modal-agent">
                <div class="modal-agent-info">
                    <p><strong>${listing.agent}</strong></p>
                    <p>📞 <a href="tel:${listing.phone}">${listing.phone}</a></p>
                    <p>📧 <a href="mailto:${listing.email}">${listing.email}</a></p>
                </div>
            </div>
        </div>
    `;

    modalBody.innerHTML = `
        <h2>${listing.title}</h2>
        <div class="modal-price">${formatPrice(listing.price)}</div>
        
        <div class="modal-section">
            <p><strong>📍 Localização:</strong> ${listing.location}</p>
            <p><strong>🏙️ Cidade:</strong> ${listing.city}, ${listing.state}</p>
            <p><strong>📝 Descrição:</strong> ${listing.description}</p>
        </div>

        <div class="modal-section">
            <h3>Detalhes</h3>
            <div class="listing-features">
                ${bedroomsHTML}
                ${bathroomsHTML}
                ${areaHTML}
            </div>
        </div>

        ${imagesHTML}
        ${featuresHTML}
        ${agentHTML}

        <div style="margin-top: 30px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="contactAgent('${listing.phone}')">
                📞 Entre em contato
            </button>
            <button class="btn btn-secondary" onclick="contactAgent('${listing.email}')">
                📧 Enviar Email
            </button>
            <button class="btn ${isFavorite ? 'btn-danger' : 'btn-primary'}" onclick="toggleFavoriteFromModal(${listing.id})">
                ${isFavorite ? '❤️ Remover dos Favoritos' : '🤍 Adicionar aos Favoritos'}
            </button>
        </div>
    `;

    modal.classList.add('active');
}


function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('active');
}

function toggleFavoriteFromModal(listingId) {
    const index = favorites.indexOf(listingId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(listingId);
    }
    saveFavorites();
    
    // Atualizar modal
    const listing = allListings.find(l => l.id === listingId);
    if (listing) {
        showListingDetail(listing);
    }
}

// GALERIA DE IMAGENS
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Atualizar thumbnails ativas
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === imageSrc) {
            thumb.classList.add('active');
        }
    });
}

function contactAgent(contact) {
    if (contact.includes('@')) {
        // Email
        window.location.href = `mailto:${contact}`;
    } else {
        // Telefone
        window.location.href = `tel:${contact}`;
    }
}

// FORMULÁRIO DE CONTATO
function submitContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    // Simular envio (em produção, seria enviado para um servidor)
    const mailtoLink = `mailto:contato@alphaprime.com?subject=Contato%20de%20${encodeURIComponent(name)}&body=${encodeURIComponent(`Nome: ${name}\nEmail: ${email}\nTelefone: ${phone}\n\nMensagem:\n${message}`)}`;
    
    window.location.href = mailtoLink;

    // Limpar formulário
    document.querySelector('.contact-form').reset();
    alert('Sua mensagem foi preparada. Clique em enviar no seu cliente de email!');
}

// BUSCA COM ENTER
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterListings();
            }
        });
    }
});

// Funções que estavam no data.js
function formatPrice(price) {
    if (typeof price === 'string') {
        price = parseFloat(price);
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

function formatArea(area) {
    return area + ' m²';
}