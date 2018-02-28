module.exports = (req, res) => {
  res.set('Content-Type', 'text/plain');
  let s = '';
  for (const name in req.headers) {
    if (req.headers.hasOwnProperty(name)) {
      s += `${name} : ${req.headers[name]} \n`
    }
  }
  res.send(s);
};
