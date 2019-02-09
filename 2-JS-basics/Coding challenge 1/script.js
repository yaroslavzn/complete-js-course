/*****************************
 * CODING CHALLENGE 1
 */

/*
Mark and John are trying to compare their BMI (Body Mass Index), which is calculated using the formula: BMI = mass / height^2 = mass / (height * height). (mass in kg and height in meter).

1. Store Mark's and John's mass and height in variables
2. Calculate both their BMIs
3. Create a boolean variable containing information about whether Mark has a higher BMI than John.
4. Print a string to the console containing the variable from step 3. (Something like "Is Mark's BMI higher than John's? true").

GOOD LUCK 😀
*/

var markMass, markHeight, johnMass, johnHeight, markBmi, johnBmi, isMarkBmiGreater;

markMass = 82;
markHeight = 1.78;
johnMass = 85;
johnHeight = 1.73;

markBmi = markMass / (markHeight * markHeight);
johnBmi = johnMass / (johnHeight * johnHeight);

console.log(markBmi, johnBmi);

if (markBmi > johnBmi) {
    console.log('Mark\'s BMI is greater than John\'s BMI.');
} else {
    console.log('John\'s BMI is greater than Mark\'s BMI.');
}