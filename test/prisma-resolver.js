module.exports = (path, options) => {
  try {
    return options.defaultResolver(path, options);
  } catch (error) {
    // Si falla con .js, intenta sin la extensión
    if (path.endsWith('.js')) {
      return options.defaultResolver(path.replace(/\.js$/, ''), options);
    }
    throw error;
  }
};