import { Session } from "@inrupt/solid-client-authn-browser";

// Initialize a new session
const session = new Session();

const deleteForm = document.getElementById("deleteForm");
const deleteStatus = document.getElementById("deleteStatus");

// Handle login if the user is not already authenticated
async function ensureLoggedIn() {
    if (!session.info.isLoggedIn) {
        await session.login({
            oidcIssuer: "https://solidcommunity.net", // Change if using a different identity provider
            clientName: "Solid POD Delete App",
            redirectUrl: window.location.href
        });
    }
}

// Delete file function
async function deleteFile(url) {
    // Make sure the user is authenticated before proceeding
    await ensureLoggedIn();

    try {
        // Additional check to confirm it's a file and not a container
        const headResponse = await session.fetch(url, { method: 'HEAD' });
        const isContainer = headResponse.headers.get("Link")?.includes('type="http://www.w3.org/ns/ldp#Container"');
        
        if (isContainer) {
            deleteStatus.textContent = "Error: Target URL appears to be a container, not a file. Aborting delete operation.";
            return;
        }

        // Proceed with deletion if confirmed as a file
        const response = await session.fetch(url, {
            method: "DELETE",
        });

        if (response.ok) {
            deleteStatus.textContent = `File deleted successfully at ${url}`;
        } else {
            deleteStatus.textContent = `Failed to delete file: ${response.statusText}`;
        }
    } catch (error) {
        deleteStatus.textContent = `Error deleting file: ${error.message}`;
    }
}

// Set up the form submission event listener
deleteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fileUrl = document.getElementById("fileUrl").value;
    deleteStatus.textContent = "Deleting file...";
    await deleteFile(fileUrl);
});
