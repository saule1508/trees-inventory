const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3000' : (process.browser ? 'https://www.trees-inventory.be' : "http://localhost:8080");
