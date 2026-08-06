(function () {
    const openings = [
        "Quick money check:", "A tiny challenge:", "Tea-break thought:",
        "Future-you asks:", "One-minute mission:", "Wallet wisdom:",
        "Friendly reminder:", "Money quiz:", "Today’s bright idea:",
        "A cheeky question:"
    ];
    const actions = [
        "Could you save the cost of one coffee today?",
        "Which purchase made you happiest this week?",
        "Can you name your top spending category?",
        "Would a 24-hour pause stop one impulse buy?",
        "Can you move 5% of today’s spending into savings?",
        "Which subscription could take a little holiday?",
        "Have you checked your budget before the kettle boils?",
        "Could you plan one no-spend evening this week?",
        "What small goal deserves its own savings pot?",
        "Can you beat last month’s savings by one euro?"
    ];
    const endings = [
        "Small steps still wear big boots.",
        "Future you may send a thank-you card.",
        "Keep calm and budget on.",
        "Your piggy bank approves this message.",
        "Brilliant choices add up."
    ];
    const resources = [
        "https://www.fdic.gov/resources/consumers/money-smart/",
        "https://www.fdic.gov/consumer-resource-center/money-smart-adults"
    ];
    const emojis = ["☕", "🫖", "🎯", "🐷", "🌱", "💡", "🪙", "🌍"];
    const notifications = [];

    openings.forEach((opening, openingIndex) => {
        actions.forEach((action, actionIndex) => {
            endings.forEach((ending, endingIndex) => {
                const index = notifications.length;
                const isQuestion = index % 3 === 0;
                notifications.push({
                    id: `money-${index + 1}`,
                    type: isQuestion ? "question" : "tip",
                    emoji: emojis[index % emojis.length],
                    title: isQuestion ? "Your turn" : "Money smile",
                    message: `${opening} ${action} ${ending}`,
                    actionLabel: isQuestion ? "Explore the answer" : "Learn something useful",
                    url: resources[(openingIndex + actionIndex + endingIndex) % resources.length]
                });
            });
        });
    });

    const partners = Array.isArray(window.FIZCAL_PARTNERS)
        ? window.FIZCAL_PARTNERS
        : [];

    partners.forEach((partner, index) => {
        if (!partner?.name || !partner?.url || !partner?.offer) return;
        notifications.push({
            id: `partner-${index + 1}`,
            type: "partner",
            emoji: partner.emoji || "🏪",
            title: partner.name,
            message: partner.offer,
            actionLabel: partner.actionLabel || "View offer",
            url: partner.url,
            sponsored: true
        });
    });

    window.FIZCAL_NOTIFICATIONS = notifications;
})();
