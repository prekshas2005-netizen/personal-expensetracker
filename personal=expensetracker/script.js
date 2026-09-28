$(function () {
  const STORAGE_KEY = 'expenses_v1';
  let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
 
  // Initial render
  render();
 
  // Add expense
  $('#expenseForm').on('submit', function (e) {
    e.preventDefault();
    const title = $('#title').val().trim();
    const amount = parseFloat($('#amount').val());
    const category = $('#category').val();
    const date = $('#date').val();
 
    if (!title || !amount || amount <= 0 || !category || !date) {
      alert('Please fill all fields with valid values.');
      return;
    }
 
    expenses.push({
      id: Date.now(),
      title, amount, category, date
    });
    persist();
    render();
    this.reset();
  });
 
  // Delete expense (event delegation)
  $('#expenseTable').on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    expenses = expenses.filter(e => e.id !== id);
    persist();
    render();
  });
 
  // Filter
  $('#filterCategory').on('change', render);
 
  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }
 
  function render() {
    const filter = $('#filterCategory').val();
    const visible = filter ? expenses.filter(e => e.category === filter) : expenses;
 
    const $tbody = $('#expenseTable').empty();
    visible.forEach(e => {
      $tbody.append(`
        <tr>
          <td>${e.title}</td>
          <td><span class="badge bg-secondary">${e.category}</span></td>
          <td>${e.date}</td>
          <td class="text-end">₹${e.amount.toFixed(2)}</td>
          <td><span class="delete-btn" data-id="${e.id}">✖</span></td>
        </tr>`);
    });
 
    $('#emptyMsg').toggle(visible.length === 0);
 
    // Summary
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    $('#totalSpent').text('₹' + total.toFixed(2));
    $('#entryCount').text(expenses.length);
 
    const byCat = {};
    expenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
    const breakdown = Object.entries(byCat)
      .map(([c, v]) => `<div><span>${c}</span><span>₹${v.toFixed(2)}</span></div>`)
      .join('');
    $('#categoryBreakdown').html(breakdown || '<p class="text-muted mb-0">No data yet.</p>');
 
    // Update filter dropdown options
    const categories = [...new Set(expenses.map(e => e.category))];
    const current = $('#filterCategory').val();
    $('#filterCategory').html('<option value="">All Categories</option>' +
      categories.map(c => `<option ${c === current ? 'selected' : ''}>${c}</option>`).join(''));
  }
});