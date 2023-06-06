
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

  displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    this.products.forEach((item, index) => {
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
    this.price = 0; // Add the price property
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
    this.price = price; // Set the price
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
    return new Book(this.title, this.author, this.genre, this.price); // Pass the price to the Book constructor
  }
}

// Concrete Builder 2 - JournalBuilder
class JournalBuilder extends ProductBuilder {
  constructor(genreFactory) {
    super('Journal', genreFactory);
  }

  build() {
    return new Journal(this.title, this.author, this.genre, this.price); // Pass the price to the Journal constructor
  }
}

class Book {
  constructor(title, author, genre, price) {
    this.title = title;
    this.author = author;
    this.type = 'Book';
    this.genre = genre;
    this.price = price; // Add the price property
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
    return this.price; // Return the price
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
    this.price = price; // Add the price property
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
    return this.price; // Return the price
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

  removeProduct(product) {
    this.library.removeProduct(product);
  }

  displayProducts() {
    this.library.displayProducts();
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

  libraryFacade.displayProducts();
});

libraryFacade.displayProducts();
