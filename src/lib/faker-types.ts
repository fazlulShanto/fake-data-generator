import { faker } from "@faker-js/faker";

export type FakerCategory = {
  name: string;
  methods: { name: string; fn: () => unknown }[];
};

export const fakerCategories: FakerCategory[] = [
  {
    name: "Person",
    methods: [
      { name: "Full Name", fn: () => faker.person.fullName() },
      { name: "First Name", fn: () => faker.person.firstName() },
      { name: "Last Name", fn: () => faker.person.lastName() },
      { name: "Middle Name", fn: () => faker.person.middleName() },
      { name: "Sex", fn: () => faker.person.sex() },
      { name: "Gender", fn: () => faker.person.gender() },
      { name: "Prefix", fn: () => faker.person.prefix() },
      { name: "Suffix", fn: () => faker.person.suffix() },
      { name: "Job Title", fn: () => faker.person.jobTitle() },
      { name: "Job Descriptor", fn: () => faker.person.jobDescriptor() },
      { name: "Job Area", fn: () => faker.person.jobArea() },
      { name: "Job Type", fn: () => faker.person.jobType() },
      { name: "Bio", fn: () => faker.person.bio() },
      { name: "Zodiac Sign", fn: () => faker.person.zodiacSign() },
    ],
  },
  {
    name: "Internet",
    methods: [
      { name: "Email", fn: () => faker.internet.email() },
      { name: "Example Email", fn: () => faker.internet.exampleEmail() },
      { name: "Username", fn: () => faker.internet.username() },
      { name: "Display Name", fn: () => faker.internet.displayName() },
      { name: "Password", fn: () => faker.internet.password() },
      { name: "URL", fn: () => faker.internet.url() },
      { name: "Domain Name", fn: () => faker.internet.domainName() },
      { name: "Domain Word", fn: () => faker.internet.domainWord() },
      { name: "Domain Suffix", fn: () => faker.internet.domainSuffix() },
      { name: "IPv4", fn: () => faker.internet.ipv4() },
      { name: "IPv6", fn: () => faker.internet.ipv6() },
      { name: "MAC Address", fn: () => faker.internet.mac() },
      { name: "Port", fn: () => faker.internet.port() },
      { name: "User Agent", fn: () => faker.internet.userAgent() },
      { name: "Color (Hex)", fn: () => faker.internet.color() },
      { name: "Emoji", fn: () => faker.internet.emoji() },
      { name: "HTTP Method", fn: () => faker.internet.httpMethod() },
      { name: "HTTP Status Code", fn: () => faker.internet.httpStatusCode() },
      { name: "JWT", fn: () => faker.internet.jwt() },
    ],
  },
  {
    name: "Location",
    methods: [
      { name: "Street Address", fn: () => faker.location.streetAddress() },
      { name: "Street", fn: () => faker.location.street() },
      {
        name: "Street Name",
        fn: () => faker.location.streetName?.() || faker.location.street(),
      },
      { name: "Building Number", fn: () => faker.location.buildingNumber() },
      { name: "City", fn: () => faker.location.city() },
      { name: "State", fn: () => faker.location.state() },
      {
        name: "State Abbr",
        fn: () => faker.location.state({ abbreviated: true }),
      },
      { name: "Country", fn: () => faker.location.country() },
      { name: "Country Code", fn: () => faker.location.countryCode() },
      { name: "Zip Code", fn: () => faker.location.zipCode() },
      { name: "Latitude", fn: () => faker.location.latitude() },
      { name: "Longitude", fn: () => faker.location.longitude() },
      {
        name: "Coordinates",
        fn: () => `${faker.location.latitude()}, ${faker.location.longitude()}`,
      },
      { name: "Time Zone", fn: () => faker.location.timeZone() },
      { name: "Direction", fn: () => faker.location.direction() },
      {
        name: "Cardinal Direction",
        fn: () => faker.location.cardinalDirection(),
      },
      {
        name: "Ordinal Direction",
        fn: () => faker.location.ordinalDirection(),
      },
      { name: "Nearby GPS", fn: () => faker.location.nearbyGPSCoordinate() },
      { name: "County", fn: () => faker.location.county() },
      {
        name: "Secondary Address",
        fn: () => faker.location.secondaryAddress(),
      },
    ],
  },
  {
    name: "Phone",
    methods: [
      { name: "Phone Number", fn: () => faker.phone.number() },
      { name: "IMEI", fn: () => faker.phone.imei() },
    ],
  },
  {
    name: "Commerce",
    methods: [
      { name: "Product Name", fn: () => faker.commerce.productName() },
      {
        name: "Product Description",
        fn: () => faker.commerce.productDescription(),
      },
      {
        name: "Product Adjective",
        fn: () => faker.commerce.productAdjective(),
      },
      { name: "Product Material", fn: () => faker.commerce.productMaterial() },
      { name: "Product", fn: () => faker.commerce.product() },
      { name: "Department", fn: () => faker.commerce.department() },
      { name: "Price", fn: () => faker.commerce.price() },
      { name: "ISBN", fn: () => faker.commerce.isbn() },
    ],
  },
  {
    name: "Company",
    methods: [
      { name: "Company Name", fn: () => faker.company.name() },
      { name: "Catch Phrase", fn: () => faker.company.catchPhrase() },
      { name: "Buzz Phrase", fn: () => faker.company.buzzPhrase() },
      { name: "Buzz Noun", fn: () => faker.company.buzzNoun() },
      { name: "Buzz Verb", fn: () => faker.company.buzzVerb() },
      { name: "Buzz Adjective", fn: () => faker.company.buzzAdjective() },
      {
        name: "Catch Phrase Adjective",
        fn: () => faker.company.catchPhraseAdjective(),
      },
      {
        name: "Catch Phrase Descriptor",
        fn: () => faker.company.catchPhraseDescriptor(),
      },
      { name: "Catch Phrase Noun", fn: () => faker.company.catchPhraseNoun() },
    ],
  },
  {
    name: "Finance",
    methods: [
      { name: "Account Number", fn: () => faker.finance.accountNumber() },
      { name: "Account Name", fn: () => faker.finance.accountName() },
      { name: "Routing Number", fn: () => faker.finance.routingNumber() },
      { name: "Amount", fn: () => faker.finance.amount() },
      { name: "Transaction Type", fn: () => faker.finance.transactionType() },
      { name: "Currency Name", fn: () => faker.finance.currencyName() },
      { name: "Currency Code", fn: () => faker.finance.currencyCode() },
      { name: "Currency Symbol", fn: () => faker.finance.currencySymbol() },
      { name: "Bitcoin Address", fn: () => faker.finance.bitcoinAddress() },
      { name: "Ethereum Address", fn: () => faker.finance.ethereumAddress() },
      { name: "Litecoin Address", fn: () => faker.finance.litecoinAddress() },
      {
        name: "Credit Card Number",
        fn: () => faker.finance.creditCardNumber(),
      },
      { name: "Credit Card CVV", fn: () => faker.finance.creditCardCVV() },
      {
        name: "Credit Card Issuer",
        fn: () => faker.finance.creditCardIssuer(),
      },
      { name: "PIN", fn: () => faker.finance.pin() },
      { name: "BIC", fn: () => faker.finance.bic() },
      { name: "IBAN", fn: () => faker.finance.iban() },
      {
        name: "Transaction Description",
        fn: () => faker.finance.transactionDescription(),
      },
      { name: "Masked Number", fn: () => faker.finance.maskedNumber() },
    ],
  },
  {
    name: "Date",
    methods: [
      { name: "Past Date", fn: () => faker.date.past().toISOString() },
      { name: "Future Date", fn: () => faker.date.future().toISOString() },
      { name: "Recent Date", fn: () => faker.date.recent().toISOString() },
      { name: "Soon Date", fn: () => faker.date.soon().toISOString() },
      { name: "Birthdate", fn: () => faker.date.birthdate().toISOString() },
      { name: "Month", fn: () => faker.date.month() },
      { name: "Weekday", fn: () => faker.date.weekday() },
      { name: "Timezone", fn: () => faker.location.timeZone() },
      { name: "Any Time", fn: () => faker.date.anytime().toISOString() },
      {
        name: "Past (Date Only)",
        fn: () => faker.date.past().toISOString().split("T")[0],
      },
      {
        name: "Future (Date Only)",
        fn: () => faker.date.future().toISOString().split("T")[0],
      },
    ],
  },
  {
    name: "Lorem",
    methods: [
      { name: "Word", fn: () => faker.lorem.word() },
      { name: "Words (3)", fn: () => faker.lorem.words(3) },
      { name: "Words (5)", fn: () => faker.lorem.words(5) },
      { name: "Sentence", fn: () => faker.lorem.sentence() },
      { name: "Sentences (2)", fn: () => faker.lorem.sentences(2) },
      { name: "Sentences (3)", fn: () => faker.lorem.sentences(3) },
      { name: "Paragraph", fn: () => faker.lorem.paragraph() },
      { name: "Paragraphs (2)", fn: () => faker.lorem.paragraphs(2) },
      { name: "Paragraphs (3)", fn: () => faker.lorem.paragraphs(3) },
      { name: "Lines (2)", fn: () => faker.lorem.lines(2) },
      { name: "Lines (5)", fn: () => faker.lorem.lines(5) },
      { name: "Slug", fn: () => faker.lorem.slug() },
      { name: "Text", fn: () => faker.lorem.text() },
    ],
  },
  {
    name: "String",
    methods: [
      { name: "UUID", fn: () => faker.string.uuid() },
      { name: "ULID", fn: () => faker.string.ulid() },
      { name: "Nanoid", fn: () => faker.string.nanoid() },
      { name: "Alpha (10)", fn: () => faker.string.alpha(10) },
      { name: "Alphanumeric (10)", fn: () => faker.string.alphanumeric(10) },
      { name: "Numeric (10)", fn: () => faker.string.numeric(10) },
      {
        name: "Hexadecimal (10)",
        fn: () => faker.string.hexadecimal({ length: 10 }),
      },
      { name: "Binary (8)", fn: () => faker.string.binary({ length: 8 }) },
      { name: "Octal (8)", fn: () => faker.string.octal({ length: 8 }) },
      { name: "Sample", fn: () => faker.string.sample() },
      { name: "Symbol (5)", fn: () => faker.string.symbol(5) },
    ],
  },
  {
    name: "Number",
    methods: [
      {
        name: "Integer (1-100)",
        fn: () => faker.number.int({ min: 1, max: 100 }),
      },
      {
        name: "Integer (1-1000)",
        fn: () => faker.number.int({ min: 1, max: 1000 }),
      },
      {
        name: "Integer (1-10000)",
        fn: () => faker.number.int({ min: 1, max: 10000 }),
      },
      {
        name: "Float (0-1)",
        fn: () => faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      },
      {
        name: "Float (0-100)",
        fn: () => faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
      },
      { name: "Binary", fn: () => faker.number.binary() },
      { name: "Octal", fn: () => faker.number.octal() },
      { name: "Hex", fn: () => faker.number.hex() },
      { name: "Big Int", fn: () => faker.number.bigInt().toString() },
      { name: "Roman Numeral", fn: () => faker.number.romanNumeral() },
    ],
  },
  {
    name: "Boolean",
    methods: [
      { name: "Boolean", fn: () => faker.datatype.boolean() },
      {
        name: "Boolean (75% true)",
        fn: () => faker.datatype.boolean({ probability: 0.75 }),
      },
      {
        name: "Boolean (25% true)",
        fn: () => faker.datatype.boolean({ probability: 0.25 }),
      },
    ],
  },
  {
    name: "Image",
    methods: [
      { name: "Avatar", fn: () => faker.image.avatar() },
      { name: "Avatar (GitHub)", fn: () => faker.image.avatarGitHub() },
      { name: "URL", fn: () => faker.image.url() },
      {
        name: "URL (640x480)",
        fn: () => faker.image.url({ width: 640, height: 480 }),
      },
      { name: "URL Placeholder", fn: () => faker.image.urlPlaceholder() },
      { name: "URL LoremFlickr", fn: () => faker.image.urlLoremFlickr() },
      { name: "URL PicsumPhotos", fn: () => faker.image.urlPicsumPhotos() },
      { name: "Data URI", fn: () => faker.image.dataUri() },
    ],
  },
  {
    name: "Color",
    methods: [
      { name: "Human Name", fn: () => faker.color.human() },
      { name: "CSS Supported", fn: () => faker.color.cssSupportedFunction() },
      {
        name: "CSS Supported Space",
        fn: () => faker.color.cssSupportedSpace(),
      },
      { name: "RGB", fn: () => faker.color.rgb() },
      { name: "CMYK", fn: () => faker.color.cmyk() },
      { name: "HSL", fn: () => faker.color.hsl() },
      { name: "HWB", fn: () => faker.color.hwb() },
      { name: "LAB", fn: () => faker.color.lab() },
      { name: "LCH", fn: () => faker.color.lch() },
      { name: "Color Space", fn: () => faker.color.colorByCSSColorSpace() },
    ],
  },
  {
    name: "Database",
    methods: [
      { name: "Column", fn: () => faker.database.column() },
      { name: "Type", fn: () => faker.database.type() },
      { name: "Collation", fn: () => faker.database.collation() },
      { name: "Engine", fn: () => faker.database.engine() },
      { name: "MongoDB ObjectId", fn: () => faker.database.mongodbObjectId() },
    ],
  },
  {
    name: "Git",
    methods: [
      { name: "Branch", fn: () => faker.git.branch() },
      { name: "Commit Entry", fn: () => faker.git.commitEntry() },
      { name: "Commit Message", fn: () => faker.git.commitMessage() },
      { name: "Commit Date", fn: () => faker.git.commitDate() },
      { name: "Commit SHA", fn: () => faker.git.commitSha() },
      { name: "Short SHA", fn: () => faker.git.commitSha({ length: 7 }) },
    ],
  },
  {
    name: "Hacker",
    methods: [
      { name: "Abbreviation", fn: () => faker.hacker.abbreviation() },
      { name: "Adjective", fn: () => faker.hacker.adjective() },
      { name: "Noun", fn: () => faker.hacker.noun() },
      { name: "Verb", fn: () => faker.hacker.verb() },
      { name: "Ingverb", fn: () => faker.hacker.ingverb() },
      { name: "Phrase", fn: () => faker.hacker.phrase() },
    ],
  },
  {
    name: "System",
    methods: [
      { name: "File Name", fn: () => faker.system.fileName() },
      { name: "Common File Name", fn: () => faker.system.commonFileName() },
      { name: "MIME Type", fn: () => faker.system.mimeType() },
      { name: "Common File Type", fn: () => faker.system.commonFileType() },
      { name: "Common File Ext", fn: () => faker.system.commonFileExt() },
      { name: "File Type", fn: () => faker.system.fileType() },
      { name: "File Extension", fn: () => faker.system.fileExt() },
      { name: "Directory Path", fn: () => faker.system.directoryPath() },
      { name: "File Path", fn: () => faker.system.filePath() },
      { name: "Semver", fn: () => faker.system.semver() },
      { name: "Network Interface", fn: () => faker.system.networkInterface() },
      { name: "Cron", fn: () => faker.system.cron() },
    ],
  },
  {
    name: "Vehicle",
    methods: [
      { name: "Vehicle", fn: () => faker.vehicle.vehicle() },
      { name: "Manufacturer", fn: () => faker.vehicle.manufacturer() },
      { name: "Model", fn: () => faker.vehicle.model() },
      { name: "Type", fn: () => faker.vehicle.type() },
      { name: "Fuel", fn: () => faker.vehicle.fuel() },
      { name: "VIN", fn: () => faker.vehicle.vin() },
      { name: "Color", fn: () => faker.vehicle.color() },
      { name: "VRM", fn: () => faker.vehicle.vrm() },
      { name: "Bicycle", fn: () => faker.vehicle.bicycle() },
    ],
  },
  {
    name: "Airline",
    methods: [
      { name: "Airport (Name)", fn: () => faker.airline.airport().name },
      { name: "Airport (IATA)", fn: () => faker.airline.airport().iataCode },
      { name: "Airline (Name)", fn: () => faker.airline.airline().name },
      { name: "Airline (IATA)", fn: () => faker.airline.airline().iataCode },
      { name: "Airplane (Name)", fn: () => faker.airline.airplane().name },
      {
        name: "Airplane (IATA)",
        fn: () => faker.airline.airplane().iataTypeCode,
      },
      { name: "Record Locator", fn: () => faker.airline.recordLocator() },
      { name: "Seat", fn: () => faker.airline.seat() },
      { name: "Aircraft Type", fn: () => faker.airline.aircraftType() },
      { name: "Flight Number", fn: () => faker.airline.flightNumber() },
    ],
  },
  {
    name: "Animal",
    methods: [
      { name: "Dog", fn: () => faker.animal.dog() },
      { name: "Cat", fn: () => faker.animal.cat() },
      { name: "Snake", fn: () => faker.animal.snake() },
      { name: "Bear", fn: () => faker.animal.bear() },
      { name: "Lion", fn: () => faker.animal.lion() },
      { name: "Cetacean", fn: () => faker.animal.cetacean() },
      { name: "Horse", fn: () => faker.animal.horse() },
      { name: "Bird", fn: () => faker.animal.bird() },
      { name: "Cow", fn: () => faker.animal.cow() },
      { name: "Fish", fn: () => faker.animal.fish() },
      { name: "Crocodilia", fn: () => faker.animal.crocodilia() },
      { name: "Insect", fn: () => faker.animal.insect() },
      { name: "Rabbit", fn: () => faker.animal.rabbit() },
      { name: "Rodent", fn: () => faker.animal.rodent() },
      { name: "Type", fn: () => faker.animal.type() },
    ],
  },
  {
    name: "Book",
    methods: [
      { name: "Title", fn: () => faker.book.title() },
      { name: "Author", fn: () => faker.book.author() },
      { name: "Genre", fn: () => faker.book.genre() },
      { name: "Format", fn: () => faker.book.format() },
      { name: "Publisher", fn: () => faker.book.publisher() },
      { name: "Series", fn: () => faker.book.series() },
    ],
  },
  {
    name: "Food",
    methods: [
      { name: "Adjective", fn: () => faker.food.adjective() },
      { name: "Description", fn: () => faker.food.description() },
      { name: "Dish", fn: () => faker.food.dish() },
      { name: "Ethnic Category", fn: () => faker.food.ethnicCategory() },
      { name: "Fruit", fn: () => faker.food.fruit() },
      { name: "Ingredient", fn: () => faker.food.ingredient() },
      { name: "Meat", fn: () => faker.food.meat() },
      { name: "Spice", fn: () => faker.food.spice() },
      { name: "Vegetable", fn: () => faker.food.vegetable() },
    ],
  },
  {
    name: "Music",
    methods: [
      { name: "Genre", fn: () => faker.music.genre() },
      { name: "Song Name", fn: () => faker.music.songName() },
      { name: "Artist", fn: () => faker.music.artist() },
      { name: "Album", fn: () => faker.music.album() },
    ],
  },
  {
    name: "Science",
    methods: [
      {
        name: "Chemical Element (Name)",
        fn: () => faker.science.chemicalElement().name,
      },
      {
        name: "Chemical Element (Symbol)",
        fn: () => faker.science.chemicalElement().symbol,
      },
      { name: "Unit (Name)", fn: () => faker.science.unit().name },
      { name: "Unit (Symbol)", fn: () => faker.science.unit().symbol },
    ],
  },
  {
    name: "Word",
    methods: [
      { name: "Adjective", fn: () => faker.word.adjective() },
      { name: "Adverb", fn: () => faker.word.adverb() },
      { name: "Conjunction", fn: () => faker.word.conjunction() },
      { name: "Interjection", fn: () => faker.word.interjection() },
      { name: "Noun", fn: () => faker.word.noun() },
      { name: "Preposition", fn: () => faker.word.preposition() },
      { name: "Verb", fn: () => faker.word.verb() },
      { name: "Sample", fn: () => faker.word.sample() },
      { name: "Words", fn: () => faker.word.words() },
    ],
  },
];

export function getFakerMethodByPath(categoryName: string, methodName: string) {
  const category = fakerCategories.find((c) => c.name === categoryName);
  if (!category) return null;
  const method = category.methods.find((m) => m.name === methodName);
  return method?.fn || null;
}
