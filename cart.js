console.clear();

// Function to update badge visibility based on counter
function updateBadgeVisibility(counter) {
    const badge = document.getElementById("badge");
    if (badge) {
        if (counter > 0) {
            badge.style.display = "flex";
            badge.innerHTML = counter;
        } else {
            badge.style.display = "none";
        }
    }
}

if(document.cookie.indexOf(',counter=')>=0)
{
    let counter = document.cookie.split(',')[1].split('=')[1]
    updateBadgeVisibility(counter);
}


let cartContainer = document.getElementById('cartContainer')

let boxContainerDiv = document.createElement('div')
boxContainerDiv.id = 'boxContainer'

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function removeProductFromCart(productId) {
    if (document.cookie.indexOf(',counter=') >= 0) {
        let orderIds = document.cookie.split(',')[0].split('=')[1].trim().split(' ');
        let counter = Number(document.cookie.split(',')[1].split('=')[1]);
        // Remove only the first occurrence of the productId
        let idx = orderIds.indexOf(productId.toString());
        if (idx !== -1) {
            orderIds.splice(idx, 1);
            counter = Math.max(0, counter - 1);
        }
        document.cookie = 'orderId=' + orderIds.join(' ') + ',counter=' + counter;
        updateBadgeVisibility(counter);
    }
}

function dynamicCartSection(ob, itemCounter) {
    let boxDiv = document.createElement('div')
    boxDiv.id = 'box'
    boxContainerDiv.appendChild(boxDiv)

    let boxImg = document.createElement('img')
    boxImg.src = ob.preview
    boxDiv.appendChild(boxImg)

    let boxh3 = document.createElement('h3')
    let h3Text = document.createTextNode(ob.name + ' × ' + itemCounter)
    boxh3.appendChild(h3Text)
    boxDiv.appendChild(boxh3)

    let boxh4 = document.createElement('h4')
    let h4Text = document.createTextNode('Amount: Rs' + ob.price)
    boxh4.appendChild(h4Text)
    boxDiv.appendChild(boxh4)

    // Add quantity controls (- and + buttons)
    let qtyDiv = document.createElement('div');
    qtyDiv.style.display = 'flex';
    qtyDiv.style.alignItems = 'center';
    qtyDiv.style.gap = '8px';
    qtyDiv.style.marginTop = '10px';

    let minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.style.width = '28px';
    minusBtn.style.height = '28px';
    minusBtn.style.fontSize = '1.2em';
    minusBtn.onclick = function() {
        // Remove one occurrence of this product
        let orderIds = document.cookie.split(',')[0].split('=')[1].trim().split(' ');
        let idx = orderIds.indexOf(ob.id.toString());
        if (idx !== -1) {
            orderIds.splice(idx, 1);
            let counter = Math.max(0, Number(document.cookie.split(',')[1].split('=')[1]) - 1);
            document.cookie = 'orderId=' + orderIds.join(' ') + ',counter=' + counter;
            updateBadgeVisibility(counter);
            // Refresh cart display
            boxContainerDiv.innerHTML = '';
            totalDiv.innerHTML = '';
            totalDiv.appendChild(totalh2);
            let counter2 = 0;
            let totalAmount2 = 0;
            if (document.cookie.indexOf(',counter=') >= 0) {
                counter2 = Number(document.cookie.split(',')[1].split('=')[1]);
                document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter2);
                let item = document.cookie.split(',')[0].split('=')[1].split(" ");
                for (let i = 0; i < counter2; i++) {
                    let itemCounter = 1;
                    for (let j = i + 1; j < counter2; j++) {
                        if (Number(item[j]) == Number(item[i])) {
                            itemCounter += 1;
                        }
                    }
                    totalAmount2 += Number(contentTitle[item[i] - 1].price) * itemCounter;
                    dynamicCartSection(contentTitle[item[i] - 1], itemCounter);
                    i += (itemCounter - 1);
                }
            }
            amountUpdate(totalAmount2);
        }
    };
    minusBtn.className = 'cart-qty-btn';
    qtyDiv.appendChild(minusBtn);

    let qtySpan = document.createElement('span');
    qtySpan.textContent = itemCounter;
    qtySpan.style.fontWeight = 'bold';
    qtySpan.style.fontSize = '1.1em';
    qtyDiv.appendChild(qtySpan);

    let plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.style.width = '28px';
    plusBtn.style.height = '28px';
    plusBtn.style.fontSize = '1.2em';
    plusBtn.onclick = function() {
        // Add one occurrence of this product
        let orderIds = document.cookie.split(',')[0].split('=')[1].trim().split(' ');
        orderIds.push(ob.id.toString());
        let counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1;
        document.cookie = 'orderId=' + orderIds.join(' ') + ',counter=' + counter;
        updateBadgeVisibility(counter);
        // Refresh cart display
        boxContainerDiv.innerHTML = '';
        totalDiv.innerHTML = '';
        totalDiv.appendChild(totalh2);
        let counter2 = 0;
        let totalAmount2 = 0;
        if (document.cookie.indexOf(',counter=') >= 0) {
            counter2 = Number(document.cookie.split(',')[1].split('=')[1]);
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter2);
            let item = document.cookie.split(',')[0].split('=')[1].split(" ");
            for (let i = 0; i < counter2; i++) {
                let itemCounter = 1;
                for (let j = i + 1; j < counter2; j++) {
                    if (Number(item[j]) == Number(item[i])) {
                        itemCounter += 1;
                    }
                }
                totalAmount2 += Number(contentTitle[item[i] - 1].price) * itemCounter;
                dynamicCartSection(contentTitle[item[i] - 1], itemCounter);
                i += (itemCounter - 1);
            }
        }
        amountUpdate(totalAmount2);
    };
    plusBtn.className = 'cart-qty-btn';
    qtyDiv.appendChild(plusBtn);

    boxDiv.appendChild(qtyDiv);

    cartContainer.appendChild(boxContainerDiv)
    cartContainer.appendChild(totalContainerDiv)
    return cartContainer
}

let totalContainerDiv = document.createElement('div')
totalContainerDiv.id = 'totalContainer'

let totalDiv = document.createElement('div')
totalDiv.id = 'total'
totalContainerDiv.appendChild(totalDiv)

let totalh2 = document.createElement('h2')
let h2Text = document.createTextNode('Total Amount')
totalh2.appendChild(h2Text)
totalDiv.appendChild(totalh2)

// Add delivery charge logic
function getDeliveryCharge() {
    var user = null;
    try {
        user = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {}
    var userEmail = user && user.email;
    var firstOrderKey = userEmail ? 'firstOrderDone_' + userEmail : null;
    if (user && userEmail && !localStorage.getItem(firstOrderKey)) {
        return 0; // Free delivery for first order
    }
    return 40; // Normal delivery charge
}

// Update amountUpdate to show delivery charge
function amountUpdate(amount) {
    let totalh4 = document.createElement('h4')
    let totalh4Text = document.createTextNode('Amount: Rs ' + amount)
    totalh4Text.id = 'toth4'
    totalh4.appendChild(totalh4Text)
    totalDiv.appendChild(totalh4)

    // Delivery charge
    let deliveryCharge = getDeliveryCharge();
    let deliveryDiv = document.createElement('div');
    deliveryDiv.id = 'deliveryCharge';
    deliveryDiv.style.fontWeight = 'bold';
    deliveryDiv.style.marginTop = '8px';
    if (deliveryCharge === 0) {
        deliveryDiv.textContent = 'Delivery: Free (First Order Offer)';
    } else {
        deliveryDiv.textContent = 'Delivery: Rs ' + deliveryCharge;
    }
    totalDiv.appendChild(deliveryDiv);

    // Remove previous buttonDiv if it exists
    let oldButtonDiv = document.getElementById('button');
    if (oldButtonDiv) {
        oldButtonDiv.remove();
    }
    // Create Place Order button
    let buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'
    let buttonTag = document.createElement('button')
    buttonTag.textContent = 'Place Order';
    buttonTag.onclick = function() {
        // Set first order flag if free delivery was applied
        var user = null;
        try {
            user = JSON.parse(localStorage.getItem('currentUser'));
        } catch (e) {}
        var userEmail = user && user.email;
        var firstOrderKey = userEmail ? 'firstOrderDone_' + userEmail : null;
        if (user && userEmail && !localStorage.getItem(firstOrderKey) && getDeliveryCharge() === 0) {
            localStorage.setItem(firstOrderKey, 'true');
        }
        window.location.href = '/orderPlaced.html?';
    }
    buttonDiv.appendChild(buttonTag)
    totalDiv.appendChild(buttonDiv)
}


// BACKEND CALL
let httpRequest = new XMLHttpRequest()
let totalAmount = 0
httpRequest.onreadystatechange = function()
{
    if(this.readyState === 4)
    {
        if(this.status == 200)
        {
            // console.log('call successful');
            contentTitle = JSON.parse(this.responseText)

            let counter = Number(document.cookie.split(',')[1].split('=')[1])
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter)

            let item = document.cookie.split(',')[0].split('=')[1].split(" ")
            console.log(counter)
            console.log(item)

            let i;
            let totalAmount = 0
            for(i=0; i<counter; i++)
            {
                let itemCounter = 1
                for(let j = i+1; j<counter; j++)
                {   
                    if(Number(item[j]) == Number(item[i]))
                    {
                        itemCounter +=1;
                    }
                }
                totalAmount += Number(contentTitle[item[i]-1].price) * itemCounter
                dynamicCartSection(contentTitle[item[i]-1],itemCounter)
                i += (itemCounter-1)
            }
            amountUpdate(totalAmount)
        }
    }
        else
        {
            console.log('call failed!');
        }
}

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true)
httpRequest.send()




