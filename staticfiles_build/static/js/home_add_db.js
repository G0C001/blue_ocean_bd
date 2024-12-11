function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('hidden');
}
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('hidden');
}
function setupModalEventListeners() {
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (openModalBtn && closeModalBtn) {
        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
    }
}
async function createDatabase() {
    const userInput = document.getElementById('userInput');
    const dbName = userInput.value.trim();
    if (!dbName) {
        alert('Please enter a database name.');
        return;
    }

    const payload = {
        user: user, // Ensure `user` is globally defined
        file_name: `${dbName}.db`,
    };

    try {
        const url = `${window.location.origin}/API/upload_to_github`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(payload),
        });

        if (!response.ok) {
            console.error(`Failed with status code ${response.status}:`, await response.text());
            alert('Error: Failed to create database');
            return;
        }

        const data = await response.json();
        console.log("Success:", data);
        await fetchAndPopulateData(); // Refresh the data after successful creation
        closeModal(); // Close modal on success
    } catch (error) {
        console.error("An error occurred:", error);
        alert('An error occurred while creating the database');
    }
}
function setupCreateDatabaseListener() {
    const createBtn = document.getElementById('createBtn');
    if (createBtn) {
        createBtn.addEventListener('click', createDatabase);
    }
}
function addDatabaseItem(dbName) {
    const databaseList = document.getElementById('databaseList');

    // Check for duplicates
    const existingItem = Array.from(databaseList.querySelectorAll('.db-name')).find(
        (span) => span.textContent === dbName
    );
    if (existingItem) {
        console.warn(`Database item "${dbName}" already exists.`);
        return;
    }

    // Create a new item and apply TailwindCSS classes
    const newItem = document.createElement('div');
    newItem.classList.add('db-item', 'bg-gray-800', 'text-white', 'rounded-lg', 'shadow-lg', 'p-4', 'flex', 'justify-between', 'items-center');
    newItem.innerHTML = `
        <div class="db-info flex items-center space-x-4">
            <i class="bi bi-server"></i>
            <span class="db-name text-xl font-bold">${dbName}</span>
        </div>
        <div class="button-container flex space-x-4">
            <button class="edit-btn px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600">
                <i class="bi bi-play-circle-fill"></i> Edit
            </button>
            <button class="delete-btn px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600">
                <i class="bi bi-trash"></i> Delete
            </button>
        </div>
    `;

    databaseList.appendChild(newItem);

    setupDatabaseItemListeners(newItem, dbName);
}
function setupDatabaseItemListeners(newItem, dbName) {
    // Delete Button Listener
    const deleteBtn = newItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        const filePath = `${user}/${dbName}.db`;
        const confirmDelete = confirm(`Are you sure you want to delete the database ${dbName}?`);
        if (confirmDelete) {
            deleteFile(filePath);
        }
    });

    // Edit Button Listener (Placeholder)
    const editBtn = newItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        localStorage.setItem('selectedDB', dbName);        
        window.location.href = '/sql_editor';
    });
}
