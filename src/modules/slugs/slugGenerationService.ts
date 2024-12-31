import { CHARSET, INITIAL_SLUG_LENGTH } from './slugsConstants';
import { SlugConfig } from './models/slugsConfigModel';
import { sequelize } from '../../utils';
const BASE = BigInt(CHARSET.length);

export const generateSlug = async (): Promise<string> => {
    // To ensure atomic updates of slug config
    return await sequelize.transaction(async (transaction) => {
      let config = await SlugConfig.findOne({ transaction });
      if (!config) {
          config = await SlugConfig.create({
              currentLength: INITIAL_SLUG_LENGTH,
              currentIndex: '0',
              totalSpace: encodeBase62(calculateMaxValue(INITIAL_SLUG_LENGTH)),
              generatedCount: '0',
          }, { transaction});
      }
  
        let currentLength = config.currentLength;
        let currentIndex = decodeBase62(config.currentIndex);
        let totalSpace = decodeBase62(config.totalSpace);
        let generatedCount = decodeBase62(config.generatedCount);
    
        // Transition to the next slug length if all slugs are generated
        if (generatedCount >= totalSpace) {
            currentLength += 1;
            currentIndex = 0n;
            generatedCount = 0n;
            totalSpace = calculateMaxValue(currentLength);
        }
    
        // Permute the current index to generate a random-like sequence
        const permutedIndex = permuteIndex(currentIndex, totalSpace);
    
        // Convert the permuted index to a slug
        const nextSlug = numberToSlug(permutedIndex, currentLength);
    
        // Prepare the next state
        const nextIndex = currentIndex + 1n;
        const nextCount = generatedCount + 1n;
    
        // Update the slug configuration
        await config.update(
            {
              currentLength: currentLength,
              currentIndex: encodeBase62(nextIndex),
              totalSpace: encodeBase62(totalSpace),
              generatedCount: encodeBase62(nextCount),
            },
            { transaction }
        );
    
        return nextSlug;
    });
};
  

/**
 * Encodes a BigInt to a Base62 string.
 * @param num - The numeric value.
 * @returns The Base62 string.
 */
export const encodeBase62 = (num: bigint): string => {
  if (num === 0n) return '0';
  let result = '';
  while (num > 0n) {
    result = CHARSET[Number(num % BASE)] + result;
    num = num / BASE;
  }
  return result;
};

/**
 * Decodes a Base62 string to a BigInt.
 * @param str - The Base62 string.
 * @returns The numeric value.
 */
const decodeBase62 = (str: string): bigint => {
  return [...str].reduce((acc, char) => acc * BASE + BigInt(CHARSET.indexOf(char)), 0n);
};

/**
 * Calculates the maximum number for a given slug length.
 * @param length - The slug length.
 * @returns The maximum number for the length.
 */
const calculateMaxValue = (length: number): bigint => {
  return BASE ** BigInt(length) - 1n;
};

/**
 * Converts a numeric value to a Base62 slug of fixed length.
 * @param num - The numeric value.
 * @param length - The desired slug length.
 * @returns The Base62 slug.
 */
const numberToSlug = (num: bigint, length: number): string => {
  const slugArray = Array(length).fill('0');
  for (let i = length - 1; i >= 0 && num > 0n; i--) {
    slugArray[i] = CHARSET[Number(num % BASE)];
    num = num / BASE;
  }
  return slugArray.join('');
};

/**
 * Permutes the index using an LCG to create a random-looking sequence.
 * @param index - The sequential index.
 * @param totalSpace - The total slug space.
 * @returns A permuted index.
 */
const permuteIndex = (index: bigint, totalSpace: bigint): bigint => {
  const a = 6364136223846793005n; // Multiplier (large prime)
  const c = 1n;                  // Increment
  return (a * index + c) % totalSpace;
};