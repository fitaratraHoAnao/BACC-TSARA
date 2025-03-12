
document.addEventListener('DOMContentLoaded', function() {
    // Variables pour stocker les filtres sélectionnés
    let selectedMatiere = '';
    let selectedSerie = 'A'; // Série A par défaut
    let selectedType = 'sujet'; // Type par défaut: sujet

    // Sélecteurs pour les boutons de filtre
    const matiereButtons = document.querySelectorAll('.btn.matiere');
    const serieButtons = document.querySelectorAll('.btn.serie');
    const typeButtons = document.querySelectorAll('.btn.type');
    
    // Élément pour afficher les documents
    const documentsList = document.getElementById('documents-list');
    const resultTitle = document.getElementById('result-title');
    
    // Éléments pour le menu latéral
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebar = document.getElementById('toggle-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const mainContent = document.querySelector('.main-content');
    
    // Éléments de page
    const pages = document.querySelectorAll('.page');
    const mainPage = document.getElementById('main-page');
    const accueilPage = document.getElementById('accueil-page');
    const contactPage = document.getElementById('contact-page');
    
    // Gestionnaire pour ouvrir/fermer le menu latéral
    toggleSidebar.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    });
    
    closeSidebar.addEventListener('click', function(e) {
        e.stopPropagation(); // Empêcher la propagation de l'événement
        sidebar.classList.remove('active');
        mainContent.classList.remove('shifted');
    });
    
    // Fermer également en cliquant en dehors de la barre latérale
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = toggleSidebar.contains(event.target);
        
        if (sidebar.classList.contains('active') && !isClickInsideSidebar && !isClickOnToggle) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
        }
    });
    
    // Gestion de la navigation entre les pages
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // Masquer toutes les pages
            pages.forEach(p => p.classList.remove('active'));
            
            // Afficher la page sélectionnée
            if (page === 'accueil') {
                accueilPage.classList.add('active');
            } else if (page === 'contact') {
                contactPage.classList.add('active');
            } else if (page === 'sujet') {
                mainPage.classList.add('active');
                selectedType = 'sujet';
                updateActiveTypeButton();
                updateDocumentsList();
            } else if (page === 'corrige') {
                mainPage.classList.add('active');
                selectedType = 'correction';
                updateActiveTypeButton();
                updateDocumentsList();
            } else if (page === 'cours') {
                mainPage.classList.add('active');
                selectedType = 'cours';
                updateActiveTypeButton();
                updateDocumentsList();
            }
            
            // Fermer le menu latéral après la sélection (toujours fermer)
            // Ajout d'un délai pour s'assurer que la fermeture se fait après le traitement de l'événement
            setTimeout(function() {
                sidebar.classList.remove('active');
                mainContent.classList.remove('shifted');
            }, 100);
        });
    });
    
    function updateActiveTypeButton() {
        typeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-type') === selectedType) {
                btn.classList.add('active');
            }
        });
    }
    
    // Attacher les événements aux boutons de matière
    matiereButtons.forEach(button => {
        button.addEventListener('click', function() {
            matiereButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedMatiere = this.getAttribute('data-matiere');
            updateDocumentsList();
        });
    });
    
    // Attacher les événements aux boutons de série
    serieButtons.forEach(button => {
        button.addEventListener('click', function() {
            serieButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedSerie = this.getAttribute('data-serie');
            updateDocumentsList();
        });
    });
    
    // Attacher les événements aux boutons de type (sujet/correction)
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedType = this.getAttribute('data-type');
            updateDocumentsList();
        });
    });
    
    // Fonction pour mettre à jour la liste des documents
    function updateDocumentsList() {
        // Vérifier si tous les filtres nécessaires sont sélectionnés
        if (!selectedMatiere) {
            resultTitle.textContent = 'Veuillez sélectionner une matière';
            documentsList.innerHTML = '';
            return;
        }
        
        // Mettre à jour le titre des résultats
        let typeText = 'Sujets';
        if (selectedType === 'correction') {
            typeText = 'Corrigés';
        } else if (selectedType === 'cours') {
            typeText = 'Cours';
        }
        const matiereText = getMatiereFullName(selectedMatiere);
        resultTitle.textContent = `${typeText} ${matiereText} - Série ${selectedSerie}`;
        
        // Simuler une liste de documents par années (2000-2023)
        // Dans un cas réel, ces données viendraient d'une API ou d'une base de données
        const years = [];
        for (let year = 2023; year >= 2000; year--) {
            years.push(year);
        }
        
        // Créer la liste des documents PDF avec icônes
        let documentsHTML = '';
        
        years.forEach(year => {
            let baseFolder = 'fonctionnement/sujet/';
            if (selectedType === 'correction') {
                baseFolder = 'fonctionnement/correction/';
            } else if (selectedType === 'cours') {
                baseFolder = 'fonctionnement/cours/';
            }
            const matiereLower = selectedMatiere.toLowerCase();
            // Construction du chemin du fichier avec la série spécifique
            const fileName = `${matiereLower}_TA_${selectedSerie}_${year}.pdf`;
            const filePath = `${baseFolder}${selectedMatiere}/${selectedSerie}/${fileName}`;
            
            documentsHTML += `
                <div class="pdf-item" data-file="${filePath}">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjZTQyNTI1IiBkPSJNMTgxLjkgMjU2LjFjLTUtMTYtNC45LTMyLjctLjEtNDguNiAzLjQtMTEuMiA5LjctMTkuNyAxNS44LTI0LjIgNC45LTMuNyAxNC43LTkuNyAzNi4xLTkuN3MzMS4yIDYgMzYuMSA5LjdjNi4xIDQuNSAxMi40IDEzIDUuOCAyNC4yIDQuNSAxNS45IDQuNyAzMi42LS4zIDQ4LjZoMGMtLjQgMS4yLS45IDIuNC0xLjQgMy41LTkuNyAyNi4yLTM5LjcgMzYuOS00MC41IDM3LTItLjQtMzkuNS04LjUtNDguNC0zNy41LS43LTEuMi0xLjMtMi41LTEuOS0zLjh6bTY0LjkgNTAuNy0xMi45IDMwLjlzMjkuNyAyNi42IDIwLjQgMzMuMmMtMTQuNiAxMC01Ny43LTMyLjktODYuOCA5LjJDMTY0LjU2IDM4MS44IDIyMyAzMDkgMjQ2LjggMzA2LjhjMTIuOC0uMiAzOS43IDkuMSAzMS4yIDE4Ljd6bS45OS05LjZjMTMuMi00Ni40IDExLjktMTM3LjQtMi44LTE3MC45LTguMS0xOC40LTI0LTI3LjEtMzYuNy0yNy4xLTEyLjcgMC0yOC41IDguNy0zNi43IDI3LjEtNy41IDE3LTEyLjkgNDYuNi0xMi45IDg0LjkgMCA0MS4zIDUuNCAxOS42IDExLjQgMjQgNC42LTEwLjE1IDEyLjUtMjEuOCAyOC4yLTIxLjhzMjMuNiAxMS42NSAyOC4yIDIxLjhjNS45LTQuNCAxMS40LTYxLjEgMTEuNC0yNC4xLjA0LTM4LjM1LjA0LTY3Ljk1IDEuMS04NSAxLTEzLjktMS0zNy43LTktNTJINzVjMTQuNSAxLjQgMy40IDI3LjkgMTUuNCBoMTY2YzExLjk1IDAgMjEuNjUgOS41NSAyMS42NSAyMS4zNVYzOTkuSDE4Ny4zM0wxOTYuOSAzMDAuMnpNMCAzMTUuNXYxNzUuMWgzODRWMzE1LjV6Ii8+PC9zdmc+" alt="PDF" class="pdf-icon">
                    <span>${matiereText} série ${selectedSerie} ${year} - ${typeText}</span>
                </div>
            `;
        });
        
        documentsList.innerHTML = documentsHTML;
        
        // Ajouter l'événement de clic pour télécharger
        attachDownloadEvents();
    }
    
    // Fonction pour obtenir le nom complet de la matière
    function getMatiereFullName(code) {
        const matieres = {
            'HG': 'Histoire-Géographie',
            'MLG': 'Malagasy',
            'FRS': 'Français',
            'PC': 'Physique-Chimie',
            'MATH': 'Mathématiques',
            'SVT': 'Sciences de la Vie et de la Terre',
            'ANG': 'Anglais',
            'PHILO': 'Philosophie'
        };
        return matieres[code] || code;
    }
    
    // Fonction pour attacher les événements de téléchargement
    function attachDownloadEvents() {
        const pdfItems = document.querySelectorAll('.pdf-item');
        
        pdfItems.forEach(item => {
            item.addEventListener('click', function() {
                const filePath = this.getAttribute('data-file');
                downloadFile(filePath);
            });
        });
    }
    
    // Fonction pour télécharger un fichier
    function downloadFile(filePath) {
        const link = document.createElement('a');
        link.href = filePath;
        link.download = filePath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Afficher la page principale par défaut au chargement
    mainPage.classList.add('active');
    
    // Appeler updateDocumentsList une fois pour initialiser
    updateDocumentsList();
});
