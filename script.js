// Load and render tables from JSON file
let allData = [];

async function loadBooks() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        allData = data.sections;
        renderTables(allData);
        setupSearch();
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('tables-container').innerHTML = 
            '<div class="no-data">Errore nel caricamento dei dati. Controlla il file data.json.</div>';
    }
}

// Configuration for pagination
const BOOKS_PER_PAGE = 50;

// Filter books based on search query
function filterBooks(sections, query) {
    return sections.map(section => ({
        ...section,
        books: section.books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.isbn.toLowerCase().includes(query) ||
            book.branch.toLowerCase().includes(query)
        )
    })).filter(section => section.books.length > 0);
}

// Render all section tables
function renderTables(sections) {
    const container = document.getElementById('tables-container');
    container.innerHTML = '';

    if (!sections || sections.length === 0) {
        container.innerHTML = '<div class="no-data">Nessuna sezione disponibile.</div>';
        return;
    }

    sections.forEach(section => {
        const sectionDiv = createSectionTable(section);
        container.appendChild(sectionDiv);
    });
}

// Create a table for each section with pagination
function createSectionTable(section) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'section-title';
    titleDiv.textContent = section.name;
    sectionDiv.appendChild(titleDiv);

    if (!section.books || section.books.length === 0) {
        const noDataDiv = document.createElement('div');
        noDataDiv.style.padding = '20px';
        noDataDiv.style.color = '#999';
        noDataDiv.textContent = 'Nessun libro in questa sezione.';
        sectionDiv.appendChild(noDataDiv);
        return sectionDiv;
    }

    // Create wrapper for table and pagination
    const wrapper = document.createElement('div');
    let currentPage = 1;
    const totalPages = Math.ceil(section.books.length / BOOKS_PER_PAGE);

    // Function to render table for current page
    function renderPage(page) {
        // Remove old table if exists
        const oldTable = wrapper.querySelector('table');
        if (oldTable) oldTable.remove();
        
        // Remove old pagination if exists
        const oldPagination = wrapper.querySelector('.pagination');
        if (oldPagination) oldPagination.remove();

        // Calculate start and end indices
        const start = (page - 1) * BOOKS_PER_PAGE;
        const end = Math.min(start + BOOKS_PER_PAGE, section.books.length);
        const booksToShow = section.books.slice(start, end);

        // Create table
        const table = document.createElement('table');
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['Titolo', 'ISBN', 'Anno', 'Categoria', 'Qualità', 'Prezzo', 'Contatto'];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        
        booksToShow.forEach(book => {
            const row = document.createElement('tr');
            
            // Title
            const titleCell = document.createElement('td');
            titleCell.textContent = book.title;
            row.appendChild(titleCell);
            
            // ISBN
            const isbnCell = document.createElement('td');
            isbnCell.textContent = book.isbn;
            row.appendChild(isbnCell);
            
            // Year
            const yearCell = document.createElement('td');
            yearCell.textContent = book.year;
            row.appendChild(yearCell);
            
            // Branch
            const branchCell = document.createElement('td');
            branchCell.className = 'branch-cell';
            branchCell.textContent = book.branch;
            row.appendChild(branchCell);
            
            // Quality
            const qualityCell = document.createElement('td');
            const qualityBadge = document.createElement('span');
            qualityBadge.className = `quality-badge quality-${book.quality.toLowerCase()}`;
            const qualityMap = {
                'excellent': 'Eccellente',
                'good': 'Buono',
                'fair': 'Discreto',
                'poor': 'Scarso'
            };
            qualityBadge.textContent = qualityMap[book.quality.toLowerCase()] || book.quality;
            qualityCell.appendChild(qualityBadge);
            row.appendChild(qualityCell);
            
            // Price
            const priceCell = document.createElement('td');
            priceCell.className = 'price';
            priceCell.textContent = '€' + book.price.toFixed(2);
            row.appendChild(priceCell);
            
            // Contact
            const contactCell = document.createElement('td');
            contactCell.className = 'contact-info';
            contactCell.textContent = book.contact;
            row.appendChild(contactCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        wrapper.appendChild(table);

        // Add pagination if more than one page
        if (totalPages > 1) {
            const pagination = document.createElement('div');
            pagination.className = 'pagination';

            // Previous button
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '← Precedente';
            prevBtn.disabled = page === 1;
            prevBtn.onclick = () => {
                if (page > 1) {
                    page--;
                    currentPage = page;
                    renderPage(page);
                }
            };
            pagination.appendChild(prevBtn);

            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                if (i === page) {
                    pageBtn.className = 'current-page';
                    pageBtn.disabled = true;
                } else {
                    pageBtn.onclick = () => {
                        page = i;
                        currentPage = page;
                        renderPage(page);
                    };
                }
                pageBtn.textContent = i;
                pagination.appendChild(pageBtn);
            }

            // Next button
            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Successivo →';
            nextBtn.disabled = page === totalPages;
            nextBtn.onclick = () => {
                if (page < totalPages) {
                    page++;
                    currentPage = page;
                    renderPage(page);
                }
            };
            pagination.appendChild(nextBtn);

            wrapper.appendChild(pagination);
        }
    }

    // Render first page
    renderPage(1);
    sectionDiv.appendChild(wrapper);
    
    return sectionDiv;
}

// Load books when page loads or immediately if DOM is already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBooks);
} else {
    loadBooks();
}

// Menu toggle behavior for small screens
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const topMenu = document.querySelector('.top-menu');
    const menuSearchRow = document.querySelector('.menu-search-row');
    const menuLinks = document.querySelectorAll('.menu-links a');

    if (!menuToggle || !topMenu) return;

    // Show search row on mobile view
    function updateMenuLayout() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            menuSearchRow.classList.add('show-on-mobile');
        } else {
            menuSearchRow.classList.remove('show-on-mobile');
            topMenu.classList.remove('open');
        }
    }

    // Call on load and on resize
    updateMenuLayout();
    window.addEventListener('resize', updateMenuLayout);

    // Toggle menu on button click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        topMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            topMenu.classList.remove('open');
            e.stopPropagation();
        });
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
        if (topMenu.classList.contains('open') && 
            !topMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            topMenu.classList.remove('open');
        }
    });

    // Close menu on scroll (iOS behavior)
    document.addEventListener('scroll', () => {
        if (topMenu.classList.contains('open')) {
            topMenu.classList.remove('open');
        }
    });
});

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    
    // Desktop menu search
    const menuSearchInput = document.getElementById('menu-search-input');
    const menuClearBtn = document.getElementById('menu-clear-search');
    
    // Mobile menu search
    const menuSearchInputMobile = document.getElementById('menu-search-input-mobile');
    const menuClearBtnMobile = document.getElementById('menu-clear-search-mobile');

    // Setup original search bar
    if (searchInput) {
        function updateClearBtn() {
            clearBtn.disabled = searchInput.value.trim() === '';
        }

        searchInput.addEventListener('input', (e) => {
            updateClearBtn();
            const query = e.target.value.toLowerCase().trim();
            if (query === '') {
                renderTables(allData);
            } else {
                const filtered = filterBooks(allData, query);
                renderTables(filtered);
            }
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            updateClearBtn();
            renderTables(allData);
            searchInput.focus();
        });

        updateClearBtn();
    }

    // Setup desktop menu search bar
    if (menuSearchInput) {
        function updateMenuClearBtn() {
            menuClearBtn.disabled = menuSearchInput.value.trim() === '';
        }

        menuSearchInput.addEventListener('input', (e) => {
            updateMenuClearBtn();
            const query = e.target.value.toLowerCase().trim();
            if (query === '') {
                renderTables(allData);
            } else {
                const filtered = filterBooks(allData, query);
                renderTables(filtered);
            }
        });

        menuClearBtn.addEventListener('click', () => {
            menuSearchInput.value = '';
            updateMenuClearBtn();
            renderTables(allData);
            menuSearchInput.focus();
        });

        updateMenuClearBtn();
    }

    // Setup mobile menu search bar
    if (menuSearchInputMobile) {
        function updateMenuClearBtnMobile() {
            menuClearBtnMobile.disabled = menuSearchInputMobile.value.trim() === '';
        }

        menuSearchInputMobile.addEventListener('input', (e) => {
            updateMenuClearBtnMobile();
            const query = e.target.value.toLowerCase().trim();
            if (query === '') {
                renderTables(allData);
            } else {
                const filtered = filterBooks(allData, query);
                renderTables(filtered);
            }
        });

        menuClearBtnMobile.addEventListener('click', () => {
            menuSearchInputMobile.value = '';
            updateMenuClearBtnMobile();
            renderTables(allData);
            menuSearchInputMobile.focus();
        });

        updateMenuClearBtnMobile();
    }
}
