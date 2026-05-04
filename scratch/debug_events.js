import { sanityClient } from './lib/sanity.js';

async function debug() {
  const events = await sanityClient.fetch(`*[_type == "event"]{
    title,
    date,
    isPublic,
    visibility
  }`);
  console.log(JSON.stringify(events, null, 2));
}

debug();
