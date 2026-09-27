/* Résumé page: the Print / Save PDF button. */
document.querySelectorAll(".js-print").forEach(function (button) {
  button.addEventListener("click", function () {
    window.print();
  });
});
