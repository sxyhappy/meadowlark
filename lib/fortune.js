const fortuneCookie = [
  'Conquer your fears or they will conquer you.',
  'Rivers need springs.',
  'Do not fear what you don\'t know.',
  'You will have a pleasant surprise.',
  'whenever possible, keep it simple'
];

exports.getFortune = () => {
  const i = Math.floor(Math.random() * fortuneCookie.length);
  return fortuneCookie[i];
};
