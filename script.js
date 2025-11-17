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

    const wrapper = document.createElement('div');
    let currentPage = 1;
    const totalPages = Math.ceil(section.books.length / BOOKS_PER_PAGE);

    function renderPage(page) {
        const oldTable = wrapper.querySelector('table');
        if (oldTable) oldTable.remove();

        const oldPagination = wrapper.querySelector('.pagination');
        if (oldPagination) oldPagination.remove();

        const start = (page - 1) * BOOKS_PER_PAGE;
        const end = Math.min(start + BOOKS_PER_PAGE, section.books.length);
        const booksToShow = section.books.slice(start, end);

        const table = document.createElement('table');

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

        const tbody = document.createElement('tbody');

        booksToShow.forEach(book => {
            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = book.title;
            row.appendChild(titleCell);

            const isbnCell = document.createElement('td');
            isbnCell.textContent = book.isbn;
            row.appendChild(isbnCell);

            const yearCell = document.createElement('td');
            yearCell.textContent = book.year;
            row.appendChild(yearCell);

            const branchCell = document.createElement('td');
            branchCell.className = 'branch-cell';
            branchCell.textContent = book.branch;
            row.appendChild(branchCell);

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

            const priceCell = document.createElement('td');
            priceCell.className = 'price';
            priceCell.textContent = '€' + book.price.toFixed(2);
            row.appendChild(priceCell);

            const contactCell = document.createElement('td');
            contactCell.className = 'contact-info';
            contactCell.textContent = book.contact;
            row.appendChild(contactCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);

        if (totalPages > 1) {
            const pagination = document.createElement('div');
            pagination.className = 'pagination';

            const prevBtn = document.createElement('button');
            prevBtn.textContent = '← Precedente';
            prevBtn.disabled = page === 1;
            prevBtn.onclick = () => {
                page--;
                currentPage = page;
                renderPage(page);
            };
            pagination.appendChild(prevBtn);

            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                if (i === page) {
                    pageBtn.className = 'current-page';
                    pageBtn.disabled = true;
                } else {
                    pageBtn.onclick = () => {
                        currentPage = i;
                        renderPage(i);
                    };
                }
                pageBtn.textContent = i;
                pagination.appendChild(pageBtn);
            }

            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Successivo →';
            nextBtn.disabled = page === totalPages;
            nextBtn.onclick = () => {
                page++;
                currentPage = page;
                renderPage(page);
            };
            pagination.appendChild(nextBtn);

            wrapper.appendChild(pagination);
        }
    }

    renderPage(1);
    sectionDiv.appendChild(wrapper);

    return sectionDiv;
}

// Load books if ready
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

    function updateMenuLayout() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            menuSearchRow.classList.add('show-on-mobile');
        } else {
            menuSearchRow.classList.remove('show-on-mobile');
            topMenu.classList.remove('open');
        }
    }

    updateMenuLayout();
    window.addEventListener('resize', updateMenuLayout);

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        topMenu.classList.toggle('open');
    });

    // FIXED: allow links to open normally
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            topMenu.classList.remove('open');
            // no preventDefault!
        });
    });

    document.addEventListener('click', (e) => {
        if (topMenu.classList.contains('open') && 
            !topMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            topMenu.classList.remove('open');
        }
    });

    document.addEventListener('scroll', () => {
        if (topMenu.classList.contains('open')) {
            topMenu.classList.remove('open');
        }
    });
});

// Setup search functionality
function setupSearch() {
    function setupField(input, clearBtn) {
        if (!input) return;

        function updateClear() {
            clearBtn.disabled = input.value.trim() === '';
        }

        input.addEventListener('input', () => {
            updateClear();
            const query = input.value.toLowerCase().trim();
            renderTables(query ? filterBooks(allData, query) : allData);
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            updateClear();
            renderTables(allData);
            input.focus();
        });

        updateClear();
    }

    setupField(
        document.getElementById('search-input'),
        document.getElementById('clear-search')
    );
    setupField(
        document.getElementById('menu-search-input'),
        document.getElementById('menu-clear-search')
    );
    setupField(
        document.getElementById('menu-search-input-mobile'),
        document.getElementById('menu-clear-search-mobile')
    );
}

