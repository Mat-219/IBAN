function mod97(digits) {
    let remainder = 0;
    for (const char of digits) {
        const digit = parseInt(char, 10);
        remainder = (remainder * 10 + digit) % 97;
    }
    return remainder;
}
function isValidIban(iban) {
    const cleaned = iban.replace(/\s/g, "").toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) {
        return false;
    }
    const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
    const converted = rearranged
        .split("")
        .map(char => {
        if (/[A-Z]/.test(char)) {
            return (char.charCodeAt(0) - 55).toString();
        }
        return char;
    })
        .join("");
    return mod97(converted) === 1;
}
const form = document.getElementById("account-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const bankName = document.getElementById("bankName").value;
    const accountNumber = document.getElementById("accountNumber").value;
    const messageEl = document.getElementById("message");
    if (!isValidIban(accountNumber)) {
        messageEl.textContent = "Nieprawidłowy numer konta bankowego (IBAN).";
        messageEl.style.color = "red";
        return;
    }
    try {
        const response = await fetch("https://localhost:7169/api/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ firstName, lastName, bankName, accountNumber })
        });
        if (response.status === 400) {
            const errorData = await response.json();
            messageEl.textContent = errorData.message;
            messageEl.style.color = "red";
            return;
        }
        if (!response.ok) {
            messageEl.textContent = "Wystąpił nieoczekiwany błąd.";
            messageEl.style.color = "red";
            return;
        }
        messageEl.textContent = "Konto zapisane pomyślnie!";
        messageEl.style.color = "green";
        form.reset();
    }
    catch (error) {
        messageEl.textContent = "Nie udało się połączyć z serwerem.";
        messageEl.style.color = "red";
    }
});
export {};
//# sourceMappingURL=app.js.map