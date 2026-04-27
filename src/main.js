import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { getImagesByQuery } from "./js/pixabay-api.js";
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from "./js/render-functions.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let maxPage = 0;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  query = event.currentTarget.elements["search-text"].value.trim();

  if (query === "") {
    iziToast.warning({
      message: "Please enter a search query.",
      position: "topRight",
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        message: "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);
    maxPage = Math.ceil(data.totalHits / 15);

    if (page < maxPage) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: "topRight",
    });
  } finally {
    hideLoader();
    form.reset();
  }
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const galleryItem = document.querySelector(".gallery-item");
    if (galleryItem) {
      const itemHeight = galleryItem.getBoundingClientRect().height;
      window.scrollBy({
        top: itemHeight * 2,
        behavior: "smooth",
      });
    }

    if (page >= maxPage) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});