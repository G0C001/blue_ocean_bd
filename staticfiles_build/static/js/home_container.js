function showContainer(containerId) {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
      container.classList.add('hidden');
    });

    const activeContainer = document.getElementById(containerId);
    if (activeContainer) {
      activeContainer.classList.remove('hidden');
    }
  }
window.onload = function () {    
showContainer('homeContainer');
};

let database_files_names = [];
async function fetchAndPopulateData() {
    const url = `${window.location.origin}/API/fetching_files`;
    const params = { folder_path: user };

    try {
        const response = await fetch(`${url}?${new URLSearchParams(params)}`);
        if (!response.ok) {
            console.error("Failed to fetch data:", response.status, response.statusText);
            return;
        }

        const data = await response.json();
        const files = data.files;
        database_files_names = files
        
        clearDatabaseItems();

        files.forEach(file => addDatabaseItem(file));
        

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function clearDatabaseItems() {
    const databaseList = document.getElementById('databaseList');
    const dbItems = databaseList.querySelectorAll('.db-item');
    dbItems.forEach(item => item.remove());
}


document.addEventListener('DOMContentLoaded', async() => {
    setupModalEventListeners();
    setupCreateDatabaseListener();
    await fetchAndPopulateData();
    // createApiBox(database_files_names)
    
});
