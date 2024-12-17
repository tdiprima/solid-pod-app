# Solid POD Interaction with Vite

This project provides a simple interface for interacting with a Solid POD using a local instance of the Community Solid Server (CSS) or a remote Solid POD (like `solidcommunity.net`). It enables users to:

1. **Read Profile Information**: View profile data from a Solid POD WebID.
2. **Write to Profile**: Update profile information (e.g., name) in the Solid POD.
3. **Upload Files**: Upload files to a specified container within the POD, creating the container if it doesn't exist.

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/tdiprima/solid-pod-app.git
   cd solid-pod-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Vite**:
   Ensure `vite` is installed globally, or you can install it locally in this project:

   ```bash
   npm install -g create-vite
   ```

4. Replace all instances of "http://localhost:3000/Tammy-DiPrima/*" with your POD url.

5. **Start the Vite development server**:

   ```bash
   npm run dev
   ```

## Usage

1. **Run Local Community Solid Server**: If using CSS on `localhost`, start it on the appropriate port (usually `3000`).
2. **Open the Application**: Navigate to `http://localhost:5173` to access the interface.
3. **Authenticate**: Log in with your Solid POD credentials.
4. **Read Profile**: Enter a WebID to fetch profile information.
5. **Write Profile**: Update profile details (e.g., name).
6. **Upload Files**: Select a file to upload to your POD's `/public` container.

## Requirements

- **Node.js** and **npm**
- **Vite** for local development and live reloading
- **@inrupt/solid-client** and **@inrupt/solid-client-authn-browser** for interacting with Solid PODs

## Notes

- This project has been tested with both a local Community Solid Server (CSS) and `solidcommunity.net`.
- Make sure the specified upload container (e.g., `/public`) exists on your POD. The upload script will create it if missing.

## License

This project is open-source and available under the MIT License.

<br>
