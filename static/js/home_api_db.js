// Function to create a new API box dynamically
function createApiBox(databaseOptions) {
    const apiList = document.getElementById('apiList');

    // Create the new API box container
    const newApiBox = document.createElement('div');
    newApiBox.classList.add('bg-gray-800', 'text-white', 'rounded-lg', 'shadow-lg', 'p-4', 'flex', 'items-center', 'justify-between', 'space-x-4');

    // Populate the dropdown dynamically from the databaseOptions array
    const optionsHtml = databaseOptions.map(option => `<option>${option}</option>`).join('');

    // Set inner HTML for the new API box
    newApiBox.innerHTML = `
        <!-- API Details -->
        <div class="flex items-center space-x-4">
            <div class="flex flex-col">
                <span class="font-bold text-lg">API Name</span>
                <span class="text-sm text-gray-400">GET</span>
            </div>
        </div>

        <!-- Database Selector -->
        <div>
            <select class="bg-gray-700 text-white font-bold rounded-md px-3 py-2">
                <option class="font-bold" disabled selected>Select DB Name</option>
                ${optionsHtml}
            </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
            <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold text-sm api-token-btn">
                API Token
            </button>
            <button class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white font-bold text-sm remove-api-box">
                Delete
            </button>
        </div>
    `;

    // Append the new API box to the list
    apiList.appendChild(newApiBox);

    // Add event listener for the "API Token" button
    newApiBox.querySelector('.api-token-btn').addEventListener('click', function () {
        openApiModal(newApiBox);  // Pass the newApiBox to the openApiModal function
    });

    // Add event listener for the "Delete" button
    newApiBox.querySelector('.remove-api-box').addEventListener('click', () => {
        const confirmDelete = confirm('Are you sure you want to delete this API?');
        if (confirmDelete) {
            apiList.removeChild(newApiBox);
        }
    });
}

document.getElementById('addApiBtn').addEventListener('click', () => {
    createApiBox(database_files_names);  // Make sure you pass the right data
});

// Open the API Token modal and dynamically set the content
function openApiModal(apiBox) {
    const apiModal = document.getElementById('apiModal');
    const apiTokenCode = document.getElementById('apiTokenCode');

    // Get the selected database name from the dropdown in the clicked API box
    const selectedDb = apiBox.querySelector('select').value;


    function encode(originalString) {
        let base64 = btoa(originalString);
        return base64.replace(/=/g, '');
      }
      let originalString = `${window.user}/${selectedDb}.db`;
      let encodedString = encode(originalString);

    const tokenContent = `
{
  "url": "${window.location.origin}/API/database",
  "method": "GET",
  "params": {
    "token": "${encodedString}",
    "query": "Send your database query as a parameter"
  }
}
`;

    // Set the content inside the <code> tag
    apiTokenCode.textContent = tokenContent;

    // Highlight the syntax (assuming Prism.js or Highlight.js is set up)
    Prism.highlightAll();

    // Show the modal
    apiModal.classList.remove('hidden');
}

// Function to close the modal
function closeApiModal() {
    const apiModal = document.getElementById('apiModal');
    apiModal.classList.add('hidden');
}

// Function to copy content to the clipboard
function copyToClipboard() {
    const apiTokenCode = document.getElementById('apiTokenCode');

    // Copy the content of the <code> tag to the clipboard
    navigator.clipboard.writeText(apiTokenCode.textContent).then(() => {
        alert('API Token copied to clipboard!');
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}