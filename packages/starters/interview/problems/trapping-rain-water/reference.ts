export function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0; // tallest wall seen from the left end
  let rightMax = 0; // tallest wall seen from the right end
  let water = 0;
  while (left < right) {
    // The lower side sets the water level, so settle that side.
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}
