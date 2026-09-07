function mod97(digits: string): number {
    let remainder = 0;

    for (const char of digits) {
        const digit = parseInt(char, 10);
        remainder = (remainder * 10 + digit) % 97;
    }

    return remainder;
}

function isValidIban(iban: string): boolean {
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

const form = document.getElementById("account-form") as HTMLFormElement;

form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
    const bankName = (document.getElementById("bankName") as HTMLInputElement).value;
    const accountNumber = (document.getElementById("accountNumber") as HTMLInputElement).value;

    const messageEl = document.getElementById("message") as HTMLParagraphElement;

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

    } catch (error) {
        messageEl.textContent = "Nie udało się połączyć z serwerem.";
        messageEl.style.color = "red";
    }
});