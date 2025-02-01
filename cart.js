let foodItems =[]
async function fetchFoodItems() {
try {
// Fetch the data from 'fooditem.json' (make sure this file exists)
const response = await
fetch('https://mocki.io/v1/3073be3b-e808-47c0-9165-ec51182104d7');
// If the fetch fails, show an error
if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    // Parse the JSON data and pass it to the next function
    foodItems = await response.json();
    populateMenu(foodItems); // This function will display the food items
    } catch (error) {
    // If there's an error with the fetch, log it to the console
    console.error('There has been a problem with your fetch operation:',
    error);
    }
}

function createMenuItem(item) {
    return `
    <div class="ourmenu-card" >
    <img src="${item.imageurl}" alt="${item.title}"
    onclick="redirecttoproductdetails(${item.id})">
    <div class="menu-card-content" >
    <h4>${item.title}</h4>
    <p>${item.description}</p>
    <span>Price: <strike
    class="strike-price">$${item.actual_price.toFixed(2)}</strike>
    $${item.selling_price.toFixed(2)}</span>
    </div>
    <div class="add-to-cart-btn">
    <button class="cta-button" onclick="addToCart(${item.id},
    '${item.title}', ${item.selling_price} , '${item.imageurl}')">Add to
    Cart</button>
    </div>
    </div>
    `;
}

// This function will organize and display the food items
function populateMenu(foodItems) {
    // An object to store categories of food items
    const categories = {
    'best-seller': [],
    'trending': [],
    'starter': [],
    'beverages': [],
    'main-course': []
};

// Go through each food item
foodItems.forEach(item => {
    // Add the item to 'best-seller' or 'trending' if applicable
    if (item.best_seller === "yes") {
    categories['best-seller'].push(item);
    }
    if (item.trending === "yes") {
    categories['trending'].push(item);
    }
    // Add the item to its category (starter, beverages, etc.)
    categories[item.category.toLowerCase().replace(" ", "-")].push(item);
});

// Now populate each category on the webpage
// For each category (best-seller, trending, etc.), create HTML for its items
for (const category in categories) {
    const categoryContainer = document.getElementById(category);
    if (categoryContainer) {
    const itemsHTML = categories[category].map(createMenuItem).join('');
    categoryContainer.querySelector('.ourmenu-items').innerHTML =
    itemsHTML;
    }
    }
}

// Add  to cart function

function addToCart(itemId, title, price,imageurl) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Check if the item already exists in the cart
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
    // If item exists, update the quantity
    cart[itemIndex].quantity += 1;
    } else {
    // If item doesn't exist, add new item to the cart
    cart.push({ id: itemId, title: title, price: price, quantity: 1
    ,imageurl:imageurl });
    }
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Display success message
showSuccessMessage(`${title} has been added to your cart!`);
}

// Function to display success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('success-message');
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    // Remove the message after 3 seconds
    setTimeout(() => {
    messageDiv.remove();
    }, 3000);
}
function redirecttoproductdetails(id){
    window.location.href = `product.html?id=${id}`;
}
function searchItems(query) {
    const searchContainer = document.getElementById('search-items').querySelector('.ourmenu-items');
    searchContainer.innerHTML = ''; // Clear any previous search results


    const filteredItems = foodItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );


    if (filteredItems.length > 0) {
        const itemsHTML = filteredItems.map(createMenuItem).join('');
        searchContainer.innerHTML = itemsHTML;
    } else {
        searchContainer.innerHTML = '<p>No items found.</p>';
    }
}

// Event listener for search input
let timeout = null;
document.querySelector('.search-input').addEventListener('input', (event) => {
    const query = event.target.value;
    console.log(query)
    if (query) {
        // Clear the previous timeout if it exists
        if (timeout) {
            clearTimeout(timeout);
        }
        // Set a new timeout
        timeout = setTimeout(() => {
            searchItems(query);
        }, 1000); // Wait for 500ms before searching
    } else {
        // Optionally clear the search results if input is empty
        document.getElementById('search-items').querySelector('.ourmenu-items').innerHTML = '';
    }
});

// When the webpage is loaded, fetch the food items and display them
document.addEventListener('DOMContentLoaded', function() {
    fetchFoodItems(); // Fetch food items when the page loads
});

fetchData();


