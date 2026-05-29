/* vocab-search.js — filters .vocab-freq-table rows by .vocab-search input */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.vocab-search').forEach(function (input) {
    var table = input.closest('.lang-section').querySelector('.vocab-freq-table tbody');
    if (!table) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      Array.from(table.rows).forEach(function (row) {
        row.hidden = q && !row.textContent.toLowerCase().includes(q);
      });
    });
  });
});
