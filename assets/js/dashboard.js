document.addEventListener("DOMContentLoaded", async () => {
    const balanceElement =
        document.getElementById("dashboard-balance");

    const incomeElement =
        document.getElementById("dashboard-income");

    const expensesElement =
        document.getElementById("dashboard-expenses");

    const balanceMessageElement =
        document.getElementById(
            "dashboard-balance-message"
        );

    const greetingElement =
        document.getElementById(
            "dashboard-greeting"
        );

    const periodElement =
        document.getElementById(
            "dashboard-period"
        );

    const budgetPercentageElement =
        document.getElementById(
            "dashboard-budget-percentage"
        );

    const budgetProgressElement =
        document.getElementById(
            "dashboard-budget-progress"
        );

    const budgetProgressTextElement =
        document.getElementById(
            "dashboard-budget-progress-text"
        );

    const budgetMessageElement =
        document.getElementById(
            "dashboard-budget-message"
        );

    const chartElement =
        document.getElementById(
            "dashboard-expense-chart"
        );

    const chartTotalElement =
        document.getElementById(
            "dashboard-chart-total"
        );

    const chartLegendElement =
        document.getElementById(
            "dashboard-chart-legend"
        );

    const recentTransactionsElement =
        document.getElementById(
            "dashboard-recent-transactions"
        );

    const errorElement =
        document.getElementById(
            "dashboard-error"
        );

    // Kontrollon nëse elementet kryesore ekzistojnë.
    if (
        !balanceElement ||
        !incomeElement ||
        !expensesElement ||
        !budgetPercentageElement ||
        !budgetProgressElement ||
        !chartElement ||
        !recentTransactionsElement
    ) {
        console.error(
            "Dashboard HTML elements are missing."
        );

        return;
    }

    setGreeting();

    try {
        // Merr të gjitha të dhënat nga një endpoint.
        const dashboard =
            await apiRequest("/Dashboard");

        renderPeriod(
            dashboard.month,
            dashboard.year
        );

        renderFinancialTotals(dashboard);

        renderBudgetHealth(dashboard);

        renderExpenseChart(
            Array.isArray(
                dashboard.expensesByCategory
            )
                ? dashboard.expensesByCategory
                : []
        );

        renderRecentTransactions(
            Array.isArray(
                dashboard.recentTransactions
            )
                ? dashboard.recentTransactions
                : []
        );
    } catch (error) {
        showError(error.message);
    }

    function setGreeting() {
        let currentUser = null;

        try {
            currentUser = JSON.parse(
                localStorage.getItem("currentUser")
            );
        } catch {
            currentUser = null;
        }

        const firstName =
            currentUser?.firstName ||
            currentUser?.name ||
            "";

        if (!greetingElement) {
            return;
        }

        greetingElement.textContent =
            firstName
                ? `Welcome back, ${firstName}`
                : "Welcome back";
    }

    function renderPeriod(month, year) {
        if (!periodElement) {
            return;
        }

        const monthNumber =
            Number(month);

        const yearNumber =
            Number(year);

        if (
            monthNumber >= 1 &&
            monthNumber <= 12 &&
            yearNumber > 0
        ) {
            periodElement.textContent =
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric"
                    }
                ).format(
                    new Date(
                        yearNumber,
                        monthNumber - 1,
                        1
                    )
                );

            return;
        }

        periodElement.textContent =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            ).format(new Date());
    }

    function renderFinancialTotals(
        dashboard
    ) {
        const totalIncome =
            Number(
                dashboard.totalIncome || 0
            );

        const totalExpenses =
            Number(
                dashboard.totalExpenses || 0
            );

        const balance =
            Number(
                dashboard.balance || 0
            );

        incomeElement.textContent =
            formatMoney(totalIncome);

        expensesElement.textContent =
            formatMoney(totalExpenses);

        balanceElement.textContent =
            formatMoney(balance);

        if (!balanceMessageElement) {
            return;
        }

        if (balance > 0) {
            balanceMessageElement.textContent =
                "Your income is higher than your expenses this month.";
        } else if (balance < 0) {
            balanceMessageElement.textContent =
                "Your expenses are higher than your income this month.";
        } else {
            balanceMessageElement.textContent =
                "Your income and expenses are currently balanced.";
        }
    }

    function renderBudgetHealth(
        dashboard
    ) {
        const totalBudget =
            Number(
                dashboard.totalBudget || 0
            );

        const budgetPercentage =
            Number(
                dashboard
                    .budgetUsagePercentage || 0
            );

        const progressWidth =
            Math.min(
                Math.max(
                    budgetPercentage,
                    0
                ),
                100
            );

        budgetPercentageElement.textContent =
            `${budgetPercentage.toFixed(1)}%`;

        budgetProgressElement.style.width =
            `${progressWidth}%`;

        if (budgetProgressTextElement) {
            budgetProgressTextElement.textContent =
                totalBudget > 0
                    ? `${budgetPercentage.toFixed(1)}% OF BUDGET USED`
                    : "NO BUDGETS CREATED";
        }

        if (!budgetMessageElement) {
            return;
        }

        if (totalBudget <= 0) {
            budgetProgressElement
                .style
                .backgroundColor =
                "#8d00d9";

            budgetMessageElement.textContent =
                "Create a budget to start tracking your spending.";

            return;
        }

        if (budgetPercentage > 100) {
            budgetProgressElement
                .style
                .backgroundColor =
                "#ba1a1a";

            budgetMessageElement.textContent =
                "You are over your budget limit.";
        } else if (
            budgetPercentage >= 80
        ) {
            budgetProgressElement
                .style
                .backgroundColor =
                "#b12d00";

            budgetMessageElement.textContent =
                "You are close to your budget limit.";
        } else {
            budgetProgressElement
                .style
                .backgroundColor =
                "#8d00d9";

            budgetMessageElement.textContent =
                "Your spending is under control.";
        }
    }

    function renderExpenseChart(
        expensesByCategory
    ) {
        if (
            !chartElement ||
            !chartTotalElement ||
            !chartLegendElement
        ) {
            return;
        }

        const categoryEntries =
            expensesByCategory
                .map(item => {
                    return {
                        categoryName:
                            item.categoryName ||
                            "Uncategorized",

                        amount:
                            Number(
                                item.amount || 0
                            )
                    };
                })
                .filter(item =>
                    item.amount > 0
                )
                .sort(
                    (first, second) =>
                        second.amount -
                        first.amount
                )
                .slice(0, 6);

        const totalExpenses =
            categoryEntries.reduce(
                (total, item) =>
                    total + item.amount,
                0
            );

        chartTotalElement.textContent =
            formatMoney(totalExpenses);

        if (
            categoryEntries.length === 0 ||
            totalExpenses === 0
        ) {
            chartElement.style.background =
                "#e4e2e1";

            chartLegendElement.innerHTML = `
                <p
                    class="text-on-surface-variant
                           text-center sm:col-span-2"
                >
                    No expense transactions
                    for this month.
                </p>
            `;

            return;
        }

        const colors = [
            "#8d00d9",
            "#ffd700",
            "#b12d00",
            "#705d00",
            "#aa30fa",
            "#ffb5a0"
        ];

        let currentPercentage = 0;

        const gradientParts = [];
        const legendParts = [];

        categoryEntries.forEach(
            (item, index) => {
                const percentage =
                    (
                        item.amount /
                        totalExpenses
                    ) * 100;

                const startPercentage =
                    currentPercentage;

                const endPercentage =
                    currentPercentage +
                    percentage;

                const color =
                    colors[
                        index %
                        colors.length
                    ];

                gradientParts.push(
                    `${color} ` +
                    `${startPercentage}% ` +
                    `${endPercentage}%`
                );

                legendParts.push(`
                    <div
                        class="flex items-center
                               justify-between gap-3
                               border-2 border-on-surface
                               rounded-lg p-3 bg-white"
                    >
                        <div
                            class="flex items-center gap-2"
                        >
                            <span
                                class="w-4 h-4
                                       rounded-sm
                                       border
                                       border-on-surface"
                                style="background:
                                       ${color}"
                            ></span>

                            <span class="font-bold">
                                ${escapeHtml(
                                    item.categoryName
                                )}
                            </span>
                        </div>

                        <span
                            class="font-label-caps
                                   text-label-caps"
                        >
                            ${percentage.toFixed(1)}%
                        </span>
                    </div>
                `);

                currentPercentage =
                    endPercentage;
            }
        );

        chartElement.style.background =
            `conic-gradient(` +
            gradientParts.join(", ") +
            `)`;

        chartLegendElement.innerHTML =
            legendParts.join("");
    }

    function renderRecentTransactions(
        transactions
    ) {
        if (
            transactions.length === 0
        ) {
            recentTransactionsElement.innerHTML = `
                <p class="text-on-surface-variant">
                    No transactions created yet.
                </p>
            `;

            return;
        }

        recentTransactionsElement.innerHTML =
            transactions
                .slice(0, 5)
                .map(transaction => {
                    const type =
                        String(
                            transaction.type ||
                            ""
                        ).toLowerCase();

                    const isExpense =
                        type === "expense";

                    const sign =
                        isExpense
                            ? "-"
                            : "+";

                    const amountClass =
                        isExpense
                            ? "text-tertiary"
                            : "text-primary";

                    const icon =
                        isExpense
                            ? "shopping_cart"
                            : "payments";

                    const iconBackground =
                        isExpense
                            ? "bg-tertiary-fixed"
                            : "bg-primary-fixed";

                    const categoryName =
                        transaction
                            .categoryName ||
                        "Uncategorized";

                    return `
                        <article
                            class="bg-white p-4
                                   rounded-lg
                                   border-2
                                   border-on-surface
                                   neo-shadow-xs
                                   flex items-center
                                   justify-between gap-3"
                        >
                            <div
                                class="flex items-center
                                       gap-3 min-w-0"
                            >
                                <div
                                    class="${iconBackground}
                                           p-2 rounded-lg
                                           border
                                           border-on-surface"
                                >
                                    <span
                                        class="material-symbols-outlined"
                                    >
                                        ${icon}
                                    </span>
                                </div>

                                <div class="min-w-0">
                                    <p
                                        class="font-bold
                                               truncate"
                                    >
                                        ${escapeHtml(
                                            transaction.title ||
                                            "Transaction"
                                        )}
                                    </p>

                                    <p
                                        class="text-xs
                                               text-outline
                                               font-label-caps"
                                    >
                                        ${escapeHtml(
                                            categoryName
                                        )}
                                        ·
                                        ${formatDate(
                                            transaction.date
                                        )}
                                    </p>
                                </div>
                            </div>

                            <p
                                class="font-headline-md
                                       ${amountClass}
                                       whitespace-nowrap"
                            >
                                ${sign}${formatMoney(
                                    transaction.amount
                                )}
                            </p>
                        </article>
                    `;
                })
                .join("");
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

    function formatDate(value) {
        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        return new Intl.DateTimeFormat(
            "en-US",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(date);
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

    function showError(message) {
        console.error(
            "Dashboard error:",
            message
        );

        if (!errorElement) {
            return;
        }

        errorElement.textContent =
            message ||
            "Dashboard data could not be loaded.";

        errorElement.classList.remove(
            "hidden"
        );
    }
});