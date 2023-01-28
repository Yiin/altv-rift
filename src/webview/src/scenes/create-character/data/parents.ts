export const parents = [
  "Benjamin",
  "Daniel",
  "Joshua",
  "Noah",
  "Andrew",
  "Juan",
  "Alex",
  "Isaac",
  "Evan",
  "Ethan",
  "Vincent",
  "Angel",
  "Diego",
  "Adrian",
  "Gabriel",
  "Michael",
  "Santiago",
  "Kevin",
  "Louis",
  "Samuel",
  "Anthony",
  "Hannah",
  "Audrey",
  "Jasmine",
  "Giselle",
  "Amelia",
  "Isabella",
  "Zoe",
  "Ava",
  "Camila",
  "Violet",
  "Sophia",
  "Evelyn",
  "Nicole",
  "Ashley",
  "Grace",
  "Brianna",
  "Natalie",
  "Olivia",
  "Elizabeth",
  "Charlotte",
  "Emma",
  "Claude",
  "Niko",
  "John",
  "Misty",
];

export function getRandomFather() {
  return Math.floor(Math.random() * parents.length);
}

export function getRandomMother() {
  return Math.floor(Math.random() * parents.length);
}

export function getRandomResemblance(gender: 0 | 1 = 0) {
  return Math.random() * (gender ? 0.5 : 1);
}
