
const form = document.getElementById("account-form") as HTMLFormElement;

form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
    const bankName = (document.getElementById("bankName") as HTMLInputElement).value;
    const accountNumber = (document.getElementById("accountNumber") as HTMLInputElement).value;

    const messageEl = document.getElementById("message") as HTMLParagraphElement;

    

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