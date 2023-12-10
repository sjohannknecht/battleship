import "./index.css";

//obfuscate address in code
(function renderContact() {
    const resp = document.getElementById("s3-t-ansprechpartner");
    const em = document.getElementById("s3-t-em");
    resp.textContent = "Steffen Johannknecht";
    const a = document.createElement("a");
    const name = "sjohannknecht"
    const host = "protonmail.com"
    a.setAttribute("href", "mailto:" + name + "@" + host);
    a.textContent = name + "@" + host;
    em.appendChild(a);
})();

