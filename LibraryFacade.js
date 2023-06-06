 class LibraryFacade {
  constructor() {
    this.library = new Library();
    this.genreFactory = new GenreFactory();
    this.bookFactory = new BookFactory(this.genreFactory);
    this.journalFactory = new JournalFactory(this.genreFactory);
  }

  addProduct(type, title, author, genreName, price, description) {
    const genre = this.genreFactory.getGenre(genreName);
    let productBuilder;
    if (type === 'Book') {
      productBuilder = this.bookFactory.createProductBuilder();
    } else if (type === 'Journal') {
      productBuilder = this.journalFactory.createProductBuilder();
    } else {
      throw new Error('Invalid product type.');
    }

    const product = productBuilder
      .withTitle(title)
      .withAuthor(author)
      .withGenre(genre)
      .withPrice(price)
      .build();

    const productWithDesc = new ProductWithDescription(product, description);
    this.library.addProduct(productWithDesc);
  }

  removeProduct(product) {
    this.library.removeProduct(product);
  }

  displayProducts() {
    this.library.displayProducts();
  }
}
