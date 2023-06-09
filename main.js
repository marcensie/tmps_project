class SortStrategy {
  sort(products) {
  }
}

class TitleSortStrategy extends SortStrategy {
  sort(products) {
    return products.sort((a, b) => a.getTitle().localeCompare(b.getTitle()));
  }
}

class PriceSortStrategy extends SortStrategy {
  sort(products) {
    return products.sort((a, b) => a.getPrice() - b.getPrice());
  }
}

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

class Library {
  constructor() {
    this.products = [];
    this.genreFactory = new GenreFactory();
    this.sortStrategy = null;
  }
  static getInstance() {
    if (!Library.instance) {
      Library.instance = new Library();
    }
    return Library.instance;
  }
  addProduct(product) {
    this.products.push(product);
  }
  setSortStrategy(sortStrategy) {
    this.sortStrategy = sortStrategy;
    this.products = this.sortStrategy ? this.sortStrategy.sort(this.products) : [...this.products];
    this.displayProducts();
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
  displayProducts() {
    const sortedProducts = this.sortStrategy ? this.sortStrategy.sort(this.products) : [...this.products];
  
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
  
    sortedProducts.forEach((item, index) => {
      const productItem = document.createElement('li');
      productItem.className = 'product-item';
  
      const type = document.createElement('h4');
      type.textContent = `${item.getType()}`;
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
      price.textContent = `Price: ${item.getPrice().toFixed(2)}`;
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
  sortProducts() {
    if (this.sortStrategy) {
      this.products = this.sortStrategy.sort(this.products);
    }
  }
}

class ProductAbstractFactory {
  createProductBuilder() {
    throw new Error('in specific factory');
  }
}

class BookFactory extends ProductAbstractFactory {
  constructor(genreFactory) {
    super();
    this.genreFactory = genreFactory;
  }
  createProductBuilder() {
    return new BookBuilder(this.genreFactory);
  }
}

class JournalFactory extends ProductAbstractFactory {
  constructor(genreFactory) {
    super();
    this.genreFactory = genreFactory;
  }
  createProductBuilder() {
    return new JournalBuilder(this.genreFactory);
  }
}

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
  }
}

class BookBuilder extends ProductBuilder {
  constructor(genreFactory) {
    super('Book', genreFactory);
  }
  build() {
    return new Book(this.title, this.author, this.genre, this.price);
  }
}

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
  getType() {
    return this.type;
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
  getType() {
    return this.type;
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

class ProductWithDescription {
  constructor(product, desc) {
    this.product = product;
    this.desc = desc;
  }
  getType() {
    return this.product.type;
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
      return `${this.product.getDescription()}  ${this.desc}`;
    }
    return this.product.getDescription();
  }
}

class LibraryFacade {
  constructor() {
    this.library = Library.getInstance();
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

  displayProducts(sortStrategy) {
    this.library.displayProducts(sortStrategy);
  }
  setSortStrategy(sortStrategy) {
    this.library.setSortStrategy(sortStrategy);
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
  }
}

class SortCommand extends Command {
  constructor(libraryFacade, sortStrategy) {
    super();
    this.libraryFacade = libraryFacade;
    this.sortStrategy = sortStrategy;
  }
  execute() {
    this.libraryFacade.setSortStrategy(this.sortStrategy);
    this.libraryFacade.sortProducts();
    this.libraryFacade.displayProducts();
  }
}

class AddProductCommand extends Command {
  constructor(libraryFacade, type, title, author, genreName, price, description) {
    super();
    this.libraryFacade = libraryFacade;
    this.type = type;
    this.title = title;
    this.author = author;
    this.genreName = genreName;
    this.price = price;
    this.description = description;
  }
  execute() {
    this.libraryFacade.addProduct(
      this.type,
      this.title,
      this.author,
      this.genreName,
      this.price,
      this.description
    );
  }
}

const library = new Library();
const genreFactory = new GenreFactory();
const bookFactory = new BookFactory(genreFactory);
const journalFactory = new JournalFactory(genreFactory);
const libraryFacade = new LibraryFacade();
const titleSortStrategy = new TitleSortStrategy();
const priceSortStrategy = new PriceSortStrategy();
const libraryInstance = Library.getInstance();

const preCreatedProducts = [
  { type: 'Book', title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy', price: 9.99, description: 'Description 1' },
  { type: 'Book', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', price: 10.99, description: 'Description 2' },
  { type: 'Book', title: 'The Great Gatsby', author: ' F. Scott Fitzgerald', genre: 'Fiction', price: 15.99 },
  { type: 'Journal', title: 'Five-Minute Journal', author: ' Intelligent Change', genre: 'Life', price: 3.99 },
  { type: 'Book', title: '1984', author: 'George Orwell', genre: 'Fiction', price: 12.99 },
  { type: 'Book', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', price: 15.99, description: 'Description 3' },
  { type: 'Journal', title: ' Daily Practices', author: 'Barrie Davenport', genre: 'Life', price: 12.99, description: 'Description 4' },
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
libraryFacade.displayProducts();
const titleSortCommand = new SortCommand(libraryFacade, titleSortStrategy);
const priceSortCommand = new SortCommand(libraryFacade, priceSortStrategy);
const addProductButton = document.getElementById('add-product');
const typeInput = document.getElementById('type');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
const priceInput = document.getElementById('price');
const descInput = document.getElementById('description');

addProductButton.addEventListener('click', () => {
  const type = typeInput.value;
  const title = titleInput.value;
  const author = authorInput.value;
  const genreName = genreInput.value;
  const price = parseFloat(priceInput.value);
  const desc = descInput.value;

  const addProductCommand = new AddProductCommand(
    libraryFacade,
    type,
    title,
    author,
    genreName,
    price,
    desc
  );
  addProductCommand.execute();

  titleInput.value = '';
  authorInput.value = '';
  genreInput.value = '';
  priceInput.value = '';
  descInput.value = '';

  libraryFacade.displayProductCount();
  libraryFacade.displayProducts();
});

document.getElementById('sort-by-title').addEventListener('click', () => {
  libraryFacade.setSortStrategy(titleSortStrategy);
  libraryFacade.displayProducts();
});

document.getElementById('sort-by-price').addEventListener('click', () => {
  libraryFacade.setSortStrategy(priceSortStrategy);
  libraryFacade.displayProducts();
});

libraryFacade.displayProducts();
