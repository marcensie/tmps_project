// Flyweight Factory
class GenreFactory {
  constructor() {
    this.genres = {};
  }

  getGenre(name) {
    if (!this.genres[name]) {
      this.genres[name] = new Genre(name);
    }
    return this.genres[name];
  }

  getGenreCount() {
    return Object.keys(this.genres).length;
  }
}

class Genre {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

// Iterator Pattern
class LibraryIterator {
  constructor(products) {
    this.products = products;
    this.currentIndex = 0;
  }

  hasNext() {
    return this.currentIndex < this.products.length;
  }

  next() {
    const product = this.products[this.currentIndex];
    this.currentIndex++;
    return product;
  }
}

// Singleton Pattern
class Library {
  constructor() {
    this.products = [];
    this.genreFactory = new GenreFactory();
  }

  addProduct(product) {
    this.products.push(product);
  }

  removeProduct(product) {
    const index = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }
  sortProducts(sortBy) {
    if (sortBy === 'title') {
      this.products.sort((a, b) => a.getTitle().localeCompare(b.getTitle()));
    } else if (sortBy === 'price') {
      this.products.sort((a, b) => a.getPrice() - b.getPrice());
    }
  }
  createIterator() {
    return new LibraryIterator(this.products);
  }

  countProducts() {
    let count = 0;
    const iterator = this.createIterator();
    while (iterator.hasNext()) {
      iterator.next();
      count++;
    }
    return count;
  }

  displayProducts(sortBy) {
    const sortedProducts = [...this.products]; // Create a copy of the products array
    if (sortBy === 'title') {
      sortedProducts.sort((a, b) => a.getTitle().localeCompare(b.getTitle()));
    } else if (sortBy === 'price') {
      sortedProducts.sort((a, b) => a.getPrice() - b.getPrice());
    }

    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    sortedProducts.forEach((item, index) => {
      const productItem = document.createElement('li');
      productItem.className = 'product-item';

      const type = document.createElement('h4');
      type.textContent = item.type;
      productItem.appendChild(type);

      const title = document.createElement('p');
      title.textContent = `Title: ${item.getTitle()}`;
      productItem.appendChild(title);

      const author = document.createElement('p');
      author.textContent = `Author: ${item.getAuthor()}`;
      productItem.appendChild(author);

      const genre = document.createElement('p');
      genre.textContent = `Genre: ${item.getGenre().getName()}`;
      productItem.appendChild(genre);

      const price = document.createElement('p');
      price.textContent = `Price: $${item.getPrice().toFixed(2)}`;
      productItem.appendChild(price);

      if (item.getDescription()) {
        const description = document.createElement('p');
        description.textContent = `Description: ${item.getDescription()}`;
        productItem.appendChild(description);
      }

      productList.appendChild(productItem);
    });
  }
  displayProductCount() {
    const productCountElement = document.getElementById('product-count');
    productCountElement.textContent = this.countProducts().toString();
  }
}


// Abstract Factory Pattern
class ProductAbstractFactory {
  createProductBuilder() {
    throw new Error('createProductBuilder() method must be implemented.');
  }
}

// Concrete Factory 1 - Book Factory
class BookFactory extends ProductAbstractFactory {
  constructor(genreFactory) {
    super();
    this.genreFactory = genreFactory;
  }

  createProductBuilder() {
    return new BookBuilder(this.genreFactory);
  }
}

// Concrete Factory 2 - Journal Factory
class JournalFactory extends ProductAbstractFactory {
  constructor(genreFactory) {
    super();
    this.genreFactory = genreFactory;
  }

  createProductBuilder() {
    return new JournalBuilder(this.genreFactory);
  }
}

// Builder Pattern
class ProductBuilder {
  constructor(type, genreFactory) {
    this.type = type;
    this.title = '';
    this.author = '';
    this.genre = null;
    this.price = 0;
    this.genreFactory = genreFactory;
  }

  withTitle(title) {
    this.title = title;
    return this;
  }

  withAuthor(author) {
    this.author = author;
    return this;
  }

  withGenre(genre) {
    this.genre = genre;
    return this;
  }

  withPrice(price) {
    this.price = price;
    return this;
  }

  build() {
    throw new Error('build() method must be implemented in the derived class.');
  }
}

// Concrete Builder 1 - BookBuilder
class BookBuilder extends ProductBuilder {
  constructor(genreFactory) {
    super('Book', genreFactory);
  }

  build() {
    return new Book(this.title, this.author, this.genre, this.price);
  }
}

// Concrete Builder 2 - JournalBuilder
class JournalBuilder extends ProductBuilder {
  constructor(genreFactory) {
    super('Journal', genreFactory);
  }

  build() {
    return new Journal(this.title, this.author, this.genre, this.price);
  }
}

class Book {
  constructor(title, author, genre, price) {
    this.title = title;
    this.author = author;
    this.type = 'Book';
    this.genre = genre;
    this.price = price;
  }

  getTitle() {
    return this.title;
  }

  getAuthor() {
    return this.author;
  }

  getGenre() {
    return this.genre;
  }

  getPrice() {
    return this.price;
  }

  getDescription() {
    return '';
  }
}

class Journal {
  constructor(title, author, genre, price) {
    this.title = title;
    this.author = author;
    this.type = 'Journal';
    this.genre = genre;
    this.price = price;
  }

  getTitle() {
    return this.title;
  }

  getAuthor() {
    return this.author;
  }

  getGenre() {
    return this.genre;
  }

  getPrice() {
    return this.price;
  }

  getDescription() {
    return '';
  }
}
//decorator
class ProductWithDescription {
  constructor(product, desc) {
    this.product = product;
    this.desc = desc;
  }

  getTitle() {
    return this.product.getTitle();
  }

  getAuthor() {
    return this.product.getAuthor();
  }

  getGenre() {
    return this.product.getGenre();
  }

  getPrice() {
    return this.product.getPrice();
  }

  getDescription() {
    if (this.desc) {
      return `${this.product.getDescription()} - ${this.desc}`;
    }
    return this.product.getDescription();
  }
}

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
    } else {
      productBuilder = this.journalFactory.createProductBuilder();
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

  removeProduct(type, title) {
    const products = this.library.products;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (product.type === type && product.getTitle() === title) {
        this.library.removeProduct(product);
        break;
      }
    }
  }

  displayProducts(sortBy) {
    this.library.displayProducts(sortBy);
  }
  sortProducts(sortBy) {
    this.library.sortProducts(sortBy);
  }

  getGenreCount() {
    return this.genreFactory.getGenreCount();
  }
  countProducts() {
    return this.library.countProducts();
  }
  displayProductCount() {
    return this.library.displayProductCount();
  }
}

class Command {
  execute() {
    throw new Error('execute() method must be implemented in the derived class.');
  }
}

// Concrete Command 1 - SortCommand
class SortCommand extends Command {
  constructor(libraryFacade, sortBy) {
    super();
    this.libraryFacade = libraryFacade;
    this.sortBy = sortBy;
  }

  execute() {
    this.libraryFacade.sortProducts(this.sortBy);
    this.libraryFacade.displayProducts(this.sortBy);
  }
}

// Invoker
class SortButton {
  constructor(command) {
    this.command = command;
  }

  onClick() {
    this.command.execute();
  }
}

const library = new Library();
const genreFactory = new GenreFactory();
const bookFactory = new BookFactory(genreFactory);
const journalFactory = new JournalFactory(genreFactory);
const libraryFacade = new LibraryFacade();

const preCreatedProducts = [
  { type: 'Book', title: 'Book 1', author: 'Author 1', genre: 'Fantasy', price: 9.99, description: 'Description 1' },
  { type: 'Journal', title: 'Journal 1', author: 'Author 2', genre: 'Science', price: 4.99, description: 'Description 2' },
  { type: 'Book', title: 'Book 2', author: 'Author 3', genre: 'Mystery', price: 12.99 },
];

preCreatedProducts.forEach((item) => {
  libraryFacade.addProduct(
    item.type,
    item.title,
    item.author,
    item.genre,
    item.price,
    item.description
  );
});

const addProductButton = document.getElementById('add-product');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
const priceInput = document.getElementById('price');
const descInput = document.getElementById('description');

addProductButton.addEventListener('click', () => {
  const type = genreInput.value; 
  const title = titleInput.value;
  const author = authorInput.value;
  const genreName = genreInput.value;
  const price = parseFloat(priceInput.value);
  const desc = descInput.value;

  libraryFacade.addProduct(type, title, author, genreName, price, desc);

  titleInput.value = '';
  authorInput.value = '';
  genreInput.value = '';
  priceInput.value = '';
  descInput.value = '';


  libraryFacade.displayProductCount();
  libraryFacade.displayProducts();

const sortButtons = document.querySelectorAll('#sort-button');
sortButtons.forEach((button) => {
  const sortBy = button.getAttribute('data-sort');
  const sortCommand = new SortCommand(libraryFacade, sortBy);
  const sortButton = new SortButton(sortCommand);

  button.addEventListener('click', () => {
    sortButton.onClick();
  });
});

});

libraryFacade.displayProducts();

