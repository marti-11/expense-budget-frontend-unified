document.addEventListener("DOMContentLoaded", async () => {
    const categoriesContainer =
        document.getElementById("categories-container");

    const categoryForm =
        document.getElementById("category-form");

    const categoryNameInput =
        document.getElementById("category-name");

    const categoryTypeInput =
        document.getElementById("category-type");

    const categoryError =
        document.getElementById("category-error");

    // Nëse kjo faqe nuk ka seksionin e kategorive, ndalemi.
    if (!categoriesContainer || !categoryForm) {
        return;
    }

    async function loadCategories() {
        try {
            const categories =
                await apiRequest("/Categories");

            renderCategories(categories);
        } catch (error) {
            categoriesContainer.innerHTML =
                `<p class="text-red-600 font-bold">
                    ${error.message}
                </p>`;
        }
    }

    function renderCategories(categories) {
        if (categories.length === 0) {
            categoriesContainer.innerHTML =
                `<p>No categories created yet.</p>`;

            return;
        }

        categoriesContainer.innerHTML =
            categories
                .map(category => {
                    return `
                        <div class="category-item"
                             data-category-id="${category.id}">

                            <div>
                                <strong>${escapeHtml(category.name)}</strong>
                                <span>${category.type}</span>
                            </div>

                            <button
                                type="button"
                                data-delete-category="${category.id}">
                                Delete
                            </button>
                        </div>
                    `;
                })
                .join("");
    }

    categoryForm.addEventListener(
        "submit",
        async event => {
            event.preventDefault();

            categoryError.textContent = "";
            categoryError.classList.add("hidden");

            try {
                await apiRequest("/Categories", {
                    method: "POST",
                    body: JSON.stringify({
                        name: categoryNameInput.value.trim(),
                        type: categoryTypeInput.value
                    })
                });

                categoryForm.reset();

                await loadCategories();
            } catch (error) {
                categoryError.textContent = error.message;
                categoryError.classList.remove("hidden");
            }
        }
    );

    categoriesContainer.addEventListener(
        "click",
        async event => {
            const deleteButton =
                event.target.closest(
                    "[data-delete-category]"
                );

            if (!deleteButton) {
                return;
            }

            const categoryId =
                deleteButton.dataset.deleteCategory;

            const confirmed = confirm(
                "Are you sure you want to delete this category?"
            );

            if (!confirmed) {
                return;
            }

            try {
                await apiRequest(
                    `/Categories/${categoryId}`,
                    {
                        method: "DELETE"
                    }
                );

                await loadCategories();
            } catch (error) {
                alert(error.message);
            }
        }
    );

    function escapeHtml(value) {
        const element =
            document.createElement("div");

        element.textContent = value;

        return element.innerHTML;
    }

    await loadCategories();
});