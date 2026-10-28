const DEFAULT_DOCUMENT_ID = "11";

const titleElement = document.querySelector("#document-title");
const scanCodeElement = document.querySelector("#scan-code");
const dateElement = document.querySelector("#document-date");
const formLinkElement = document.querySelector("#form-link");
const noFormMessageElement = document.querySelector("#no-form-message");
const statusElement = document.querySelector("#status-message");

function showError(message) {
  statusElement.textContent = message;
  statusElement.hidden = false;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function isGoogleFormUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "docs.google.com" &&
      url.pathname.startsWith("/forms/");
  } catch {
    return false;
  }
}

function getDocumentId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("doc") || params.get("v") || DEFAULT_DOCUMENT_ID;
}

function displayDocument(documentData, id) {
  titleElement.textContent = documentData.title;
  scanCodeElement.textContent = `${documentData.scanCode} ${documentData.deployedAt}`;
  dateElement.textContent = formatDate(documentData.updatedAt);
  dateElement.dateTime = documentData.updatedAt;

  if (isGoogleFormUrl(documentData.formUrl)) {
    formLinkElement.href = documentData.formUrl;
    formLinkElement.hidden = false;
    return;
  }

  noFormMessageElement.hidden = false;
  showError(`Le formulaire du document ${id} n'est pas configuré.`);
}

async function loadDocument() {
  const id = getDocumentId();

  try {
    const response = await fetch("data.json", { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Impossible de charger la configuration (${response.status}).`);
    }

    const documents = await response.json();
    const documentData = documents[id];

    if (!documentData) {
      titleElement.textContent = "Document introuvable";
      showError(`Le document demandé (${id}) n'existe pas. Vérifiez le QR code ou contactez l'établissement.`);
      return;
    }

    displayDocument(documentData, id);
    document.title = `${documentData.title} | Établissement`;
  } catch (error) {
    titleElement.textContent = "Service momentanément indisponible";
    showError("La configuration du document n'a pas pu être chargée. Réessayez dans quelques instants.");
    console.error(error);
  }
}

loadDocument();
