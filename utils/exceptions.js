

export class NoImagesFoundException extends Error {
  constructor(value, ...args) {
    super(...args);
    this.message = 'No Images were found';
    this.toString = () => value + this.message;
  }
}

export class GenericAxiosException extends Error {
  constructor(value, ...args) {
    super(...args);
    this.message = 'Nah';
    this.toString = () => value + this.message;
  }
}

export class FileReadException extends Error {
  constructor(error, ...args) {
    super(...args);
    this.message = 'Error reading from file. ';
    this.toString = () => this.message + error;
  }
}


export class FileWriteException extends Error {
  constructor(error, ...args) {
    super(...args);
    this.message = 'Error writing to file. ';
    this.toString = () => this.message + error;
  }
}

export class InvalidDateException extends Error {
  constructor(error, ...args) {
    super(...args);
    this.message = 'Date format was not correct. Please use format mm/dd/yyyy hh:mm';
    this.toString = () => this.message + error;
  }
}
