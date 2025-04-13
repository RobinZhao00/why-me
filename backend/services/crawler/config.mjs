export const userAgents = [
    'Mozilla/5.0 ...',
    'Mozilla/5.0 ...',
  ];
  
  export const getRandomUA = () =>
    userAgents[Math.floor(Math.random() * userAgents.length)];
  