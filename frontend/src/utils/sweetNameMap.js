export const PREMIUM_NAMES = {
    "Dark Heaven Chocolate": "Midnight Cocoa Bliss",
    "Rainbow Lollipop": "Rainbow Swirl Pop",
    "Strawberry Cheesecake": "Berry Cloud Cheesecake",
    "Gummy Bears": "Jelly Bear Bites",
    "Hazelnut Truffle": "Golden Hazelnut Truffle"
};

export const getDisplayName = (originalName) => {
    return PREMIUM_NAMES[originalName] || originalName;
};
