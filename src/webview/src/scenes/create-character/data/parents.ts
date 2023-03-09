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
  "Hannah", // 21
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
  "Emma", // 41
  "Claude",
  "Niko",
  "John",
  "Misty", // 45
];

export const females = [
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  40, 41, 45,
];

export function getRandomParent(gender: 0 | 1 = 0) {
  if (gender) {
    return females[Math.floor(Math.random() * females.length)];
  }
  return Math.floor(Math.random() * parents.length);
}

export function getRandomResemblance(gender: 0 | 1 = 0) {
  return Math.random() * (gender ? 0.5 : 1);
}
