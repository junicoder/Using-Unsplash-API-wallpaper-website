document.addEventListener("DOMContentLoaded", function () {
  const unsplashApiKey = "Your API key here"; // Replace with your key
  const wallpaperGrid = document.getElementById("wallpaper-grid");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const numImages = 10; // Number of wallpapers to fetch

  const getUnsplashWallpapers = async (query) => {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${unsplashApiKey}&count=${numImages}&orientation=landscape${
        query ? `&query=${query}` : ""
      }`
    );
    const data = await response.json();
    return data;
  };

  const createWallpaperItem = (data) => {
    const item = document.createElement("div");
    item.classList.add("wallpaper-item");

    const img = document.createElement("img");
    img.src = data.urls.regular;
    img.alt = data.alt_description;

    const downloadBtn = document.createElement("button");
    downloadBtn.classList.add("download-btn");
    downloadBtn.textContent = "Download";

    downloadBtn.addEventListener("click", async () => {
      try {
        // Fetch the image data
        const response = await fetch(data.urls.full);
        const imageData = await response.blob();

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = URL.createObjectURL(imageData);
        link.download = "wallpaper.jpg"; // Adjust file name as needed

        // Trigger a click event on the link to initiate download
        link.click();
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    });

    item.appendChild(img);
    item.appendChild(downloadBtn);

    return item;
  };

  const displayWallpapers = async (query) => {
    wallpaperGrid.innerHTML = ""; // Clear previous wallpapers

    const wallpapers = await getUnsplashWallpapers(query);
    wallpapers.forEach((wallpaper) => {
      const wallpaperItem = createWallpaperItem(wallpaper);
      wallpaperGrid.appendChild(wallpaperItem);
    });
  };

  // Event listener for search button click
  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      displayWallpapers(searchTerm);
    }
  });

  // Initial display of wallpapers
  displayWallpapers("");
});
