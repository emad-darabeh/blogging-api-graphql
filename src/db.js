const users = [
  {
    id: '1',
    name: 'osama darabeh',
    email: 'osama@gmail.com'
  },
  {
    id: '2',
    name: 'emad',
    email: 'emad@gmail.com',
    age: 33
  },
  {
    id: '3',
    name: 'abood darabeh',
    email: 'abood@gmail.com',
    age: 22
  }
];

const posts = [
  {
    id: '11',
    title: 'game of thrones',
    body: '7 kingdoms are fighting over the throne',
    published: true,
    author: '1'
  },
  {
    id: '12',
    title: 'end game',
    body: 'super heros trying to save the earth',
    published: true,
    author: '2'
  },
  {
    id: '13',
    title: 'our planet',
    body: 'a documentary about the planet earth and the nature life',
    published: false,
    author: '2'
  }
];

const comments = [
  {
    id: '111',
    body: 'nice post',
    author: '1',
    post: '11'
  },
  {
    id: '112',
    body: 'hey this is cool post',
    author: '3',
    post: '12'
  },
  {
    id: '113',
    body: 'hi can we talk',
    author: '3',
    post: '12'
  },
  {
    id: '114',
    body: 'hi can we talk',
    author: '2',
    post: '13'
  }
];

const db = {
  users,
  posts,
  comments
};

export default db;
