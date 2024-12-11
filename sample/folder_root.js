const folders = document.querySelectorAll(".folder");

    folders.forEach((folder) => {
      folder.addEventListener("click", () => {
        const folderId = folder.getAttribute("data-folder");
        const files = document.getElementById(`${folderId}-files`);
        const icon = folder.querySelector("i");
        
        if (files.style.display === "none" || !files.style.display) {
          files.style.display = "block";
          folder.classList.add("open");
        } else {
          files.style.display = "none";
          folder.classList.remove("open");
        }
      });
    });