import { Character } from '@/lib/api/superhero';

/**
 * Convert stat value to a numeric value (0-100)
 */
export function parseStatValue(stat: string | undefined | null): number {
  if (!stat || stat === 'null') return 0;
  const numStat = parseInt(stat);
  return isNaN(numStat) ? 0 : Math.max(0, Math.min(100, numStat));
}

/**
 * Calculate total power level based on all stats
 */
export function calculatePowerLevel(character: Character): number {
  if (!character || !character.powerstats) return 0;
  
  const stats = character.powerstats;
  let total = 0;
  let count = 0;
  
  // Sum all available stats
  Object.values(stats).forEach(value => {
    const numValue = parseStatValue(value);
    if (numValue > 0) {
      total += numValue;
      count++;
    }
  });
  
  // Return average if we have stats, otherwise 0
  return count > 0 ? Math.round(total / count) : 0;
}

/**
 * Get the winner for a specific stat comparison
 * Returns: 1 if char1 wins, 2 if char2 wins, 0 if tie
 */
export function getStatWinner(
  char1: Character, 
  char2: Character, 
  stat: keyof Character['powerstats']
): 0 | 1 | 2 {
  const value1 = parseStatValue(char1.powerstats[stat]);
  const value2 = parseStatValue(char2.powerstats[stat]);
  
  if (value1 > value2) return 1;
  if (value2 > value1) return 2;
  return 0;
}

/**
 * Get total number of stat wins for each character
 * Returns: [char1Wins, char2Wins, ties]
 */
export function getTotalWins(char1: Character, char2: Character): [number, number, number] {
  if (!char1 || !char2) return [0, 0, 0];
  
  const stats = Object.keys(char1.powerstats) as Array<keyof Character['powerstats']>;
  let char1Wins = 0;
  let char2Wins = 0;
  let ties = 0;
  
  stats.forEach(stat => {
    const winner = getStatWinner(char1, char2, stat);
    if (winner === 1) char1Wins++;
    else if (winner === 2) char2Wins++;
    else ties++;
  });
  
  return [char1Wins, char2Wins, ties];
}

/**
 * Get attribute comparison between two characters
 * Returns: { attribute, char1Value, char2Value, winner }
 */
export function compareAttributes(
  char1: Character, 
  char2: Character
): Array<{
  attribute: string;
  char1Value: string;
  char2Value: string;
  winner: 0 | 1 | 2;
}> {
  if (!char1 || !char2) return [];
  
  const result = [];
  
  // Compare powerstat attributes
  const stats = Object.keys(char1.powerstats) as Array<keyof Character['powerstats']>;
  stats.forEach(stat => {
    const char1Value = char1.powerstats[stat] || 'N/A';
    const char2Value = char2.powerstats[stat] || 'N/A';
    const winner = getStatWinner(char1, char2, stat);
    
    result.push({
      attribute: stat.charAt(0).toUpperCase() + stat.slice(1), // Capitalize first letter
      char1Value,
      char2Value,
      winner
    });
  });
  
  // Add power level
  const char1PowerLevel = calculatePowerLevel(char1);
  const char2PowerLevel = calculatePowerLevel(char2);
  
  let powerLevelWinner: 0 | 1 | 2 = 0;
  if (char1PowerLevel > char2PowerLevel) powerLevelWinner = 1;
  else if (char2PowerLevel > char1PowerLevel) powerLevelWinner = 2;
  
  result.push({
    attribute: 'Overall Power',
    char1Value: String(char1PowerLevel),
    char2Value: String(char2PowerLevel),
    winner: powerLevelWinner
  });
  
  // Add other attributes for comparison
  result.push({
    attribute: 'Height',
    char1Value: char1.appearance.height?.[1] || 'N/A',
    char2Value: char2.appearance.height?.[1] || 'N/A',
    winner: 0 // No winner for height
  });
  
  result.push({
    attribute: 'Weight',
    char1Value: char1.appearance.weight?.[1] || 'N/A',
    char2Value: char2.appearance.weight?.[1] || 'N/A',
    winner: 0 // No winner for weight
  });
  
  result.push({
    attribute: 'Publisher',
    char1Value: char1.biography.publisher || 'N/A',
    char2Value: char2.biography.publisher || 'N/A',
    winner: 0 // No winner for publisher
  });
  
  return result;
} 