
const updateDetailsButton = document.getElementById('update-details-button');
const updateBookButton = document.getElementById('update-book-button');
const modal = document.getElementById('edit-book-modal');
updateDetailsButton.addEventListener('click', () => {
   modal.classList.add('open');
});
updateBookButton.addEventListener('click', () => {
    modal.classList.remove('open');
});

window.addEventListener('click', (event) => {
    if(event.target === modal){
        modal.classList.remove('open');
    }
});