document.addEventListener("DOMContentLoaded", async () => {
    const form =
        document.getElementById("budget-form");

    const categorySelect =
        document.getElementById("budget-category");

    const amountInput =
        document.getElementById("budget-amount");

    const monthInput =
        document.getElementById("budget-month");

    const errorElement =
        document.getElementById("budget-error");

    const submitButton =
        document.getElementById("budget-submit");

    const budgetsContainer =
        document.getElementById("budgets-container");

    const overallProgress =
        document.getElementById(
            "overall-budget-progress"
        );

    const overallPercentage =
        document.getElementById(
            "overall-budget-percentage"
        );

    const overallMessage =
        document.getElementById(
            "overall-budget-message"
        );

    if (
        !form ||
        !categorySelect ||
        !amountInput ||
        !monthInput ||
        !budgetsContainer
    ) {
        return;
    }

    let hasExpenseCategories = false;

    setCurrentMonth();

    async function loadExpenseCategories() {
        const categories =
            await apiRequest("/Categories");

        const expenseCategories =
            categories.filter(category => {
                return String(category.type)
                    .toLowerCase() === "expense";
            });

        hasExpenseCategories =
            expenseCategories.length > 0;

        if (!hasExpenseCategories) {
            categorySelect.innerHTML = `
                <option value="">
                    Create an Expense category first
                </option>
            `;

            categorySelect.disabled = true;
            submitButton.disabled = true;

            return;
        }

        categorySelect.disabled = false;
        submitButton.disabled = false;

        categorySelect.innerHTML =
            '<option value="">Select category</option>' +
            expenseCategories
                .map(category => {
                    return `
                        <option value="${category.id}">
                            ${escapeHtml(category.name)}
                        </option>
                    `;
                })
                .join("");
    }

    async function loadBudgets() {
        try {
            const budgets =
                await apiRequest("/Budgets");

            renderBudgets(budgets);
            updateOverallSummary(budgets);
        } catch (error) {
            budgetsContainer.innerHTML = `
                <p class="text-error font-bold">
                    ${escapeHtml(error.message)}
                </p>
            `;

            updateOverallSummary([]);
        }
    }

    function renderBudgets(budgets) {
        if (!Array.isArray(budgets) ||
            budgets.length === 0) {

            budgetsContainer.innerHTML = `
                <p class="text-on-surface-variant">
                    No budgets created yet.
                </p>
            `;

            return;
        }

        budgetsContainer.innerHTML =
            budgets
                .map(budget => {
                    const amount =
                        Number(budget.amount || 0);

                    const spent =
                        Number(
                            budget.spent ??
                            budget.spentAmount ??
                            0
                        );

                    const remaining =
                        Number(
                            budget.remaining ??
                            budget.remainingAmount ??
                            amount - spent
                        );

                    const calculatedPercentage =
                        amount > 0
                            ? (spent / amount) * 100
                            : 0;

                    const percentage =
                        Number(
                            budget.usagePercentage ??
                            calculatedPercentage
                        );

                    const progressWidth =
                        Math.min(
                            Math.max(percentage, 0),
                            100
                        );

                    const categoryName =
                        budget.categoryName ??
                        budget.category?.name ??
                        "Category";

                    const status =
                        getBudgetStatus(percentage);

                    return `
                        <article
                            class="${status.cardClass}
                                   border-4 border-on-surface
                                   p-6 rounded-lg sticker-shadow
                                   bounce-hover transition-all
                                   flex flex-col gap-4"
                            data-budget-id="${budget.id}"
                        >
                            <div
                                class="flex justify-between
                                       items-start gap-3"
                            >
                                <div
                                    class="w-14 h-14
                                           ${status.iconBackground}
                                           flex items-center
                                           justify-center
                                           border-2 border-on-surface
                                           rounded-full
                                           sticker-shadow-sm"
                                >
                                    <span
                                        class="material-symbols-outlined
                                               text-3xl"
                                    >
                                        account_balance_wallet
                                    </span>
                                </div>

                                <span
                                    class="${status.badgeClass}
                                           font-bold px-3 py-1
                                           rounded-full
                                           border-2 border-on-surface
                                           text-label-caps"
                                >
                                    ${status.label}
                                </span>
                            </div>

                            <div>
                                <h3
                                    class="font-headline-md
                                           text-headline-md"
                                >
                                    ${escapeHtml(categoryName)}
                                </h3>

                                <p
                                    class="text-on-surface-variant
                                           font-medium"
                                >
                                    ${getMonthName(budget.month)}
                                    ${escapeHtml(budget.year)}
                                </p>
                            </div>

                            <div class="space-y-2 mt-2">
                                <div
                                    class="flex justify-between
                                           gap-3 text-label-caps"
                                >
                                    <span>SPENT</span>

                                    <span class="font-black">
                                        ${formatMoney(spent)}
                                        /
                                        ${formatMoney(amount)}
                                    </span>
                                </div>

                                <div
                                    class="h-4 w-full
                                           bg-surface-container-highest
                                           rounded-full
                                           border-2 border-on-surface
                                           overflow-hidden"
                                >
                                    <div
                                        class="h-full
                                               ${status.progressClass}
                                               transition-all"
                                        style="width:
                                               ${progressWidth}%"
                                    ></div>
                                </div>

                                <p
                                    class="${status.textClass}
                                           font-bold mt-2"
                                >
                                    ${percentage.toFixed(1)}% used
                                </p>
                            </div>

                            <div
                                class="mt-auto pt-4
                                       flex justify-between
                                       items-center gap-3"
                            >
                                <div>
                                    <p
                                        class="text-label-caps
                                               text-on-surface-variant"
                                    >
                                        Remaining
                                    </p>

                                    <p
                                        class="font-headline-md
                                               text-headline-md"
                                    >
                                        ${formatMoney(remaining)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    data-delete-budget="${budget.id}"
                                    class="bg-error-container
                                           text-on-error-container
                                           border-2 border-error
                                           rounded-full px-4 py-2
                                           font-bold active-press"
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    `;
                })
                .join("");
    }

    function updateOverallSummary(budgets) {
        if (!Array.isArray(budgets) ||
            budgets.length === 0) {

            overallProgress.style.width = "0%";
            overallPercentage.textContent = "0%";

            overallMessage.textContent =
                "Create your first budget to start tracking your spending.";

            return;
        }

        const totalBudget =
            budgets.reduce((total, budget) => {
                return total +
                    Number(budget.amount || 0);
            }, 0);

        const totalSpent =
            budgets.reduce((total, budget) => {
                return total +
                    Number(
                        budget.spent ??
                        budget.spentAmount ??
                        0
                    );
            }, 0);

        const percentage =
            totalBudget > 0
                ? (totalSpent / totalBudget) * 100
                : 0;

        const progressWidth =
            Math.min(
                Math.max(percentage, 0),
                100
            );

        overallProgress.style.width =
            `${progressWidth}%`;

        overallPercentage.textContent =
            `${percentage.toFixed(1)}%`;

        if (percentage > 100) {
            overallMessage.textContent =
                "You are over your total budget. Review your expenses.";
        } else if (percentage >= 80) {
            overallMessage.textContent =
                "You are close to your total budget limit.";
        } else {
            overallMessage.textContent =
                "Your budgets are under control. Nice job!";
        }
    }

    form.addEventListener(
        "submit",
        async event => {
            event.preventDefault();

            hideError();

            if (!hasExpenseCategories) {
                showError(
                    "Create an Expense category first."
                );

                return;
            }

            const monthParts =
                monthInput.value.split("-");

            if (monthParts.length !== 2) {
                showError(
                    "Please select a valid month."
                );

                return;
            }

            const year =
                Number(monthParts[0]);

            const month =
                Number(monthParts[1]);

            const categoryId =
                Number(categorySelect.value);

            const amount =
                Number(amountInput.value);

            if (!categoryId) {
                showError(
                    "Please select a category."
                );

                return;
            }

            if (!amount || amount <= 0) {
                showError(
                    "Budget amount must be greater than zero."
                );

                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = "Saving...";

            try {
                await apiRequest("/Budgets", {
                    method: "POST",

                    body: JSON.stringify({
                        amount: amount,
                        month: month,
                        year: year,
                        categoryId: categoryId
                    })
                });

                amountInput.value = "";
                categorySelect.value = "";

                await loadBudgets();
            } catch (error) {
                showError(error.message);
            } finally {
                submitButton.disabled =
                    !hasExpenseCategories;

                submitButton.textContent =
                    "Save Budget";
            }
        }
    );

    budgetsContainer.addEventListener(
        "click",
        async event => {
            const deleteButton =
                event.target.closest(
                    "[data-delete-budget]"
                );

            if (!deleteButton) {
                return;
            }

            const budgetId =
                deleteButton.dataset.deleteBudget;

            const confirmed =
                confirm("Delete this budget?");

            if (!confirmed) {
                return;
            }

            deleteButton.disabled = true;
            deleteButton.textContent =
                "Deleting...";

            try {
                await apiRequest(
                    `/Budgets/${budgetId}`,
                    {
                        method: "DELETE"
                    }
                );

                await loadBudgets();
            } catch (error) {
                alert(error.message);

                deleteButton.disabled = false;
                deleteButton.textContent =
                    "Delete";
            }
        }
    );

    function setCurrentMonth() {
        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        monthInput.value =
            `${year}-${month}`;
    }

    function getBudgetStatus(percentage) {
        if (percentage > 100) {
            return {
                label: "CRITICAL",
                cardClass: "bg-error-container",
                badgeClass: "bg-error text-white",
                iconBackground: "bg-error text-white",
                progressClass: "bg-error animate-pulse",
                textClass: "text-error"
            };
        }

        if (percentage >= 80) {
            return {
                label: "WARNING",
                cardClass: "bg-white",
                badgeClass:
                    "bg-tertiary-fixed text-tertiary",
                iconBackground:
                    "bg-tertiary-fixed text-tertiary",
                progressClass: "bg-tertiary",
                textClass: "text-tertiary"
            };
        }

        return {
            label: "STABLE",
            cardClass: "bg-white",
            badgeClass:
                "bg-primary-container text-primary",
            iconBackground:
                "bg-secondary-fixed text-secondary",
            progressClass: "bg-primary",
            textClass: "text-primary"
        };
    }

    function getMonthName(month) {
        const monthNumber =
            Number(month);

        if (
            monthNumber < 1 ||
            monthNumber > 12
        ) {
            return "";
        }

        return new Intl.DateTimeFormat(
            "en-US",
            {
                month: "long"
            }
        ).format(
            new Date(2026, monthNumber - 1, 1)
        );
    }

    function formatMoney(value) {
        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(
            Number(value || 0)
        );
    }

    function showError(message) {
        errorElement.textContent = message;
        errorElement.classList.remove("hidden");
    }

    function hideError() {
        errorElement.textContent = "";
        errorElement.classList.add("hidden");
    }

    function escapeHtml(value) {
        const element =
            document.createElement("div");

        element.textContent =
            value == null
                ? ""
                : String(value);

        return element.innerHTML;
    }

    try {
        await loadExpenseCategories();
        await loadBudgets();
    } catch (error) {
        showError(error.message);
    }
});