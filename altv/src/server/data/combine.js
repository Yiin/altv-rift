import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the JSON files
const file1 = path.join(__dirname, 'private-homes.positions.json');
const file2 = path.join(__dirname, 'private-homes-2.positions.json');
const outputFile = path.join(__dirname, 'result.json');

const positions1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
const positions2 = JSON.parse(fs.readFileSync(file2, 'utf8'));

console.log(`Loaded ${positions1.length} positions from ${file1}`);
console.log(`Loaded ${positions2.length} positions from ${file2}`);

// Function to calculate distance between two positions
function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Function to get position object (handles both pos and coords formats)
function getPosition(item) {
  return item.pos || item.coords;
}

// Standardize the format of positions from file2 to match file1
const standardizedPositions2 = positions2.map((pos, index) => {
  return {
    id: positions1.length + index + 1, // Start IDs after the last ID in positions1
    street: pos.street,
    pos: pos.coords // Convert coords to pos for consistency
  };
});

// Combine positions and remove duplicates
function combinePositions(positions1, standardizedPositions2) {
  const result = [...positions1];
  let nextId = Math.max(...positions1.map(p => p.id)) + 1;

  standardizedPositions2.forEach(pos2 => {
    // Check if this position is already in the result (within 5 units)
    const isDuplicate = result.some(pos1 => 
      calculateDistance(getPosition(pos1), getPosition(pos2)) < 5
    );

    if (!isDuplicate) {
      // Add to result with next ID
      result.push({
        ...pos2,
        id: nextId++
      });
    }
  });

  return result;
}

const combined = combinePositions(positions1, standardizedPositions2);
console.log(`Combined into ${combined.length} unique positions (removed ${positions1.length + standardizedPositions2.length - combined.length} duplicates)`);

// Sort by ID for consistency
combined.sort((a, b) => a.id - b.id);

// Write the result to a file
fs.writeFileSync(outputFile, JSON.stringify(combined, null, 2), 'utf8');
console.log(`Result saved to ${outputFile}`);
