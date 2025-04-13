// utils.mjs
import UserAgent from 'user-agents';

const userAgentGenerator = new UserAgent({ deviceCategory: 'desktop'});

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getRandomUserAgent = () => userAgentGenerator.random().toString();