document.addEventListener("DOMContentLoaded", async () => {
    const form =
        document.getElementById("transaction-form");

    const titleInput =
        document.getElementById("transaction-title");

    const descriptionInput =
        document.getElementById("transaction-description");

    const amountInput =
        document.getElementById("transaction-amount");

    const dateInput =
        document.getElementById("transaction-date");

    const categorySelect =
        document.getElementById("transaction-category");

    const errorElement =
        document.getElementById("transaction-error");

    const submitButton =
        document.getElementById("transaction-submit");

    const transactionsContainer =
        document.getElementById("transactions-container");

    if (
        !form ||
        !categorySelect ||
        !transactionsContainer
    ) {
        return;
    }

    let categories = [];

    // Vendos datën e sotme automatikisht.
    dateInput.value =
        new Date().toISOString().split("T")[0];

    async function loadCategories() {
        categories = await apiRequest("/Categories");

        categorySelect.innerHTML =
            '<option value="">Select category</option>' +
            categories
                .map(category => {
                    return `
                        <option
                            value="${category.id}"
                            data-type="${category.type}"
                        >
                            ${escapeHtml(category.name)}
                            (${category.type})
                        </option>
                    `;
                })
                .join("");
    }

    async function loadTransactions() {
        try {
            const transactions =
                await apiRequest("/Transactions");

            renderTransactions(transactions);
        } catch (error) {
            transactionsContainer.innerHTML = `
                <p class="text-error font-bold">
                    ${escapeHtml(error.message)}
                </p>
            `;
        }
    }

    function renderTransactions(transactions) {
        if (transactions.length === 0) {
            transactionsContainer.innerHTML = `
                <p class="text-on-surface-variant">
                    No transactions created yet.
                </p>
            `;

            return;
        }

        transactionsContainer.innerHTML =
            transactions
                .map(transaction => {
                    const isExpense =
                        transaction.type === "Expense";

                    const amountSign =
                        isExpense ? "-" : "+";

                    const amountClass =
                        isExpense
                            ? "text-tertiary"
                            : "text-primary";

                    const emoji =
                        isExpense ? "💸" : "💰";

                    return `
                        <article
                            class="sticker-card bg-surface
                                   p-6 rounded-lg block-shadow"
                            data-transaction-id="${transaction.id}"
                        >
                            <div
                                class="flex justify-between
                                       items-start gap-4 mb-4"
                            >
                                <div
                                    class="w-14 h-14
                                           bg-primary-fixed
                                           rounded-full
                                           border-2 border-on-surface
                                           flex items-center
                                           justify-center text-2xl"
                                >
                                    ${emoji}
                                </div>

                                <div class="text-right">
                                    <p
                                        class="font-headline-md
                                               text-headline-md
                                               ${amountClass}"
                                    >
                                        ${amountSign}${formatMoney(
                                            transaction.amount
                                        )}
                                    </p>

                                    <p
                                        class="font-label-caps
                                               text-label-caps
                                               text-on-surface-variant"
                                    >
                                        ${formatDate(transaction.date)}
                                    </p>
                                </div>
                            </div>

                            <h4
                                class="font-headline-md
                                       text-headline-md"
                            >
                                ${escapeHtml(transaction.title)}
                            </h4>

                            <p
                                class="font-body-md
                                       text-on-surface-variant"
                            >
                                ${escapeHtml(
                                    transaction.description ||
                                    "No description"
                                )}
                            </p>

                            <p
                                class="mt-3 font-bold
                                       text-secondary"
                            >
                                ${escapeHtml(
                                    transaction.categoryName
                                )}
                            </p>

                            <div class="mt-5 flex justify-end">
                                <button
                                    type="button"
                                    data-delete-transaction="${transaction.id}"
                                    class="bg-error-container
                                           text-on-error-container
                                           border-2 border-error
                                           rounded-full
                                           px-4 py-2 font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    `;
                })
                .join("");
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();

        errorElement.textContent = "";
        errorElement.classList.add("hidden");

        const selectedOption =
            categorySelect.options[
                categorySelect.selectedIndex
            ];

        const transactionType =
            selectedOption.dataset.type;

        if (!transactionType) {
            showError("Please select a category.");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Saving...";

        try {
            await apiRequest("/Transactions", {
                method: "POST",

                body: JSON.stringify({
                    title: titleInput.value.trim(),

                    description:
                        descriptionInput.value.trim() ||
                        null,

                    amount:
                        Number(amountInput.value),

                    date:
                        dateInput.value,

                    type:
                        transactionType,

                    categoryId:
                        Number(categorySelect.value)
                })
            });

            form.reset();

            dateInput.value =
                new Date()
                    .toISOString()
                    .split("T")[0];

            await loadTransactions();
        } catch (error) {
            showError(error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent =
                "Save Transaction";
        }
    });

    transactionsContainer.addEventListener(
        "click",
        async event => {
            const deleteButton =
                event.target.closest(
                    "[data-delete-transaction]"
                );

            if (!deleteButton) {
                return;
            }

            const transactionId =
                deleteButton.dataset
                    .deleteTransaction;

            const confirmed = confirm(
                "Delete this transaction?"
            );

            if (!confirmed) {
                return;
            }

            try {
                await apiRequest(
                    `/Transactions/${transactionId}`,
                    {
                        method: "DELETE"
                    }
                );

                await loadTransactions();
            } catch (error) {
                alert(error.message);
            }
        }
    );

    function showError(message) {
        errorElement.textContent = message;
        errorElement.classList.remove("hidden");
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(amount);
    }

    function formatDate(date) {
        return new Date(date)
            .toLocaleDateString();
    }

    function escapeHtml(value) {
        const element =
            document.createElement("div");

        element.textContent =
            value == null ? "" : String(value);

        return element.innerHTML;
    }

    try {
        await loadCategories();
        await loadTransactions();
    } catch (error) {
        showError(error.message);
    }
});