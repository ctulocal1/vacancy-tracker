let modal = document.querySelector(".modal");
let modalClose = document.querySelector(".modal-close");
let newQuote = document.querySelector("button.new-quote");
let cancel = document.querySelector("button.cancel");

newQuote.addEventListener("click", e => {
  e.preventDefault();
  modal.showModal();
});
modalClose.addEventListener("click", e => modal.close());
cancel.addEventListener("click", e => {
  e.preventDefault();
  modal.close() ;
});
