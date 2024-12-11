async function deleteFile(filePath) {
    const url = `${window.location.origin}/API/delect_file_by_user`;

    try {
        const params = new URLSearchParams({ file_path: filePath });
        const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });

        if (response.ok) {
            const data = await response.json();
            console.log("File deletion request successful.");
            console.log("Response:", data);

            // Remove the corresponding DOM element
            const databaseList = document.getElementById('databaseList');
            const dbItem = Array.from(databaseList.querySelectorAll('.db-item')).find(item =>
                item.querySelector('.db-name').textContent === filePath.replace(`${user}/`, '').replace('.db', '')
            );
            if (dbItem) dbItem.remove();
        } else {
            console.error(`Request failed with status code ${response.status}`);
            console.error("Response:", await response.text());
        }
    } catch (error) {
        console.error("Error occurred while sending the request:", error);
    }
}
