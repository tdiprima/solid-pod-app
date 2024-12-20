/**
 * @file upload-local.js
 * @description Upload a file to a Solid POD
 * @requires @inrupt/solid-client
 * @requires @inrupt/solid-client-authn-browser
 * @requires @inrupt/vocab-common-rdf
 * @note This file is a modified version of the original upload-web.js
 */
import {
    getSolidDataset,
    getThing,
    setThing,
    getStringNoLocale,
    setStringNoLocale,
    saveSolidDatasetAt, 
    createContainerAt,
    saveFileInContainer
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { VCARD } from "@inrupt/vocab-common-rdf";

// TODO: Change this to your identity provider.
const SOLID_IDENTITY_PROVIDER = "http://localhost:3000";
const MY_POD = "http://localhost:3000/Tammy-DiPrima/";

document.getElementById(
    "solid_identity_provider"
).innerHTML = `[<a target="_blank" href="${SOLID_IDENTITY_PROVIDER}">${SOLID_IDENTITY_PROVIDER}</a>]`;

const NOT_ENTERED_WEBID =
    "...not logged in yet - but enter any WebID to read from its profile...";

const session = new Session();

const buttonLogin = document.getElementById("btnLogin");
const writeForm = document.getElementById("writeForm");
const readForm = document.getElementById("readForm");
const uploadForm = document.getElementById("uploadForm");

// 1a. Start Login Process. Call session.login() function.
async function login() {
    if (!session.info.isLoggedIn) {
        await session.login({
            oidcIssuer: SOLID_IDENTITY_PROVIDER,
            clientName: "Inrupt tutorial client app",
            redirectUrl: window.location.href
        });
    }
}

// 1b. Login Redirect. Call session.handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
    await session.handleIncomingRedirect(window.location.href);
    if (session.info.isLoggedIn) {
        // Update the page with the status.
        document.getElementById(
            "labelStatus"
        ).innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
        document.getElementById("labelStatus").setAttribute("role", "alert");
        document.getElementById("webID").value = session.info.webId;
    }
}

// The example has the login redirect back to the index.html.
// This calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.
handleRedirectAfterLogin();

// 2. Write to profile
async function writeProfile() {
    const name = document.getElementById("input_name").value;

    if (!session.info.isLoggedIn) {
        // You must be authenticated to write.
        document.getElementById(
            "labelWriteStatus"
        ).textContent = `...you can't write [${name}] until you first login!`;
        document.getElementById("labelWriteStatus").setAttribute("role", "alert");
        return;
    }
    const webID = session.info.webId;
    // The WebID can contain a hash fragment (e.g. `#me`) to refer to profile data
    // in the profile dataset. If we strip the hash, we get the URL of the full
    // dataset.
    const profileDocumentUrl = new URL(webID);
    profileDocumentUrl.hash = "";

    // To write to a profile, you must be authenticated. That is the role of the fetch
    // parameter in the following call.
    let myProfileDataset = await getSolidDataset(profileDocumentUrl.href, {
        fetch: session.fetch
    });

    // The profile data is a "Thing" in the profile dataset.
    let profile = getThing(myProfileDataset, webID);

    // Using the name provided in text field, update the name in your profile.
    // VCARD.fn object is a convenience object that includes the identifier string "http://www.w3.org/2006/vcard/ns#fn".
    // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#fn" string instead of VCARD.fn.
    profile = setStringNoLocale(profile, VCARD.fn, name);

    // Write back the profile to the dataset.
    myProfileDataset = setThing(myProfileDataset, profile);

    // Write back the dataset to your Pod.
    await saveSolidDatasetAt(profileDocumentUrl.href, myProfileDataset, {
        fetch: session.fetch
    });

    // Update the page with the retrieved values.
    document.getElementById(
        "labelWriteStatus"
    ).textContent = `Wrote [${name}] as name successfully!`;
    document.getElementById("labelWriteStatus").setAttribute("role", "alert");
    document.getElementById(
        "labelFN"
    ).textContent = `...click the 'Read Profile' button to to see what the name might be now...?!`;
}

// 3. Read profile
async function readProfile() {
    const webID = document.getElementById("webID").value;

    if (webID === NOT_ENTERED_WEBID) {
        document.getElementById(
            "labelFN"
        ).textContent = `Login first, or enter a WebID (any WebID!) to read from its profile`;
        return false;
    }

    try {
        new URL(webID);
    } catch (_) {
        document.getElementById(
            "labelFN"
        ).textContent = `Provided WebID [${webID}] is not a valid URL - please try again`;
        return false;
    }

    const profileDocumentUrl = new URL(webID);
    profileDocumentUrl.hash = "";
   
    // Profile is public data; i.e., you do not need to be logged in to read the data.
    // For illustrative purposes, shows both an authenticated and non-authenticated reads.

    let myDataset;
    try {
        if (session.info.isLoggedIn) {
            myDataset = await getSolidDataset(profileDocumentUrl.href, { fetch: session.fetch });
        } else {
            myDataset = await getSolidDataset(profileDocumentUrl.href);
        }
    } catch (error) {
        document.getElementById(
            "labelFN"
        ).textContent = `Entered value [${webID}] does not appear to be a WebID. Error: [${error}]`;
        return false;
    }

    const profile = getThing(myDataset, webID);

    const formattedName = getStringNoLocale(profile, VCARD.fn);

    // Update the page with the retrieved values.
    document.getElementById("labelFN").textContent = `[${formattedName}]`;
}

 // 4. Upload file
 async function uploadFile(event) {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    // TODO: folder name
    const containerUrl = `${MY_POD}public/`;

    try {
        // Step 1b: Ensure the public container exists
        const headResponse = await session.fetch(containerUrl, { method: "HEAD" });
        if (!headResponse.ok) {
            await createContainerAt(containerUrl, { fetch: session.fetch });
            console.log("Created missing public container.");
        }

        // Step 2b: Upload the file
        const fileResponse = await saveFileInContainer(containerUrl, file, {
            contentType: "text/turtle",
            fetch: session.fetch,
        });
        const fileUrl = `${containerUrl}${file.name}`;
        document.getElementById("labelUploadStatus").innerHTML = `File uploaded successfully at <a href="${fileUrl}" target="_blank">${fileUrl}</a>`;
        document.getElementById("labelUploadStatus").setAttribute("role", "alert");
    } catch (error) {
        console.error(`Error uploading file: ${error}`);
        document.getElementById("labelUploadStatus").innerHTML = `Error uploading file: ${error}`;
        document.getElementById("labelUploadStatus").setAttribute("role", "alert");
    }
}


buttonLogin.onclick = function () {
    login();
};

writeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    writeProfile();
});

readForm.addEventListener("submit", (event) => {
    event.preventDefault();
    readProfile();
});

uploadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    uploadFile(event);
});
