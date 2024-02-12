function Parse(balance) {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default Parse;
