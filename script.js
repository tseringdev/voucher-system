/* ====================================== */
/*     Income & Expenses Voucher App      */
/*        Author: Tsering                 */
/* ====================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();

    // Load vouchers from localStorage
    loadVouchers();

    // Handle voucher form submission
    document.getElementById('voucherForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Gather form data
        const type = document.querySelector('input[name="voucherType"]:checked').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;

        // Create voucher object
        const voucher = {
            id: Date.now(),
            type,
            amount,
            category,
            date,
            description,
            createdAt: new Date().toISOString()
        };

        // Save voucher and reset form
        saveVoucher(voucher);
        this.reset();
        document.getElementById('date').valueAsDate = new Date();
    });
});

/* ====================================== */
/*           Save Voucher                 */
/* ====================================== */
function saveVoucher(voucher) {
    let vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    vouchers.unshift(voucher); // Add to the beginning
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
    loadVouchers();
}

/* ====================================== */
/*          Load & Render Vouchers        */
/* ====================================== */
function loadVouchers() {
    const vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    const voucherItems = document.getElementById('voucherItems');

    // If no vouchers, show empty state
    if (vouchers.length === 0) {
        voucherItems.innerHTML = `
            <div class="empty-state">
                <p>No vouchers added yet. Add your first transaction!</p>
            </div>
        `;
        updateSummary(0, 0);
        return;
    }

    voucherItems.innerHTML = '';
    let totalIncome = 0;
    let totalExpenses = 0;

    // Category name mapping
    const categoryNames = {
        'salary': 'Salary',
        'business': 'Business',
        'investment': 'Investment',
        'remittance': 'Remittance',
        'other-income': 'Other Income',
        'food': 'Food',
        'transportation': 'Transportation',
        'housing': 'Housing',
        'utilities': 'Utilities',
        'health': 'Health',
        'education': 'Education',
        'other-expense': 'Other Expense'
    };

    // Render each voucher
    vouchers.forEach(voucher => {
        const voucherElement = document.createElement('div');
        voucherElement.className = `voucher-item ${voucher.type} new-voucher`;

        // Calculate totals
        if (voucher.type === 'income') {
            totalIncome += voucher.amount;
        } else {
            totalExpenses += voucher.amount;
        }

        // Format date
        const formattedDate = new Date(voucher.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Voucher HTML
        voucherElement.innerHTML = `
            <div class="voucher-details">
                <div class="voucher-title">${voucher.description || categoryNames[voucher.category]}</div>
                <div class="voucher-date">${formattedDate}</div>
                <span class="voucher-category">${categoryNames[voucher.category]}</span>
            </div>
            <div class="voucher-amount">
                ${voucher.type === 'income' ? '+' : '-'}रु${voucher.amount.toFixed(2)}
            </div>
            <div class="action-btns">
                <button class="action-btn" onclick="deleteVoucher(${voucher.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        voucherItems.appendChild(voucherElement);

        // Remove new-voucher animation class after 0.5s
        setTimeout(() => {
            voucherElement.classList.remove('new-voucher');
        }, 500);
    });

    // Update summary cards
    updateSummary(totalIncome, totalExpenses);
}

/* ====================================== */
/*           Update Summary Cards         */
/* ====================================== */
function updateSummary(income, expenses) {
    document.getElementById('total-income').textContent = income.toFixed(2);
    document.getElementById('total-expenses').textContent = expenses.toFixed(2);
    document.getElementById('current-balance').textContent = (income - expenses).toFixed(2);
}

/* ====================================== */
/*           Delete a Voucher             */
/* ====================================== */
function deleteVoucher(id) {
    let vouchers = JSON.parse(localStorage.getItem('vouchers')) || [];
    vouchers = vouchers.filter(voucher => voucher.id !== id);
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
    loadVouchers();
}