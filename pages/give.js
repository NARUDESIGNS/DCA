function give() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const amount = document.getElementById('amount').value;
    const reason = document.getElementById('reason').value;

    if (fullname.trim().length < 1) {
        showNotification('Please enter your name', '#ed243a')
    } else if (email.trim().length < 1 || !email.includes('@')) {
        showNotification('Please enter a valid email', '#ed243a')
    } else if (amount < 100) {
        showNotification('Please enter an amount greater than ₦100', '#ed243a')
    } else if (reason.trim().length < 1) {
        showNotification('Please select a reason', '#ed243a')
    } else {
        var handler = PaystackPop.setup({
            key: 'pk_live_18882409759ded97d4d6abf22abe772726e25bf5',
            amount: parseInt(amount) * 100,
            currency: "NGN",
            email: email,
            label: "Divine Christian Assembly",
            metadata: {
                custom_fields: [
                    {
                        "display_name": "Reason",
                        "variable_name": "Reason",
                        "value": reason,
                    }, {
                        "display_name": "Fullname",
                        "variable_name": "Fullname",
                        "value": fullname,
                    },
                ]
            },
            callback: function (response) {
                showNotification('Payment Successful!', '#008000');
            },
            onClose: function () { },
        });
        handler.openIframe();
    }
}

function showNotification(message, color) {
    var notification = document.getElementById("notification");
    notification.innerText = message;
    notification.style.background = color;
    notification.className = "show";
    setTimeout(function () {
        notification.className = notification.className.replace("show", "");
    }, 3000);
}