async function getData(link) {
  const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json.data);

    // Update the DOM with metadata
    document.querySelector('#here').innerHTML = JSON.stringify(json.data, null, 2); // Debugging
    document.querySelector('#there').innerHTML = json.data["og:site_name"] || "Site name not available";

    // Add more preview details if available
    if (json.data['url']) {
      console.log(json.data['url']);
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Attach the function to the button click
document.getElementById("generatePreview").addEventListener("click", () => {
  const link = document.getElementById("urlInput").value; // Get the URL from input
  if (link) {
    getData(link); // Call the fetch function with the user's link
  } else {
    alert("Please enter a valid link!");
  }
});