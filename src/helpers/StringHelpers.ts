export const StringHelpers = {
  toPascalCase(input: string) {
    if (!input) {
      return input;
    } else if (input.length < 2) {
      return input.toUpperCase();
    }

    return input[0].toUpperCase() + input.substr(1);
  }
};
